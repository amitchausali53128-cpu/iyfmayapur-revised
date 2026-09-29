import { useState, useEffect } from "react";
import { CourseCard } from "../components/Card";
import bgimage from "../assets/sample.jpg";
import { Link } from "react-router-dom";
import { getCourses } from "../utils/lmsState";
import FadeUp from "../utils/motions/FadeUp";
import { motion } from "framer-motion";

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchYouthCourses() {
      try {
        setIsLoading(true);

        const allCourses = await getCourses();

        const youthCourses = (allCourses || []).filter(
          (c) => c.category === "Youth"
        );

        setCourses(youthCourses);
      } catch (err) {
        console.error("Error loading Youth courses:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchYouthCourses();
  }, []);

  const scrollToFeatured = () => {
    const featuredSection = document.getElementById("featured-courses");

    if (featuredSection) {
      featuredSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] text-gray-800">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative min-h-[72vh] md:min-h-[82vh] w-full overflow-hidden bg-black">

        {/* Background Image */}
        <motion.img
          src={bgimage}
          alt="IYF Mayapur Youth Courses"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.12 }}
          transition={{
            duration: 12,
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
            object-center
          "
        />

        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Left gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Amber glow */}
        <motion.div
          animate={{
            opacity: [0.15, 0.3, 0.15],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -right-20
            top-10
            h-72
            w-72
            rounded-full
            bg-[#f59e0b]/20
            blur-[100px]
          "
        />

        {/* =====================================================
            FLOATING PARTICLES
        ====================================================== */}

        <motion.span
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-[12%]
            top-[25%]
            h-1.5
            w-1.5
            rounded-full
            bg-[#f59e0b]
            shadow-[0_0_12px_rgba(245,158,11,0.8)]
          "
        />

        <motion.span
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.9, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 4,
            delay: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-[72%]
            top-[22%]
            h-1
            w-1
            rounded-full
            bg-[#f59e0b]
            shadow-[0_0_12px_rgba(245,158,11,0.8)]
          "
        />

        <motion.span
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3.5,
            delay: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            right-[18%]
            top-[55%]
            h-1.5
            w-1.5
            rounded-full
            bg-[#f59e0b]
            shadow-[0_0_12px_rgba(245,158,11,0.8)]
          "
        />

        {/* =====================================================
            HERO CONTENT
        ====================================================== */}

        <div className="relative z-10 flex min-h-[72vh] md:min-h-[82vh] items-center">

          <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24">

            <div className="max-w-3xl text-white">

              {/* Eyebrow */}
              <FadeUp>
                <div className="mb-5 flex items-center gap-3">

                  <div className="h-0.5 w-10 bg-[#f59e0b] sm:w-12" />

                  <p
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.2em]
                      text-[#f59e0b]
                      sm:text-xs
                      md:text-sm
                    "
                  >
                    Youth for a Brighter Tomorrow
                  </p>

                </div>
              </FadeUp>

              {/* Heading */}
              <FadeUp>
                <h1
                  className="
                    font-serif
                    text-4xl
                    font-light
                    leading-[1]
                    tracking-tight
                    sm:text-5xl
                    md:text-6xl
                    lg:text-7xl
                  "
                >
                  Discover the Wisdom
                  <br />

                  <span className="italic text-[#f59e0b]">
                    Within
                  </span>
                </h1>
              </FadeUp>

              {/* Decorative divider */}
              <FadeUp>
                <div className="my-5 flex items-center gap-3 sm:my-7">

                  <div className="h-px w-14 bg-white/50 sm:w-20" />

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
                      h-2
                      w-2
                      rotate-45
                      bg-[#f59e0b]
                    "
                  />

                  <div className="h-px w-6 bg-white/30 sm:w-10" />

                </div>
              </FadeUp>

              {/* Description */}
              <FadeUp>
                <p
                  className="
                    max-w-xl
                    text-sm
                    font-light
                    leading-relaxed
                    text-white/90
                    sm:text-base
                    md:text-lg
                  "
                >
                  Explore timeless spiritual wisdom through thoughtfully
                  designed courses that inspire conscious living, meaningful
                  relationships and a deeper understanding of life.
                </p>
              </FadeUp>

              {/* Buttons */}
              <FadeUp>
                <div className="mt-7 flex flex-wrap gap-3 sm:mt-9">

                  <motion.button
                    onClick={scrollToFeatured}
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        "0 10px 35px rgba(245,158,11,0.35)",
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                    className="
                      rounded-full
                      bg-[#f59e0b]
                      px-5
                      py-2.5
                      text-xs
                      font-semibold
                      tracking-wide
                      text-green-950
                      transition
                      sm:px-6
                      sm:py-3
                      sm:text-sm
                    "
                  >
                    Explore Courses
                    <span className="ml-2">→</span>
                  </motion.button>

                  <Link to="/lms/dashboard">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255,255,255,0.15)",
                      }}
                      whileTap={{
                        scale: 0.96,
                      }}
                      className="
                        rounded-full
                        border
                        border-white/40
                        bg-white/5
                        px-5
                        py-2.5
                        text-xs
                        font-semibold
                        tracking-wide
                        text-white
                        backdrop-blur-sm
                        transition
                        sm:px-6
                        sm:py-3
                        sm:text-sm
                      "
                    >
                      My Dashboard
                    </motion.button>
                  </Link>

                </div>
              </FadeUp>

              {/* Bottom tagline */}
              <FadeUp>
                <div className="mt-7 flex items-center gap-3 text-[10px] text-white/70 sm:mt-9 sm:text-xs">

                  <span className="h-px w-7 bg-[#f59e0b] sm:w-10" />

                  <span className="uppercase tracking-[0.18em]">
                    Learn • Reflect • Grow
                  </span>

                </div>
              </FadeUp>

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
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
          className="
            absolute
            bottom-5
            left-1/2
            z-20
            -translate-x-1/2
            text-xl
            text-white
            sm:bottom-7
          "
        >
          ↓
        </motion.div>

        {/* Amber bottom border */}
        <div
          className="
            absolute
            bottom-0
            left-0
            z-20
            h-0.5
            w-full
            bg-gradient-to-r
            from-transparent
            via-[#f59e0b]
            to-transparent
          "
        />
      </section>

      {/* =====================================================
          COURSES SECTION
      ====================================================== */}

      <section
        id="featured-courses"
        className="
          relative
          overflow-hidden
          bg-[#faf8f3]
          px-5
          py-16
          sm:px-8
          md:px-12
          lg:px-20
        "
      >

        {/* Decorative background glow */}
        <div
          className="
            pointer-events-none
            absolute
            -right-32
            top-20
            h-72
            w-72
            rounded-full
            bg-[#f59e0b]/10
            blur-[100px]
          "
        />

        <div className="relative z-10 mx-auto max-w-7xl">

          {/* Section heading */}
          <FadeUp>
            <div className="mb-10 text-center">

              <div className="mb-3 flex items-center justify-center gap-3">

                <div className="h-px w-10 bg-[#f59e0b]" />

                <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#1f5d42]">
                  Learning Journey
                </span>

                <div className="h-px w-10 bg-[#f59e0b]" />

              </div>

              <h2
                className="
                  font-serif
                  text-3xl
                  font-semibold
                  text-[#1f5d42]
                  sm:text-4xl
                "
              >
                Our Youth Courses
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                Discover courses designed to help young minds learn,
                reflect and grow through timeless wisdom.
              </p>

            </div>
          </FadeUp>

          {/* Courses */}
          {isLoading ? (

            <div className="flex w-full flex-col items-center justify-center py-16">

              <div
                className="
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-4
                  border-[#f59e0b]/20
                  border-t-[#f59e0b]
                "
              />

              <p className="mt-4 text-sm font-medium text-gray-500">
                Fetching youth courses...
              </p>

            </div>

          ) : courses.length === 0 ? (

            <div className="mx-auto max-w-lg rounded-2xl border border-[#1f5d42]/10 bg-white p-8 text-center shadow-sm">

              <div className="mb-3 text-3xl text-[#f59e0b]">
                ✦
              </div>

              <p className="text-gray-600">
                No youth courses are available yet.
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Admin can add courses from the Admin Portal.
              </p>

            </div>

          ) : (

            <div
              className="
                grid
                grid-cols-1
                gap-6
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >
              {courses.map((course) => (

                <FadeUp key={course._id}>
                  <div className="h-full transition-transform duration-300 hover:-translate-y-1">

                    <CourseCard
                      imageUrl={course.imgUrl}
                      title={course.title}
                      price={course.price}
                      courseId={course._id}
                    />

                  </div>
                </FadeUp>

              ))}
            </div>

          )}

          {/* View all */}
          <FadeUp>
            <div className="mt-12 text-center">

              <Link to="/lms">

                <button
                  className="
                    rounded-full
                    border
                    border-[#1f5d42]/20
                    bg-white
                    px-6
                    py-2.5
                    text-sm
                    font-semibold
                    text-[#1f5d42]
                    shadow-sm
                    transition-all
                    duration-300
                    hover:border-[#f59e0b]
                    hover:bg-[#1f5d42]
                    hover:text-white
                    hover:shadow-lg
                  "
                >
                  View All Categories
                  <span className="ml-2">→</span>
                </button>

              </Link>

            </div>
          </FadeUp>

        </div>
      </section>

      {/* =====================================================
          QUOTE SECTION
      ====================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#1f5d42]
          px-6
          py-16
          text-center
          sm:px-10
        "
      >

        {/* Amber glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-72
            w-72
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#f59e0b]/10
            blur-[100px]
          "
        />

        <div className="relative z-10 mx-auto max-w-3xl">

          <FadeUp>

            <div className="mb-5 flex items-center justify-center gap-3">

              <div className="h-px w-12 bg-[#f59e0b]" />

              <span className="text-[#f59e0b]">
                ✦
              </span>

              <div className="h-px w-12 bg-[#f59e0b]" />

            </div>

            <blockquote
              className="
                font-serif
                text-xl
                font-light
                italic
                leading-relaxed
                text-white
                sm:text-2xl
                md:text-3xl
              "
            >
              "Inquiries in submission constitute the proper combination
              for spiritual understanding."
            </blockquote>

          </FadeUp>

          <FadeUp>

            <p
              className="
                mt-5
                font-serif
                text-sm
                text-white/70
                sm:text-base
              "
            >
              — A. C. Bhaktivedanta Swami Prabhupada
            </p>

          </FadeUp>

        </div>

        {/* Bottom decoration */}
        <div
          className="
            absolute
            bottom-0
            left-0
            h-0.5
            w-full
            bg-gradient-to-r
            from-transparent
            via-[#f59e0b]
            to-transparent
          "
        />

      </section>

    </div>
  );
}

