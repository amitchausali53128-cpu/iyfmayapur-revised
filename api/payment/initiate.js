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

export default function handler(request, response) {
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
      amount: amount.toFixed(2),

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
