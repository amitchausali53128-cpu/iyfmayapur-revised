import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaArrowRight,
  FaHeart,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

const links = [
  { label: "Home", to: "/" },
  { label: "Events", to: "/events" },
  { label: "Courses", to: "/courses" },
  { label: "Gallery", to: "/gallery" },
  { label: "Store", to: "/store" },
  { label: "Donation", to: "/donation" },
  { label: "About", to: "/aboutUs" },
  { label: "Shrila Prabhupada", to: "/prabhupada" },
];

const services = [
  { label: "Youth Spiritual Lodging", to: "/seva" },
  { label: "Youth Spiritual Food", to: "/seva" },
  { label: "Youth Counselling", to: "/seva" },
  { label: "Youth Festivals", to: "/events" },
  { label: "Gita Distribution", to: "/store" },
  { label: "Value Skills Training", to: "/courses" },
  { label: "Spiritual Education", to: "/prabhupada" },
];

const socials = [
  { icon: <FaFacebookF />, link: "https://www.facebook.com/IYFMayapurOfficial/" },
  { icon: <FaInstagram />, link: "https://www.instagram.com/iyf_sridham_mayapur/" },
  { icon: <FaYoutube />, link: "https://www.youtube.com/c/iyfsridhammayapur" },
  { icon: <FaEnvelope />, link: "mailto:mayapuriyf@gmail.com" },
];

const Footer = () => (
  <footer className="relative overflow-hidden bg-[#10251b] text-white">
    <div className="absolute -left-32 top-10 h-60 w-60 rounded-full bg-[#f59e0b]/10 blur-[100px]" />
    <div className="absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-[#1f8a5b]/15 blur-[100px]" />
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent" />

    <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:py-12">
      <div className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md md:flex-row md:items-center">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f59e0b]">
            Be a part of something meaningful
          </p>

          <h2 className="font-serif text-2xl md:text-3xl">
            Inspire. Connect.{" "}
            <span className="italic text-[#f59e0b]">Serve.</span>
          </h2>
        </div>

        <motion.a
          href="/donation"
          whileHover={{ scale: 1.04 }}
          className="flex w-fit items-center gap-2 rounded-full bg-[#f59e0b] px-5 py-2.5 text-sm font-semibold text-green-950"
        >
          Join the Movement <FaArrowRight className="text-xs" />
        </motion.a>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1.2fr]">
        {/* BRAND */}
        <motion.div
          className="col-span-2 lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <NavLink to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="IYF Mayapur Logo"
              className="h-12 w-auto object-contain"
            />

            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold">IYF</span>
              <span className="font-serif text-base text-white/85">
                Sridham Mayapur
              </span>
            </div>
          </NavLink>

          <p className="mt-3 max-w-sm text-sm leading-6 text-white/50">
            Building a generation of kind, conscious and capable leaders for a
            better world.
          </p>

          <div className="mt-4 flex gap-2">
            {socials.map((s, i) => (
              <motion.a
                key={i}
                href={s.link}
                target={s.link.startsWith("http") ? "_blank" : undefined}
                rel={
                  s.link.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                whileHover={{ y: -4, scale: 1.1 }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-white/65 transition hover:border-[#f59e0b] hover:bg-[#f59e0b] hover:text-green-950"
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* EXPLORE */}
        <div className="col-span-1 lg:col-span-1">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#f59e0b]">
            Explore
          </h3>

          <ul className="space-y-2">
            {links.map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.to}
                  className="group flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
                >
                  <span className="h-px w-0 bg-[#f59e0b] transition-all group-hover:w-3" />
                  {item.label}
                  <FiArrowUpRight className="text-[10px] opacity-0 transition group-hover:opacity-100" />
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* SERVICES */}
        <div className="col-span-1 lg:col-span-1">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#f59e0b]">
            Our Services
          </h3>

          <ul className="space-y-2">
            {services.map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.to}
                  className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-[#f59e0b]/60" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* CONNECT */}
        <div className="col-span-2 lg:col-span-1">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#f59e0b]">
            Connect
          </h3>

          <div className="space-y-3 text-sm text-white/50">
            <p className="flex gap-3">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-[#f59e0b]" />
              Sridhama Mayapur, West Bengal, India
            </p>

            <a
              href="mailto:mayapuriyf@gmail.com"
              className="flex items-center gap-3 transition hover:text-white"
            >
              <FaEnvelope className="shrink-0 text-[#f59e0b]" />
              <span>mayapuriyf@gmail.com</span>
            </a>
          </div>

          <div className="mt-4 rounded-xl border border-[#f59e0b]/15 bg-[#f59e0b]/5 p-3">
            <p className="text-xs leading-5 text-white/50">
              "Youth with purpose can create a brighter tomorrow."
            </p>
          </div>
        </div>
      </div>

      <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex  items-center justify-between gap-2 text-[11px] text-white/30 md:flex-row">
        <p>© {new Date().getFullYear()} IYF Sridham Mayapur</p>

        <p className="flex items-center gap-1">
          Made with <FaHeart className="text-[#f59e0b]" /> for the youth
        </p>

        <p>All Rights Reserved</p>
      </div>
    </div>
  </footer>
);

export default Footer;