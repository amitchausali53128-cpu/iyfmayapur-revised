import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

const MAIN_SITE_URL =
  import.meta.env.VITE_MAIN_SITE_URL || "https://iyfmayapur.org";

export default function Footer() {
  const token = localStorage.getItem("token");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.role === "admin");
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAdmin(false);
      }
    }
  }, [token]);

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[#dfe9e2] bg-[#143d2d]">
      {/* Subtle decorative glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#f59e0b]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-48 w-48 rounded-full bg-[#1f5d42]/40 blur-3xl" />

      {/* Top decorative line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent opacity-70" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-7 md:flex-row md:gap-6">

          {/* Brand */}
          <div className="flex items-center gap-3.5">
            {/* Logo container */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#fbbf24]/30 bg-[#faf8f3] shadow-lg shadow-black/10">
              <img
                src="/logo.png"
                alt="IYF Mayapur"
                className="h-full w-full object-contain p-1.5"
              />
            </div>

            <div>
              <p className="font-serif text-base font-semibold tracking-wide text-[#fffaf1]">
                IYF Mayapur LMS
              </p>

              <p className="mt-0.5 text-xs tracking-wide text-[#b8c9bf]">
                Learning Management System
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link
              to="/lms"
              className="text-[#c8d5ce] transition-colors duration-200 hover:text-[#fbbf24]"
            >
              Courses
            </Link>

            {token && (
              <Link
                to="/lms/dashboard"
                className="text-[#c8d5ce] transition-colors duration-200 hover:text-[#fbbf24]"
              >
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/lms/admin"
                className="text-[#c8d5ce] transition-colors duration-200 hover:text-[#fbbf24]"
              >
                Admin
              </Link>
            )}

            <a
              href={MAIN_SITE_URL}
              className="group flex items-center gap-1 text-[#fbbf24] transition-colors duration-200 hover:text-[#fff1c7]"
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-1">
                ←
              </span>
              Main Site
            </a>
          </nav>

          {/* Copyright */}
          <div className="flex flex-col items-center gap-1.5 text-center text-xs text-[#9fb3a7] md:items-end md:text-right">
            <p>
              © 2026 IYF Mayapur. All rights reserved.
            </p>

            <p className="flex items-center gap-1.5">
              <span>Made with</span>

              <FaHeart className="text-[11px] text-[#f59e0b]" />

              <span>for IYF Sridham Mayapur</span>
            </p>
          </div>
        </div>

        {/* Bottom decorative divider */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#6e8b7b]" />

          <span className="text-[10px] text-[#f59e0b]">✦</span>

          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#6e8b7b]" />
        </div>
      </div>
    </footer>
  );
}
