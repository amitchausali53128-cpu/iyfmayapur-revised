import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { cloudinaryAsset } from "../../lib/cloudinary";
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

/* ------------------------------------------------------------------ */
/* Storage / config                                                    */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* Shared tailwind strings (just constants, not CSS classes)           */
/* ------------------------------------------------------------------ */
const shell = "mx-auto w-[min(1240px,calc(100%-40px))]";
const serif = "font-serif";
const eyebrow =
  "text-[11px] font-medium uppercase tracking-[0.28em] text-amber-500";
const goldButton =
  "inline-flex items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-amber-500 to-amber-400 px-6 py-3.5 text-[13px] font-semibold tracking-wider text-emerald-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(245,158,11,0.4)] disabled:cursor-wait disabled:opacity-60";
const inputClass =
  "w-full rounded-xl border border-stone-900/10 bg-white px-4 py-3 text-[15px] normal-case tracking-normal text-stone-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15";
const labelClass =
  "grid gap-1.5 text-[11px] font-medium uppercase tracking-wider text-stone-500";

const particles = [
  { left: "8%", top: "18%", size: 4, delay: 0 },
  { left: "18%", top: "65%", size: 6, delay: 1 },
  { left: "32%", top: "25%", size: 4, delay: 2 },
  { left: "48%", top: "72%", size: 4, delay: 0.5 },
  { left: "61%", top: "18%", size: 6, delay: 1.5 },
  { left: "73%", top: "55%", size: 4, delay: 2.5 },
  { left: "86%", top: "30%", size: 4, delay: 1 },
  { left: "92%", top: "70%", size: 6, delay: 3 },
];

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function StoreHero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1.22]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 0.9, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.1, 0.3, 0.55]);

  return (
    <section
      ref={heroRef}
      className="relative h-[82vh] min-h-140 w-full overflow-hidden bg-black text-white md:h-[92vh]"
    >
      <motion.img
        src={cloudinaryAsset("/store/prabhupada-books-hero.png", {
          width: 1800,
          crop: "limit",
        })}
        alt="A collection of devotional books"
        fetchPriority="high"
        decoding="async"
        style={{ scale, y: imageY }}
        className="absolute inset-0 h-full w-full object-cover object-[62%_center] md:object-center"
      />
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      <motion.div
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-amber-500/20 blur-[100px]"
      />

      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.9, 0.2], scale: [1, 1.5, 1] }}
          transition={{
            duration: 3 + i * 0.3,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="absolute inset-0 z-20 flex items-center"
      >
        <div className="w-full px-5 sm:px-8 md:px-16 lg:px-24">
          <div className="max-w-2xl text-left">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-0.5 bg-amber-500"
              />
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-amber-500 sm:text-xs sm:tracking-[0.28em] md:text-sm">
                The Bhaktivedanta Library
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35 }}
              className={`${serif} text-5xl font-light leading-[0.96] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl`}
            >
              Books that open
              <br />
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="inline-block italic text-amber-500"
              >
                the door within.
              </motion.span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mb-4 mt-5 flex origin-left items-center gap-2 sm:mb-6 sm:mt-7 sm:gap-3"
            >
              <div className="h-px w-12 bg-white/50 sm:w-20" />
              <motion.div
                animate={{ rotate: [45, 135, 45], scale: [1, 1.25, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="h-1.5 w-1.5 rotate-45 bg-amber-500 sm:h-2 sm:w-2"
              />
              <div className="h-px w-5 bg-white/30 sm:w-8" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="max-w-[320px] text-sm font-light leading-relaxed text-white/90 sm:max-w-lg sm:text-base md:max-w-xl md:text-xl lg:text-2xl"
            >
              Discover timeless wisdom from Śrīla Prabhupāda — books for
              seekers, families, students, and anyone looking for a deeper
              understanding of life.
            </motion.p>

            <motion.a
              href="#book-collection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.7 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 35px rgba(245,158,11,0.4)" }}
              whileTap={{ scale: 0.96 }}
              className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-amber-500 px-5 py-2.5 text-xs font-semibold tracking-wider text-emerald-950 sm:mt-10 sm:px-7 sm:py-3.5 sm:text-sm"
            >
              Explore the collection
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="inline-flex"
              >
                <FiArrowRight />
              </motion.span>
            </motion.a>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-24 right-4 z-20 hidden sm:block md:bottom-12 md:right-14 lg:right-20"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="-rotate-3 text-right leading-[0.9] text-white/80"
          style={{ fontFamily: "Caveat, cursive" }}
        >
          <p className="text-xl md:text-2xl">Śrīla Prabhupāda</p>
          <p className="text-2xl md:text-3xl">Books · Wisdom · Bhakti</p>
          <p className="mt-1 text-base md:text-lg">in Krishna Consciousness</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 text-white sm:bottom-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-xl sm:text-2xl"
        >
          ↓
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute bottom-0 left-0 z-30 h-0.5 w-full origin-left bg-linear-to-r from-transparent via-amber-500 to-transparent"
      />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */
export default function Store() {
  const [cart, setCart] = useState(() => readStorage("prabhupada-book-cart"));
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
            data?.message || data?.error || "Unable to load book categories."
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
              fetchedCategories.filter((category) => category !== "All books")
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
      if (activeCategory !== "All books") params.set("category", activeCategory);
      if (search.trim()) params.set("search", search.trim());

      try {
        const query = params.toString();
        const response = await fetch(
          `${bookServerUrl}/books${query ? `?${query}` : ""}`
        );
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || data?.error || "Unable to load books.");
        }
        if (!Array.isArray(data)) {
          throw new Error("The server returned an invalid books response.");
        }
        if (!cancelled) setBooks(data);
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
        if (!cancelled) setBooksLoading(false);
      }
    };

    fetchBooks();
    return () => {
      cancelled = true;
    };
  }, [activeCategory, search]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("prabhupada-book-cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("prabhupada-book-wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

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
            ? { ...item, qty: Number(item.qty || 0) + change }
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

  const handleAccountChange = (email) => {
    setAccountEmail(email);
    if (typeof window !== "undefined") {
      if (email) localStorage.setItem(activeAccountStorageKey, email);
      else localStorage.removeItem(activeAccountStorageKey);
    }
  };

  const coverStyle = (book) => ({
    backgroundPosition: book.coverPosition,
    ...(book.imageUrl
      ? { backgroundImage: `url("${book.imageUrl}")`, backgroundSize: "contain" }
      : {}),
  });

  return (
    <div className="overflow-x-hidden bg-[#faf6ee] font-sans text-stone-900">
      <StoreHero />

      {/* BENEFITS */}
      <section
        aria-label="Store benefits"
        className={`${shell} relative z-10 -mt-11 grid overflow-hidden rounded-2xl border border-amber-500/25 bg-[#fffdf8] shadow-[0_30px_60px_-30px_rgba(11,34,24,0.35)] md:grid-cols-3`}
      >
        {[
          { icon: FiBookOpen, title: "Authentic editions", text: "Original teachings and purports" },
          { icon: FiShoppingBag, title: "Packed with care", text: "Every book handled thoughtfully" },
          { icon: FiCheck, title: "Free shipping", text: "On orders above ₹999" },
        ].map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex items-center gap-4 border-stone-900/10 px-7 py-6 not-first:border-t md:not-first:border-l md:not-first:border-t-0"
          >
            <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-linear-to-br from-[#0b2218] to-[#123225] text-lg text-amber-400">
              <Icon />
            </span>
            <div>
              <strong className={`${serif} block text-xl font-semibold`}>{title}</strong>
              <small className="text-[13px] text-stone-500">{text}</small>
            </div>
          </div>
        ))}
      </section>

      {/* COLLECTION */}
      <section id="book-collection" className={`${shell} pb-28 pt-20 md:pt-24`}>
        {/* ACCOUNT */}
        <section className="relative mb-16 flex flex-col items-start gap-5 overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_90%_0%,rgba(245,158,11,0.22),transparent_45%),linear-gradient(135deg,#0b2218,#123225)] p-6 text-white shadow-[0_24px_50px_-28px_rgba(11,34,24,0.7)] md:mb-20 md:flex-row md:items-center md:gap-6 md:px-9 md:py-7">
          <div className="grid h-14 w-14 flex-none place-items-center rounded-full border border-amber-500/50 text-2xl text-amber-400">
            <FiUser />
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-1.5 text-[11px] tracking-[0.28em] text-amber-500">
              YOUR BOOK ACCOUNT
            </p>
            <h2 className={`${serif} mb-1 text-2xl font-normal md:text-3xl`}>
              {accountEmail
                ? "Welcome back to your library"
                : "Keep your book journey together"}
            </h2>
            <span className="text-sm text-white/70">
              {accountEmail
                ? `Signed in as ${accountEmail}`
                : "Sign in to access your past orders and keep track of your books."}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setAccountOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-[13px] font-semibold tracking-wide text-emerald-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(245,158,11,0.4)]"
          >
            <FiUser />
            {accountEmail ? "My orders" : "Sign in / Create account"}
          </button>
        </section>

        {/* HEADING */}
        <div className="mb-11 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className={eyebrow}>A library for the soul</p>
            <h2 className={`${serif} mb-4 mt-3.5 text-5xl font-light leading-none tracking-tight text-[#0b2218] md:text-6xl`}>
              Find your next <em className="italic text-amber-700">book.</em>
            </h2>
            <p className="max-w-xl leading-relaxed text-stone-500">
              Explore foundational works on bhakti, consciousness,
              self-realization, and the timeless wisdom of the Vedic tradition.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#0b2218] px-5 py-3 font-medium text-[#0b2218] transition duration-300 hover:bg-[#0b2218] hover:text-white"
          >
            <FiShoppingBag />
            <span>Cart</span>
            <b className="grid h-6 min-w-6 place-items-center rounded-full bg-amber-500 px-1.5 text-xs text-emerald-950">
              {cartCount}
            </b>
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="mb-11 flex flex-wrap items-center justify-between gap-5 border-b border-stone-900/10 pb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-[13px] transition duration-300 ${
                  activeCategory === category
                    ? "border-[#0b2218] bg-[#0b2218] text-amber-400"
                    : "border-stone-900/10 bg-[#fffdf8] text-stone-500 hover:border-amber-500 hover:text-[#0b2218]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <label className="flex w-full items-center gap-2.5 rounded-full border border-stone-900/10 bg-[#fffdf8] px-4 py-2.5 text-stone-500 transition focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/15 md:w-72">
            <FiSearch />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search the library..."
              type="search"
              className="flex-1 bg-transparent text-sm text-stone-900 outline-none"
            />
          </label>
        </div>

        {/* BOOK GRID */}
        {booksLoading ? (
          <EmptyState title="Loading the library" text="Fetching the latest books for you." />
        ) : booksError ? (
          <EmptyState title="Unable to load books" text={booksError} />
        ) : books.length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-7">
            {books.map((book, index) => {
              const wished = wishlist.some((item) => item.id === book.id);

              return (
                <motion.article
                  key={book.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-stone-900/10 bg-white transition duration-500 hover:-translate-y-2 hover:border-amber-500/55 hover:shadow-[0_34px_60px_-30px_rgba(11,34,24,0.45)]"
                >
                  <div className="relative grid aspect-[4/4.4] place-items-center overflow-hidden bg-white">
                    {book.badge && (
                      <span className="absolute left-4 top-4 z-30 rounded-full border border-amber-500/50 bg-white/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-amber-400 backdrop-blur-md">
                        {book.badge}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleWishlist(book)}
                      aria-label={
                        wished
                          ? `Remove ${book.title} from wishlist`
                          : `Add ${book.title} to wishlist`
                      }
                      className={`absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition duration-300 hover:scale-110 ${
                        wished
                          ? "border-amber-500 bg-amber-500 text-emerald-950"
                          : "border-white/25 bg-white/10 text-white"
                      }`}
                    >
                      <FiHeart className={wished ? "fill-current" : ""} />
                    </button>

                    <div
                      role="img"
                      aria-label={`Cover for ${book.title}`}
                      style={coverStyle(book)}
                      className="relative z-20 grid h-full w-full place-items-center overflow-hidden bg-contain bg-center bg-no-repeat p-3 text-center transition duration-700"
                    >
                      {!book.imageUrl && (
                        <span className={`${serif} text-lg font-semibold leading-tight text-amber-400`}>
                          {book.title}
                        </span>
                      )}
                    </div>

                  </div>

                  <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
                    <p className="mb-2.5 flex gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-700">
                      {book.category}
                      <span>·</span>
                      {book.format}
                    </p>

                    <h3 className={`${serif} mb-2.5 text-3xl font-semibold leading-tight text-[#0b2218]`}>
                      {book.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-stone-500">
                      {book.description}
                    </p>

                    <div className="mb-5 flex items-center gap-2 text-sm">
                      <span className="flex text-amber-500">
                        <FiStar className="fill-current" />
                      </span>
                      <strong>{book.rating}</strong>
                      <small className="text-stone-500">Reader rating</small>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-stone-900/10 pt-4">
                      <div className="flex items-baseline gap-2">
                        <strong className={`${serif} text-3xl font-semibold text-[#0b2218]`}>
                          ₹{book.price}
                        </strong>
                        <del className="text-sm text-stone-400">₹{book.originalPrice}</del>
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(book)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0b2218] px-4 py-2.5 text-[13px] font-medium text-white transition duration-300 hover:translate-x-0.5 hover:bg-amber-500 hover:text-emerald-950"
                      >
                        Add to cart
                        <FiArrowRight />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No books found" text="Try another title or category." />
        )}
      </section>

      {/* CLOSING */}
      <section className="grid justify-items-center gap-3.5 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.2),transparent_55%),linear-gradient(180deg,#0b2218,#06150e)] px-6 py-28 text-center text-white">
        <div className="text-2xl text-amber-500">✦</div>
        <p className="text-xs uppercase tracking-[0.28em] text-amber-500">
          Knowledge becomes wisdom when we live it.
        </p>
        <h2 className={`${serif} text-4xl font-light leading-tight md:text-6xl`}>
          Let a good book
          <br />
          become a good beginning.
        </h2>
        <span className="mt-4 text-3xl text-white/80" style={{ fontFamily: "Caveat, cursive" }}>
          Hare Krishna
        </span>
      </section>

      {/* CART OVERLAY */}
      <div
        onClick={() => setCartOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-90 bg-[#050e0a]/60 backdrop-blur-sm transition-opacity duration-500 ${
          cartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* CART DRAWER */}
      <aside
        aria-hidden={!cartOpen}
        className={`fixed right-0 top-0 z-100 flex h-dvh w-[min(440px,100%)] flex-col bg-[#fffdf8] shadow-[-30px_0_60px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-out ${
          cartOpen ? "translate-x-0" : "translate-x-[105%]"
        }`}
      >
        <div className="flex items-center justify-between bg-linear-to-br from-[#0b2218] to-[#123225] px-7 py-6 text-white">
          <div>
            <p className={`${serif} text-3xl`}>Your library bag</p>
            <span className="text-xs uppercase tracking-[0.16em] text-amber-400">
              {cartCount} {cartCount === 1 ? "book" : "books"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/25 transition duration-300 hover:rotate-90 hover:bg-amber-500 hover:text-emerald-950"
          >
            <FiX />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-2.5">
          {cart.length === 0 ? (
            <div className="grid justify-items-center gap-2 px-2.5 py-16 text-center text-stone-500">
              <FiBookOpen className="text-4xl text-amber-500" />
              <h3 className={`${serif} mt-1.5 text-2xl text-[#0b2218]`}>
                Your library bag is empty
              </h3>
              <p className="mb-2.5">
                Discover a book to begin building your spiritual library.
              </p>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-[#0b2218] px-5 py-2.5 text-[#0b2218] transition hover:bg-[#0b2218] hover:text-white"
              >
                Continue browsing
                <FiArrowRight />
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[64px_1fr_auto] gap-4 border-b border-stone-900/10 py-5"
              >
                <div
                  style={coverStyle(item)}
                  className="aspect-[3/4.2] w-16 rounded-l-sm rounded-r-lg bg-[#1d3a2b] bg-cover shadow-[6px_10px_18px_rgba(0,0,0,0.3)]"
                />

                <div className="flex min-w-0 flex-col gap-1">
                  <strong className={`${serif} text-xl leading-tight text-[#0b2218]`}>
                    {item.title}
                  </strong>
                  <span className="text-xs text-stone-500">{item.format}</span>

                  <div className="mt-auto flex items-center justify-between pt-2.5">
                    <div className="inline-flex items-center gap-1 rounded-full border border-stone-900/10 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label={`Decrease ${item.title} quantity`}
                        className="grid h-7 w-7 place-items-center rounded-full bg-[#faf6ee] text-[#0b2218] transition hover:bg-amber-500"
                      >
                        <FiMinus />
                      </button>
                      <span className="min-w-6 text-center text-sm font-medium">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label={`Increase ${item.title} quantity`}
                        className="grid h-7 w-7 place-items-center rounded-full bg-[#faf6ee] text-[#0b2218] transition hover:bg-amber-500"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <strong>₹{Number(item.price) * Number(item.qty)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.title}`}
                  className="self-start text-stone-400 transition hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="grid gap-2.5 border-t border-stone-900/10 bg-[#faf6ee] px-7 pb-7 pt-6">
            <p className="flex justify-between text-sm text-stone-500">
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </p>
            <p className="flex justify-between text-sm text-stone-500">
              <span>Shipping</span>
              <strong>{shipping === 0 ? "Free" : `₹${shipping}`}</strong>
            </p>
            <div className="mt-1 flex items-center justify-between border-t border-stone-900/10 pt-3.5 text-[#0b2218]">
              <span>Total</span>
              <strong className={`${serif} text-3xl`}>₹{total}</strong>
            </div>

            <button type="button" onClick={openCheckout} className={`${goldButton} mt-2 w-full`}>
              Proceed to checkout
              <FiArrowRight />
            </button>

            <small className="text-center text-xs text-stone-500">
              Secure checkout · Prices include applicable taxes
            </small>
          </div>
        )}
      </aside>

      <AnimatePresence>
        {checkoutOpen && (
          <CheckoutModal
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onClose={() => setCheckoutOpen(false)}
          />
        )}
        {accountOpen && (
          <AccountModal
            activeEmail={accountEmail}
            onClose={() => setAccountOpen(false)}
            onAccountChange={handleAccountChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */
function EmptyState({ title, text }) {
  return (
    <div className="grid justify-items-center gap-1.5 rounded-3xl border border-dashed border-amber-500/50 bg-[#fffdf8] px-5 py-20 text-center text-stone-500">
      <FiBookOpen className="text-3xl text-amber-500" />
      <h3 className={`${serif} mt-2 text-3xl font-medium text-[#0b2218]`}>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function ModalShell({ onClose, closeLabel, titleId, wide, eyebrowText, title, children }) {
  return (
    <div className="fixed inset-0 z-120 grid place-items-center p-5">
      <motion.button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#050e0a]/70 backdrop-blur-md"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`relative max-h-[calc(100dvh-40px)] w-full overflow-y-auto rounded-[26px] border border-amber-500/35 bg-[#fffdf8] px-6 pb-8 pt-10 text-center shadow-[0_50px_100px_-30px_rgba(0,0,0,0.6)] sm:px-9 ${
          wide ? "max-w-[640px]" : "max-w-[480px]"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-stone-900/10 text-[#0b2218] transition duration-300 hover:rotate-90 hover:bg-[#0b2218] hover:text-white"
        >
          <FiX />
        </button>

        <div className="text-xl text-amber-500">✦</div>
        <p className="mb-1.5 mt-2 text-[11px] uppercase tracking-[0.28em] text-amber-700">
          {eyebrowText}
        </p>
        <h2 id={titleId} className={`${serif} mb-2 text-4xl font-normal text-[#0b2218]`}>
          {title}
        </h2>
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Account modal                                                       */
/* ------------------------------------------------------------------ */
function AccountModal({ activeEmail, onClose, onAccountChange }) {
  const [mode, setMode] = useState("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(activeEmail);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

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
        const token = localStorage.getItem(accountTokenStorageKey);

        const response = await fetch(`${bookServerUrl}/transactions/get`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ email: activeEmail }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || data.error || "Unable to load your past orders."
          );
        }

        const fetchedOrders = Array.isArray(data)
          ? data
          : data.transactions || data.orders || data.data || [];

        if (!Array.isArray(fetchedOrders)) {
          throw new Error("The server returned an invalid orders response.");
        }

        if (!cancelled) setOrders(fetchedOrders);
      } catch (ordersRequestError) {
        if (!cancelled) {
          setOrdersError(
            ordersRequestError instanceof Error
              ? ordersRequestError.message
              : "Unable to load your past orders."
          );
        }
      } finally {
        if (!cancelled) setOrdersLoading(false);
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

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (mode === "signUp" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (mode === "signUp" && !name.trim()) {
      setError("Enter your name.");
      return;
    }
    if (mode === "signUp" && !mobile.trim()) {
      setError("Enter your mobile number.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "signUp") {
        const response = await fetch(`${bookServerUrl}/users/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: normalizedEmail,
            mobile: mobile.trim(),
            password,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || data.error || "Unable to create your account."
          );
        }

        setMessage("Your account is ready. Signing you in...");
      }

      const loginResponse = await fetch(`${bookServerUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const loginData = await loginResponse.json().catch(() => ({}));

      if (!loginResponse.ok) {
        throw new Error(
          loginData.message ||
            loginData.error ||
            "Unable to sign in with those credentials."
        );
      }

      const signedInEmail = loginData.user?.email || normalizedEmail;

      localStorage.setItem(accountTokenStorageKey, loginData.token);
      localStorage.setItem(
        accountUserStorageKey,
        JSON.stringify(loginData.user || { email: signedInEmail })
      );

      onAccountChange(signedInEmail);
      setPassword("");
      setConfirmPassword("");
    } catch (accountError) {
      console.error("Book account error:", accountError);
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
    localStorage.removeItem(accountTokenStorageKey);
    localStorage.removeItem(accountUserStorageKey);
    onAccountChange("");
    onClose();
  };

  return (
    <ModalShell
      onClose={onClose}
      closeLabel="Close account"
      titleId="book-account-title"
      eyebrowText="Book account"
      title={
        activeEmail
          ? "Your past orders"
          : mode === "signUp"
            ? "Create your account"
            : "Welcome back"
      }
    >
      {activeEmail ? (
        <>
          <p className="mb-6 text-sm leading-relaxed text-stone-500">
            Signed in as <strong>{activeEmail}</strong>
          </p>

          <div className="grid max-h-80 gap-3 overflow-y-auto text-left">
            {ordersLoading ? (
              <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-[#0b2218]">
                Loading your orders...
              </p>
            ) : ordersError ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {ordersError}
              </p>
            ) : orders.length ? (
              orders.map((order) => (
                <div
                  key={order.reference_id || order._id || order.id}
                  className="rounded-2xl border border-stone-900/10 bg-white px-4 py-4"
                >
                  <div className="mb-2.5 flex justify-between gap-3">
                    <div>
                      <strong>{order.reference_id || "Order"}</strong>
                      <small className="block text-stone-500">{order.email}</small>
                    </div>
                    <strong>₹{order.amount}</strong>
                  </div>

                  {order.books?.length ? (
                    <ul className="list-disc pl-5 text-sm text-stone-500">
                      {order.books.map((book) => (
                        <li key={book._id || `${book.book_name}-${book.book_format}`}>
                          {book.book_name} × {book.book_quantity}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-stone-500">
                      Book details are not available for this order.
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-[#0b2218]">
                No completed book orders are linked to this account yet.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={signOut}
            className="mt-5 text-sm text-amber-700 underline underline-offset-4"
          >
            Sign out
          </button>
        </>
      ) : (
        <form onSubmit={submit} className="mt-6 grid gap-3.5 text-left">
          {mode === "signUp" && (
            <>
              <label className={labelClass}>
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Mobile
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  autoComplete="tel"
                  required
                  className={inputClass}
                />
              </label>
            </>
          )}

          <label className={labelClass}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signUp" ? "new-password" : "current-password"}
              minLength={8}
              required
              className={inputClass}
            />
          </label>

          {mode === "signUp" && (
            <label className={labelClass}>
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className={inputClass}
              />
            </label>
          )}

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
          {message && (
            <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-[#0b2218]">
              {message}
            </p>
          )}

          <button type="submit" disabled={isSubmitting} className={`${goldButton} mt-2 w-full`}>
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
              setMode((current) => (current === "signUp" ? "signIn" : "signUp"));
              setError("");
            }}
            className="text-sm text-amber-700 underline underline-offset-4"
          >
            {mode === "signUp"
              ? "Already have an account? Sign in"
              : "First time here? Create an account"}
          </button>
        </form>
      )}
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/* Checkout modal                                                      */
/* ------------------------------------------------------------------ */
function CheckoutModal({ cart, subtotal, shipping, total, onClose }) {
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
    setForm((current) => ({ ...current, [name]: value }));
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
        throw new Error("Please complete all required customer details.");
      }

      localStorage.setItem(
        "prabhupada-book-pending-order",
        JSON.stringify({
          email: form.email.trim().toLowerCase(),
          total,
          items: cart,
          createdAt: new Date().toISOString(),
        })
      );

      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cart,
          payment_type: "store",
          amount: total,
          transaction_purpose: "Book Purchase",
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response from the payment server.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to start HDFC payment.");
      }
      if (!data.payment_url) {
        throw new Error("The HDFC payment URL was not returned.");
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

  return (
    <ModalShell
      wide
      onClose={onClose}
      closeLabel="Close checkout"
      titleId="book-checkout-title"
      eyebrowText="Secure checkout"
      title="Delivery details"
    >
      <p className="mb-6 text-sm leading-relaxed text-stone-500">
        Complete your details and you’ll be securely redirected to the payment
        gateway.
      </p>

      <form onSubmit={submitPayment} className="grid gap-3.5 text-left">
        <div className="grid gap-3.5 sm:grid-cols-2">
          <CheckoutInput label="First name" name="first_name" value={form.first_name} onChange={updateField} autoComplete="given-name" />
          <CheckoutInput label="Last name" name="last_name" value={form.last_name} onChange={updateField} autoComplete="family-name" />
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <CheckoutInput label="Email" name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" />
          <CheckoutInput label="Mobile" name="mobile" type="tel" value={form.mobile} onChange={updateField} autoComplete="tel" />
        </div>

        <CheckoutInput label="Address line 1" name="address_1" value={form.address_1} onChange={updateField} autoComplete="address-line1" />
        <CheckoutInput label="Address line 2" name="address_2" value={form.address_2} onChange={updateField} autoComplete="address-line2" required={false} />

        <div className="grid gap-3.5 sm:grid-cols-2">
          <CheckoutInput label="PIN code" name="pin_code" value={form.pin_code} onChange={updateField} autoComplete="postal-code" />
          <CheckoutInput label="District" name="district" value={form.district} onChange={updateField} />
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <CheckoutInput label="City" name="city" value={form.city} onChange={updateField} autoComplete="address-level2" />
          <CheckoutInput label="State" name="state" value={form.state} onChange={updateField} autoComplete="address-level1" />
        </div>

        <CheckoutInput label="Country" name="country" value={form.country} onChange={updateField} autoComplete="country-name" />

        <div className="grid gap-2.5 rounded-2xl border border-stone-900/10 bg-[#faf6ee] p-5">
          <p className="flex justify-between text-sm text-stone-500">
            <span>Subtotal</span>
            <strong>₹{subtotal}</strong>
          </p>
          <p className="flex justify-between text-sm text-stone-500">
            <span>Shipping</span>
            <strong>{shipping === 0 ? "Free" : `₹${shipping}`}</strong>
          </p>
          <div className="mt-1 flex items-center justify-between border-t border-stone-900/10 pt-3.5 text-[#0b2218]">
            <span>Total payable</span>
            <strong className={`${serif} text-3xl`}>₹{total}</strong>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <button type="submit" disabled={loading || !cart.length} className={`${goldButton} w-full`}>
          {loading ? "Connecting to HDFC..." : "Pay securely"}
          {!loading && <FiArrowRight />}
        </button>

        <small className="text-center text-xs text-stone-500">
          You will be securely redirected to the HDFC payment gateway to
          complete your payment.
        </small>
      </form>
    </ModalShell>
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
    <label className={labelClass}>
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
        className={inputClass}
      />
    </label>
  );
}