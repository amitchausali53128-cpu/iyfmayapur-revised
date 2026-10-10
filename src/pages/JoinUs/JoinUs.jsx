
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  EyeOff,
  MapPin,
  Phone,
  User,
  Mail,
  Lock,
} from "lucide-react";

import TempImg from "../../assets/Temple.webp";
const apiUrl = import.meta.env.VITE_SADHNA_API_URL;

/* =========================================================
   DECORATIONS
========================================================= */

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

/* =========================================================
   INSPIRATION
========================================================= */

const inspirations = [
  "Spiritual Growth",
  "Leadership",
  "Community Service",
  "Arts & Culture",
  "Events",
  "Technology",
  "Content & Media",
  "Teaching",
];

/* =========================================================
   DECORATION COMPONENT
========================================================= */

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

/* =========================================================
   INPUT COMPONENT
========================================================= */

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  icon: Icon,
  required = false,
}) => {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#123047]/80">
        {Icon && <Icon size={13} className="text-[#b86f00]" />}
        {label}
        {required && <span className="text-[#f59e0b]">*</span>}
      </span>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="
            w-full
            rounded-xl
            border
            border-[#123047]/15
            bg-white/75
            px-4
            py-3
            text-sm
            font-medium
            text-[#123047]
            outline-none
            backdrop-blur-md
            transition-all
            placeholder:text-[#123047]/40
            hover:bg-white/90
            focus:border-[#f59e0b]/70
            focus:bg-white
            focus:ring-2
            focus:ring-[#f59e0b]/15
          "
        />
      </div>
    </label>
  );
};

/* =========================================================
   TEXTAREA COMPONENT
========================================================= */

const TextArea = ({
  label,
  question,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b86f00]">
        {label}
      </span>

      <p className="mb-3 text-base font-semibold leading-6 text-[#123047] sm:text-lg">
        {question}
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="
          w-full
          resize-none
          rounded-2xl
          border
          border-[#123047]/15
          bg-white/80
          px-4
          py-3.5
          text-sm
          leading-6
          text-[#123047]
          outline-none
          backdrop-blur-md
          transition-all
          placeholder:text-[#123047]/40
          hover:bg-white/95
          focus:border-[#f59e0b]/70
          focus:bg-white
          focus:ring-2
          focus:ring-[#f59e0b]/15
        "
      />
    </label>
  );
};

/* =========================================================
   STEP HEADING
========================================================= */

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

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a66300]">
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
        className="
          font-serif
          text-3xl
          font-light
          leading-[1.05]
          tracking-tight
          text-[#123047]
          sm:text-4xl
        "
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
        className="
          mt-4
          max-w-xl
          text-sm
          font-medium
          leading-6
          text-[#123047]/70
          sm:text-[15px]
        "
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const JoinIYF = () => {
  const [step, setStep] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: "",
    city: "",
    address: "",

    contribution: "",
    expectation: "",

    email: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedInspirations, setSelectedInspirations] = useState([]);

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleInspiration = (inspiration) => {
    setSelectedInspirations((prev) =>
      prev.includes(inspiration)
        ? prev.filter((item) => item !== inspiration)
        : [...prev, inspiration],
    );
  };

  const nextStep = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const previousStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = async () => {
    const registrationData = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      address: [form.address, form.city].filter(Boolean).join(", "),
      dob: form.dob,
      onboarding: {
        expectation: form.expectation,
        contribution: form.contribution,
        inspiration: selectedInspirations,
      },
    };


    try {
      const response = await fetch(`${apiUrl}/api/user/register`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.status === 200) {
        setStep(5);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        window.alert(
          data?.message || "Registration failed. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error during registration:", error);
      window.alert(
        "Unable to complete registration. Please try again.",
      );
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
          IMAGE OVERLAYS
      ====================================================== */}

      <div className="absolute inset-0 bg-black/25" />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-black/80
          via-black/45
          to-black/10
        "
      />

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-72
          bg-gradient-to-t
          from-black/75
          via-black/25
          to-transparent
        "
      />

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-32
          bg-gradient-to-b
          from-black/40
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
        <div className="w-full max-w-[600px]">
          {/* =================================================
              INTRO
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

                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#f59e0b]">
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
            className="mb-4 max-w-[540px]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/75">
                Your Journey
              </span>

              <span className="text-[10px] font-medium text-white/65">
                {String(step + 1).padStart(2, "0")} / 05
              </span>
            </div>

            <div className="h-1 overflow-hidden rounded-full bg-white/25">
              <motion.div
                animate={{
                  width: `${((step + 1) / 5) * 100}%`,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-[#f59e0b]
                  to-[#fbbf24]
                "
              />
            </div>
          </motion.div>

          {/* =================================================
              CARD
          ================================================== */}

          <motion.div
            layout
            className="
              w-full
              overflow-hidden
              rounded-3xl
              border
              border-white/70
              bg-[#dff4ff]/95
              shadow-[0_25px_80px_rgba(0,0,0,0.35)]
              backdrop-blur-xl
            "
          >
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent" />

            <div className="p-5 sm:p-7 md:p-8">
              <AnimatePresence mode="wait">
                {/* =================================================
                    STEP 1 — WELCOME
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
                    <StepHeading
                      eyebrow="Welcome"
                      title={
                        <>
                          Begin your{" "}
                          <span className="italic text-[#f59e0b]">
                            journey.
                          </span>
                        </>
                      }
                      subtitle="Join a community of young people growing together through spirituality, service, leadership and meaningful friendships."
                    />

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
                      className="my-7 flex origin-left items-center gap-3"
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

                    <div className="grid grid-cols-3 gap-2.5">
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
                            border-[#123047]/10
                            bg-white/50
                            p-3
                            sm:p-4
                          "
                        >
                          <p className="text-[9px] font-bold text-[#f59e0b]">
                            {number}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-[#123047] sm:text-sm">
                            {title}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* =================================================
                    STEP 2 — BASIC INFORMATION
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
                      eyebrow="About you"
                      title={
                        <>
                          Let’s get to{" "}
                          <span className="italic text-[#f59e0b]">
                            know you.
                          </span>
                        </>
                      }
                      subtitle="Tell us a few basic details so we can get to know you and connect you with the IYF Mayapur community."
                    />

                    <div className="mt-7 grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Full name"
                        placeholder="Enter your full name"
                        value={form.name}
                        icon={User}
                        required
                        onChange={(value) =>
                          updateForm("name", value)
                        }
                      />

                      <Input
                        label="Phone number"
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        icon={Phone}
                        required
                        onChange={(value) =>
                          updateForm("phone", value)
                        }
                      />

                      <Input
                        label="Date of birth"
                        type="date"
                        value={form.dob}
                        required
                        onChange={(value) =>
                          updateForm("dob", value)
                        }
                      />

                      <Input
                        label="City / Town"
                        placeholder="Where are you from?"
                        value={form.city}
                        icon={MapPin}
                        required
                        onChange={(value) =>
                          updateForm("city", value)
                        }
                      />

                      <div className="sm:col-span-2">
                        <Input
                          label="Address"
                          placeholder="Your current address"
                          value={form.address}
                          icon={MapPin}
                          required
                          onChange={(value) =>
                            updateForm("address", value)
                          }
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* =================================================
                    STEP 3 — QUESTIONS
                ================================================== */}

                {step === 2 && (
                  <motion.div
                    key="questions"
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
                      eyebrow="Your voice matters"
                      title={
                        <>
                          Let us know{" "}
                          <span className="italic text-[#f59e0b]">
                            your thoughts.
                          </span>
                        </>
                      }
                      subtitle="There is no right or wrong answer. Share what you genuinely hope to give and receive through your journey with IYF Mayapur."
                    />

                    <div className="mt-7 space-y-6">
                      <div
                        className="
                          rounded-2xl
                          border
                          border-[#123047]/10
                          bg-white/45
                          p-4
                          sm:p-5
                        "
                      >
                        <TextArea
                          label="Question 01"
                          question="How would you like to contribute to IYF Mayapur?"
                          placeholder="Tell us about your skills, interests, ideas, or ways you would like to serve and contribute..."
                          value={form.contribution}
                          onChange={(value) =>
                            updateForm("contribution", value)
                          }
                        />
                      </div>

                      <div
                        className="
                          rounded-2xl
                          border
                          border-[#123047]/10
                          bg-white/45
                          p-4
                          sm:p-5
                        "
                      >
                        <TextArea
                          label="Question 02"
                          question="What do you expect from IYF Mayapur?"
                          placeholder="Tell us what you hope to learn, experience, receive, or achieve through IYF Mayapur..."
                          value={form.expectation}
                          onChange={(value) =>
                            updateForm("expectation", value)
                          }
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* =================================================
                    STEP 4 — INSPIRATION
                ================================================== */}

                {step === 3 && (
                  <motion.div
                    key="inspiration"
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
                      subtitle="Choose the areas you would love to explore, learn about, or contribute to within IYF Mayapur."
                    />

                    <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {inspirations.map((inspiration, index) => {
                        const selected =
                          selectedInspirations.includes(inspiration);

                        return (
                          <motion.button
                            key={inspiration}
                            type="button"
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
                              toggleInspiration(inspiration)
                            }
                            className={`
                              rounded-xl
                              border
                              p-3
                              text-left
                              transition-all
                              sm:p-3.5
                              ${
                                selected
                                  ? "border-[#f59e0b] bg-[#f59e0b]/15 text-[#8c5700] shadow-sm"
                                  : "border-[#123047]/10 bg-white/55 text-[#123047]/75 hover:border-[#8ed8f5] hover:bg-white/80"
                              }
                            `}
                          >
                            <div
                              className={`
                                mb-2
                                flex
                                h-6
                                w-6
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
                                <span className="text-[11px] font-bold">
                                  ✓
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] font-medium leading-4 sm:text-xs">
                              {inspiration}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <p className="mt-5 text-center text-[10px] font-medium text-[#123047]/50">
                      Select as many as you'd like
                    </p>
                  </motion.div>
                )}

                {/* =================================================
                    STEP 5 — CREATE ACCOUNT
                ================================================== */}

                {step === 4 && (
                  <motion.div
                    key="account"
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
                      eyebrow="Almost there"
                      title={
                        <>
                          Create your{" "}
                          <span className="italic text-[#f59e0b]">
                            account.
                          </span>
                        </>
                      }
                      subtitle="Use your email and create a password to complete your IYF Mayapur registration."
                    />

                    <div className="mt-7 space-y-4">
                      <Input
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        icon={Mail}
                        required
                        onChange={(value) =>
                          updateForm("email", value)
                        }
                      />

                      {/* Password */}

                      <label className="block">
                        <span className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#123047]/80">
                          <Lock
                            size={13}
                            className="text-[#b86f00]"
                          />
                          Password
                          <span className="text-[#f59e0b]">*</span>
                        </span>

                        <div className="relative">
                          <input
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            value={form.password}
                            onChange={(e) =>
                              updateForm(
                                "password",
                                e.target.value,
                              )
                            }
                            placeholder="Create a password"
                            required
                            className="
                              w-full
                              rounded-xl
                              border
                              border-[#123047]/15
                              bg-white/75
                              px-4
                              py-3
                              pr-12
                              text-sm
                              font-medium
                              text-[#123047]
                              outline-none
                              transition-all
                              placeholder:text-[#123047]/40
                              focus:border-[#f59e0b]/70
                              focus:bg-white
                              focus:ring-2
                              focus:ring-[#f59e0b]/15
                            "
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(
                                !showPassword,
                              )
                            }
                            className="
                              absolute
                              right-3
                              top-1/2
                              -translate-y-1/2
                              text-[#123047]/45
                              transition
                              hover:text-[#123047]
                            "
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </label>

                      {/* Confirm Password */}

                      <label className="block">
                        <span className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#123047]/80">
                          <Lock
                            size={13}
                            className="text-[#b86f00]"
                          />
                          Confirm password
                          <span className="text-[#f59e0b]">*</span>
                        </span>

                        <div className="relative">
                          <input
                            type={
                              showConfirmPassword
                                ? "text"
                                : "password"
                            }
                            value={form.confirmPassword}
                            onChange={(e) =>
                              updateForm(
                                "confirmPassword",
                                e.target.value,
                              )
                            }
                            placeholder="Confirm your password"
                            required
                            className="
                              w-full
                              rounded-xl
                              border
                              border-[#123047]/15
                              bg-white/75
                              px-4
                              py-3
                              pr-12
                              text-sm
                              font-medium
                              text-[#123047]
                              outline-none
                              transition-all
                              placeholder:text-[#123047]/40
                              focus:border-[#f59e0b]/70
                              focus:bg-white
                              focus:ring-2
                              focus:ring-[#f59e0b]/15
                            "
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(
                                !showConfirmPassword,
                              )
                            }
                            className="
                              absolute
                              right-3
                              top-1/2
                              -translate-y-1/2
                              text-[#123047]/45
                              transition
                              hover:text-[#123047]
                            "
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </label>

                      <div
                        className="
                          mt-5
                          rounded-xl
                          border
                          border-[#f59e0b]/20
                          bg-[#f59e0b]/8
                          p-3.5
                        "
                      >
                        <p className="text-xs font-medium leading-5 text-[#123047]/70">
                          Your information will help us understand
                          how you would like to connect and
                          contribute to the IYF Mayapur community.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="registration-success"
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
                    className="py-8 text-center sm:py-12"
                  >
                    <StepHeading
                      eyebrow="Registration complete"
                      title={
                        <>
                          Welcome to the{" "}
                          <span className="italic text-[#f59e0b]">
                            Krishna Conscious Society.
                          </span>
                        </>
                      }
                      subtitle="Your registration is complete. We are grateful to have you join our spiritual community."
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* =================================================
                  NAVIGATION
              ================================================== */}

              {step < 5 && (
                <div className="mt-7 flex items-center justify-between border-t border-[#123047]/10 pt-5">
                {step > 0 ? (
                  <motion.button
                    type="button"
                    whileHover={{
                      x: -3,
                    }}
                    onClick={previousStep}
                    className="
                      rounded-full
                      px-2
                      py-2
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      text-[#123047]/55
                      transition
                      hover:text-[#123047]
                    "
                  >
                    ← Back
                  </motion.button>
                ) : (
                  <div />
                )}

                {step < 4 && (
                  <motion.button
                    type="button"
                    whileHover={{
                      scale: 1.04,
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
                      font-bold
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

                {step === 4 && (
                  <motion.button
                    type="button"
                    whileHover={{
                      scale: 1.04,
                      boxShadow:
                        "0 10px 30px rgba(245,158,11,0.3)",
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                    onClick={handleSubmit}
                    className="
                      rounded-full
                      bg-[#f59e0b]
                      px-5
                      py-2.5
                      text-[10px]
                      font-bold
                      tracking-wider
                      text-[#123047]
                      sm:px-6
                      sm:py-3
                    "
                  >
                    Create Account →
                  </motion.button>
                )}
                </div>
              )}
            </div>
          </motion.div>

          {/* =================================================
              SIGNATURE
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
              className="-rotate-2 text-white/70"
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
          RIGHT SIDE MESSAGE
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
          bg-gradient-to-r
          from-transparent
          via-[#f59e0b]
          to-transparent
        "
      />
    </main>
  );
};

export default JoinIYF;