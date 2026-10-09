import { randomUUID } from "node:crypto";

import {
  DEPARTMENT_CODE,
  encryptPayload,
  GATEWAY_URL,
  createLmsReference,
} from "../_lib/treasury.js";

const required = [
  "email",
  "amount",
  "mobile",
  "first_name",
  "last_name",
  "address_1",
  "pin_code",
  "district",
  "city",
  "state",
  "country",
];

function normalizeCartItems(cart) {
  if (!Array.isArray(cart)) return [];

  const normalized = [];
  for (const item of cart) {
    if (!item || typeof item !== "object") continue;

    const id = item.id ?? item._id ?? item.book_id ?? item.bookId;
    const qty = Number(item.qty ?? item.quantity ?? item.book_quantity ?? 1);

    if (!id || !Number.isFinite(qty) || qty <= 0) continue;

    normalized.push({
      id: String(id),
      qty: Math.trunc(qty),
    });
  }

  return normalized;
}

function asMoney(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

async function buildCanonicalStoreOrder(bookServerUrl, cart) {
  const response = await fetch(`${bookServerUrl}/books`);
  const data = await response.json().catch(() => null);

  if (!response.ok || !Array.isArray(data)) {
    throw new Error("Unable to load the book catalog for checkout validation.");
  }

  const catalog = new Map();
  for (const book of data) {
    if (!book || typeof book !== "object") continue;

    const id = book._id ?? book.id ?? book.book_id ?? book.bookId;
    if (id) catalog.set(String(id), book);
  }

  let subtotal = 0;
  const canonicalBooks = [];

  for (const item of cart) {
    const catalogEntry = catalog.get(item.id);
    if (!catalogEntry) {
      throw new Error(`Book ${item.id} is no longer available.`);
    }

    const price = asMoney(
      catalogEntry.book_price ?? catalogEntry.price ?? catalogEntry.amount ?? catalogEntry.sale_price,
      0
    );
    if (price <= 0) {
      throw new Error(`Book ${item.id} is missing a valid price.`);
    }

    const stock = asMoney(
      catalogEntry.available_quantity ?? catalogEntry.stock ?? catalogEntry.quantity ?? catalogEntry.inventory,
      Number.POSITIVE_INFINITY
    );
    if (Number.isFinite(stock) && item.qty > stock) {
      throw new Error(`Book ${item.id} exceeds the available stock.`);
    }

    const lineTotal = price * item.qty;
    subtotal += lineTotal;

    canonicalBooks.push({
      id: item.id,
      book_quantity: item.qty,
      book_name:
        catalogEntry.book_name ??
        catalogEntry.title ??
        catalogEntry.name ??
        `Book ${item.id}`,
      book_price: Number(price.toFixed(2)),
      book_format:
        catalogEntry.book_format ??
        catalogEntry.format ??
        "Book",
    });
  }

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const amount = Number((subtotal + shipping).toFixed(2));

  return { amount, books: canonicalBooks, shipping };
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const input = request.body || {};

    const missing = required.filter(
      (field) =>
        !String(input[field] ?? "").trim()
    );

    const amount = Number(input.amount);

    if (
      missing.length ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return response.status(400).json({
        error:
          "Please complete all required payment details.",
        fields: missing,
      });
    }

    const isStorePayment =
      input.payment_type === "store";

    if (isStorePayment) {
      const cart = normalizeCartItems(input.cart);
      if (!cart.length) {
        return response.status(400).json({
          error: "Your cart is empty or invalid.",
        });
      }

      try {
        const canonicalOrder = await buildCanonicalStoreOrder(
          process.env.BOOK_SERVER_URL || "http://localhost:3000",
          cart
        );

        if (Math.abs(amount - canonicalOrder.amount) > 0.01) {
          return response.status(400).json({
            error: "The invoice amount does not match the server-validated cart total.",
          });
        }

        input.cart = cart;
        input.amount = canonicalOrder.amount;
        input.books = canonicalOrder.books;
      } catch (error) {
        return response.status(400).json({
          error:
            error instanceof Error
              ? error.message
              : "The cart could not be validated.",
        });
      }
    }

    const isLmsPayment =
      input.payment_type === "lms";

    /*
     * LMS requires both IDs.
     */
    if (isLmsPayment) {
      if (!String(input.course_id ?? "").trim()) {
        return response.status(400).json({
          error: "course_id is required for LMS payment.",
          fields: ["course_id"],
        });
      }

      if (!String(input.user_id ?? "").trim()) {
        return response.status(400).json({
          error: "user_id is required for LMS payment.",
          fields: ["user_id"],
        });
      }
    }

    let referenceId;

    if (isLmsPayment) {
      /*
       * IMPORTANT:
       *
       * Treasury does not return our course_id/user_id
       * fields in the callback.
       *
       * Therefore they are encoded into reference_id.
       */
      referenceId = createLmsReference(
        input.user_id,
        input.course_id
      );
    } else if (isStorePayment) {
      referenceId =
        `IYF-STORE-${Date.now()}-${randomUUID()
          .slice(0, 8)
          .toUpperCase()}`;
    } else {
      referenceId =
        `IYF-${Date.now()}-${randomUUID()
          .slice(0, 8)
          .toUpperCase()}`;
    }

    const payload = {
      mode: "1",
      type: "1",
      amount: Number(input.amount).toFixed(2),

      reference_id: referenceId,

      first_name: input.first_name,
      middle_name: input.middle_name || "",
      last_name: input.last_name,

      email: input.email,
      mobile: input.mobile,

      pan_card: input.pan_card || "",
      passport_no: input.passport_no || "",

      address_1: input.address_1,
      address_2: input.address_2 || "",
      post_office: input.post_office || "",

      pin_code: input.pin_code,
      district: input.district,
      city: input.city,
      state: input.state,
      country: input.country,

      /*
       * Keep the gateway purpose simple.
       *
       * Do NOT depend on this field to transport LMS
       * metadata because your actual callback did not
       * return it.
       */
      transaction_purpose: isLmsPayment
        ? "LMS Course Enrollment"
        : isStorePayment
          ? "Book Purchase"
          : (
              input.transaction_purpose ||
              "General Donation"
            ),

      isRecurring: "0",
    };

    const encryptedData =
      encryptPayload(payload);

    const paymentUrl =
      `${GATEWAY_URL}` +
      `?dept_code=${encodeURIComponent(DEPARTMENT_CODE)}` +
      `&data=${encodeURIComponent(encryptedData)}`;

    console.log("Payment initiation:", {
      type: isStorePayment
        ? "STORE"
        : isLmsPayment
          ? "LMS"
          : "DONATION",

      referenceId,

      /*
       * Don't log user data unnecessarily.
       */
      courseId: isLmsPayment
        ? String(input.course_id)
        : undefined,

      amount: payload.amount,
    });

    const bookServerUrl =
  process.env.BOOK_SERVER_URL ||
  "http://localhost:3000";

  const books =
    isStorePayment && Array.isArray(input.books)
      ? input.books
      : (input.cart || []).map((book) => ({
          id: book.id,
          book_quantity: Number(book.qty ?? book.quantity ?? 1),
          book_name: book.title ?? book.book_name ?? `Book ${book.id}`,
          book_price: Number(book.price ?? 0),
          book_format: book.format ?? book.book_format ?? "Book",
        }));

const transactionResponse = await fetch(
  `${bookServerUrl}/transactions/`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reference_id: referenceId,
      payment_type: isStorePayment
        ? "store"
        : isLmsPayment
          ? "lms"
          : "donation",
      amount: payload.amount,
      name:
        `${payload.first_name} ` +
        `${payload.middle_name} ` +
        `${payload.last_name}`.trim(),
      email: payload.email,
      mobile: payload.mobile,
      address:
        `${payload.address_1}, ${payload.address_2}, ${payload.city}, ${payload.pin_code}, ${payload.district}, ${payload.state}, ${payload.country}`.trim(),
      books,
      transaction_purpose:
        payload.transaction_purpose,
    }),
  }
);

if (!transactionResponse.ok) {
  const errorText =
    await transactionResponse.text();

  console.error(
    "Failed to create payment transaction:",
    transactionResponse.status,
    errorText
  );

  return response.status(500).json({
    error: "Unable to create payment transaction.",
  });
}

return response.status(200).json({
  reference_id: referenceId,
  payment_url: paymentUrl,
});

  } catch (error) {
    console.error(
      "Payment initiation error:",
      error
    );

    return response.status(500).json({
      error: "Unable to start the payment.",
    });
  }
}
