import { useEffect, useState } from "react";
import { cloudinaryAsset } from "../../lib/cloudinary";
import './store.css';
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
  FiUser,
  FiX,
} from "react-icons/fi";

const readStorage = (key) => {
  if (typeof window === "undefined") return [];

  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const activeAccountStorageKey = "prabhupada-book-active-account";
const accountTokenStorageKey = "prabhupada-book-token";
const accountUserStorageKey = "prabhupada-book-user";
const bookServerUrl = (import.meta.env.VITE_BOOK_SERVER_URL || "").replace(
  /\/$/,
  ""
);

export default function Store() {
  const [cart, setCart] = useState(() =>
    readStorage("prabhupada-book-cart")
  );

  const [wishlist, setWishlist] = useState(() =>
    readStorage("prabhupada-book-wishlist")
  );

  const [activeCategory, setActiveCategory] = useState("All books");
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState(["All books"]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const [accountEmail, setAccountEmail] = useState(() =>
    typeof window === "undefined"
      ? ""
      : localStorage.getItem(activeAccountStorageKey) || ""
  );

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${bookServerUrl}/books/categories`);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Unable to load book categories."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("The server returned an invalid categories response.");
        }

        const fetchedCategories = data
          .map((category) =>
            typeof category === "string"
              ? category
              : category?.name || category?.category
          )
          .filter(Boolean);

        if (!cancelled) {
          setCategories([
            "All books",
            ...new Set(
              fetchedCategories.filter(
                (category) => category !== "All books"
              )
            ),
          ]);
        }
      } catch (requestError) {
        if (!cancelled) {
          setBooksError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load book categories."
          );
        }
      }
    };

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchBooks = async () => {
      setBooksLoading(true);
      setBooksError("");

      const params = new URLSearchParams();
      if (activeCategory !== "All books") {
        params.set("category", activeCategory);
      }
      if (search.trim()) {
        params.set("search", search.trim());
      }

      try {
        const query = params.toString();
        const response = await fetch(
          `${bookServerUrl}/books${query ? `?${query}` : ""}`
        );
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Unable to load books."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("The server returned an invalid books response.");
        }

        if (!cancelled) {
          setBooks(data);
        }
      } catch (requestError) {
        if (!cancelled) {
          setBooks([]);
          setBooksError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load books."
          );
        }
      } finally {
        if (!cancelled) {
          setBooksLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      cancelled = true;
    };
  }, [activeCategory, search]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "prabhupada-book-cart",
        JSON.stringify(cart)
      );
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

  const cartCount = cart.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  const shipping =
    subtotal >= 999 || subtotal === 0 ? 0 : 79;

  const total = subtotal + shipping;

  const addToCart = (book) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === book.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === book.id
            ? {
                ...item,
                qty: Number(item.qty || 0) + 1,
              }
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
        .filter(
          (item) => Number(item.qty || 0) > 0
        )
    );
  };

  const removeFromCart = (id) => {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    );
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

  const handleAccountChange = (email) => {
    setAccountEmail(email);

    if (typeof window !== "undefined") {
      if (email) {
        localStorage.setItem(
          activeAccountStorageKey,
          email
        );
      } else {
        localStorage.removeItem(
          activeAccountStorageKey
        );
      }
    }
  };

  return (
    <div className="book-store-page">

      {/* HERO */}
      <section className="book-store-hero">
        <img
          src={cloudinaryAsset(
            "/store/prabhupada-books-hero.png",
            {
              width: 1800,
              crop: "limit",
            }
          )}
          alt="A collection of devotional books"
          fetchPriority="high"
          decoding="async"
        />

        <div className="book-store-hero__veil" />

        <div className="book-store-shell book-store-hero__content">
          <span className="book-store-hero__ornament">
            ✦
          </span>

          <p className="book-store-eyebrow">
            The Bhaktivedanta Library
          </p>

          <h1>
            Books that open
            <br />
            the door within.
          </h1>

          <p className="book-store-hero__intro">
            Discover timeless wisdom from Śrīla Prabhupāda —
            books for seekers, families, students, and
            anyone looking for a deeper understanding of life.
          </p>

          <a
            href="#book-collection"
            className="book-store-hero__button"
          >
            Explore the collection
            <FiArrowRight />
          </a>
        </div>

        <div className="book-store-hero__bottom">
          <span>Śrīla Prabhupāda</span>
          <span className="book-store-hero__line" />
          <span>Books · Wisdom · Bhakti</span>
        </div>
      </section>

      {/* BENEFITS */}
      <section
        className="book-store-benefits book-store-shell"
        aria-label="Store benefits"
      >
        <div className="book-benefit">
          <span className="book-benefit__icon">
            <FiBookOpen />
          </span>

          <div>
            <strong>Authentic editions</strong>
            <small>
              Original teachings and purports
            </small>
          </div>
        </div>

        <div className="book-benefit">
          <span className="book-benefit__icon">
            <FiShoppingBag />
          </span>

          <div>
            <strong>Packed with care</strong>
            <small>
              Every book handled thoughtfully
            </small>
          </div>
        </div>

        <div className="book-benefit">
          <span className="book-benefit__icon">
            <FiCheck />
          </span>

          <div>
            <strong>Free shipping</strong>
            <small>
              On orders above ₹999
            </small>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section
        className="book-store-shell book-collection"
        id="book-collection"
      >

        {/* ACCOUNT */}
        <section className="book-account-banner">
          <div className="book-account-banner__icon">
            <FiUser />
          </div>

          <div className="book-account-banner__content">
            <p>YOUR BOOK ACCOUNT</p>

            <h2>
              {accountEmail
                ? "Welcome back to your library"
                : "Keep your book journey together"}
            </h2>

            <span>
              {accountEmail
                ? `Signed in as ${accountEmail}`
                : "Sign in to access your past orders and keep track of your books."}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setAccountOpen(true)}
          >
            <FiUser />
            {accountEmail
              ? "My orders"
              : "Sign in / Create account"}
          </button>
        </section>

        {/* HEADING */}
        <div className="book-collection__header">
          <div>
            <p className="book-store-eyebrow">
              A library for the soul
            </p>

            <h2>
              Find your next
              <em> book.</em>
            </h2>

            <p className="book-collection__description">
              Explore foundational works on bhakti,
              consciousness, self-realization, and the
              timeless wisdom of the Vedic tradition.
            </p>
          </div>

          <button
            type="button"
            className="book-cart-button"
            onClick={() => setCartOpen(true)}
          >
            <FiShoppingBag />
            <span>Cart</span>
            <b>{cartCount}</b>
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="book-store-toolbar">

          <div className="book-store-categories">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={
                  activeCategory === category
                    ? "is-active"
                    : ""
                }
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                {category}
              </button>
            ))}
          </div>

          <label className="book-store-search">
            <FiSearch />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search the library..."
              type="search"
            />
          </label>
        </div>

        {/* BOOK GRID */}
        {booksLoading ? (
          <div className="book-store-empty-search">
            <FiBookOpen />
            <h3>Loading the library</h3>
            <p>Fetching the latest books for you.</p>
          </div>
        ) : booksError ? (
          <div className="book-store-empty-search">
            <FiBookOpen />
            <h3>Unable to load books</h3>
            <p>{booksError}</p>
          </div>
        ) : books.length ? (
          <div className="book-grid">
            {books.map((book, index) => {
              const wished = wishlist.some(
                (item) => item.id === book.id
              );

              return (
                <article
                  className="book-card"
                  key={book.id}
                  style={{
                    "--card-index": index,
                  }}
                >
                  <div className="book-card__visual">

                    <span className="book-card__badge">
                      {book.badge}
                    </span>

                    <button
                      type="button"
                      className={`book-card__heart ${
                        wished ? "is-active" : ""
                      }`}
                      onClick={() =>
                        toggleWishlist(book)
                      }
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
                        backgroundPosition:
                          book.coverPosition,
                        ...(book.imageUrl
                          ? {
                              backgroundImage: `url("${book.imageUrl}")`,
                              backgroundSize: "cover",
                            }
                          : {}),
                      }}
                    />

                    <div className="book-card__cover-shadow" />

                    <span className="book-card__cover-title">
                      {book.title}
                    </span>
                  </div>

                  <div className="book-card__body">

                    <p className="book-card__category">
                      {book.category}
                      <span>·</span>
                      {book.format}
                    </p>

                    <h3>{book.title}</h3>

                    <p className="book-card__description">
                      {book.description}
                    </p>

                    <div className="book-card__rating">
                      <span>
                        <FiStar />
                      </span>

                      <strong>{book.rating}</strong>

                      <small>
                        Reader rating
                      </small>
                    </div>

                    <div className="book-card__footer">
                      <div className="book-card__price">
                        <strong>
                          ₹{book.price}
                        </strong>

                        <del>
                          ₹{book.originalPrice}
                        </del>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addToCart(book)
                        }
                      >
                        Add to cart
                        <FiArrowRight />
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

            <h3>
              No books found
            </h3>

            <p>
              Try another title or category.
            </p>
          </div>
        )}
      </section>

      {/* CLOSING SECTION */}
      <section className="book-store-closing">
        <div className="book-store-closing__ornament">
          ✦
        </div>

        <p>
          Knowledge becomes wisdom when we live it.
        </p>

        <h2>
          Let a good book
          <br />
          become a good beginning.
        </h2>

        <span>
          Hare Krishna
        </span>
      </section>

      {/* CART OVERLAY */}
      {cartOpen && (
        <button
          type="button"
          className="book-cart-overlay"
          onClick={() => setCartOpen(false)}
          aria-label="Close cart"
        />
      )}

      {/* CART DRAWER */}
      <aside
        className={`book-cart-drawer ${
          cartOpen ? "is-open" : ""
        }`}
        aria-hidden={!cartOpen}
      >
        <div className="book-cart-drawer__header">
          <div>
            <p>Your library bag</p>
            <span>
              {cartCount}{" "}
              {cartCount === 1
                ? "book"
                : "books"}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setCartOpen(false)
            }
            aria-label="Close cart"
          >
            <FiX />
          </button>
        </div>

        <div className="book-cart-drawer__items">
          {cart.length === 0 ? (
            <div className="book-cart-empty">
              <FiBookOpen />

              <h3>
                Your library bag is empty
              </h3>

              <p>
                Discover a book to begin
                building your spiritual library.
              </p>

              <button
                type="button"
                onClick={() =>
                  setCartOpen(false)
                }
              >
                Continue browsing
                <FiArrowRight />
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                className="book-cart-item"
                key={item.id}
              >
                <div
                  className="book-cart-item__cover"
                  style={{
                    backgroundPosition:
                      item.coverPosition,
                  }}
                />

                <div className="book-cart-item__info">
                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    {item.format}
                  </span>

                  <div className="book-cart-item__bottom">
                    <div className="book-quantity">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            -1
                          )
                        }
                        aria-label={`Decrease ${item.title} quantity`}
                      >
                        <FiMinus />
                      </button>

                      <span>
                        {item.qty}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            1
                          )
                        }
                        aria-label={`Increase ${item.title} quantity`}
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <strong>
                      ₹
                      {Number(item.price) *
                        Number(item.qty)}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="book-cart-item__remove"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
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
              <strong>
                ₹{subtotal}
              </strong>
            </p>

            <p>
              <span>Shipping</span>
              <strong>
                {shipping === 0
                  ? "Free"
                  : `₹${shipping}`}
              </strong>
            </p>

            <div>
              <span>Total</span>
              <strong>
                ₹{total}
              </strong>
            </div>

            <button
              type="button"
              className="book-checkout-button"
              onClick={openCheckout}
            >
              Proceed to checkout
              <FiArrowRight />
            </button>

            <small>
              Secure checkout · Prices include
              applicable taxes
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
          onClose={() =>
            setCheckoutOpen(false)
          }
        />
      )}

      {accountOpen && (
        <AccountModal
          activeEmail={accountEmail}
          onClose={() =>
            setAccountOpen(false)
          }
          onAccountChange={
            handleAccountChange
          }
        />
      )}
    </div>
  );
}

function AccountModal({
  activeEmail,
  onClose,
  onAccountChange,
}) {
  const [mode, setMode] =
    useState("signIn");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState(activeEmail);

  const [mobile, setMobile] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [orders, setOrders] =
    useState([]);

  const [ordersLoading, setOrdersLoading] =
    useState(false);

  const [ordersError, setOrdersError] =
    useState("");

  useEffect(() => {
    if (!activeEmail) {
      setOrders([]);
      setOrdersError("");
      return undefined;
    }

    let cancelled = false;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");

      try {
        const token =
          localStorage.getItem(
            accountTokenStorageKey
          );

        const response = await fetch(
          `${bookServerUrl}/transactions/get`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {}),
            },
            body: JSON.stringify({
              email: activeEmail,
            }),
          }
        );

        const data =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              "Unable to load your past orders."
          );
        }

        const fetchedOrders =
          Array.isArray(data)
            ? data
            : data.transactions ||
              data.orders ||
              data.data ||
              [];

        if (!Array.isArray(fetchedOrders)) {
          throw new Error(
            "The server returned an invalid orders response."
          );
        }

        if (!cancelled) {
          setOrders(fetchedOrders);
        }
      } catch (ordersRequestError) {
        if (!cancelled) {
          setOrdersError(
            ordersRequestError instanceof Error
              ? ordersRequestError.message
              : "Unable to load your past orders."
          );
        }
      } finally {
        if (!cancelled) {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [activeEmail]);

  const submit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError(
        "Enter your email and password."
      );
      return;
    }

    if (
      mode === "signUp" &&
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (
      mode === "signUp" &&
      !name.trim()
    ) {
      setError("Enter your name.");
      return;
    }

    if (
      mode === "signUp" &&
      !mobile.trim()
    ) {
      setError(
        "Enter your mobile number."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "signUp") {
        const response = await fetch(
          `${bookServerUrl}/users/`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name: name.trim(),
              email: normalizedEmail,
              mobile: mobile.trim(),
              password,
            }),
          }
        );

        const data =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              "Unable to create your account."
          );
        }

        setMessage(
          "Your account is ready. Signing you in..."
        );
      }

      const loginResponse =
        await fetch(
          `${bookServerUrl}/users/login`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email: normalizedEmail,
              password,
            }),
          }
        );

      const loginData =
        await loginResponse
          .json()
          .catch(() => ({}));

      if (!loginResponse.ok) {
        throw new Error(
          loginData.message ||
            loginData.error ||
            "Unable to sign in with those credentials."
        );
      }

      const signedInEmail =
        loginData.user?.email ||
        normalizedEmail;

      localStorage.setItem(
        accountTokenStorageKey,
        loginData.token
      );

      localStorage.setItem(
        accountUserStorageKey,
        JSON.stringify(
          loginData.user || {
            email: signedInEmail,
          }
        )
      );

      onAccountChange(
        signedInEmail
      );

      setPassword("");
      setConfirmPassword("");
    } catch (accountError) {
      console.error(
        "Book account error:",
        accountError
      );

      setError(
        accountError instanceof Error
          ? accountError.message
          : "Unable to access your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem(
      accountTokenStorageKey
    );

    localStorage.removeItem(
      accountUserStorageKey
    );

    onAccountChange("");
    onClose();
  };

  return (
    <div className="book-modal">
      <button
        type="button"
        className="book-modal__backdrop"
        onClick={onClose}
        aria-label="Close account"
      />

      <div
        className="book-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-account-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="book-modal__close"
          aria-label="Close account"
        >
          <FiX />
        </button>

        <div className="book-modal__ornament">
          ✦
        </div>

        <p className="book-modal__eyebrow">
          Book account
        </p>

        <h2 id="book-account-title">
          {activeEmail
            ? "Your past orders"
            : mode === "signUp"
              ? "Create your account"
              : "Welcome back"}
        </h2>

        {activeEmail ? (
          <>
            <p className="book-modal__intro">
              Signed in as{" "}
              <strong>
                {activeEmail}
              </strong>
            </p>

            <div className="book-orders">
              {ordersLoading ? (
                <p className="book-message">
                  Loading your orders...
                </p>
              ) : ordersError ? (
                <p className="book-message book-message--error">
                  {ordersError}
                </p>
              ) : orders.length ? (
                orders.map((order) => (
                  <div
                    key={
                      order.reference_id ||
                      order._id ||
                      order.id
                    }
                    className="book-order"
                  >
                    <div className="book-order__top">
                      <div>
                        <strong>
                          {order.reference_id ||
                            "Order"}
                        </strong>

                        <small>
                          {order.email}
                        </small>
                      </div>

                      <strong>
                        ₹{order.amount}
                      </strong>
                    </div>

                    {order.books?.length ? (
                      <ul>
                        {order.books.map(
                          (book) => (
                            <li
                              key={
                                book._id ||
                                `${book.book_name}-${book.book_format}`
                              }
                            >
                              {book.book_name} ×{" "}
                              {book.book_quantity}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>
                        Book details are not
                        available for this order.
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="book-message">
                  No completed book orders are
                  linked to this account yet.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={signOut}
              className="book-modal__text-button"
            >
              Sign out
            </button>
          </>
        ) : (
          <form
            onSubmit={submit}
            className="book-account-form"
          >
            {mode === "signUp" && (
              <>
                <label>
                  Name
                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  Mobile
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(event) =>
                      setMobile(
                        event.target.value
                      )
                    }
                    autoComplete="tel"
                    required
                  />
                </label>
              </>
            )}

            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                autoComplete={
                  mode === "signUp"
                    ? "new-password"
                    : "current-password"
                }
                minLength={8}
                required
              />
            </label>

            {mode === "signUp" && (
              <label>
                Confirm password
                <input
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>
            )}

            {error && (
              <p className="book-message book-message--error">
                {error}
              </p>
            )}

            {message && (
              <p className="book-message">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="book-modal__submit"
            >
              {isSubmitting
                ? "Please wait..."
                : mode === "signUp"
                  ? "Create account"
                  : "Sign in"}

              <FiArrowRight />
            </button>

            <button
              type="button"
              onClick={() => {
                setMode((current) =>
                  current === "signUp"
                    ? "signIn"
                    : "signUp"
                );
                setError("");
              }}
              className="book-modal__switch"
            >
              {mode === "signUp"
                ? "Already have an account? Sign in"
                : "First time here? Create an account"}
            </button>
          </form>
        )}
      </div>
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

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const updateField = (event) => {
    const { name, value } =
      event.target;

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
      const missing =
        Object.entries(form)
          .filter(([key]) => {
            if (key === "address_2")
              return false;

            return !String(
              form[key]
            ).trim();
          })
          .map(([key]) => key);

      if (missing.length) {
        throw new Error(
          "Please complete all required customer details."
        );
      }

      localStorage.setItem(
        "prabhupada-book-pending-order",
        JSON.stringify({
          email: form.email
            .trim()
            .toLowerCase(),
          total,
          items: cart,
          createdAt:
            new Date().toISOString(),
        })
      );

      const response = await fetch(
        "/api/payment/initiate",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...form,
            cart,
            payment_type: "store",
            amount: total,
            transaction_purpose:
              "Book Purchase",
          }),
        }
      );

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
          data.error ||
            "Unable to start HDFC payment."
        );
      }

      if (!data.payment_url) {
        throw new Error(
          "The HDFC payment URL was not returned."
        );
      }

      window.location.assign(
        data.payment_url
      );
    } catch (err) {
      console.error(
        "HDFC payment error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start payment. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <div className="book-modal">
      <button
        type="button"
        className="book-modal__backdrop"
        onClick={onClose}
        aria-label="Close checkout"
      />

      <div
        className="book-modal__panel book-checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-checkout-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close checkout"
          className="book-modal__close"
        >
          <FiX />
        </button>

        <div className="book-modal__ornament">
          ✦
        </div>

        <p className="book-modal__eyebrow">
          Secure checkout
        </p>

        <h2 id="book-checkout-title">
          Delivery details
        </h2>

        <p className="book-modal__intro">
          Complete your details and you’ll be
          securely redirected to the payment
          gateway.
        </p>

        <form
          onSubmit={submitPayment}
          className="book-checkout-form"
        >
          <div className="book-form-grid">
            <CheckoutInput
              label="First name"
              name="first_name"
              value={form.first_name}
              onChange={updateField}
              autoComplete="given-name"
            />

            <CheckoutInput
              label="Last name"
              name="last_name"
              value={form.last_name}
              onChange={updateField}
              autoComplete="family-name"
            />
          </div>

          <div className="book-form-grid">
            <CheckoutInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
            />

            <CheckoutInput
              label="Mobile"
              name="mobile"
              type="tel"
              value={form.mobile}
              onChange={updateField}
              autoComplete="tel"
            />
          </div>

          <CheckoutInput
            label="Address line 1"
            name="address_1"
            value={form.address_1}
            onChange={updateField}
            autoComplete="address-line1"
          />

          <CheckoutInput
            label="Address line 2"
            name="address_2"
            value={form.address_2}
            onChange={updateField}
            autoComplete="address-line2"
            required={false}
          />

          <div className="book-form-grid">
            <CheckoutInput
              label="PIN code"
              name="pin_code"
              value={form.pin_code}
              onChange={updateField}
              autoComplete="postal-code"
            />

            <CheckoutInput
              label="District"
              name="district"
              value={form.district}
              onChange={updateField}
            />
          </div>

          <div className="book-form-grid">
            <CheckoutInput
              label="City"
              name="city"
              value={form.city}
              onChange={updateField}
              autoComplete="address-level2"
            />

            <CheckoutInput
              label="State"
              name="state"
              value={form.state}
              onChange={updateField}
              autoComplete="address-level1"
            />
          </div>

          <CheckoutInput
            label="Country"
            name="country"
            value={form.country}
            onChange={updateField}
            autoComplete="country-name"
          />

          <div className="book-checkout-summary">
            <p>
              <span>Subtotal</span>
              <strong>
                ₹{subtotal}
              </strong>
            </p>

            <p>
              <span>Shipping</span>
              <strong>
                {shipping === 0
                  ? "Free"
                  : `₹${shipping}`}
              </strong>
            </p>

            <div>
              <span>Total payable</span>
              <strong>
                ₹{total}
              </strong>
            </div>
          </div>

          {error && (
            <div className="book-checkout-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading || !cart.length
            }
            className="book-modal__submit"
          >
            {loading
              ? "Connecting to HDFC..."
              : "Pay securely"}

            {!loading && (
              <FiArrowRight />
            )}
          </button>

          <small className="book-checkout-note">
            You will be securely redirected to
            the HDFC payment gateway to complete
            your payment.
          </small>
        </form>
      </div>
    </div>
  );
}

function CheckoutInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  autoComplete,
  required = true,
}) {
  return (
    <label className="book-checkout-input">
      <span>
        {label}
        {required && " *"}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
      />
    </label>
  );
}
