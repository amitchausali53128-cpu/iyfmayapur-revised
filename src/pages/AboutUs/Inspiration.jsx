import { motion } from "framer-motion";
import image from "/inspiration-removebg.png";

export default function Inspiration() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-[#FFFDF9] flex items-center justify-center px-6 py-16 md:py-24">

      {/* ================= BACKGROUND DECORATION ================= */}

      {/* Large ambient golden glow */}
      <div
        className="
          absolute
          top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-[500px] h-[500px]
          rounded-full
          bg-amber-200/20
          blur-[120px]
          pointer-events-none
        "
      />

      {/* Small decorative glow */}
      <div
        className="
          absolute
          left-[15%] top-[25%]
          w-32 h-32
          rounded-full
          bg-yellow-200/20
          blur-[60px]
          pointer-events-none
        "
      />

      {/* Decorative circles */}
      <div className="absolute left-8 top-20 w-3 h-3 rounded-full bg-amber-300/50" />
      <div className="absolute left-14 top-28 w-1.5 h-1.5 rounded-full bg-amber-500/40" />
      <div className="absolute right-12 bottom-24 w-3 h-3 rounded-full bg-amber-300/50" />

      {/* ================= MAIN CONTENT ================= */}

      <div className="relative w-full max-w-6xl flex flex-col md:flex-row justify-center items-center gap-8 md:gap-20 lg:gap-32">

        {/* ================= TEXT ================= */}

        <motion.div
          initial={{ opacity: 0, x: -150 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 text-center md:text-left"
        >

          {/* Decorative line */}
          <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
            <span className="w-10 h-[1px] bg-amber-500/60" />

            <span className="text-[10px] uppercase tracking-[0.35em] text-amber-700 font-semibold">
              Our Inspiration
            </span>

            <span className="md:hidden w-10 h-[1px] bg-amber-500/60" />
          </div>

          {/* Heading */}
          <h2 className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif leading-[0.95] text-stone-900">

            {/* Backlight behind heading */}
            <span
              className="
                absolute
                -inset-8
                bg-amber-200/30
                blur-[55px]
                rounded-full
                -z-10
              "
            />

            Our
            <br />

            <span className="italic font-normal text-amber-600">
              Inspiration
            </span>
          </h2>

          {/* Bottom decorative element */}
          <div className="mt-7 flex items-center justify-center md:justify-start gap-3">
            <span className="w-16 h-[1px] bg-stone-300" />
            <span className="text-amber-500 text-sm">✦</span>
            <span className="w-16 h-[1px] bg-stone-300" />
          </div>

        </motion.div>


        {/* ================= IMAGE ================= */}

        <motion.div
          initial={{ opacity: 0, x: 150 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.1,
          }}
          className="relative flex items-center justify-center"
        >

          {/* Image backlight */}
          <div
            className="
              absolute
              w-[75%] h-[75%]
              rounded-full
              bg-amber-300/25
              blur-[80px]
            "
          />

          {/* Decorative ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute
              w-[90%]
              aspect-square
              rounded-full
              border
              border-amber-300/30
              border-dashed
            "
          />

          {/* Inner glow */}
          <div className="absolute w-[65%] aspect-square rounded-full bg-yellow-100/40 blur-3xl" />

          {/* Image */}
          <motion.img
            src={image}
            alt="Inspiration"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              relative
              z-10
              max-h-[28rem]
              md:max-h-[32rem]
              lg:max-h-[35rem]
              object-contain
              drop-shadow-[0_20px_35px_rgba(180,120,20,0.15)]
            "
          />

        </motion.div>

      </div>

      {/* ================= BOTTOM DECORATION ================= */}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-50">
        <span className="w-16 h-[1px] bg-amber-300" />
        <span className="text-amber-500 text-xs">✦</span>
        <span className="w-16 h-[1px] bg-amber-300" />
      </div>

    </section>
  );
}