import { Link, useLocation } from "react-router-dom";

const LAST_UPDATED = "October 9, 2026";

const legalPages = {
  "/legal/privacy-policy": {
    eyebrow: "Your privacy matters",
    title: "Privacy Policy",
    intro:
      "This Privacy Policy explains how IYF Sridham Mayapur collects, uses, and protects information when you visit our website, use our learning services, purchase from our store, or make a donation.",
    sections: [
      {
        title: "Information we collect",
        paragraphs: [
          "We may collect information you provide directly, such as your name, email address, phone number, billing or shipping address, account details, course activity, donation details, and messages sent to us.",
          "We also receive limited technical information such as your browser, device, approximate location, pages visited, and interaction data needed to keep the website secure and improve our services.",
        ],
      },
      {
        title: "How we use information",
        paragraphs: [
          "We use information to provide and improve courses, process orders and donations, issue receipts, manage accounts, communicate about transactions or services, respond to enquiries, prevent fraud, and meet legal or accounting obligations.",
          "We do not sell your personal information. We may send service-related messages and, where permitted, occasional updates about IYF activities. You can ask us to stop non-essential communications at any time.",
        ],
      },
      {
        title: "Payments and service providers",
        paragraphs: [
          "Payments are handled through payment providers and banking partners. We do not intentionally store complete card, banking, or UPI credentials on this website. Those providers process information under their own privacy notices and security practices.",
          "We may share only the information needed with trusted service providers that host our website, deliver products, send communications, or support our operations. They may use information only to provide services to us and must protect it appropriately.",
        ],
      },
      {
        title: "Storage, security, and retention",
        paragraphs: [
          "We use reasonable administrative, technical, and organisational safeguards to protect personal information. No online service can guarantee absolute security, so please use a strong password and contact us promptly if you suspect unauthorised access.",
          "We retain information only for as long as reasonably necessary for the purposes described here, including legal, tax, accounting, dispute-resolution, and fraud-prevention requirements.",
        ],
      },
      {
        title: "Your choices and rights",
        paragraphs: [
          "You may ask us to access, correct, update, or delete personal information we hold about you, subject to applicable legal requirements. You may also withdraw consent where processing is based on consent. To make a request, email mayapuriyf@gmail.com with enough detail for us to identify the relevant account or transaction.",
        ],
      },
      {
        title: "Children and external links",
        paragraphs: [
          "Our services are not intended for children who cannot lawfully use them without a parent or guardian. We do not knowingly collect personal information from such children.",
          "Our website may link to third-party websites, payment providers, or social platforms. Their privacy practices are independent of ours, so please review their policies before sharing information.",
        ],
      },
      {
        title: "Changes and contact",
        paragraphs: [
          "We may update this policy when our services or legal obligations change. The latest version will be posted on this page with a new update date.",
          "For privacy questions or requests, contact IYF Sridham Mayapur at mayapuriyf@gmail.com.",
        ],
      },
    ],
  },
  "/legal/terms-of-service": {
    eyebrow: "Please read before using our services",
    title: "Terms of Service",
    intro:
      "These Terms of Service govern access to and use of the IYF Sridham Mayapur website, learning platform, store, donation services, and related content.",
    sections: [
      {
        title: "Acceptance and eligibility",
        paragraphs: [
          "By accessing or using our services, you agree to these Terms and our Privacy Policy. If you use a service on behalf of another person or organisation, you confirm that you have authority to accept these Terms for them.",
          "You must provide accurate information, keep account credentials confidential, and be legally able to enter into the transaction you make. A parent or guardian is responsible for a minor's use where permitted.",
        ],
      },
      {
        title: "Accounts and learning services",
        paragraphs: [
          "Some courses and features require an account. You are responsible for activity under your account and must notify us promptly if you believe it has been compromised.",
          "Course access is personal, non-transferable, and subject to the course description and payment status. Do not share login details, copy or redistribute course materials, or use the platform to interfere with another learner's access.",
        ],
      },
      {
        title: "Store orders and donations",
        paragraphs: [
          "Product descriptions, prices, availability, taxes, shipping charges, and estimated delivery information are shown at checkout and may change. We may correct errors, cancel an order, or contact you for clarification where reasonably necessary.",
          "Donations are voluntary contributions to support IYF activities and are not purchases of goods or services. Please review our Refund & Cancellation Policy before making a payment.",
        ],
      },
      {
        title: "Acceptable use",
        paragraphs: [
          "You must not misuse the website, attempt unauthorised access, introduce malicious code, scrape or overload our systems, impersonate another person, submit unlawful or harmful content, infringe rights, or use our services for fraud or commercial exploitation without permission.",
          "We may suspend or end access when reasonably necessary to protect users, our services, or our legal rights. Where appropriate, we will provide notice and an opportunity to resolve the issue.",
        ],
      },
      {
        title: "Content and intellectual property",
        paragraphs: [
          "IYF Sridham Mayapur and its licensors retain rights in the website, branding, course materials, text, images, video, and other content. We grant you a limited, personal, non-exclusive, non-transferable licence to use the services for their intended purpose.",
          "You retain rights in content you submit, but grant us permission to use it as needed to operate, secure, and improve the service. Do not submit content you do not have permission to share.",
        ],
      },
      {
        title: "Disclaimers and liability",
        paragraphs: [
          "Services and content are provided for general educational and informational purposes and are offered on an 'as available' basis. We do not guarantee uninterrupted operation, complete accuracy, or that every result will meet your expectations.",
          "To the maximum extent permitted by law, IYF Sridham Mayapur will not be liable for indirect, incidental, special, or consequential loss arising from use of the services. Nothing in these Terms excludes liability that cannot lawfully be excluded.",
        ],
      },
      {
        title: "Governing law and contact",
        paragraphs: [
          "These Terms are governed by the laws of India. Disputes will be subject to the jurisdiction of the courts having authority over IYF Sridham Mayapur, subject to applicable consumer protections.",
          "Questions about these Terms can be sent to mayapuriyf@gmail.com. We may update these Terms from time to time; continued use after an update means you accept the revised Terms.",
        ],
      },
    ],
  },
  "/legal/refund-cancellation": {
    eyebrow: "Clear payment expectations",
    title: "Refund & Cancellation Policy",
    intro:
      "This policy explains how cancellations, refunds, failed payments, and donation reversals are handled for IYF Sridham Mayapur services.",
    sections: [
      {
        title: "Course purchases",
        paragraphs: [
          "If you purchased a paid course and cannot access it because of a technical issue on our side, contact us at mayapuriyf@gmail.com with your order or payment reference. We will investigate and, where appropriate, restore access or issue a refund.",
          "Because digital course access may begin immediately, change-of-mind refunds are not automatic after access has been provided. We will review exceptional requests fairly based on the circumstances and applicable law.",
        ],
      },
      {
        title: "Store orders",
        paragraphs: [
          "You may request cancellation before an order is dispatched by contacting us with your order reference. After dispatch, cancellation may not be possible, but you can contact us about a damaged, incorrect, or materially defective item.",
          "For an eligible return or replacement, keep the item in its received condition and provide photographs and order details within 7 days of delivery. Refunds, where approved, are returned through the original payment method after review.",
        ],
      },
      {
        title: "Donations",
        paragraphs: [
          "Donations are intended to support IYF activities and are generally final. If you made a duplicate, unauthorised, or mistaken donation, contact us as soon as possible with the transaction reference. We will review the request and process any approved reversal subject to payment-provider and legal requirements.",
        ],
      },
      {
        title: "Failed or duplicated payments",
        paragraphs: [
          "If money was debited but the order, course enrolment, or donation does not show as successful, do not immediately retry. Contact us with the payment reference so we can verify the status. Bank or payment-provider reversals may take additional business days.",
          "Approved refunds are normally initiated within 7 business days after approval. The time taken for the funds to appear depends on your bank or payment provider.",
        ],
      },
      {
        title: "How to contact us",
        paragraphs: [
          "Email mayapuriyf@gmail.com with your name, registered email, transaction or order reference, amount, date, and a short description of the issue. Do not send full card numbers, passwords, or other sensitive authentication information.",
        ],
      },
    ],
  },
  "/legal/shipping-delivery": {
    eyebrow: "Orders and access",
    title: "Shipping & Delivery Policy",
    intro:
      "This policy explains how physical store orders, digital courses, and donation confirmations are delivered through IYF Sridham Mayapur.",
    sections: [
      {
        title: "Physical products",
        paragraphs: [
          "We currently ship eligible store orders within India to the address entered at checkout. Available shipping charges and any free-shipping threshold are shown before payment.",
          "Orders are generally dispatched within 3–7 business days after successful payment. Delivery is usually completed within 5–10 business days after dispatch, depending on the destination, courier, weather, and other conditions outside our control.",
        ],
      },
      {
        title: "Address and delivery issues",
        paragraphs: [
          "Please check your name, phone number, and full delivery address before paying. Additional costs or delays caused by an incomplete or incorrect address may be your responsibility.",
          "If a package arrives damaged, incorrect, or does not arrive within a reasonable time after dispatch, email mayapuriyf@gmail.com with your order reference and photographs where relevant so we can investigate with the courier.",
        ],
      },
      {
        title: "Digital courses",
        paragraphs: [
          "Paid digital courses do not require physical delivery. Once payment is confirmed, access is made available to the account or email used for the purchase. If access is not available after confirmation, contact us with your payment reference.",
        ],
      },
      {
        title: "Donations and contact",
        paragraphs: [
          "Donations do not result in a physical shipment. A payment confirmation or receipt may be provided electronically when the transaction is successfully verified.",
          "For delivery questions, contact IYF Sridham Mayapur at mayapuriyf@gmail.com before placing a time-sensitive order.",
        ],
      },
    ],
  },
};

function LegalPage() {
  const { pathname } = useLocation();
  const page = legalPages[pathname] || legalPages["/legal/privacy-policy"];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fffdf8] text-[#2d241d]">
      <header className="bg-[#10251b] px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#f5c957]">
            {page.eyebrow}
          </p>
          <h1 className="font-serif text-4xl font-semibold sm:text-5xl">{page.title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/75">{page.intro}</p>
          <p className="mt-5 text-sm text-white/50">Last updated: {LAST_UPDATED}</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="space-y-10">
          {page.sections.map((section) => (
            <section key={section.title} className="border-b border-[#eadfce] pb-8 last:border-b-0">
              <h2 className="font-serif text-2xl font-semibold text-[#1f3b2d]">{section.title}</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-8 text-[#5f625d]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-[#eadfce] pt-8 text-sm font-semibold">
          <Link className="text-[#276244] hover:text-[#b66d24]" to="/legal/privacy-policy">
            Privacy Policy
          </Link>
          <Link className="text-[#276244] hover:text-[#b66d24]" to="/legal/terms-of-service">
            Terms of Service
          </Link>
          <Link className="text-[#276244] hover:text-[#b66d24]" to="/legal/refund-cancellation">
            Refund & Cancellation
          </Link>
          <Link className="text-[#276244] hover:text-[#b66d24]" to="/legal/shipping-delivery">
            Shipping & Delivery
          </Link>
        </div>
      </main>
    </div>
  );
}

export default LegalPage;
