import React from "react";
import { motion } from "motion/react";
import TempImg from "../../assets/GrpImg1.webp";

const stats = [
  { icon: "👥", value: "10K+", label: "Youth Connected" }, { icon: "📅", value: "50+", label: "Events Organized" },
  { icon: "❤️", value: "7+", label: "Service Areas" }, { icon: "🌐", value: "Global", label: "Growing Family" },
];

const decorations = [
  { type: "leaf", className: "left-4 top-10", delay: 0, duration: 5 }, { type: "leaf", className: "right-6 top-12", delay: 0.5, duration: 6 },
  { type: "leaf", className: "left-[43%] top-16", delay: 1, duration: 4 }, { type: "leaf", className: "right-[37%] top-24", delay: 1.5, duration: 5 },
  { type: "bird", className: "right-[38%] top-12", delay: 0, duration: 7 }, { type: "bird", className: "left-[52%] top-[20%]", delay: 1, duration: 6 },
];

const Decoration = ({ item, index }) => {
  const isBird = item.type === "bird";

  return (
    <motion.div
      className={`absolute z-20 ${item.className}`}
      animate={{
        x: isBird ? [0, index % 2 ? -15 : 18, 0] : 0,
        y: [0, index % 2 ? 8 : -8, 0],
        rotate: isBird ? 0 : [0, index % 2 ? -8 : 8, 0],
      }}
      transition={{
        duration: item.duration,
        delay: item.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {isBird ? (
        <svg
          width={index % 2 ? 35 : 42}
          height="30"
          viewBox="0 0 42 30"
          fill="none"
        >
          <path
            d="M3 18C10 8 16 8 21 16C26 8 33 8 39 18"
            stroke="#9da69a"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <span className={index < 2 ? "text-4xl opacity-60" : "text-2xl opacity-40"}>
          🍃
        </span>
      )}
    </motion.div>
  );
};

const WhoWeAre = () => {
  return (
    <section className="relative overflow-hidden bg-[#063f35]">

      <div className="relative min-h-180 overflow-hidden bg-[#fffaf0]">

        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#e8f0d5]/60 blur-3xl" />

        <div className="absolute -right-32 top-32 h-80 w-80 rounded-full bg-[#f5dfad]/50 blur-3xl" />

        {decorations.map((item, index) => (
          <Decoration
            key={`${item.type}-${index}`}
            item={item}
            index={index}
          />
        ))}

        <div className="relative z-30 mx-auto flex min-h-180 max-w-7xl items-center px-5 py-20 sm:px-8 md:px-12 lg:px-16">

          <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_1.1fr_0.85fr]">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8 }}
            >

              <div className="mb-4 flex items-center gap-3">

                <span className="text-3xl">
                  🍃
                </span>

                <p className="text-[11px] font-semibold tracking-[0.28em] text-[#15705e]">
                  WHO WE ARE
                </p>

              </div>

              <h2 className="max-w-xl font-serif text-4xl font-semibold leading-[1.08] text-[#163b39] sm:text-5xl lg:text-[46px]">

                Inspiring Youth.
                <br />

                Serving Society.
                <br />

                <span className="text-[#16735f]">
                  Spreading Krishna Consciousness.
                </span>

              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-[#53635d] sm:text-base">
                The International Youth Forum (IYF) Mayapur is a community
                dedicated to spiritual growth, character building and
                selfless service. We aim to empower youth through devotion,
                education and practical skills, helping them become
                responsible global citizens and dedicated servants of Krishna.
              </p>

              <motion.button
                whileHover={{
                  scale: 1.04,
                  x: 4,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#08745e] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#08745e]/20"

                onClick={() => {window.location.href = "/aboutUs"}}
              >
                Know More About Us

                <span className="text-lg">
                  →
                </span>
              </motion.button>

            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 1,
              }}
              className="relative flex min-h-90 items-center justify-center"
            >

              <div className="absolute h-64 w-64 rounded-full bg-[#f8d77d]/30 blur-3xl sm:h-80 sm:w-80" />

              <motion.img
                src={TempImg}
                alt="IYF Mayapur"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 max-h-95 w-full max-w-107.5 object-contain opacity-90 shadow-xl/30 mix-blend-multiply"
              />

              <motion.div
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 8, -8, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-8 left-[20%] z-20 text-3xl"
              >
                🌸
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 12, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-[10%] top-[25%] z-20 text-3xl"
              >
                🍃
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.5,
                  duration: 0.8,
                }}
                className="absolute right-0 sm:top-[95%]  z-20 rotate-[-7deg] text-shadow-lg/30 text-[#16735f]/80 hidden lg:block"
              >
                <p
                  className="text-3xl leading-[0.8] sm:text-3xl"
                  style={{
                    fontFamily: "Caveat, cursive",
                  }}
                >
                  A Brighter
                  <br />
                  You
                  <br />
                  A Kinder
                  <br />
                  World
                </p>
              </motion.div>

            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 50,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 0.8,
              }}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >

              {stats.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                  }}
                  className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-xl/30 backdrop-blur-md sm:p-5"
                >

                  <div className="mb-3 text-2xl">
                    {item.icon}
                  </div>

                  <p className="text-2xl font-bold text-[#183e3b]">
                    {item.value}
                  </p>

                  <p className="mt-1 text-xs text-[#68756f]">
                    {item.label}
                  </p>

                </motion.div>
              ))}

            </motion.div>

          </div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="absolute bottom-24 right-6 z-30 hidden max-w-67.5 text-right md:block"
        >

          <p
            className="text-lg italic leading-relaxed text-[#41514b]"
            style={{
              fontFamily: "Caveat, cursive",
            }}
          >
            "The youth are the hope of the future."
          </p>

          <p className="mt-1 text-[10px] font-semibold tracking-wider text-[#68756f]">
            — SRILA PRABHUPADA
          </p>

        </motion.div>

        

        {["left-[8%]", "right-[12%]"].map((position, index) => (
          <motion.div
            key={position}
            animate={{
              y: [0, -6, 0],
              rotate: [0, index ? -7 : 5, 0],
            }}
            transition={{
              duration: 4 + index * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute bottom-12 ${position} z-50 text-2xl`}
          >
            {index ? "🍃" : "🌿"}
          </motion.div>
        ))}

      </div>
    </section>
  );
};

export default WhoWeAre;