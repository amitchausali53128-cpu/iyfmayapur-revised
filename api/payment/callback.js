import {
  callbackClaims,
  decryptPayload,
  signPaymentToken,
} from "../_lib/treasury.js";

export default async function handler(request, response) {
  const siteUrl =
    process.env.PUBLIC_SITE_URL || "https://iyfmayapur.org";

  try {
    if (
      request.method !== "GET" ||
      !request.query.data
    ) {
      throw new Error("Missing Treasury callback data");
    }

    const claims = callbackClaims(
      decryptPayload(request.query.data)
    );

    console.log(claims);

    if (!claims.reference_id) {
      throw new Error(
        "Treasury response did not include a reference number"
      );
    }

    const referenceId = String(claims.reference_id);

    const isStorePayment =
      referenceId.startsWith("IYF-STORE-");

    const isLmsPayment =
      referenceId.startsWith("IYF-LMS-");

    const token = signPaymentToken(claims);

    // ------------------------------------------
    // STORE PAYMENT
    // ------------------------------------------
    if (isStorePayment) {
      const destination = `${siteUrl}/store/thank-you`;

      return response.redirect(
        302,
        `${destination}?payment_token=${encodeURIComponent(token)}`
      );
    }

    // ------------------------------------------
    // LMS PAYMENT
    // ------------------------------------------
    if (isLmsPayment) {
      if (!claims.course_id) {
        throw new Error("Missing course_id");
      }

      if (!claims.user_id) {
        throw new Error("Missing user_id");
      }

      // Server-to-server call.
      // Browser never sees/calls this endpoint.
      const enrollResponse = await fetch(
  `${process.env.VITE_LMS_API_URL}/api/internal/enroll`,
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      "Authorization":
        `Bearer ${process.env.LMS_INTERNAL_API_SECRET}`,
    },

    body: JSON.stringify({
      user_id: claims.user_id,
      course_id: claims.course_id,
      payment_id: claims.payment_id,
      order_id: claims.reference_id,
      signature: claims.signature,
      amount: claims.amount,
      currency: "INR",
    }),
  }
);


      if (!enrollResponse.ok) {
        const errorText = await enrollResponse.text();

        console.error(
          "LMS enrollment failed:",
          enrollResponse.status,
          errorText
        );

        throw new Error("LMS enrollment failed");
      }

      const destination =
        `${siteUrl}/lms/course/` +
        `${encodeURIComponent(claims.course_id)}`;

      return response.redirect(
        302,
        `${destination}?payment_token=${encodeURIComponent(token)}`
      );
    }

    // ------------------------------------------
    // DONATION
    // ------------------------------------------
    const destination = `${siteUrl}/donation`;

    return response.redirect(
      302,
      `${destination}?payment_token=${encodeURIComponent(token)}`
    );
  } catch (error) {
    console.error(error);

    return response.redirect(
      302,
      `${siteUrl}/donation?payment_error=callback`
    );
  }
}
