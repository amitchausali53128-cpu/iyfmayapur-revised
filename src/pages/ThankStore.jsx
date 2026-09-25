import { Link, useSearchParams } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiShoppingBag,
} from "react-icons/fi";

export default function StoreThankYou() {
  const [searchParams] = useSearchParams();
  const referenceId = searchParams.get("reference_id");

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-xl rounded-2xl bg-white px-6 py-10 text-center shadow-lg sm:px-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <FiCheck className="h-8 w-8" />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-600">
          Order confirmed
        </p>

        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
          Thank you for your order!
        </h1>

        <p className="mx-auto max-w-lg text-base leading-7 text-gray-600">
          Your payment has been received successfully. We’re grateful for
          your support and will carefully prepare your books for delivery.
        </p>

        {referenceId && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
            <span className="block text-sm font-medium text-gray-500">
              Order reference
            </span>
            <strong className="mt-1 block break-all text-base font-semibold text-gray-900">
              {referenceId}
            </strong>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/store"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
          >
            <FiShoppingBag className="h-4 w-4" />
            Continue shopping
          </Link>

          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            Back to home
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
