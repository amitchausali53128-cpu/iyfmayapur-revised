import { useEffect, useMemo, useState } from "react";
import { cloudinaryAsset } from "../lib/cloudinary";
import {
  FiArrowRight,
  FiBookOpen,
  FiCheck,
  FiHeart,
  FiMinus,
  FiPlus,
  FiSearch,
  FiShoppingBag,
  FiStar,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const books = [
  {
    id: "bg-as-it-is",
    title: "Bhagavad-gītā As It Is",
    category: "Bhagavad-gītā",
    format: "Hardcover",
    price: 499,
    originalPrice: 599,
    rating: "4.9",
    badge: "Bestseller",
    coverPosition: "0% 0%",
    description:
      "The complete edition with original Sanskrit, translations, and illuminating purports.",
  },
  {
    id: "srimad-bhagavatam",
    title: "Śrīmad-Bhāgavatam — Canto 1",
    category: "Śrīmad-Bhāgavatam",
    format: "Hardcover",
    price: 699,
    originalPrice: 799,
    rating: "4.9",
    badge: "Essential",
    coverPosition: "50% 0%",
    description:
      "The timeless narration of spiritual history, philosophy, devotion, and divine wisdom.",
  },
  {
    id: "science-self-realization",
    title: "The Science of Self-Realization",
    category: "Wisdom",
    format: "Paperback",
    price: 249,
    originalPrice: 299,
    rating: "4.8",
    badge: "Reader favourite",
    coverPosition: "100% 0%",
    description:
      "Clear conversations and essays addressing life, consciousness, meditation, and the self.",
  },
  {
    id: "nectar-devotion",
    title: "The Nectar of Devotion",
    category: "Bhakti-yoga",
    format: "Paperback",
    price: 399,
    originalPrice: 449,
    rating: "4.8",
    badge: "Bhakti classic",
    coverPosition: "0% 100%",
    description:
      "A practical and profound guide to the complete science of devotional service.",
  },
  {
    id: "teachings-caitanya",
    title: "Teachings of Lord Caitanya",
    category: "Bhakti-yoga",
    format: "Hardcover",
    price: 449,
    originalPrice: 525,
    rating: "4.9",
    badge: "Classic",
    coverPosition: "50% 100%",
    description:
      "The essential teachings of Śrī Caitanya Mahāprabhu presented with clarity and depth.",
  },
  {
    id: "krsna-book",
    title: "Kṛṣṇa — The Supreme Personality of Godhead",
    category: "Kṛṣṇa Book",
    format: "Hardcover",
    price: 599,
    originalPrice: 699,
    rating: "5.0",
    badge: "Family favourite",
    coverPosition: "100% 100%",
    description:
      "A captivating narration of Lord Kṛṣṇa’s extraordinary pastimes and teachings.",
  },
];

const categories = [
  "All books",
  "Bhagavad-gītā",
  "Śrīmad-Bhāgavatam",
  "Bhakti-yoga",
  "Wisdom",
  "Kṛṣṇa Book",
];

const readStorage = (key) => {
  if (typeof window === "undefined") return [];

  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

export default function Store() {
  const [cart, setCart] = useState(() =>
    readStorage("prabhupada-book-cart")
  );

  const [wishlist, setWishlist] = useState(() =>
    readStorage("prabhupada-book-wishlist")
  );

  const [activeCategory, setActiveCategory] = useState("All books");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("prabhupada-book-cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "prabhupada-book-wishlist",
        JSON.stringify(wishlist)
      );
    }
  }, [wishlist]);

  const filteredBooks = useMemo(() => {
    const term = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesCategory =
        activeCategory === "All books" ||
        book.category === activeCategory;

      const matchesSearch =
        !term ||
        `${book.title} ${book.category} ${book.description}`
          .toLowerCase()
          .includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const cartCount = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = subtotal + shipping;

  const addToCart = (book) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === book.id);

      if (existing) {
        return current.map((item) =>
          item.id === book.id
            ? { ...item, qty: Number(item.qty || 0) + 1 }
            : item
        );
      }

      return [...current, { ...book, qty: 1 }];
    });

    setCartOpen(true);
  };

  const updateQuantity = (id, change) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: Number(item.qty || 0) + change,
              }
            : item
        )
        .filter((item) => Number(item.qty || 0) > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const toggleWishlist = (book) => {
    setWishlist((current) =>
      current.some((item) => item.id === book.id)
        ? current.filter((item) => item.id !== book.id)
        : [...current, book]
    );
  };

  const openCheckout = () => {
    if (!cart.length) {
      window.alert("Your cart is empty.");
      return;
    }

    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="book-store-page">
      <section className="book-store-hero">
        <img
          src={cloudinaryAsset("/store/prabhupada-books-hero.png", {
            width: 1800,
            crop: "limit",
          })}
          alt="A collection of devotional books"
          fetchPriority="high"
          decoding="async"
        />

        <div className="book-store-shell book-store-hero__content">
          <p className="book-store-eyebrow">Transcendental literature</p>

          <h1>
            Books by
            <br />
            Śrīla Prabhupāda
          </h1>

          <p>
            Timeless wisdom for a thoughtful, joyful, and spiritually fulfilled
            life.
          </p>

          <a href="#book-collection">
            Explore the collection <FiArrowRight />
          </a>
        </div>
      </section>

      <section
        className="book-store-benefits book-store-shell"
        aria-label="Store benefits"
      >
        <div>
          <span>
            <FiBookOpen />
          </span>
          <p>
            <strong>Authentic editions</strong>
            <small>Original teachings and purports</small>
          </p>
        </div>

        <div>
          <span>
            <FiShoppingBag />
          </span>
          <p>
            <strong>Carefully packed</strong>
            <small>Books delivered with care</small>
          </p>
        </div>

        <div>
          <span>
            <FiCheck />
          </span>
          <p>
            <strong>Free shipping</strong>
            <small>On orders above ₹999</small>
          </p>
        </div>
      </section>

      <section
        className="book-store-shell book-collection"
        id="book-collection"
      >
        <div className="book-collection__header">
          <div>
            <p className="book-store-eyebrow">The Bhaktivedanta library</p>
            <h2>Find your next book</h2>
          </div>

          <button
            type="button"
            className="book-cart-button"
            onClick={() => setCartOpen(true)}
          >
            <FiShoppingBag /> Cart <span>{cartCount}</span>
          </button>
        </div>

        <div className="book-store-toolbar">
          <div className="book-store-categories">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={activeCategory === category ? "is-active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <label className="book-store-search">
            <FiSearch />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search books"
              type="search"
            />
          </label>
        </div>

        {filteredBooks.length ? (
          <div className="book-grid">
            {filteredBooks.map((book) => {
              const wished = wishlist.some((item) => item.id === book.id);

              return (
                <article className="book-card" key={book.id}>
                  <div className="book-card__visual">
                    <span className="book-card__badge">{book.badge}</span>

                    <button
                      type="button"
                      className={`book-card__heart ${
                        wished ? "is-active" : ""
                      }`}
                      onClick={() => toggleWishlist(book)}
                      aria-label={
                        wished
                          ? `Remove ${book.title} from wishlist`
                          : `Add ${book.title} to wishlist`
                      }
                    >
                      <FiHeart />
                    </button>

                    <div
                      className="book-card__cover"
                      role="img"
                      aria-label={`Illustrated cover for ${book.title}`}
                      style={{
                        backgroundPosition: book.coverPosition,
                      }}
                    />

                    <span className="book-card__cover-title">
                      {book.title}
                    </span>
                  </div>

                  <div className="book-card__body">
                    <p className="book-card__category">
                      {book.category} · {book.format}
                    </p>

                    <h3>{book.title}</h3>

                    <p className="book-card__description">
                      {book.description}
                    </p>

                    <div className="book-card__rating">
                      <FiStar />
                      <strong>{book.rating}</strong>
                      <span>Reader rating</span>
                    </div>

                    <div className="book-card__footer">
                      <p>
                        <strong>₹{book.price}</strong>
                        <del>₹{book.originalPrice}</del>
                      </p>

                      <button
                        type="button"
                        onClick={() => addToCart(book)}
                      >
                        <FiShoppingBag /> Add
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="book-store-empty-search">
            <FiBookOpen />
            <h3>No books found</h3>
            <p>Try another title or category.</p>
          </div>
        )}
      </section>

      {cartOpen && (
        <button
          type="button"
          className="book-cart-overlay"
          onClick={() => setCartOpen(false)}
          aria-label="Close cart"
        />
      )}

      <aside
        className={`book-cart-drawer ${cartOpen ? "is-open" : ""}`}
        aria-hidden={!cartOpen}
      >
        <div className="book-cart-drawer__header">
          <div>
            <p>Your cart</p>
            <span>
              {cartCount} {cartCount === 1 ? "book" : "books"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
          >
            <FiX />
          </button>
        </div>

        <div className="book-cart-drawer__items">
          {cart.length === 0 ? (
            <div className="book-cart-empty">
              <FiShoppingBag />

              <h3>Your cart is empty</h3>

              <p>
                Discover a book to begin your spiritual library.
              </p>

              <button
                type="button"
                onClick={() => setCartOpen(false)}
              >
                Continue browsing
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div className="book-cart-item" key={item.id}>
                <div
                  className="book-cart-item__cover"
                  style={{
                    backgroundPosition: item.coverPosition,
                  }}
                />

                <div className="book-cart-item__info">
                  <strong>{item.title}</strong>

                  <span>{item.format}</span>

                  <div className="book-cart-item__bottom">
                    <div className="book-quantity">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label={`Decrease ${item.title} quantity`}
                      >
                        <FiMinus />
                      </button>

                      <span>{item.qty}</span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label={`Increase ${item.title} quantity`}
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <strong>
                      ₹{Number(item.price) * Number(item.qty)}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="book-cart-item__remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.title}`}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="book-cart-summary">
            <p>
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </p>

            <p>
              <span>Shipping</span>
              <strong>
                {shipping === 0 ? "Free" : `₹${shipping}`}
              </strong>
            </p>

            <div>
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>

            <button
              type="button"
              className="book-checkout-button"
              onClick={openCheckout}
            >
              Proceed to checkout <FiArrowRight />
            </button>

            <small>
              Secure checkout · Prices include applicable taxes
            </small>
          </div>
        )}
      </aside>

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  );
}

function CheckoutModal({
  cart,
  subtotal,
  shipping,
  total,
  onClose,
}) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    address_1: "",
    address_2: "",
    pin_code: "",
    district: "",
    city: "",
    state: "",
    country: "India",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submitPayment = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const missing = Object.entries(form)
        .filter(([key]) => {
          if (key === "address_2") return false;
          return !String(form[key]).trim();
        })
        .map(([key]) => key);

      if (missing.length) {
        throw new Error(
          "Please complete all required customer details."
        );
      }

      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          payment_type: "store",
          amount: total,
          transaction_purpose: "Book Purchase",
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response from the payment server."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to start HDFC payment."
        );
      }

      if (!data.payment_url) {
        throw new Error(
          "The HDFC payment URL was not returned."
        );
      }

      window.location.assign(data.payment_url);
    } catch (err) {
      console.error("HDFC payment error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start payment. Please try again."
      );

      setLoading(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10";

  const labelClass =
    "block text-sm font-medium text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close checkout"
      />

      {/* Modal */}
      <div
        className="relative z-10 max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-checkout-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white px-6 py-5 sm:px-8">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-green-600">
              Secure checkout
            </p>

            <h2
              id="book-checkout-title"
              className="text-2xl font-bold text-gray-900"
            >
              Delivery details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submitPayment}>
          {/* Form */}
          <div className="space-y-5 px-6 py-6 sm:px-8">
            {/* First / Last Name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                First name *
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={updateField}
                  autoComplete="given-name"
                  required
                  className={inputClass}
                />
              </label>

              <label className={labelClass}>
                Last name *
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={updateField}
                  autoComplete="family-name"
                  required
                  className={inputClass}
                />
              </label>
            </div>

            {/* Email / Mobile */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Email *
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </label>

              <label className={labelClass}>
                Mobile *
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={updateField}
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  className={inputClass}
                />
              </label>
            </div>

            {/* Address */}
            <label className={labelClass}>
              Address line 1 *
              <input
                name="address_1"
                value={form.address_1}
                onChange={updateField}
                autoComplete="address-line1"
                required
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Address line 2
              <input
                name="address_2"
                value={form.address_2}
                onChange={updateField}
                autoComplete="address-line2"
                className={inputClass}
              />
            </label>

            {/* PIN / District */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                PIN code *
                <input
                  name="pin_code"
                  value={form.pin_code}
                  onChange={updateField}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  required
                  className={inputClass}
                />
              </label>

              <label className={labelClass}>
                District *
                <input
                  name="district"
                  value={form.district}
                  onChange={updateField}
                  required
                  className={inputClass}
                />
              </label>
            </div>

            {/* City / State */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                City *
                <input
                  name="city"
                  value={form.city}
                  onChange={updateField}
                  autoComplete="address-level2"
                  required
                  className={inputClass}
                />
              </label>

              <label className={labelClass}>
                State *
                <input
                  name="state"
                  value={form.state}
                  onChange={updateField}
                  autoComplete="address-level1"
                  required
                  className={inputClass}
                />
              </label>
            </div>

            {/* Country */}
            <label className={labelClass}>
              Country *
              <input
                name="country"
                value={form.country}
                onChange={updateField}
                autoComplete="country-name"
                required
                className={inputClass}
              />
            </label>
          </div>

          {/* Order Summary */}
          <div className="border-y border-gray-200 bg-gray-50 px-6 py-5 sm:px-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <strong className="font-semibold text-gray-900">
                  ₹{subtotal}
                </strong>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <strong className="font-semibold text-gray-900">
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </strong>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base">
                <span className="font-semibold text-gray-900">
                  Total payable
                </span>

                <strong className="text-lg font-bold text-gray-900">
                  ₹{total}
                </strong>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mx-6 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-8"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="px-6 py-6 sm:px-8">
            <button
              type="submit"
              disabled={loading || !cart.length}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Connecting to HDFC..."
                : "Pay securely"}

              {!loading && (
                <FiArrowRight className="h-4 w-4" />
              )}
            </button>

            <small className="mt-3 block text-center text-xs leading-5 text-gray-500">
              You will be securely redirected to the HDFC payment
              gateway to complete your payment.
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}


