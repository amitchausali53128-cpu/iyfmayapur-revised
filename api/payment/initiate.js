import { randomUUID } from "node:crypto";

import {
  DEPARTMENT_CODE,
  encryptPayload,
  GATEWAY_URL,
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

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const input = request.body || {};

    const paymentType = String(input.payment_type ?? "donation").trim().toLowerCase();

    if (paymentType !== "donation") {
      return response.status(400).json({
        error: "Only donation payments are accepted.",
      });
    }

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

    const referenceId =
      `IYF-${Date.now()}-${randomUUID()
        .slice(0, 8)
        .toUpperCase()}`;

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
      transaction_purpose:
        input.transaction_purpose || "General Donation",

      isRecurring: "0",
    };

    const encryptedData =
      encryptPayload(payload);

    const paymentUrl =
      `${GATEWAY_URL}` +
      `?dept_code=${encodeURIComponent(DEPARTMENT_CODE)}` +
      `&data=${encodeURIComponent(encryptedData)}`;

    console.log("Payment initiation:", {
      type: "DONATION",
      referenceId,
      amount: payload.amount,
    });

    const transactionResponse = await fetch(
      `${process.env.BOOK_SERVER_URL || "http://localhost:3000"}/transactions/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference_id: referenceId,
          payment_type: "donation",
          amount: payload.amount,
          name:
            `${payload.first_name} ` +
            `${payload.middle_name} ` +
            `${payload.last_name}`.trim(),
          email: payload.email,
          mobile: payload.mobile,
          address:
            `${payload.address_1}, ${payload.address_2}, ${payload.city}, ${payload.pin_code}, ${payload.district}, ${payload.state}, ${payload.country}`.trim(),
          books: [],
          transaction_purpose:
            payload.transaction_purpose,
        }),
      }
    );

    if (!transactionResponse.ok) {
      const errorText =
        await transactionResponse.text();

      console.error(
        "Failed to create donation transaction:",
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
