import { Resend } from "resend";

import {
  callbackClaims,
  decryptPayload,
  signPaymentToken,
} from "../_lib/treasury.js";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

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
     * 5. STORE PAYMENT
     */
    if (false) {
      /*
       * Send store notification email.
       *
       * IMPORTANT:
       * Email failure must NOT make the payment
       * itself fail. The payment has already been
       * confirmed by Treasury.
       */
      try {

        const dataFromServer = await fetch(
          `${process.env.BOOK_SERVER_URL}/transactions/reference/${referenceId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!dataFromServer.ok) {
          throw new Error(
            `Failed to fetch transaction data from book server. Status: ${dataFromServer.status}`
          );
        }

        const transactionData =
          await dataFromServer.json();

        console.log(
          "Fetched transaction data from book server:",
          transactionData
        );

        if (!process.env.RESEND_API_KEY) {
          throw new Error(
            "RESEND_API_KEY is not configured"
          );
        }

        if (!process.env.STORE_NOTIFICATION_EMAIL) {
          throw new Error(
            "STORE_NOTIFICATION_EMAIL is not configured"
          );
        }

        if (!process.env.RESEND_FROM_EMAIL) {
          throw new Error(
            "RESEND_FROM_EMAIL is not configured"
          );
        }

        const customerName = transactionData.name || "";

        const customerEmail =
          transactionData.email ||
          "";

        const customerMobile =
          transactionData.mobile ||
          "";

        const customerAddress =transactionData.address || "";

        await resend.emails.send({
          from:
            process.env.RESEND_FROM_EMAIL,

          to:
            process.env.STORE_NOTIFICATION_EMAIL,

          subject:
            `New Book Order - ${claims.reference_id}`,

          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
              <h2>New Book Purchase</h2>

              <p>
                A new book purchase has been successfully
                completed.
              </p>
              <h3>Books</h3>
              <ul>
                ${transactionData.books
                  .map(
                    (book) =>
                      `<li>${book.book_name} - ${book.book_format} - Quantity: ${book.book_quantity} - Price: INR ${book.book_price}</li>`
                  )
                  .join("")}
              </ul>


              <h3>Payment Details</h3>

              <table cellpadding="6" cellspacing="0" border="0">
                <tr>
                  <td><strong>Reference ID</strong></td>
                  <td>${claims.reference_id}</td>
                </tr>

                <tr>
                  <td><strong>Transaction ID</strong></td>
                  <td>${claims.transaction_id || "-"}</td>
                </tr>

                <tr>
                  <td><strong>Payment ID</strong></td>
                  <td>${claims.payment_id || "-"}</td>
                </tr>

                <tr>
                  <td><strong>Amount</strong></td>
                  <td>INR ${claims.amount}</td>
                </tr>

                <tr>
                  <td><strong>Payment Mode</strong></td>
                  <td>${claims.payment_mode || "-"}</td>
                </tr>

                <tr>
                  <td><strong>Transaction Date</strong></td>
                  <td>${claims.transaction_date}</td>
                </tr>
              </table>

              <h3>Customer Details</h3>

              <table cellpadding="6" cellspacing="0" border="0">
                <tr>
                  <td><strong>Name</strong></td>
                  <td>${customerName || "-"}</td>
                </tr>

                <tr>
                  <td><strong>Email</strong></td>
                  <td>${customerEmail || "-"}</td>
                </tr>

                <tr>
                  <td><strong>Mobile</strong></td>
                  <td>${customerMobile || "-"}</td>
                </tr>

                <tr>
                  <td><strong>Address</strong></td>
                  <td>${customerAddress || "-"}</td>
                </tr>
              </table>

              <p style="margin-top: 24px;">
                This notification was generated automatically
                after successful payment confirmation.
              </p>
            </div>
          `,
        });

        console.log(
          "Store purchase notification email sent:",
          {
            reference_id:
              claims.reference_id,
            payment_id:
              claims.payment_id,
          }
        );
      } catch (emailError) {
        /*
         * Do NOT turn a successful payment into a
         * failed payment just because email failed.
         */
        console.error(
          "Store notification email failed:",
          emailError
        );
      }

      /*
       * Customer-facing redirect.
       */
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
    if (false) {
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
              user_id:
                claims.user_id,

              course_id:
                claims.course_id,

              payment_id:
                claims.payment_id,

              order_id:
                claims.reference_id,

              amount:
                claims.amount,

              currency: "INR",
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
       * Only redirect to the course after
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
