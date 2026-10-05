import { motion } from "framer-motion";
import image from "/inspiration-removebg.png";
import image2 from "/jps.png";

export default function Inspiration() {
  const butterflies = [
    { x: "8%", y: "22%", delay: 0, size: "text-xl" },
    { x: "86%", y: "18%", delay: 1.5, size: "text-2xl" },
    { x: "78%", y: "72%", delay: 3, size: "text-lg" },
  ];

  const birds = [
    { x: "18%", y: "14%", delay: 0.5 },
    { x: "76%", y: "12%", delay: 2 },
  ];

  const leaves = [
    { x: "6%", y: "62%", rotate: -25, delay: 0 },
    { x: "91%", y: "58%", rotate: 25, delay: 1 },
    { x: "14%", y: "78%", rotate: 45, delay: 2 },
    { x: "84%", y: "82%", rotate: -40, delay: 3 },
  ];

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#FFFDF9] px-6 py-16 md:py-24">

      {/* ================= BACKGROUND DECORATION ================= */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/20 blur-[120px]" />

      <div className="pointer-events-none absolute left-[15%] top-[25%] h-32 w-32 rounded-full bg-yellow-200/20 blur-[60px]" />

      <div className="absolute left-8 top-20 h-3 w-3 rounded-full bg-amber-300/50" />
      <div className="absolute left-14 top-28 h-1.5 w-1.5 rounded-full bg-amber-500/40" />
      <div className="absolute bottom-24 right-12 h-3 w-3 rounded-full bg-amber-300/50" />

      {/* ================= BUTTERFLIES ================= */}

      {butterflies.map((item, i) => (
        <motion.div
          key={`butterfly-${i}`}
          className={`pointer-events-none absolute z-20 ${item.size}`}
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: [0.35, 0.9, 0.35],
            y: [0, -18, 0],
            x: [0, 8, -4, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 5 + i,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🦋
        </motion.div>
      ))}

      {/* ================= BIRDS ================= */}

      {birds.map((item, i) => (
        <motion.div
          key={`bird-${i}`}
          className="pointer-events-none absolute z-20 text-lg text-stone-500/50"
          style={{ left: item.x, top: item.y }}
          animate={{
            x: [0, 35, 70],
            y: [0, -8, 4],
            opacity: [0.25, 0.65, 0],
          }}
          transition={{
            duration: 7 + i,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🐦
        </motion.div>
      ))}

      {/* ================= LEAVES ================= */}

      {leaves.map((item, i) => (
        <motion.div
          key={`leaf-${i}`}
          className="pointer-events-none absolute z-20 text-xl text-emerald-700/30"
          style={{ left: item.x, top: item.y, rotate: item.rotate }}
          animate={{
            y: [0, -12, 0],
            rotate: [item.rotate, item.rotate + 12, item.rotate],
          }}
          transition={{
            duration: 4 + i,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🌿
        </motion.div>
      ))}

      {/* ================= BACKGROUND IMAGE ================= */}

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${image})`,
          filter:
            "drop-shadow(0 0 18px rgba(255,255,255,0.95)) drop-shadow(0 0 45px rgba(255,255,255,0.8)) drop-shadow(0 20px 45px rgba(180,120,20,0.12))",
        }}
        animate={{ y: [0, -7, 0], scale: [1, 1.015, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* White image aura */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-[80px]" />

      {/* ================= MAIN CONTENT ================= */}

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center gap-8 md:flex-row md:gap-20 lg:gap-32">

        {/* ================= TEXT ================= */}

        <motion.div
          initial={{ opacity: 0, x: -150 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center md:text-left"
        >
          <div className="mb-5 flex items-center justify-center gap-3 md:justify-start">
            <span className="h-[1px] w-10 bg-amber-500/60" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-700">
              Our Inspiration
            </span>
            <span className="h-[1px] w-10 bg-amber-500/60 md:hidden" />
          </div>

          <h2 className="relative font-serif text-5xl leading-[0.95] text-stone-900 sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="absolute -inset-8 -z-10 rounded-full bg-amber-200/30 blur-[55px]" />
            Our
            <br />
            <span className="font-normal italic text-amber-600">
              Inspiration
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-stone-600/80 sm:text-base md:mx-0">
            Where devotion becomes inspiration, and every step leads closer to the Divine.
          </p>

          <div className="mt-7 flex items-center justify-center gap-3 md:justify-start">
            <span className="h-[1px] w-16 bg-stone-300" />
            <span className="text-sm text-amber-500">✦</span>
            <span className="h-[1px] w-16 bg-stone-300" />
          </div>
        </motion.div>

        {/* ================= IMAGE SPACE ================= */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative h-[260px] w-full md:h-[360px] md:w-[420px] lg:h-[450px] lg:w-[500px]"
        >
          {/* Image backlight */}
          <div className="absolute inset-0 rounded-full bg-amber-300/20 blur-[80px]" />

          {/* Decorative ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-amber-300/30"
          />

          {/* Inner glow */}
          <div className="absolute left-1/2 top-1/2 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-100/40 blur-3xl" />

          {/* ================= JPS IMAGE ================= */}

          <motion.img
            src={image2}
            alt="JPS Maharaj"
            initial={{ opacity: 0, x: 180, scale: 0.92 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              duration: 1.1,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15,
            }}
            animate={{ y: [0, -5, 0] }}
            className="absolute left-1/2 top-1/2 z-10 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_20px_35px_rgba(180,120,20,0.15)]"
          />
        </motion.div>
      </div>

      {/* ================= BOTTOM DECORATION ================= */}

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 opacity-50">
        <span className="h-[1px] w-16 bg-amber-300" />
        <span className="text-xs text-amber-500">✦</span>
        <span className="h-[1px] w-16 bg-amber-300" />
      </div>

    </section>
  );
}