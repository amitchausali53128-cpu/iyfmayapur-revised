import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
    left: "48%",
    top: "20%",
    size: "45",
    duration: 8,
    delay: 0,
  },
  {
    type: "bird",
    left: "70%",
    top: "30%",
    size: "32",
    duration: 9,
    delay: 1,
  },
];

const interests = [
  "Spiritual Growth",
  "Leadership",
  "Community Service",
  "Arts & Culture",
  "Events",
  "Technology",
  "Content & Media",
  "Teaching",
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
        <svg
          width={item.size}
          height="30"
          viewBox="0 0 45 30"
          fill="none"
        >
          <path
            d="M3 18C10 7 17 7 22 16C27 7 35 7 42 18"
            stroke="white"
            strokeOpacity="0.55"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    );
  }

  return null;
};

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#123047]/55">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-[#123047]/10
          bg-white/65
          px-4
          py-3
          text-sm
          text-[#123047]
          outline-none
          backdrop-blur-md
          transition-all
          placeholder:text-[#123047]/30
          hover:bg-white/80
          focus:border-[#f59e0b]/60
          focus:bg-white/90
          focus:ring-2
          focus:ring-[#f59e0b]/15
        "
      />
    </label>
  );
};

const StepHeading = ({ eyebrow, title, subtitle }) => {
  return (
    <div>
      <motion.div
        initial={{
          opacity: 0,
          x: -20,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="mb-3 flex items-center gap-3"
      >
        <div className="h-0.5 w-9 bg-[#f59e0b]" />

        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b86f00]">
          {eyebrow}
        </p>
      </motion.div>

      <motion.h2
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.1,
        }}
        className="font-serif text-3xl font-light leading-[1] tracking-tight text-[#123047] sm:text-4xl"
      >
        {title}
      </motion.h2>

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
          duration: 0.6,
          delay: 0.2,
        }}
        className="mt-3 max-w-lg text-xs font-light leading-5 text-[#123047]/60 sm:text-sm"
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

const JoinIYF = () => {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    city: "",
  });

  const [selectedInterests, setSelectedInterests] = useState([]);

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest],
    );
  };

  const nextStep = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#102c3d]">
      {/* =====================================================
          TEMPLE IMAGE
      ====================================================== */}

      <motion.img
        src={TempImg}
        alt="Mayapur Temple"
        initial={{
          scale: 1,
        }}
        animate={{
          scale: 1.05,
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-[62%_center]
          md:object-center
        "
      />

      {/* =====================================================
          BLACK IMAGE OVERLAY
          SAME STYLE AS YOUR ABOUT HERO
      ====================================================== */}

      {/* Overall black tint */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Strong left darkness behind onboarding */}
      <div
        className="
          absolute
          inset-0
          bg-linear-to-r
          from-black/75
          via-black/40
          to-black/10
        "
      />

      {/* Bottom cinematic gradient */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-72
          bg-linear-to-t
          from-black/70
          via-black/25
          to-transparent
        "
      />

      {/* Subtle top darkness */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-32
          bg-linear-to-b
          from-black/35
          to-transparent
        "
      />

      {/* =====================================================
          SAFFRON GLOW
      ====================================================== */}

      <motion.div
        animate={{
          opacity: [0.12, 0.28, 0.12],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          right-[20%]
          top-[12%]
          h-72
          w-72
          rounded-full
          bg-[#f59e0b]/20
          blur-[100px]
        "
      />

      {/* =====================================================
          DECORATIONS
      ====================================================== */}

      {decorations.map((item, index) => (
        <Decoration
          key={`${item.type}-${index}`}
          item={item}
          index={index}
        />
      ))}

      

      {/* =====================================================
          MAIN CONTENT
          LEFT SIDE
      ====================================================== */}

      <div
        className="
          relative
          z-20
          flex
          min-h-screen
          items-center
          px-4
          pb-8
          pt-24
          sm:px-8
          md:px-12
          lg:px-16
          xl:px-24
        "
      >
        <div className="w-full max-w-[560px]">
          {/* =================================================
              INTRO TEXT ABOVE CARD
          ================================================== */}

          {step === 0 && (
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
              }}
              className="mb-5 hidden text-white sm:block"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="h-0.5 w-10 bg-[#f59e0b]" />

                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#f59e0b]">
                  Youth for a Brighter Tomorrow
                </p>
              </div>

              <h1 className="font-serif text-4xl font-thin leading-none md:text-5xl">
                Join the{" "}
                <span className="italic text-[#f59e0b]">
                  movement.
                </span>
              </h1>
            </motion.div>
          )}

          {/* =================================================
              PROGRESS
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mb-4 max-w-[500px]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/65">
                Your Journey
              </span>

              <span className="text-[10px] text-white/50">
                {String(step + 1).padStart(2, "0")} / 04
              </span>
            </div>

            <div className="h-1 overflow-hidden rounded-full bg-white/20">
              <motion.div
                animate={{
                  width: `${((step + 1) / 4) * 100}%`,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="
                  h-full
                  rounded-full
                  bg-linear-to-r
                  from-[#f59e0b]
                  to-[#fbbf24]
                "
              />
            </div>
          </motion.div>

          {/* =================================================
              ONBOARDING CARD
          ================================================== */}

          <motion.div
            layout
            className="
              w-full
              overflow-hidden
              rounded-3xl
              border
              border-white/70
              bg-[#dff4ff]/90
              shadow-[0_25px_80px_rgba(0,0,0,0.3)]
              backdrop-blur-xl
            "
          >
            {/* Saffron accent */}
            <div className="h-1 w-full bg-linear-to-r from-transparent via-[#f59e0b] to-transparent" />

            <div className="p-5 sm:p-7 md:p-8">
              <AnimatePresence mode="wait">
                {/* =================================================
                    STEP 1
                ================================================== */}

                {step === 0 && (
                  <motion.div
                    key="welcome"
                    initial={{
                      opacity: 0,
                      x: 35,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -35,
                    }}
                    transition={{
                      duration: 0.45,
                    }}
                  >
                    <div>
                      <motion.div
                        initial={{
                          opacity: 0,
                          x: -20,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          duration: 0.6,
                        }}
                        className="mb-4 flex items-center gap-3"
                      >
                        <div className="h-0.5 w-9 bg-[#f59e0b]" />

                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b86f00]">
                          Welcome
                        </p>
                      </motion.div>

                      <motion.h2
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.7,
                          delay: 0.1,
                        }}
                        className="
                          font-serif
                          text-3xl
                          font-light
                          leading-[0.95]
                          tracking-tight
                          text-[#123047]
                          sm:text-4xl
                        "
                      >
                        Begin your{" "}
                        <span className="italic text-[#f59e0b]">
                          journey.
                        </span>
                      </motion.h2>

                      <motion.p
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.6,
                          delay: 0.25,
                        }}
                        className="
                          mt-4
                          max-w-md
                          text-sm
                          font-light
                          leading-6
                          text-[#123047]/65
                        "
                      >
                        Join a community of young people growing together
                        through spirituality, service, leadership and
                        meaningful friendships.
                      </motion.p>

                      {/* Decorative divider */}
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
                          duration: 0.7,
                          delay: 0.5,
                        }}
                        className="my-6 flex origin-left items-center gap-3"
                      >
                        <div className="h-px w-16 bg-[#123047]/15" />

                        <motion.div
                          animate={{
                            rotate: [45, 135, 45],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                          }}
                          className="h-2 w-2 rotate-45 bg-[#f59e0b]"
                        />

                        <div className="h-px w-8 bg-[#123047]/10" />
                      </motion.div>

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          ["01", "Inspire"],
                          ["02", "Connect"],
                          ["03", "Serve"],
                        ].map(([number, title], index) => (
                          <motion.div
                            key={title}
                            initial={{
                              opacity: 0,
                              y: 15,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              delay: 0.55 + index * 0.1,
                            }}
                            className="
                              rounded-xl
                              border
                              border-[#123047]/8
                              bg-white/45
                              p-3
                            "
                          >
                            <p className="text-[9px] text-[#f59e0b]">
                              {number}
                            </p>

                            <p className="mt-1 text-xs font-medium text-[#123047]">
                              {title}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* =================================================
                    STEP 2
                ================================================== */}

                {step === 1 && (
                  <motion.div
                    key="details"
                    initial={{
                      opacity: 0,
                      x: 35,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -35,
                    }}
                    transition={{
                      duration: 0.45,
                    }}
                  >
                    <StepHeading
                      eyebrow="A little about you"
                      title={
                        <>
                          Let’s get to{" "}
                          <span className="italic text-[#f59e0b]">
                            know you.
                          </span>
                        </>
                      }
                      subtitle="Tell us a little about yourself so we can help you find your place within the IYF community."
                    />

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Your name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={(value) =>
                          updateForm("name", value)
                        }
                      />

                      <Input
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(value) =>
                          updateForm("email", value)
                        }
                      />

                      <Input
                        label="Phone number"
                        placeholder="+91"
                        value={form.phone}
                        onChange={(value) =>
                          updateForm("phone", value)
                        }
                      />

                      <Input
                        label="Age"
                        type="number"
                        placeholder="Your age"
                        value={form.age}
                        onChange={(value) =>
                          updateForm("age", value)
                        }
                      />

                      <div className="sm:col-span-2">
                        <Input
                          label="City / Town"
                          placeholder="Where are you from?"
                          value={form.city}
                          onChange={(value) =>
                            updateForm("city", value)
                          }
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* =================================================
                    STEP 3
                ================================================== */}

                {step === 2 && (
                  <motion.div
                    key="interests"
                    initial={{
                      opacity: 0,
                      x: 35,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -35,
                    }}
                    transition={{
                      duration: 0.45,
                    }}
                  >
                    <StepHeading
                      eyebrow="Find your space"
                      title={
                        <>
                          What inspires{" "}
                          <span className="italic text-[#f59e0b]">
                            you?
                          </span>
                        </>
                      }
                      subtitle="Choose the areas you'd love to explore or contribute to within IYF Mayapur."
                    />

                    <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {interests.map((interest, index) => {
                        const selected =
                          selectedInterests.includes(interest);

                        return (
                          <motion.button
                            key={interest}
                            initial={{
                              opacity: 0,
                              y: 15,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              delay: index * 0.04,
                            }}
                            whileHover={{
                              y: -3,
                            }}
                            whileTap={{
                              scale: 0.97,
                            }}
                            onClick={() =>
                              toggleInterest(interest)
                            }
                            className={`
                              rounded-xl
                              border
                              p-3
                              text-left
                              transition-all
                              ${
                                selected
                                  ? "border-[#f59e0b] bg-[#f59e0b]/15 text-[#a96700]"
                                  : "border-[#123047]/10 bg-white/50 text-[#123047]/65 hover:border-[#8ed8f5] hover:bg-white/75"
                              }
                            `}
                          >
                            <div
                              className={`
                                mb-2
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                rounded-full
                                border
                                ${
                                  selected
                                    ? "border-[#f59e0b] bg-[#f59e0b] text-[#123047]"
                                    : "border-[#123047]/15"
                                }
                              `}
                            >
                              {selected && (
                                <span className="text-[10px] font-bold">
                                  ✓
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] leading-4 sm:text-xs">
                              {interest}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <p className="mt-4 text-center text-[9px] text-[#123047]/40">
                      Select as many as you'd like
                    </p>
                  </motion.div>
                )}

                {/* =================================================
                    STEP 4
                ================================================== */}

                {step === 3 && (
                  <motion.div
                    key="complete"
                    initial={{
                      opacity: 0,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{
                        scale: 0,
                      }}
                      animate={{
                        scale: 1,
                      }}
                      transition={{
                        delay: 0.1,
                        type: "spring",
                        stiffness: 180,
                      }}
                      className="
                        mx-auto
                        mb-5
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-full
                        bg-[#f59e0b]
                        shadow-[0_10px_35px_rgba(245,158,11,0.3)]
                      "
                    >
                      <span className="text-2xl font-bold text-[#123047]">
                        ✓
                      </span>
                    </motion.div>

                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#b86f00]">
                      Welcome aboard
                    </p>

                    <h2 className="font-serif text-3xl font-light leading-tight text-[#123047] sm:text-4xl">
                      You’re part of{" "}
                      <span className="italic text-[#f59e0b]">
                        IYF Mayapur.
                      </span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#123047]/60">
                      Your journey starts here. Meet inspiring people,
                      discover new possibilities and find meaningful ways to
                      serve.
                    </p>

                    <div
                      className="
                        mx-auto
                        mt-6
                        max-w-sm
                        rounded-xl
                        border
                        border-[#123047]/10
                        bg-white/45
                        p-4
                        text-left
                      "
                    >
                      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b86f00]">
                        Your interests
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {selectedInterests.length > 0 ? (
                          selectedInterests.map((interest) => (
                            <span
                              key={interest}
                              className="
                                rounded-full
                                border
                                border-[#8ed8f5]
                                bg-white/70
                                px-2.5
                                py-1
                                text-[10px]
                                text-[#123047]/70
                              "
                            >
                              {interest}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#123047]/40">
                            Exploring everything
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* =================================================
                  NAVIGATION
              ================================================== */}

              <div className="mt-7 flex items-center justify-between border-t border-[#123047]/10 pt-5">
                {step > 0 ? (
                  <motion.button
                    whileHover={{
                      x: -3,
                    }}
                    onClick={previousStep}
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.15em]
                      text-[#123047]/45
                      transition
                      hover:text-[#123047]
                    "
                  >
                    ← Back
                  </motion.button>
                ) : (
                  <div />
                )}

                {step < 3 && (
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        "0 10px 30px rgba(245,158,11,0.3)",
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                    onClick={nextStep}
                    className="
                      rounded-full
                      bg-[#f59e0b]
                      px-5
                      py-2.5
                      text-[10px]
                      font-semibold
                      tracking-wider
                      text-[#123047]
                      sm:px-6
                      sm:py-3
                    "
                  >
                    {step === 0 ? "Let's Begin" : "Continue"}

                    <motion.span
                      animate={{
                        x: [0, 4, 0],
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
                )}

                {step === 3 && (
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        "0 10px 30px rgba(245,158,11,0.3)",
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                    className="
                      rounded-full
                      bg-[#f59e0b]
                      px-5
                      py-2.5
                      text-[10px]
                      font-semibold
                      tracking-wider
                      text-[#123047]
                      sm:px-6
                      sm:py-3
                    "
                  >
                    Explore IYF →
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* =================================================
              SMALL SIGNATURE
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1,
              duration: 0.8,
            }}
            className="mt-4 hidden text-left sm:block"
          >
            <motion.div
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="-rotate-2 text-white/65"
              style={{
                fontFamily: "Caveat, cursive",
              }}
            >
              <p className="text-base">
                Youths for a Brighter Tomorrow
              </p>

              <p className="text-xs">
                in Krishna Consciousness
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE TEMPLE INDICATOR
      ====================================================== */}

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
          delay: 1.2,
          duration: 1,
        }}
        className="
          absolute
          bottom-10
          right-5
          z-20
          hidden
          text-right
          md:block
          lg:right-12
        "
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
          className="-rotate-3 text-white/75"
          style={{
            fontFamily: "Caveat, cursive",
          }}
        >
          <p className="text-xl lg:text-2xl">
            Youths for a
          </p>

          <p className="text-2xl lg:text-3xl">
            Brighter Tomorrow
          </p>

          <p className="mt-1 text-sm lg:text-base">
            in Krishna Consciousness
          </p>

          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <span className="h-px w-6 bg-white/40" />

            <span className="text-[9px] tracking-wide">
              IYF Mayapur
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* =====================================================
          BOTTOM ACCENT
      ====================================================== */}

      <motion.div
        initial={{
          scaleX: 0,
        }}
        animate={{
          scaleX: 1,
        }}
        transition={{
          duration: 1.5,
          delay: 0.8,
        }}
        className="
          absolute
          bottom-0
          left-0
          z-30
          h-0.5
          w-full
          origin-left
          bg-linear-to-r
          from-transparent
          via-[#f59e0b]
          to-transparent
        "
      />
    </main>
  );
};

export default JoinIYF;
