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
    <main className="store-thank-you">
      <section className="store-thank-you__card">
        <div className="store-thank-you__icon">
          <FiCheck />
        </div>

        <p className="book-store-eyebrow">
          Order confirmed
        </p>

        <h1>Thank you for your order!</h1>

        <p>
          Your payment has been received successfully.
          We’re grateful for your support and will carefully
          prepare your books for delivery.
        </p>

        {referenceId && (
          <div className="store-thank-you__reference">
            <span>Order reference</span>
            <strong>{referenceId}</strong>
          </div>
        )}

        <div className="store-thank-you__actions">
          <Link to="/store">
            <FiShoppingBag />
            Continue shopping
          </Link>

          <Link to="/">
            Back to home
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
