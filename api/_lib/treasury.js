import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

export const GATEWAY_URL =
  process.env.MAYAPUR_PAYMENT_GATEWAY_URL ||
  "https://payments.mayapur.com/process/payment/request";

export const DEPARTMENT_CODE = "IYF";

function key() {
  const value = process.env.MAYAPUR_PAYMENT_AUTH_KEY;

  if (!value || Buffer.byteLength(value, "utf8") !== 32) {
    throw new Error(
      "MAYAPUR_PAYMENT_AUTH_KEY is not configured correctly"
    );
  }

  return Buffer.from(value, "utf8");
}

/**
 * Convert an object into the format expected by Treasury.
 */
export function encryptPayload(payload = {}) {
  const params = new URLSearchParams();

  for (const [name, value] of Object.entries(payload)) {
    params.set(name, value == null ? "" : String(value));
  }

  const plaintext = params.toString();

  const cipher = createCipheriv(
    "aes-256-ecb",
    key(),
    null
  );

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]).toString("base64");

  /*
   * The supplied Treasury PHP example does:
   *
   * openssl_encrypt(..., options=0)
   *        ↓
   * base64_encode(...)
   *
   * openssl_encrypt with options=0 already Base64 encodes,
   * therefore this is intentionally Base64 twice.
   */
  return Buffer.from(ciphertext, "utf8").toString("base64");
}

/**
 * Decrypt Treasury callback data.
 */
export function decryptPayload(value) {
  if (!value) {
    throw new Error("Missing Treasury callback data");
  }

  /*
   * Remove the outer Base64 layer.
   */
  const innerBase64 = Buffer.from(
    String(value),
    "base64"
  ).toString("utf8");

  const decipher = createDecipheriv(
    "aes-256-ecb",
    key(),
    null
  );

  /*
   * Remove the inner Base64 layer and decrypt.
   */
  const plaintext = Buffer.concat([
    decipher.update(
      Buffer.from(innerBase64, "base64")
    ),
    decipher.final(),
  ]).toString("utf8");

  /*
   * Support JSON as well as the URL-encoded format
   * shown by the Treasury integration.
   */
  try {
    return JSON.parse(plaintext);
  } catch {
    return Object.fromEntries(
      new URLSearchParams(plaintext)
    );
  }
}

/**
 * Determine whether Treasury reports a successful payment.
 */
export function paymentSucceeded(payload = {}) {
  const responseCode =
    payload.Response_Code ||
    payload.response_code ||
    payload.ResponseCode ||
    payload.responseCode;

  const status = [
    payload.status,
    payload.Status,
    payload.payment_status,
    payload.paymentStatus,
    payload.transaction_status,
    payload.Transaction_Status,
    payload.response,
    payload.message,
    payload.Response_Message,
    payload.Response_Message,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  /*
   * Explicit failure always wins.
   */
  if (
    /not\s+successful|fail(?:ed|ure)?|declin(?:ed|e)|reject(?:ed|ion)|cancel(?:led|ed)?/.test(
      status
    )
  ) {
    return false;
  }

  /*
   * Treasury's successful response code.
   */
  if (
    String(responseCode || "").toUpperCase() === "E000"
  ) {
    return true;
  }

  return /(^|\s)(success|successful|completed|captured|approved)(\s|$)/.test(
    status
  );
}

/**
 * Encode LMS metadata into the merchant reference.
 *
 * Example:
 *
 * IYF-LMS-eyJ1IjoiMTIzIiwiYyI6ImNvdXJzZS0xMjMifQ-ABC123
 *
 * u = user_id
 * c = course_id
 *
 * The reference is returned by Treasury as
 * sub_merchant_reference_no.
 */
export function createLmsReference(userId, courseId) {
  if (!String(userId || "").trim()) {
    throw new Error("Missing LMS user_id");
  }

  if (!String(courseId || "").trim()) {
    throw new Error("Missing LMS course_id");
  }

  const metadata = {
    u: String(userId),
    c: String(courseId),
  };

  const encoded = Buffer.from(
    JSON.stringify(metadata),
    "utf8"
  ).toString("base64url");

  const randomPart = cryptoRandomReference();

  return `IYF-LMS-${encoded}-${randomPart}`;
}

/**
 * Extract LMS metadata from our reference.
 */
export function parseLmsReference(referenceId) {
  const reference = String(referenceId || "");

  if (!reference.startsWith("IYF-LMS-")) {
    return null;
  }

  const remainder = reference.slice(
    "IYF-LMS-".length
  );

  /*
   * The final section is our random identifier.
   * Everything before it is the encoded metadata.
   */
  const separator = remainder.lastIndexOf("-");

  if (separator <= 0) {
    return null;
  }

  const encoded = remainder.slice(0, separator);

  try {
    const metadata = JSON.parse(
      Buffer.from(
        encoded,
        "base64url"
      ).toString("utf8")
    );

    if (
      !metadata ||
      !metadata.u ||
      !metadata.c
    ) {
      return null;
    }

    return {
      user_id: String(metadata.u),
      course_id: String(metadata.c),
    };
  } catch {
    return null;
  }
}

/**
 * Generate a short random reference component.
 */
function cryptoRandomReference() {
  return randomUUID()
    .replace(/-/g, "")
    .slice(0, 16)
    .toUpperCase();
}


function cryptoRandomBytes(size) {
  /*
   * Avoid importing randomUUID separately just for
   * this small reference component.
   */
  const bytes = new Uint8Array(size);

  /*
   * node:crypto randomUUID is already imported indirectly
   * only through this module in most deployments, but
   * using HMAC-independent UUID generation here keeps
   * the reference simple.
   */
  const uuid = cryptoRandomUuid();

  return uuid
    .replace(/-/g, "")
    .slice(0, size * 2)
    .toUpperCase();
}

function cryptoRandomUuid() {
  /*
   * randomUUID is available in modern Node.js runtimes.
   */
  return requireRandomUUID();
}

function requireRandomUUID() {
  /*
   * This function is replaced below by the imported
   * randomUUID-compatible implementation.
   */
  return randomUUID?.() || "00000000-0000-0000-0000-000000000000";
}

/**
 * Normalize Treasury callback.
 *
 * NOTE:
 * LMS user_id/course_id are intentionally recovered
 * from reference_id, because your actual Treasury callback
 * does not return them as independent fields.
 */
export function callbackClaims(payload = {}) {
  const referenceId =
    payload.reference_id ||
    payload.sub_merchant_reference_no ||
    payload.merchant_reference_id ||
    "";

  const reference = String(referenceId);

  const lmsData = parseLmsReference(reference);

  const purpose =
    payload.transaction_purpose ||
    payload.Transaction_Purpose ||
    payload.purpose ||
    payload.Purpose ||
    "General Donation";

  const transactionId =
    payload.Unique_Ref_Number ||
    payload.unique_ref_number ||
    payload.transaction_id ||
    payload.Transaction_ID ||
    payload["HDFC_Data[txnid]"] ||
    "";

  const paymentId =
    payload.payment_id ||
    payload.Payment_ID ||
    payload.Payment_Id ||
    payload["HDFC_Data[mihpayid]"] ||
    payload.Unique_Ref_Number ||
    "";

  const amount =
    payload.Total_Amount ||
    payload.total_amount ||
    payload.Transaction_Amount ||
    payload.requested_payment_amount ||
    payload.Requested_Payment_Amount ||
    payload.amount ||
    payload["HDFC_Data[amount]"] ||
    "";

  const transactionDate =
    payload.Transaction_Date ||
    payload.transaction_date ||
    new Date().toISOString();

  const paymentMode =
    payload.Payment_Mode ||
    payload.payment_mode ||
    payload["HDFC_Data[mode]"] ||
    "";

  return {
    reference_id: reference,

    transaction_id: String(transactionId),

    payment_id: String(paymentId),

    amount: String(amount),

    status: paymentSucceeded(payload)
      ? "success"
      : "failed",

    transaction_date: String(transactionDate),

    payment_mode: String(paymentMode),

    purpose: String(purpose),

    /*
     * These come from our own encoded reference.
     */
    course_id: lmsData?.course_id || "",

    user_id: lmsData?.user_id || "",

    /*
     * Treasury does not currently provide a signature
     * field in the callback you showed.
     */
    signature: "",
  };
}

/**
 * Sign browser-facing payment token.
 */
export function signPaymentToken(claims = {}) {
  const payload = Buffer.from(
    JSON.stringify({
      ...claims,
      issued_at: Date.now(),
    })
  ).toString("base64url");

  const signature = createHmac(
    "sha256",
    key()
  )
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

/**
 * Verify browser-facing payment token.
 */
export function verifyPaymentToken(token) {
  const [payload, signature] =
    String(token || "").split(".");

  if (!payload || !signature) {
    throw new Error("Invalid payment token");
  }

  const expected = createHmac(
    "sha256",
    key()
  )
    .update(payload)
    .digest();

  const received = Buffer.from(
    signature,
    "base64url"
  );

  if (
    received.length !== expected.length ||
    !timingSafeEqual(received, expected)
  ) {
    throw new Error("Invalid payment signature");
  }

  const claims = JSON.parse(
    Buffer.from(
      payload,
      "base64url"
    ).toString("utf8")
  );

  if (
    !claims.issued_at ||
    Date.now() - claims.issued_at >
      1000 * 60 * 60 * 24 * 365
  ) {
    throw new Error("Payment token expired");
  }

  return claims;
}

function escapePdf(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

export function createReceiptPdf(payment) {
  const rows = [
    "IYF MAYAPUR - DONATION RECEIPT",
    "Thank you for your generous contribution.",
    "",
    `Receipt / Reference: ${payment.reference_id}`,
    `Transaction date: ${payment.transaction_date}`,
    `Purpose: ${payment.purpose}`,
    `Amount: INR ${Number(payment.amount).toFixed(2)}`,
    `Transaction ID: ${
      payment.transaction_id ||
      "Confirmed by Mayapur Treasury"
    }`,
    `Payment mode: ${
      payment.payment_mode || "Online"
    }`,
    "",
    "This is a computer-generated payment acknowledgement.",
  ];

  const stream =
    `BT /F1 16 Tf 54 760 Td ` +
    `(${escapePdf(rows[0])}) Tj ` +
    `/F1 11 Tf 0 -34 Td ` +
    rows
      .slice(1)
      .map(
        (row) =>
          `(${escapePdf(row)}) Tj 0 -23 Td`
      )
      .join(" ") +
    " ET";

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",

    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",

    "<< /Type /Page /Parent 2 0 R " +
      "/MediaBox [0 0 595 842] " +
      "/Resources << /Font << /F1 5 0 R >> >> " +
      "/Contents 4 0 R >>",

    `<< /Length ${Buffer.byteLength(stream)} >>\n` +
      `stream\n${stream}\nendstream`,

    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));

    pdf +=
      `${index + 1} 0 obj\n` +
      `${object}\n` +
      "endobj\n";
  });

  const xref = Buffer.byteLength(pdf);

  pdf +=
    `xref\n` +
    `0 ${objects.length + 1}\n` +
    `0000000000 65535 f \n` +
    offsets
      .slice(1)
      .map(
        (offset) =>
          `${String(offset).padStart(10, "0")} 00000 n `
      )
      .join("\n") +
    "\n" +
    `trailer << /Size ${
      objects.length + 1
    } /Root 1 0 R >>\n` +
    `startxref\n${xref}\n` +
    "%%EOF";

  return Buffer.from(pdf);
}
