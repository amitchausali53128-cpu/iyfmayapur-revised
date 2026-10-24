import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  MessageCircle,
  Radio,
  Sparkles,
  Sunrise,
  Users,
  Video,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Edit these                                                          */
/* ------------------------------------------------------------------ */
const ZOOM_URL = "https://us02web.zoom.us/j/87302558829?pwd=LpC1qaoOdEQAWdYCSp9DLjdWuecEBs.1"; // Bhagavatam class link
const JAPA_URL = "https://us02web.zoom.us/j/87302558829?pwd=LpC1qaoOdEQAWdYCSp9DLjdWuecEBs.1"; // Morning Japa joining link
const YOUTUBE_URL = "https://www.youtube.com/@IYFSridhamMayapur"; // Youtube link

/*
  Palette
  black  #0a0a0f   blue  #2563eb / #1d4ed8   orange  #f97316   white  #ffffff
*/
const serif = "font-serif";

const orangeButton =
  "inline-flex items-center gap-2.5 rounded-full bg-linear-to-r from-orange-500 to-orange-400 px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-orange-500/30";
const outlineButton =
  "inline-flex items-center gap-2.5 rounded-full border-2 border-white/70 px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-white hover:text-[#0a0a0f]";

const particles = [
  { left: "6%", top: "20%", size: 4, delay: 0, color: "bg-orange-500" },
  { left: "22%", top: "70%", size: 6, delay: 1, color: "bg-blue-500" },
  { left: "40%", top: "28%", size: 4, delay: 2, color: "bg-orange-500" },
  { left: "58%", top: "75%", size: 4, delay: 0.5, color: "bg-blue-500" },
  { left: "74%", top: "22%", size: 6, delay: 1.5, color: "bg-orange-500" },
  { left: "90%", top: "60%", size: 4, delay: 2.5, color: "bg-blue-500" },
];

const schedule = [
  { icon: CalendarDays, label: "Class days", value: "Monday to Saturday", tone: "blue" },
  { icon: Clock3, label: "Class time", value: "8:30 – 9:15 pm IST", tone: "blue" },
  { icon: Sunrise, label: "Morning Japa", value: "4:30 – 6:30 am daily", tone: "orange" },
];

const infoCards = [
  {
    icon: BookOpen,
    title: "What you will learn?",
    points: [
      "The timeless wisdom of the Śrīmad-Bhāgavatam, explained simply",
      "Practical ways to apply spiritual principles in daily life",
      "Clarity on purpose, relationships, stress and decision-making",
    ],
  },
  {
    icon: GraduationCap,
    title: "From whom you will learn?",
    points: [
      "Experienced devotee-speakers from IYF Mayapur",
      "Teachers who live and practise what they share",
      "Open Q&A so your questions are answered",
    ],
  },
  {
    icon: Video,
    title: "How to join?",
    points: [
      "Register once on Zoom using the button above",
      "Join the WhatsApp community for reminders and links",
      "Log in at 8:30 pm IST, Monday to Saturday",
    ],
  },
];

const highlights = [
  { title: "Free", text: "No payment, no card", icon: Sparkles },
  { title: "Live", text: "Online & interactive", icon: Radio },
  { title: "For all youths", text: "Student or job holder, you are welcome", icon: Users },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, delay },
});

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Free() {
  return (
    <div className="overflow-x-hidden bg-white font-sans text-[#0a0a0f]">
      {/* ============================== HERO (black) ==================== */}
      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_85%_0%,rgba(37,99,235,0.55),transparent_45%),radial-gradient(circle_at_5%_100%,rgba(249,115,22,0.25),transparent_45%),linear-gradient(135deg,#020617,#0b1f5c)] px-5 pb-28 pt-20 text-white sm:px-8 md:pb-36 md:pt-28">
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.15, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-20 -top-10 h-80 w-80 rounded-full bg-blue-600/40 blur-[110px]"
        />
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-orange-500/30 blur-[110px]"
        />

        {particles.map((p, i) => (
          <motion.span
            key={i}
            className={`absolute rounded-full ${p.color} shadow-[0_0_12px_currentColor]`}
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ y: [0, -16, 0], opacity: [0.2, 0.95, 0.2], scale: [1, 1.5, 1] }}
            transition={{
              duration: 3 + i * 0.3,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-full border border-orange-500/50 bg-orange-500/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-300 backdrop-blur sm:text-xs sm:tracking-[0.26em]"
          >
            <span>Free Sessions</span>
            <span className="h-3 w-px bg-orange-300/50" />
            <span>Monday to Saturday</span>
            <span className="h-3 w-px bg-orange-300/50" />
            <span>8:30 pm IST</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className={`${serif} text-5xl font-light leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl`}
          >
            Śrīmad-Bhāgavatam
            <br />
            <span className="italic text-orange-500">Class</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="my-6 flex items-center gap-3"
          >
            <div className="h-px w-16 bg-blue-500/70" />
            <motion.div
              animate={{ rotate: [45, 135, 45], scale: [1, 1.25, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="h-2 w-2 rotate-45 bg-orange-500"
            />
            <div className="h-px w-16 bg-blue-500/70" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="max-w-xl text-base font-light leading-relaxed text-white/85 sm:text-lg"
          >
            A live, interactive evening class for youths who want real answers
            and a calmer, more purposeful life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.a
              href={ZOOM_URL}
              whileHover={{ scale: 1.05, boxShadow: "0 12px 35px rgba(249,115,22,0.55)" }}
              whileTap={{ scale: 0.96 }}
              className={orangeButton}
            >
              <Video size={18} />
              Join on Zoom
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="inline-flex"
              >
                <ArrowRight size={16} />
              </motion.span>
            </motion.a>

            <motion.a
              href={YOUTUBE_URL}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className={outlineButton}
            >
              {/* <MessageCircle size={18} /> */}
              
              Subscribe to our YouTube Channel
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="inline-flex"
              >
                <ArrowRight size={16} />
              </motion.span>
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="absolute bottom-0 left-0 h-1 w-full origin-left bg-linear-to-r from-blue-600 via-orange-500 to-blue-600"
        />
      </section>

      {/* ============================ SCHEDULE (white card) ============= */}
      <section className="relative z-10 mx-auto -mt-10 w-[min(1100px,calc(100%-40px))]">
        <motion.div
          {...fadeUp()}
          className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_60px_-25px_rgba(10,10,15,0.45)] md:grid-cols-3"
        >
          {schedule.map(({ icon: Icon, label, value, tone }) => (
            <div
              key={label}
              className="flex items-center gap-4 px-6 py-6 not-first:border-t not-first:border-slate-200 md:not-first:border-l md:not-first:border-t-0"
            >
              <span
                className={`grid h-12 w-12 flex-none place-items-center rounded-full text-white shadow-md ${
                  tone === "orange"
                    ? "bg-linear-to-br from-orange-500 to-orange-400 shadow-orange-500/30"
                    : "bg-linear-to-br from-blue-700 to-blue-500 shadow-blue-600/30"
                }`}
              >
                <Icon size={20} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {label}
                </p>
                <p className={`${serif} text-xl font-semibold leading-tight text-[#0a0a0f] sm:text-2xl`}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ============================ MORNING JAPA (black) ============== */}
      <section className="mx-auto w-[min(1100px,calc(100%-40px))] pt-20">
        <motion.div
          {...fadeUp()}
          className="relative overflow-hidden rounded-3xl border border-orange-300/40 bg-[radial-gradient(circle_at_90%_0%,rgba(253,224,71,0.45),transparent_50%),linear-gradient(135deg,#c2410c,#f97316)] p-8 text-white shadow-[0_30px_60px_-30px_rgba(194,65,12,0.7)] sm:p-12"
        >
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.12, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-16 right-8 h-56 w-56 rounded-full bg-yellow-200/50 blur-[80px]"
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -bottom-6 right-8 text-white/25"
          >
            <Sunrise size={170} strokeWidth={1.2} />
          </motion.div>

          <div className="relative z-10 max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-50 sm:text-xs">
              <span className="block h-0.5 w-10 bg-white" />
              Daily · Every morning
            </p>

            <h2 className={`${serif} text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl`}>
              Join Every Morning
              <br />
              <span className="italic text-[#0a0a0f]">Japa</span>
            </h2>

            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/30 bg-[#0a0a0f] px-5 py-2.5">
              <Clock3 size={18} className="text-orange-400" />
              <span className="text-base font-semibold tracking-wide sm:text-lg">
                4:30 am – 6:30 am
              </span>
            </div>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white sm:text-lg">
              Begin your day in the calm of the brahma-muhūrta. Chant together
              in a focused, supportive group and carry that peace through the
              rest of your day.
            </p>

            <motion.a
              href={JAPA_URL}
              whileHover={{ scale: 1.05, boxShadow: "0 12px 35px rgba(249,115,22,0.55)" }}
              whileTap={{ scale: 0.96 }}
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#0a0a0f] px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-black/30"
            >
              <Sunrise size={18} />
              Join Morning Japa
              <ArrowRight size={16} />
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* ============================ INFO CARDS (white) ================ */}
      <section className="mx-auto w-[min(1240px,calc(100%-40px))] pb-8 pt-20">
        <motion.div {...fadeUp()} className="mb-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-500">
            About the class
          </p>
          <h2 className={`${serif} mt-3 text-4xl font-light leading-tight tracking-tight text-[#0a0a0f] md:text-5xl`}>
            Everything you need to <em className="italic text-blue-600">know.</em>
          </h2>
        </motion.div>

        <div className="grid gap-7 md:grid-cols-3">
          {infoCards.map(({ icon: Icon, title, points }, index) => (
            <motion.article
              key={title}
              {...fadeUp(index * 0.1)}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 border-t-4 border-t-blue-600 bg-white p-7 transition duration-500 hover:-translate-y-2 hover:border-t-orange-500 hover:shadow-[0_34px_60px_-30px_rgba(37,99,235,0.5)]"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl transition duration-500 group-hover:bg-orange-500/25" />

              <span className="relative mb-5 grid h-12 w-12 place-items-center rounded-full bg-[#0a0a0f] text-orange-400 transition duration-500 group-hover:bg-blue-600 group-hover:text-white">
                <Icon size={22} />
              </span>

              <h3 className={`${serif} relative mb-4 text-3xl font-semibold leading-tight text-[#0a0a0f]`}>
                {title}
              </h3>

              <ul className="relative space-y-3">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rotate-45 bg-orange-500" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ============================ HIGHLIGHTS (blue band) ============ */}
      <section className="mt-16 bg-[radial-gradient(circle_at_100%_0%,rgba(249,115,22,0.35),transparent_45%),linear-gradient(135deg,#1e3a8a,#2563eb)] py-16">
        <div className="mx-auto grid w-[min(1240px,calc(100%-40px))] gap-5 md:grid-cols-3">
          {highlights.map(({ title, text, icon: Icon }, index) => (
            <motion.div
              key={title}
              {...fadeUp(index * 0.1)}
              className="flex flex-col items-center rounded-2xl border border-white/20 bg-white px-6 py-8 text-center shadow-[0_24px_50px_-30px_rgba(0,0,0,0.6)] transition duration-500 hover:-translate-y-1.5"
            >
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-orange-500 text-white">
                <Icon size={20} />
              </span>
              <p className={`${serif} text-4xl font-semibold text-[#0a0a0f]`}>{title}</p>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================== CLOSING (black) ================= */}
      <section className="grid justify-items-center gap-3.5 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.35),transparent_55%),linear-gradient(180deg,#0a0a0f,#000)] px-6 py-24 text-center text-white">
        <div className="text-2xl text-orange-500">✦</div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-400">
          Your day, well spent
        </p>
        <h2 className={`${serif} text-4xl font-light leading-tight md:text-6xl`}>
          Start at 4:30 am,
          <br />
          <span className="italic text-orange-500">grow by 8:30 pm.</span>
        </h2>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <motion.a
            href={JAPA_URL}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className={orangeButton}
          >
            <Sunrise size={18} />
            Join Morning Japa
          </motion.a>
          <motion.a
            href={ZOOM_URL}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
          >
            <Video size={18} />
            Join on Zoom
          </motion.a>
        </div>

        <span className="mt-6 text-3xl text-white/80" style={{ fontFamily: "Caveat, cursive" }}>
          Hare Krishna
        </span>
      </section>
    </div>
  );
}