import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import TempImg from "../../assets/Temple.webp";

const decorations = [
  {
    type: "particle",
    left: "8%",
    top: "18%",
    size: "w-1 h-1",
    delay: 0,
  },
  {
    type: "particle",
    left: "18%",
    top: "65%",
    size: "w-1.5 h-1.5",
    delay: 1,
  },
  {
    type: "particle",
    left: "32%",
    top: "25%",
    size: "w-1 h-1",
    delay: 2,
  },
  {
    type: "particle",
    left: "48%",
    top: "72%",
    size: "w-1 h-1",
    delay: 0.5,
  },
  {
    type: "particle",
    left: "61%",
    top: "18%",
    size: "w-1.5 h-1.5",
    delay: 1.5,
  },
  {
    type: "particle",
    left: "73%",
    top: "55%",
    size: "w-1 h-1",
    delay: 2.5,
  },
  {
    type: "particle",
    left: "86%",
    top: "30%",
    size: "w-1 h-1",
    delay: 1,
  },
  {
    type: "particle",
    left: "92%",
    top: "70%",
    size: "w-1.5 h-1.5",
    delay: 3,
  },

  {
    type: "bird",
    left: "45%",
    top: "20%",
    size: "45",
    duration: 8,
    delay: 0,
  },
  {
    type: "bird",
    left: "65%",
    top: "30%",
    size: "32",
    duration: 9,
    delay: 1,
  },
];

const Decoration = ({ item, index }) => {
  if (item.type === "particle") {
    return (
      <motion.span
        className={`absolute ${item.size} rounded-full bg-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.8)]`}
        style={{
          left: item.left,
          top: item.top,
        }}
        animate={{
          y: [0, -18, 0],
          opacity: [0.2, 0.9, 0.2],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 3 + index * 0.3,
          delay: item.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  }

  if (item.type === "bird") {
    return (
      <motion.div
        className="absolute z-10"
        style={{
          left: item.left,
          top: item.top,
        }}
        animate={{
          x: [0, index % 2 ? 35 : 40, 0],
          y: [0, -10, 0],
          opacity: [0.2, 0.7, 0.2],
        }}
        transition={{
          duration: item.duration,
          delay: item.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width={item.size} height="30" viewBox="0 0 45 30" fill="none">
          <path
            d="M3 18C10 7 17 7 22 16C27 7 35 7 42 18"
            stroke="white"
            strokeOpacity="0.6"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    );
  }

  return null;
};

const AboutHero = () => {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.12, 1.25]);

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.65, 1],
    [1, 0.9, 0],
  );

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [0.15, 0.3, 0.55],
  );

  return (
    <section
      ref={heroRef}
      className="relative h-[70vh] min-h-140 w-full overflow-hidden bg-black md:h-[95vh]"
    >
      <motion.img
        src={TempImg}
        alt="Temple"
        style={{
          scale,
          y: imageY,
        }}
        className="absolute inset-0 h-full w-full object-cover object-[62%_center] md:object-center"
      />

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-black"
      />

      <div
        className="absolute inset-0 bg-linear-to-r from-black/85 via-black/45 to-transparent"
      />

      <div
        className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-black/80 via-black/30 to-transparent"
      />

      <motion.div
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#f59e0b]/20 blur-[100px]"
      />

      {decorations.map((item, index) => (
        <Decoration key={`${item.type}-${index}`} item={item} index={index} />
      ))}

      <motion.div
        style={{
          y: contentY,
          opacity: contentOpacity,
        }}
        className="absolute inset-0 z-20 flex items-center"
      >
        <div className="w-full px-5 sm:px-8 md:px-16 lg:px-24">
          <div className="max-w-2xl text-left text-white">
            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
              className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "48px" }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                }}
                className="h-0.5 bg-[#f59e0b]"
              />

              <p
                className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#f59e0b] sm:text-xs sm:tracking-[0.28em] md:text-sm"
              >
                Youth for a Brighter Tomorrow
              </p>
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1,
                delay: 0.35,
              }}
              className="font-serif text-5xl font-thin leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            >
              IYF{" "}
              <motion.span
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.8,
                }}
                className="italic text-[#f59e0b]"
              >
                Mayapur
              </motion.span>
            </motion.h1>

            <motion.div
              initial={{
                opacity: 0,
                scaleX: 0,
              }}
              animate={{
                opacity: 1,
                scaleX: 1,
              }}
              transition={{
                duration: 1,
                delay: 0.8,
              }}
              className="mb-4 mt-5 flex origin-left items-center gap-2 sm:mb-6 sm:mt-7 sm:gap-3"
            >
              <div className="h-px w-12 bg-white/50 sm:w-20" />

              <motion.div
                animate={{
                  rotate: [45, 135, 45],
                  scale: [1, 1.25, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="
                  h-1.5
                  w-1.5
                  rotate-45
                  bg-[#f59e0b]
                  sm:h-2
                  sm:w-2
                "
              />

              <div className="h-px w-5 bg-white/30 sm:w-8" />
            </motion.div>

            <motion.p
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 1,
              }}
              className="max-w-[320px] text-sm font-light leading-relaxed text-white/90 sm:max-w-lg sm:text-base md:max-w-xl md:text-xl lg:text-2xl"
            >
              Building a generation of kind, conscious and capable leaders for a
              better world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 1.3,
                duration: 1,
              }}
              className="mt-6 flex items-center gap-2 text-[10px] text-white/70 sm:mt-8 sm:gap-3 sm:text-xs md:text-sm"
            >
              <motion.span
                animate={{
                  width: [20, 32, 20],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="h-px bg-[#f59e0b]"
              />

              <span className="uppercase tracking-[0.15em] sm:tracking-widest">
                Inspire • Connect • Serve
              </span>
            </motion.div>

            <motion.button
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.5,
                duration: 0.7,
              }}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 10px 35px rgba(245,158,11,0.35)",
              }}
              whileTap={{
                scale: 0.96,
              }}
              className="mt-6 rounded-full bg-[#f59e0b] px-5 py-2.5 text-xs font-semibold tracking-wider text-green-950 transition sm:mt-10 sm:px-6 sm:py-3"
            >
              Join the Movement
              <motion.span
                animate={{
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                }}
                className="ml-2 inline-block"
              >
                →
              </motion.span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{
          opacity: 0,
          x: 30,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          delay: 1.5,
          duration: 1,
        }}
        className="absolute bottom-20 right-4 z-20 sm:bottom-24 sm:right-8 md:bottom-10 md:right-14 lg:right-20"
      >
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="-rotate-3 text-right leading-[0.85] text-white/80"
          style={{
            fontFamily: "Caveat, cursive",
          }}
        >
          <p className="text-lg sm:text-xl md:text-2xl">Youths for a</p>

          <p className="text-xl sm:text-2xl md:text-3xl">Brighter Tomorrow</p>

          <p className="mt-1 text-sm sm:text-base md:text-lg">
            in Krishna Consciousness
          </p>

          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <span className="h-px w-5 bg-white/50 sm:w-7" />

            <span className="text-[9px] tracking-wide sm:text-[10px] md:text-xs">
              IYF Mayapur
            </span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 text-white sm:bottom-8"
      >
        <motion.div
          animate={{
            y: [0, 8, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-xl sm:text-2xl"
        >
          ↓
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 1.5,
          delay: 1,
        }}
        className="absolute bottom-0 left-0 z-30 h-0.5 w-full origin-left bg-linear-to-r from-transparent via-[#f59e0b] to-transparent"
      />
    </section>
  );
};

export default AboutHero;
