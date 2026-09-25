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

export default function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const input = request.body || {};

    console.log("Payment initiation request:", input);
    const missing = required.filter(
      (field) => !String(input[field] ?? "").trim()
    );

    const amount = Number(input.amount);

    if (
      missing.length ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return response.status(400).json({
        error: "Please complete all required payment details.",
        fields: missing,
      });
    }

    /*
     * Determine payment type.
     *
     * Store:
     *   transaction_purpose === "Book Purchase"
     *
     * LMS:
     *   course_id is present
     *
     * Donation:
     *   neither of the above
     */

    const isStorePayment =
      input.payment_type === "store";

    const isLmsPayment =
      input.payment_type === "lms";

    let referenceId;

    if (isStorePayment) {
      referenceId =
        `IYF-STORE-${Date.now()}-${randomUUID()
          .slice(0, 8)
          .toUpperCase()}`;
    } else if (isLmsPayment) {
      referenceId =
        `IYF-LMS-${Date.now()}-${randomUUID()
          .slice(0, 8)
          .toUpperCase()}`;
    } else {
      referenceId =
        `IYF-${Date.now()}-${randomUUID()
          .slice(0, 8)
          .toUpperCase()}`;
    }

    const payload = {
      dept_code: DEPARTMENT_CODE,

      name: `${input.first_name} ${input.last_name}`,

      email: input.email,

      reference_id: referenceId,

      amount: amount.toFixed(2),

      mode: "1",
      type: "1",
      isRecurring: "0",

      mobile: input.mobile,

      first_name: input.first_name,
      middle_name: input.middle_name || "",
      last_name: input.last_name,

      /*
       * Keep the LMS purpose when course_id exists.
       * Otherwise use the supplied purpose.
       */
      transaction_purpose: isLmsPayment
        ? (
            input.transaction_purpose ||
            `LMS Course Enrollment (course_id:${input.course_id})`
          )
        : (
            input.transaction_purpose ||
            "General Donation"
          ),

      /*
       * THIS IS IMPORTANT.
       *
       * The Treasury callback needs to return this information
       * so the callback can identify an LMS payment.
       */
      course_id: isLmsPayment
        ? String(input.course_id)
        : "",

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
    };

    const data = encryptPayload(payload);

    const paymentUrl =
      `${GATEWAY_URL}` +
      `?dept_code=${DEPARTMENT_CODE}` +
      `&data=${encodeURIComponent(data)}`;

    console.log("Payment initiation:", {
      type: isStorePayment
        ? "STORE"
        : isLmsPayment
          ? "LMS"
          : "DONATION",
      referenceId,
      courseId: payload.course_id,
      purpose: payload.transaction_purpose,
    });

    return response.status(200).json({
      reference_id: referenceId,
      payment_url: paymentUrl,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);

    return response.status(500).json({
      error: "Unable to start the payment.",
    });
  }
}