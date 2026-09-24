import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const tileAnimations = [
  {
    hidden: { opacity: 0, x: -100, y: -60, scale: 0.9 },
    visible: { opacity: 1, x: 0, y: 0, scale: 1 },
  },
  {
    hidden: { opacity: 0, y: -100, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  {
    hidden: { opacity: 0, x: 100, y: -60, scale: 0.9 },
    visible: { opacity: 1, x: 0, y: 0, scale: 1 },
  },
  {
    hidden: { opacity: 0, x: -100, y: 70, scale: 0.9 },
    visible: { opacity: 1, x: 0, y: 0, scale: 1 },
  },
  {
    hidden: { opacity: 0, y: 100, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  {
    hidden: { opacity: 0, x: 100, y: 70, scale: 0.9 },
    visible: { opacity: 1, x: 0, y: 0, scale: 1 },
  },
];

const tileTransition = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1],
};

// ============================================================
// HERO TILE
// ============================================================

function HeroTile({
  image,
  className = "",
  animation,
  delay = 0,
}) {
  return (
    <motion.div
      initial={animation.hidden}
      whileInView={animation.visible}
      viewport={{
        once: false,
        amount: 0.25,
      }}
      transition={{
        ...tileTransition,
        delay,
      }}
      whileHover={{
        y: -4,
        transition: {
          duration: 0.25,
        },
      }}
      className={`
        relative
        overflow-hidden
        group
        rounded-lg
        md:rounded-xl
        h-full
        shadow-[0_8px_25px_rgba(80,50,10,0.08)]
        ${className}
      `}
    >
      {/* Golden hover glow */}

      <div
        className="
          absolute
          inset-0
          bg-amber-200/10
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-500
          z-10
          pointer-events-none
        "
      />

      <img
        src={image}
        alt=""
        className="
          w-full
          h-full
          object-cover
          transition-transform
          duration-700
          ease-out
          group-hover:scale-105
        "
      />

      {/* Image overlay */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-stone-900/10
          via-transparent
          to-white/5
          pointer-events-none
        "
      />
    </motion.div>
  );
}

// ============================================================
// MOBILE BRANDING SLIDE
// ============================================================

function MobileBranding() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.92,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        min-h-[430px]
        w-full
        overflow-hidden
        rounded-2xl
        flex
        items-center
        justify-center
        text-center
        px-7
        py-10
        bg-[#FFFDF9]
        border
        border-amber-200/50
        shadow-[0_15px_45px_rgba(120,80,20,0.08)]
      "
    >
      {/* Main glow */}

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3, 0.45, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          w-[90%]
          h-[70%]
          rounded-full
          bg-amber-300/30
          blur-[80px]
        "
      />

      {/* Secondary glow */}

      <div
        className="
          absolute
          w-[55%]
          h-[45%]
          rounded-full
          bg-yellow-200/30
          blur-[50px]
        "
      />

      {/* Decorative ring */}

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          w-[92%]
          aspect-square
          rounded-full
          border
          border-dashed
          border-amber-300/25
          pointer-events-none
        "
      />

      <div className="relative z-10">
        {/* Eyebrow */}

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="
            block
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-amber-700
            font-bold
            mb-4
          "
        >
          ISKCON Youth Forum
        </motion.span>

        {/* Ornament */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 0.3,
            duration: 0.5,
          }}
          className="
            text-amber-500
            text-sm
            mb-3
          "
        >
          ✦
        </motion.div>

        {/* Heading */}

        <motion.h1
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
            duration: 0.7,
          }}
          className="
            relative
            font-serif
            text-4xl
            sm:text-5xl
            font-bold
            leading-[1.05]
            text-stone-900
          "
        >
          <span
            className="
              absolute
              inset-0
              -z-10
              blur-2xl
              bg-amber-300/40
              scale-110
            "
          />

          One mission,
          <br />

          <span className="italic font-normal text-amber-600">
            many communities
          </span>
        </motion.h1>

        {/* Description */}

        <motion.p
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.5,
            duration: 0.6,
          }}
          className="
            mt-5
            max-w-xs
            mx-auto
            text-sm
            leading-relaxed
            text-stone-600
          "
        >
          IYF connects young people through spiritual growth,
          meaningful friendships, learning and service.
        </motion.p>

        {/* CTA */}

        <motion.button
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.65,
            duration: 0.6,
          }}
          whileTap={{
            scale: 0.97,
          }}
          className="
            mt-6
            rounded-full
            bg-amber-600
            px-6
            py-3
            text-sm
            font-medium
            text-white
            shadow-[0_8px_25px_rgba(180,120,20,0.22)]
          "
        >
          Explore Centers
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================================
// MOBILE CAROUSEL
// ============================================================

function MobileCarousel({ sampleImg }) {
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      type: "branding",
    },
    {
      type: "image",
      image: sampleImg,
    },
    {
      type: "image",
      image: sampleImg,
    },
    {
      type: "image",
      image: sampleImg,
    },
    {
      type: "image",
      image: sampleImg,
    },
    {
      type: "image",
      image: sampleImg,
    },
    {
      type: "image",
      image: sampleImg,
    },
  ];

  const next = () => {
    setCurrent((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const previous = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  // ----------------------------------------------------------
  // Swipe handling
  // ----------------------------------------------------------

  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (event) => {
    setTouchStart(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (touchStart === null) return;

    const touchEnd = event.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        next();
      } else {
        previous();
      }
    }

    setTouchStart(null);
  };

  return (
    <div
      className="
        relative
        w-full
      "
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ====================================================
          SLIDE
      ==================================================== */}

      <div className="overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{
              opacity: 0,
              x: 45,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -45,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            {slides[current].type === "branding" ? (
              <MobileBranding />
            ) : (
              <div
                className="
                  relative
                  w-full
                  h-[430px]
                  sm:h-[500px]
                  overflow-hidden
                  rounded-2xl
                  shadow-[0_12px_40px_rgba(80,50,10,0.1)]
                "
              >
                <img
                  src={slides[current].image}
                  alt=""
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-stone-900/20
                    via-transparent
                    to-white/5
                  "
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ====================================================
          PREVIOUS / NEXT
      ==================================================== */}

      <button
        type="button"
        onClick={previous}
        aria-label="Previous slide"
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          w-10
          h-10
          rounded-full
          bg-white/90
          backdrop-blur
          shadow-lg
          flex
          items-center
          justify-center
          text-stone-700
          active:scale-95
          transition-transform
        "
      >
        ‹
      </button>

      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          w-10
          h-10
          rounded-full
          bg-white/90
          backdrop-blur
          shadow-lg
          flex
          items-center
          justify-center
          text-stone-700
          active:scale-95
          transition-transform
        "
      >
        ›
      </button>

      {/* ====================================================
          DOTS
      ==================================================== */}

      <div className="flex items-center justify-center gap-2 mt-5">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setCurrent(index)}
            className={`
              h-1.5
              rounded-full
              transition-all
              duration-300
              ${
                current === index
                  ? "w-7 bg-amber-600"
                  : "w-1.5 bg-amber-300"
              }
            `}
          />
        ))}
      </div>

      {/* Swipe hint */}

      <p
        className="
          mt-3
          text-center
          text-[10px]
          uppercase
          tracking-[0.2em]
          text-stone-400
        "
      >
        Swipe to explore
      </p>
    </div>
  );
}

// ============================================================
// DESKTOP BRANDING
// ============================================================

function DesktopBranding() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.85,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      viewport={{
        once: false,
        amount: 0.4,
      }}
      transition={{
        duration: 1,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        col-span-2
        row-span-2
        md:col-span-5
        md:col-start-5
        md:row-start-2
        md:row-span-2
        flex
        flex-col
        items-center
        justify-center
        text-center
        p-4
        sm:p-6
        rounded-2xl
        z-10
        overflow-hidden
      "
    >
      {/* Main glow */}

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.5, 0.35],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          w-[80%]
          h-[65%]
          rounded-full
          bg-amber-300/30
          blur-[80px]
        "
      />

      <div
        className="
          absolute
          w-[55%]
          h-[45%]
          rounded-full
          bg-yellow-200/30
          blur-[50px]
        "
      />

      {/* Content */}

      <div className="relative z-10">
        <motion.span
          initial={{
            opacity: 0,
            y: 10,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
          }}
          transition={{
            duration: 0.6,
            delay: 0.45,
          }}
          className="
            block
            text-[10px]
            sm:text-xs
            uppercase
            tracking-[0.3em]
            text-amber-700
            font-bold
            mb-2
          "
        >
          ISKCON Youth Forum
        </motion.span>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: false,
          }}
          transition={{
            duration: 0.5,
            delay: 0.55,
          }}
          className="text-amber-500 text-sm mb-2"
        >
          ✦
        </motion.div>

        <h1
          className="
            relative
            text-2xl
            sm:text-3xl
            md:text-4xl
            lg:text-5xl
            font-serif
            text-stone-900
            font-bold
            leading-tight
          "
        >
          <span
            className="
              absolute
              inset-0
              -z-10
              blur-2xl
              bg-amber-300/40
              scale-110
            "
          />

          One mission,
          <br />

          <span className="italic font-normal text-amber-600">
            many communities
          </span>
        </h1>

        <motion.p
          initial={{
            opacity: 0,
            y: 10,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
          }}
          transition={{
            duration: 0.6,
            delay: 0.65,
          }}
          className="
            text-[11px]
            sm:text-xs
            text-stone-600
            mt-2
            sm:mt-3
            max-w-xs
            mx-auto
            leading-relaxed
          "
        >
          IYF connects young people through spiritual growth,
          meaningful friendships, learning and service.
        </motion.p>

        <motion.button
          initial={{
            opacity: 0,
            y: 10,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
          }}
          transition={{
            duration: 0.6,
            delay: 0.8,
          }}
          whileHover={{
            scale: 1.05,
            y: -2,
          }}
          whileTap={{
            scale: 0.97,
          }}
          className="
            mt-4
            px-5
            py-2
            bg-amber-600
            text-white
            font-medium
            text-xs
            rounded-full
            shadow-[0_8px_20px_rgba(180,120,20,0.22)]
            hover:bg-amber-700
            transition-colors
          "
        >
          Explore Centers
        </motion.button>
      </div>

      {/* Decorative rotating ring */}

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          w-[90%]
          aspect-square
          rounded-full
          border
          border-dashed
          border-amber-300/20
          pointer-events-none
        "
      />
    </motion.div>
  );
}

// ============================================================
// MAIN HERO
// ============================================================

export default function Hero() {
  const sampleImg = "/src/assets/image.png";

  const centers = [
    {
      span: "row-span-2 md:col-span-4 md:row-span-2",
    },
    {
      span: "md:col-span-5 md:row-span-1",
    },
    {
      span: "row-span-2 md:col-span-3 md:row-span-2",
    },
    {
      span: "row-span-2 md:col-span-4 md:row-span-2",
    },
    {
      span: "md:col-span-4 md:row-span-1 md:col-start-5 md:row-start-4",
    },
    {
      span: "row-span-2 md:col-span-4 md:row-span-2 md:col-start-9 md:row-start-3",
    },
  ];

  return (
    <>
      {/* ====================================================
          MOBILE
          ==================================================== */}

      <section
        className="
          md:hidden
          relative
          min-h-screen
          bg-[#FFFDF9]
          px-4
          pt-5
          pb-8
          overflow-hidden
          flex
          items-center
        "
      >
        {/* Background glow */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[500px]
            h-[500px]
            rounded-full
            bg-amber-200/15
            blur-[120px]
            pointer-events-none
          "
        />

        {/* Decorative corner */}

        <div
          className="
            absolute
            top-6
            left-5
            flex
            items-center
            gap-2
            text-amber-500/60
          "
        >
          <span className="w-5 h-px bg-amber-400/50" />
          <span className="text-xs">✦</span>
        </div>

        <div
          className="
            relative
            z-10
            w-full
            max-w-md
            mx-auto
          "
        >
          <MobileCarousel sampleImg={sampleImg} />
        </div>
      </section>

      {/* ====================================================
          DESKTOP / TABLET
          ==================================================== */}

      <section
        className="
          hidden
          md:flex
          relative
          min-h-screen
          bg-[#FFFDF9]
          px-5
          py-7
          md:h-[100svh]
          md:min-h-0
          md:px-12
          lg:px-24
          items-center
          justify-center
          font-sans
          overflow-hidden
        "
      >
        {/* Main ambient glow */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[600px]
            h-[500px]
            rounded-full
            bg-amber-200/20
            blur-[130px]
            pointer-events-none
          "
        />

        {/* Secondary glow */}

        <div
          className="
            absolute
            top-[15%]
            left-[5%]
            w-40
            h-40
            rounded-full
            bg-yellow-200/20
            blur-[80px]
            pointer-events-none
          "
        />

        {/* Decorative corners */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: false,
          }}
          transition={{
            duration: 1,
          }}
          className="
            absolute
            top-8
            left-8
            md:top-12
            md:left-12
            flex
            items-center
            gap-2
            text-amber-500/60
          "
        >
          <span className="w-6 h-px bg-amber-400/50" />
          <span className="text-xs">✦</span>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: false,
          }}
          transition={{
            duration: 1,
            delay: 0.2,
          }}
          className="
            absolute
            bottom-8
            right-8
            md:bottom-12
            md:right-12
            flex
            items-center
            gap-2
            text-amber-500/60
          "
        >
          <span className="text-xs">✦</span>
          <span className="w-6 h-px bg-amber-400/50" />
        </motion.div>

        {/* ==================================================
            DESKTOP GRID
        ================================================== */}

        <div
          className="
            relative
            w-full
            max-w-7xl
            md:h-full
            grid
            grid-cols-12
            gap-3
            sm:gap-4
            md:gap-5
            auto-rows-[minmax(0,1fr)]
            items-stretch
          "
        >
          {/* Top left */}

          <HeroTile
            image={sampleImg}
            animation={tileAnimations[0]}
            delay={0.05}
            className={`
              hero-tile
              hero-tile--one
              ${centers[0].span}
            `}
          />

          {/* Top center */}

          <HeroTile
            image={sampleImg}
            animation={tileAnimations[1]}
            delay={0.15}
            className={`
              hero-tile
              hero-tile--two
              ${centers[1].span}
            `}
          />

          {/* Top right */}

          <HeroTile
            image={sampleImg}
            animation={tileAnimations[2]}
            delay={0.25}
            className={`
              hero-tile
              hero-tile--three
              ${centers[2].span}
            `}
          />

          {/* Center branding */}

          <DesktopBranding />

          {/* Bottom left */}

          <HeroTile
            image={sampleImg}
            animation={tileAnimations[3]}
            delay={0.35}
            className={`
              hero-tile
              hero-tile--four
              ${centers[3].span}
            `}
          />

          {/* Bottom center */}

          <HeroTile
            image={sampleImg}
            animation={tileAnimations[4]}
            delay={0.45}
            className={`
              hero-tile
              hero-tile--five
              ${centers[4].span}
            `}
          />

          {/* Bottom right */}

          <HeroTile
            image={sampleImg}
            animation={tileAnimations[5]}
            delay={0.55}
            className={`
              hero-tile
              hero-tile--six
              ${centers[5].span}
            `}
          />
        </div>
      </section>
    </>
  );
}
