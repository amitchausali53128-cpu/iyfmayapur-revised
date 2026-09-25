import {
  callbackClaims,
  decryptPayload,
  signPaymentToken,
} from "../_lib/treasury.js";

export default function handler(request, response) {
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

    if (!claims.reference_id) {
      throw new Error(
        "Treasury response did not include a reference number"
      );
    }

    // Add it HERE
    const isStorePayment =
      String(claims.reference_id).startsWith("IYF-STORE-");

    const token = signPaymentToken(claims);

    // Store payment
    if (isStorePayment) {
      const destination = `${siteUrl}/store/thank-you`;

      return response.redirect(
        302,
        `${destination}?payment_token=${encodeURIComponent(token)}`
      );
    }

    // Existing LMS payment
    if (claims.course_id) {
      const destination =
        `${siteUrl}/lms/course/` +
        `${encodeURIComponent(claims.course_id)}`;

      return response.redirect(
        302,
        `${destination}?payment_token=${encodeURIComponent(token)}`
      );
    }

    // Existing donation payment
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
