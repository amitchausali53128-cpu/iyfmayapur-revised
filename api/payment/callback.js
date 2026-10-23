import {
  callbackClaims,
  decryptPayload,
  signPaymentToken,
} from "../_lib/treasury.js";


export default async function handler(
  request,
  response
) {
  const siteUrl =
    process.env.PUBLIC_SITE_URL ||
    "https://iyfmayapur.org";

  try {
    if (
      request.method !== "GET" ||
      !request.query.data
    ) {
      throw new Error(
        "Missing Treasury callback data"
      );
    }

    /*
     * 1. Decrypt Treasury callback.
     */
    const decrypted = decryptPayload(
      request.query.data
    );

    console.log(
      "Treasury callback fields:",
      Object.keys(decrypted)
    );

    /*
     * 2. Normalize callback.
     */
    const claims =
      callbackClaims(decrypted);

    console.log("Payment claims:", {
      reference_id: claims.reference_id,
      course_id: claims.course_id,
      user_id: claims.user_id,
      payment_id: claims.payment_id,
      amount: claims.amount,
      status: claims.status,
    });

    /*
     * 3. Reference is mandatory.
     */
    if (!claims.reference_id) {
      throw new Error(
        "Treasury response did not include a reference number"
      );
    }

    const referenceId =
      String(claims.reference_id);

    if (
      referenceId.startsWith("IYF-STORE-") ||
      referenceId.startsWith("IYF-LMS-")
    ) {
      throw new Error(
        "Store and LMS payments are no longer supported. Donation payments only."
      );
    }

    /*
     * 4. Never process a failed payment.
     */
    if (claims.status !== "success") {
      throw new Error(
        "Payment was not successful"
      );
    }

    /*
     * 7. DONATION
     */
    const token =
      signPaymentToken(claims);

    const destination =
      `${siteUrl}/donation`;

    return response.redirect(
      302,
      `${destination}?payment_token=${encodeURIComponent(
        token
      )}`
    );
  } catch (error) {
    console.error(
      "Treasury callback error:",
      error
    );

    return response.redirect(
      302,
      `${siteUrl}/payment_error`
    );
  }
}
