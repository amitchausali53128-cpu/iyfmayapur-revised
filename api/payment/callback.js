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

    /*
     * Debug only the useful field names.
     * Avoid logging the complete customer payload.
     */
    console.log(
      "Treasury callback fields:",
      Object.keys(decrypted)
    );

    /*
     * 2. Normalize callback.
     *
     * course_id and user_id are recovered from
     * our IYF-LMS reference.
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

    const isStorePayment =
      referenceId.startsWith("IYF-STORE-");

    const isLmsPayment =
      referenceId.startsWith("IYF-LMS-");

    /*
     * 4. Never process a failed payment.
     */
    if (claims.status !== "success") {
      throw new Error(
        "Payment was not successful"
      );
    }

    /*
     * 5. STORE PAYMENT
     */
    if (isStorePayment) {
      const token =
        signPaymentToken(claims);

      const destination =
        `${siteUrl}/store/thank-you`;

      return response.redirect(
        302,
        `${destination}?payment_token=${encodeURIComponent(
          token
        )}`
      );
    }

    /*
     * 6. LMS PAYMENT
     */
    if (isLmsPayment) {
      if (!claims.course_id) {
        throw new Error(
          "Missing course_id in LMS reference"
        );
      }

      if (!claims.user_id) {
        throw new Error(
          "Missing user_id in LMS reference"
        );
      }

      /*
       * Internal server-to-server enrollment.
       *
       * The browser never calls this endpoint.
       */
      const lmsUrl =
        process.env.LMS_API_URL ||
        process.env.VITE_LMS_API_URL;

      if (!lmsUrl) {
        throw new Error(
          "LMS_API_URL is not configured"
        );
      }

      if (!process.env.LMS_INTERNAL_API_SECRET) {
        throw new Error(
          "LMS_INTERNAL_API_SECRET is not configured"
        );
      }

      const enrollResponse =
        await fetch(
          `${lmsUrl}/internal/enroll`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "Authorization":
                `Bearer ${process.env.LMS_INTERNAL_API_SECRET}`,
            },

            body: JSON.stringify({
              user_id: claims.user_id,

              course_id:
                claims.course_id,

              payment_id:
                claims.payment_id,

              order_id:
                claims.reference_id,

              amount:
                claims.amount,

              currency: "INR",

              /*
               * This is the server's authenticated
               * internal request, so there is no need
               * to send an undefined Treasury signature.
               */
            }),
          }
        );

      if (!enrollResponse.ok) {
        const errorText =
          await enrollResponse.text();

        console.error(
          "LMS enrollment failed:",
          {
            status:
              enrollResponse.status,
            reference_id:
              claims.reference_id,
            course_id:
              claims.course_id,
            error:
              errorText.slice(0, 1000),
          }
        );

        throw new Error(
          "LMS enrollment failed"
        );
      }

      /*
       * 7. Only redirect to the course after
       * enrollment succeeds.
       */
      const token =
        signPaymentToken(claims);

      const destination =
        `${siteUrl}/lms/course/` +
        encodeURIComponent(
          claims.course_id
        );

      return response.redirect(
        302,
        `${destination}?payment_token=${encodeURIComponent(
          token
        )}`
      );
    }

    /*
     * 8. DONATION
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
      // `${siteUrl}/donation?payment_error=callback`
      `${siteUrl}/payment_error`
    );
  }
}
