import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaArrowLeft } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

// URL of the main IYF site
const MAIN_SITE_URL =
  import.meta.env.VITE_MAIN_SITE_URL || "https://iyfmayapur.org";

const navLinks = [
  { name: "Courses", path: "/" },
  { name: "Youth Courses", path: "/youth" },
  { name: "Vedic Courses", path: "/vedic" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token"));

  // --------------------------------------------------
  // Scroll behavior
  // --------------------------------------------------
  useEffect(() => {
    let frameId = 0;
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        setIsScrolled(currentScrollY > 20);

        setIsVisible((visible) => {
          if (currentScrollY <= 20) return true;

          if (Math.abs(currentScrollY - previousScrollY) < 6) {
            return visible;
          }

          return currentScrollY < previousScrollY;
        });

        previousScrollY = currentScrollY;
        frameId = 0;
      });
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  // --------------------------------------------------
  // JWT role
  // --------------------------------------------------
  let userRole = null;

  if (token) {
    try {
      userRole = jwtDecode(token).role;
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      setToken(null);
    }
  }

  // --------------------------------------------------
  // Active route
  // --------------------------------------------------
  const isActive = (path) => {
    const routePath = path === "/" ? "/lms" : `/lms${path}`;

    if (path === "/") {
      return (
        location.pathname === "/lms" ||
        location.pathname === "/lms/"
      );
    }

    return (
      location.pathname === routePath ||
      location.pathname.startsWith(`${routePath}/`)
    );
  };

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMenuOpen(false);
    window.location.href = "/lms/login";
  };

  return (
    <nav
      className={`
        fixed left-0 top-0 z-50 w-full h-16
        px-4 sm:px-8
        flex items-center justify-between
        transition-all duration-300
        ${
          isVisible || menuOpen
            ? "translate-y-0"
            : "-translate-y-full"
        }
        ${
          isScrolled
            ? "bg-white/85 backdrop-blur-xl shadow-sm border-b border-gray-100"
            : "bg-white/20 backdrop-blur-sm"
        }
      `}
    >
      {/* =====================================================
          BRAND
      ====================================================== */}
      <Link
        to="/lms"
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-3 py-2 group"
      >
        <img
          src="/logo.png"
          alt="IYF Mayapur Logo"
          className="
            h-11 sm:h-12
            w-auto
            object-contain
            transition-transform duration-300
            group-hover:scale-105
          "
        />

        <div className="flex flex-col leading-tight">
          <span className="text-lg sm:text-xl font-bold text-[#1f5d42]">
            IYF Mayapur
          </span>

          <span className="text-sm sm:text-base font-semibold text-[#1f5d42] font-serif">
            Learning Portal
          </span>
        </div>
      </Link>

      {/* =====================================================
          DESKTOP NAVIGATION
      ====================================================== */}
      <ul className="hidden md:flex items-center gap-5 lg:gap-7">
        {navLinks.map((item) => {
          const active = isActive(item.path);

          return (
            <li key={item.path}>
              <Link
                to={
                  item.path === "/"
                    ? "/lms"
                    : `/lms${item.path}`
                }
                className={`
                  relative
                  block
                  py-4
                  text-sm
                  font-medium
                  transition-colors
                  duration-200
                  ${
                    active
                      ? "text-[#1f5d42] font-semibold"
                      : "text-gray-800 hover:text-[#1f5d42]"
                  }
                `}
              >
                <span className="inline-flex items-center gap-2">
                  {item.name}
                </span>

                {/* Active indicator */}
                {active && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
                    <div className="h-[1px] w-5 bg-gradient-to-r from-transparent to-amber-500" />

                    <span className="text-amber-500 text-[10px] animate-pulse">
                      ✦
                    </span>

                    <div className="h-[1px] w-5 bg-gradient-to-l from-transparent to-amber-500" />
                  </div>
                )}
              </Link>
            </li>
          );
        })}

        {/* Dashboard */}
        {token && (
          <li>
            <Link
              to="/lms/dashboard"
              className={`
                relative block py-4 text-sm font-medium
                transition-colors duration-200
                ${
                  isActive("/dashboard")
                    ? "text-[#1f5d42] font-semibold"
                    : "text-gray-800 hover:text-[#1f5d42]"
                }
              `}
            >
              Dashboard

              {isActive("/dashboard") && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
                  <div className="h-[1px] w-5 bg-gradient-to-r from-transparent to-amber-500" />
                  <span className="text-amber-500 text-[10px] animate-pulse">
                    ✦
                  </span>
                  <div className="h-[1px] w-5 bg-gradient-to-l from-transparent to-amber-500" />
                </div>
              )}
            </Link>
          </li>
        )}

        {/* Admin Portal */}
        {token && userRole === "admin" && (
          <li>
            <Link
              to="/lms/admin"
              className={`
                relative block py-4 text-sm font-medium
                transition-colors duration-200
                ${
                  isActive("/admin")
                    ? "text-[#1f5d42] font-semibold"
                    : "text-gray-800 hover:text-[#1f5d42]"
                }
              `}
            >
              Admin Portal

              {isActive("/admin") && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
                  <div className="h-[1px] w-5 bg-gradient-to-r from-transparent to-amber-500" />
                  <span className="text-amber-500 text-[10px] animate-pulse">
                    ✦
                  </span>
                  <div className="h-[1px] w-5 bg-gradient-to-l from-transparent to-amber-500" />
                </div>
              )}
            </Link>
          </li>
        )}

        {/* Main Site */}
        <li>
          <a
            href={MAIN_SITE_URL}
            className="
              inline-flex items-center gap-2
              py-2 px-4
              bg-[#fe9d2c]
              hover:bg-[#b5752a]
              text-white
              text-sm
              font-semibold
              rounded-xl
              shadow-md
              transition-all duration-200
              hover:-translate-y-0.5
            "
          >
            Main Site
          </a>
        </li>
      </ul>

      {/* =====================================================
          DESKTOP AUTH BUTTON
      ====================================================== */}
      <div className="hidden lg:flex items-center gap-2">
        {token ? (
          <button
            onClick={handleLogout}
            className="
              inline-flex items-center gap-2
              py-2 px-4
              border border-[#1f5d42]/20
              bg-white/70
              hover:bg-[#1f5d42]
              text-[#1f5d42]
              hover:text-white
              text-sm
              font-semibold
              rounded-xl
              shadow-sm
              transition-all duration-200
            "
          >
            <FaArrowLeft className="text-xs" />
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/lms/register"
              className="
                py-2 px-4
                border border-[#1f5d42]/20
                bg-white/70
                hover:bg-[#1f5d42]/10
                text-[#1f5d42]
                text-sm
                font-semibold
                rounded-xl
                transition-all duration-200
              "
            >
              Register
            </Link>

            <Link
              to="/lms/login"
              className="
                py-2 px-5
                bg-[#fe9d2c]
                hover:bg-[#b5752a]
                text-white
                text-sm
                font-semibold
                rounded-xl
                shadow-md
                transition-all duration-200
              "
            >
              Login
            </Link>
          </>
        )}
      </div>

      {/* =====================================================
          MOBILE HAMBURGER
      ====================================================== */}
      <button
        type="button"
        aria-label="Toggle Navigation Menu"
        onClick={() => setMenuOpen((prev) => !prev)}
        className="
          md:hidden
          relative
          p-2
          text-gray-800
          hover:text-[#1f5d42]
          focus:outline-none
        "
      >
        {menuOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaBars className="text-xl" />
        )}
      </button>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}
      <div
        className={`
          md:hidden
          fixed
          inset-x-0
          top-16
          bg-white/95
          backdrop-blur-xl
          border-b border-gray-200
          shadow-xl
          transition-all duration-300 ease-in-out
          ${
            menuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }
        `}
      >
        <div className="flex max-h-[calc(100vh-4rem)] flex-col overflow-y-auto px-5 py-5">

          {/* Navigation */}
          <ul className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={
                      item.path === "/"
                        ? "/lms"
                        : `/lms${item.path}`
                    }
                    onClick={() => setMenuOpen(false)}
                    className={`
                      flex items-center justify-between
                      px-4 py-3
                      rounded-lg
                      text-base
                      font-medium
                      transition-colors
                      ${
                        active
                          ? "bg-[#1f5d42]/10 text-[#1f5d42] font-semibold"
                          : "text-gray-700 hover:bg-gray-100 hover:text-[#1f5d42]"
                      }
                    `}
                  >
                    <span>{item.name}</span>

                    {active && (
                      <span className="text-amber-500 text-xs">
                        ✦
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Dashboard */}
            {token && (
              <li>
                <Link
                  to="/lms/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={`
                    flex items-center justify-between
                    px-4 py-3
                    rounded-lg
                    text-base
                    font-medium
                    transition-colors
                    ${
                      isActive("/dashboard")
                        ? "bg-[#1f5d42]/10 text-[#1f5d42] font-semibold"
                        : "text-gray-700 hover:bg-gray-100 hover:text-[#1f5d42]"
                    }
                  `}
                >
                  <span>Dashboard</span>

                  {isActive("/dashboard") && (
                    <span className="text-amber-500 text-xs">
                      ✦
                    </span>
                  )}
                </Link>
              </li>
            )}

            {/* Admin */}
            {token && userRole === "admin" && (
              <li>
                <Link
                  to="/lms/admin"
                  onClick={() => setMenuOpen(false)}
                  className={`
                    flex items-center justify-between
                    px-4 py-3
                    rounded-lg
                    text-base
                    font-medium
                    transition-colors
                    ${
                      isActive("/admin")
                        ? "bg-[#1f5d42]/10 text-[#1f5d42] font-semibold"
                        : "text-gray-700 hover:bg-gray-100 hover:text-[#1f5d42]"
                    }
                  `}
                >
                  <span>Admin Portal</span>

                  {isActive("/admin") && (
                    <span className="text-amber-500 text-xs">
                      ✦
                    </span>
                  )}
                </Link>
              </li>
            )}
          </ul>

          {/* Divider */}
          <div className="my-4 border-t border-gray-100" />

          {/* Auth */}
          <div className="flex flex-col gap-2">
            {!token ? (
              <>
                <Link
                  to="/lms/register"
                  onClick={() => setMenuOpen(false)}
                  className="
                    w-full
                    py-3 px-4
                    border border-[#1f5d42]/20
                    bg-white
                    hover:bg-[#1f5d42]/10
                    text-[#1f5d42]
                    text-center
                    font-semibold
                    rounded-xl
                    transition-all duration-200
                  "
                >
                  Register
                </Link>

                <Link
                  to="/lms/login"
                  onClick={() => setMenuOpen(false)}
                  className="
                    w-full
                    py-3 px-4
                    bg-[#fe9d2c]
                    hover:bg-[#b5752a]
                    text-white
                    text-center
                    font-semibold
                    rounded-xl
                    shadow-md
                    transition-all duration-200
                  "
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="
                  w-full
                  py-3 px-4
                  bg-[#1f5d42]
                  hover:bg-[#164632]
                  text-white
                  text-center
                  font-semibold
                  rounded-xl
                  transition-all duration-200
                "
              >
                Logout
              </button>
            )}

            {/* Main Site */}
            <a
              href={MAIN_SITE_URL}
              onClick={() => setMenuOpen(false)}
              className="
                flex items-center justify-center gap-2
                w-full
                py-3 px-4
                bg-[#fe9d2c]
                hover:bg-[#b5752a]
                text-white
                font-semibold
                rounded-xl
                shadow-md
                transition-all duration-200
              "
            >
              <FaArrowLeft className="text-xs" />
              Back to IYF Main Site
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

