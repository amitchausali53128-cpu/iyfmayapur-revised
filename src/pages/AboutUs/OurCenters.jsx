import React from "react";
import { motion } from "motion/react";
import centerImage from "../../assets/OurBase/Img1.jpg";

const centers = [
  { name: "Mayapur Base", location: "NIT Durgapur", image: centerImage },
  { name: "Shantipur Base", location: "NIT Silchar", image: centerImage },
  { name: "Jagannath Base", location: "Bolpur", image: centerImage },
  { name: "Brihad Mrdanga Base", location: "Bardhaman", image: centerImage },
  { name: "Koladwipa Base", location: "IIIT Kalyani", image: centerImage },
  { name: "Simantadwipa Base", location: "Phuljohor, BCREC", image: centerImage },
];

const decorations = [
  { type: "flower", left: "5%", top: "18%", size: 30, delay: 0 }, { type: "flower", left: "92%", top: "22%", size: 24, delay: 1.5 },
  { type: "leaf", left: "10%", top: "70%", size: 34, delay: 0.8 }, { type: "leaf", left: "88%", top: "72%", size: 30, delay: 2 },
  { type: "bird", left: "15%", top: "25%", size: 42, delay: 0 }, { type: "bird", left: "78%", top: "18%", size: 35, delay: 2 },
  { type: "butterfly", left: "25%", top: "75%", size: 24, delay: 1 }, { type: "butterfly", left: "70%", top: "65%", size: 22, delay: 2.5 },
  { type: "petal", left: "20%", top: "45%", delay: 0 }, { type: "petal", left: "35%", top: "82%", delay: 1 }, { type: "petal", left: "65%", top: "78%", delay: 2 }, { type: "petal", left: "82%", top: "42%", delay: 1.5 },
];

const Decoration = ({ item, index }) => {
  if (item.type === "flower") {
    return (
      <motion.div
        className="pointer-events-none absolute z-10"
        style={{
          left: item.left,
          top: item.top,
        }}
        animate={{
          y: [0, -12, 0],
          rotate: [-5, 5, -5],
          opacity: [0.65, 1, 0.65],
        }}
        transition={{
          duration: 4 + index,
          delay: item.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width={item.size} height={item.size} viewBox="0 0 40 40">
          <circle cx="20" cy="10" r="7" fill="#f9a8d4" />
          <circle cx="30" cy="18" r="7" fill="#fbcfe8" />
          <circle cx="26" cy="29" r="7" fill="#f9a8d4" />
          <circle cx="14" cy="29" r="7" fill="#fbcfe8" />
          <circle cx="10" cy="18" r="7" fill="#f9a8d4" />

          <circle cx="20" cy="20" r="5" fill="#f59e0b" />
        </svg>
      </motion.div>
    );
  }

  if (item.type === "leaf") {
    return (
      <motion.div
        className="pointer-events-none absolute z-10"
        style={{
          left: item.left,
          top: item.top,
        }}
        animate={{
          y: [0, -15, 0],
          x: [0, 8, 0],
          rotate: [-8, 8, -8],
        }}
        transition={{
          duration: 5 + index,
          delay: item.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width={item.size} height={item.size} viewBox="0 0 40 40">
          <path
            d="M8 30C8 14 20 5 34 6C34 22 24 34 8 30Z"
            fill="#86a66a"
            opacity="0.65"
          />

          <path
            d="M10 29C18 23 24 17 32 8"
            stroke="#526b42"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </motion.div>
    );
  }

  if (item.type === "bird") {
    return (
      <motion.div
        className="pointer-events-none absolute z-10"
        style={{
          left: item.left,
          top: item.top,
        }}
        animate={{
          x: [0, 35, 70, 35, 0],
          y: [0, -10, 0, 8, 0],
          opacity: [0.25, 0.7, 0.45, 0.7, 0.25],
        }}
        transition={{
          duration: 9 + index,
          delay: item.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width={item.size} height="28" viewBox="0 0 50 30" fill="none">
          <path
            d="M3 18C11 7 19 7 25 17C31 7 39 7 47 18"
            stroke="#526b42"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    );
  }

  if (item.type === "butterfly") {
    return (
      <motion.div
        className="pointer-events-none absolute z-20"
        style={{
          left: item.left,
          top: item.top,
        }}
        animate={{
          x: [0, 18, -10, 0],
          y: [0, -18, -5, 0],
          rotate: [-5, 8, -8, -5],
        }}
        transition={{
          duration: 6 + index,
          delay: item.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width={item.size} height={item.size} viewBox="0 0 40 40">
          <ellipse
            cx="13"
            cy="18"
            rx="9"
            ry="12"
            fill="#c084fc"
            opacity="0.75"
          />

          <ellipse
            cx="27"
            cy="18"
            rx="9"
            ry="12"
            fill="#f9a8d4"
            opacity="0.75"
          />

          <ellipse cx="20" cy="27" rx="4" ry="9" fill="#8b5cf6" />

          <line x1="18" y1="10" x2="14" y2="4" stroke="#555" strokeWidth="1" />

          <line x1="22" y1="10" x2="26" y2="4" stroke="#555" strokeWidth="1" />
        </svg>
      </motion.div>
    );
  }

  if (item.type === "petal") {
    return (
      <motion.span
        className="pointer-events-none absolute z-10 h-2 w-2 rounded-full bg-[#f9a8d4]"
        style={{
          left: item.left,
          top: item.top,
        }}
        animate={{
          y: [0, 80, 160],
          x: [0, 20, -10],
          rotate: [0, 180, 360],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 6 + index,
          delay: item.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  }

  return null;
};

const CenterCard = ({ center }) => {
  return (
    <motion.div
      whileHover={{
        y: -12,
        scale: 1.03,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="group relative w-70 shrink-0 overflow-hidden rounded-[28px] bg-white shadow-xl sm:w-80 md:w-87.5"
    >
      <div className="relative h-65 overflow-hidden">
        <img
          src={center.image}
          alt={`${center.name} - ${center.location}`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f59e0b]/30 blur-3xl"
        />

        <div className="absolute bottom-5 left-5 text-white">
          <p className="mb-1 text-xs uppercase tracking-[0.25em] text-[#f59e0b]">
            IYF Center
          </p>

          <h3 className="text-2xl font-semibold">{center.name}</h3>

          <p className="mt-1 text-sm text-white/80">{center.location}</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm text-gray-500">Explore Center</span>

        <motion.span
          animate={{
            x: [0, 5, 0],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
          }}
          className="text-xl text-[#f59e0b]"
        >
          →
        </motion.span>
      </div>
    </motion.div>
  );
};

const DifferentCenters = () => {
  const movingCenters = [...centers, ...centers];

  return (
    <section className="relative overflow-hidden bg-[#faf7f0] py-24">
      {decorations.map((item, index) => (
        <Decoration key={`${item.type}-${index}`} item={item} index={index} />
      ))}

      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[20%] top-[15%] h-72 w-72 rounded-full bg-[#f59e0b]/20 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[15%] bottom-[10%] h-80 w-80 rounded-full bg-green-300/20 blur-[120px]"
      />

      <div className="relative z-20 mx-auto mb-14 max-w-4xl px-6 text-center">
        <motion.p
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
          className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#f59e0b]"
        >
          Our Presence
        </motion.p>

        <motion.h2
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.1,
          }}
          className="font-serif text-4xl font-medium text-[#253b2f] sm:text-5xl md:text-6xl"
        >
          Our Different Centers
        </motion.h2>

        <motion.p
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
            delay: 0.2,
          }}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg"
        >
          IYF connects young minds across different campuses, cities and
          communities through Krishna consciousness, education and service.
        </motion.p>
      </div>

      <div className="relative z-20 w-full overflow-hidden">
        {/* <div className="pointer-events-none absolute left-0 top-0 z-30 h-full w-28 bg-linear-to-r from-[#faf7f0] to-transparent" /> */}

        {/* <div className="pointer-events-none absolute right-0 top-0 z-30 h-full w-28 bg-linear-to-l from-[#faf7f0] to-transparent" /> */}

        <motion.div
          className="flex w-max gap-6"
          initial={{
            x: "-50%",
          }}
          animate={{
            x: "0%",
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {movingCenters.map((center, index) => (
            <CenterCard key={`${center.name}-${index}`} center={center} />
          ))}
        </motion.div>
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
        className="relative z-20 mt-14 text-center"
      >
        <p className="text-sm tracking-wide text-gray-500">
          Inspiring youth • Connecting hearts • Serving society
        </p>

        <motion.div
          animate={{
            scaleX: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mx-auto mt-4 h-0.5 w-20 origin-center bg-[#f59e0b]"
        />
      </motion.div>
    </section>
  );
};

export default DifferentCenters;
