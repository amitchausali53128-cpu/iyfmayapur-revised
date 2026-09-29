import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CourseCard } from "../components/Card";
import { Link } from "react-router-dom";
import { getCourses } from "../utils/lmsState";
import FadeUp from "../utils/motions/FadeUp";

export default function VedicCourses() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchVedicCourses() {
            try {
                setIsLoading(true);
                const allCourses = await getCourses();

                const vedicCourses = (allCourses || []).filter(
                    (c) => c.category === "Vedic"
                );

                setCourses(vedicCourses);
            } catch (err) {
                console.error("Error loading Vedic courses:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchVedicCourses();
    }, []);

    const scrollToFeatured = () => {
        const featuredSection =
            document.getElementById("featured-courses");

        if (featuredSection) {
            featuredSection.scrollIntoView({
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="w-full overflow-hidden bg-[#faf8f3]">

            {/* =====================================================
                HERO
            ====================================================== */}
            <section
                className="
                    relative flex
                    min-h-[560px]
                    h-[78vh]
                    md:h-[88vh]
                    w-full
                    items-center
                    overflow-hidden
                    bg-black
                    px-5
                    py-16
                    text-white
                "
            >

                {/* Background Image */}
                <motion.div
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{
                        duration: 1.8,
                        ease: "easeOut",
                    }}
                    className="
                        absolute
                        inset-0
                        bg-[url('/dev.jpg')]
                        bg-cover
                        bg-center
                        md:bg-top
                    "
                />

                {/* Dark Cinematic Overlay */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-black/45
                    "
                />

                {/* Bottom Gradient */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black
                        via-black/45
                        to-black/20
                    "
                />

                {/* Left Cinematic Gradient */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-r
                        from-black/65
                        via-black/20
                        to-transparent
                    "
                />

                {/* Amber Glow */}
                <motion.div
                    animate={{
                        opacity: [0.25, 0.45, 0.25],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="
                        absolute
                        -bottom-32
                        left-1/2
                        h-[300px]
                        w-[300px]
                        -translate-x-1/2
                        rounded-full
                        bg-[#f59e0b]/20
                        blur-[100px]
                        md:h-[450px]
                        md:w-[450px]
                    "
                />

                {/* =================================================
                    Floating Particles
                ================================================== */}

                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        opacity: [0.25, 0.6, 0.25],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                    }}
                    className="
                        absolute
                        left-[12%]
                        top-[25%]
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-[#f59e0b]
                    "
                />

                <motion.div
                    animate={{
                        y: [0, 18, 0],
                        opacity: [0.2, 0.55, 0.2],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        delay: 1,
                    }}
                    className="
                        absolute
                        right-[18%]
                        top-[32%]
                        h-1
                        w-1
                        rounded-full
                        bg-amber-300
                    "
                />

                <motion.div
                    animate={{
                        y: [0, -12, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        delay: 2,
                    }}
                    className="
                        absolute
                        right-[30%]
                        bottom-[30%]
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-[#f59e0b]
                    "
                />

                {/* =================================================
                    HERO CONTENT
                ================================================== */}

                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        w-full
                        max-w-5xl
                        text-center
                    "
                >
                    <FadeUp>

                        {/* Eyebrow */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="
                                mb-4
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-[0.3em]
                                text-[#f59e0b]
                                sm:text-xs
                                md:text-sm
                            "
                        >
                            IYF Mayapur • Vedic Education
                        </motion.p>

                        {/* Heading */}
                        <h1
                            className="
                                mx-auto
                                max-w-4xl
                                font-serif
                                text-4xl
                                font-semibold
                                leading-[1.05]
                                tracking-tight
                                text-white
                                drop-shadow-2xl
                                sm:text-5xl
                                md:text-6xl
                                lg:text-7xl
                            "
                        >
                            Vedic Scripture
                            <br />

                            <span className="italic text-[#f59e0b]">
                                & Philosophy
                            </span>
                        </h1>

                        {/* Decorative Line */}
                        <div
                            className="
                                mx-auto
                                mt-7
                                flex
                                items-center
                                justify-center
                                gap-3
                            "
                        >
                            <span
                                className="
                                    h-px
                                    w-14
                                    bg-white/60
                                    sm:w-20
                                "
                            />

                            <span
                                className="
                                    text-lg
                                    text-[#f59e0b]
                                "
                            >
                                ✦
                            </span>

                            <span
                                className="
                                    h-px
                                    w-14
                                    bg-white/60
                                    sm:w-20
                                "
                            />
                        </div>

                        {/* Description */}
                        <p
                            className="
                                mx-auto
                                mt-7
                                max-w-2xl
                                px-2
                                font-sans
                                text-sm
                                leading-7
                                text-white/85
                                sm:text-base
                                md:text-lg
                                md:leading-8
                            "
                        >
                            Deepen your spiritual understanding through
                            authorized systematic study of Vedic texts,
                            designed to nurture character, values, and
                            profound scriptural realization.
                        </p>

                        {/* Tagline */}
                        <p
                            className="
                                mt-5
                                font-serif
                                text-sm
                                italic
                                tracking-wide
                                text-white/70
                                sm:text-base
                            "
                        >
                            Learn • Reflect • Realize
                        </p>

                        {/* Buttons */}
                        <div
                            className="
                                mt-8
                                flex
                                flex-col
                                items-center
                                justify-center
                                gap-3
                                sm:flex-row
                                sm:gap-4
                            "
                        >
                            <motion.button
                                whileHover={{
                                    y: -3,
                                    scale: 1.02,
                                }}
                                whileTap={{
                                    scale: 0.98,
                                }}
                                onClick={scrollToFeatured}
                                className="
                                    w-full
                                    max-w-[240px]
                                    rounded-full
                                    bg-[#f59e0b]
                                    px-7
                                    py-3.5
                                    text-sm
                                    font-semibold
                                    text-slate-950
                                    shadow-[0_8px_30px_rgba(245,158,11,0.25)]
                                    transition
                                    hover:bg-[#fbbf24]
                                    sm:w-auto
                                "
                            >
                                Explore Vedic Courses
                            </motion.button>

                            <Link
                                to="/lms/dashboard"
                                className="w-full sm:w-auto"
                            >
                                <motion.div
                                    whileHover={{
                                        y: -3,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    className="
                                        mx-auto
                                        w-full
                                        max-w-[240px]
                                        rounded-full
                                        border
                                        border-white/35
                                        bg-white/10
                                        px-7
                                        py-3.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        backdrop-blur-md
                                        transition
                                        hover:bg-white/20
                                        sm:w-auto
                                    "
                                >
                                    My Dashboard
                                </motion.div>
                            </Link>
                        </div>
                    </FadeUp>
                </div>

                {/* =================================================
                    Bottom Scroll Indicator
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
                        duration: 1,
                    }}
                    className="
                        absolute
                        bottom-6
                        left-1/2
                        z-10
                        -translate-x-1/2
                    "
                >
                    <button
                        onClick={scrollToFeatured}
                        className="
                            flex
                            flex-col
                            items-center
                            gap-1
                            text-white/60
                            transition
                            hover:text-[#f59e0b]
                        "
                    >
                        <span className="text-[10px] uppercase tracking-[0.25em]">
                            Explore
                        </span>

                        <motion.span
                            animate={{
                                y: [0, 5, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                            }}
                            className="text-lg"
                        >
                            ↓
                        </motion.span>
                    </button>
                </motion.div>

                {/* Bottom Amber Line */}
                <div
                    className="
                        absolute
                        bottom-0
                        left-1/2
                        h-px
                        w-2/3
                        -translate-x-1/2
                        bg-gradient-to-r
                        from-transparent
                        via-[#f59e0b]
                        to-transparent
                        opacity-70
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
                    px-4
                    py-16
                    sm:px-8
                    md:py-20
                    lg:py-24
                "
            >

                {/* Background Glow */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-0
                        h-[300px]
                        w-[500px]
                        -translate-x-1/2
                        rounded-full
                        bg-amber-100/40
                        blur-[100px]
                    "
                />

                <div className="relative z-10 mx-auto max-w-7xl">

                    {/* Section Header */}
                    <FadeUp>
                        <div className="text-center">

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.25em]
                                    text-[#f59e0b]
                                "
                            >
                                Study • Understand • Practice
                            </p>

                            <h2
                                className="
                                    mt-3
                                    font-serif
                                    text-3xl
                                    font-semibold
                                    text-[#1f5d42]
                                    sm:text-4xl
                                    md:text-5xl
                                "
                            >
                                Our Vedic Courses
                            </h2>

                            {/* Decorative Element */}
                            <div
                                className="
                                    mx-auto
                                    mt-5
                                    flex
                                    items-center
                                    justify-center
                                    gap-3
                                "
                            >
                                <span
                                    className="
                                        h-px
                                        w-12
                                        bg-[#1f5d42]/40
                                    "
                                />

                                <span
                                    className="
                                        text-[#f59e0b]
                                    "
                                >
                                    ✦
                                </span>

                                <span
                                    className="
                                        h-px
                                        w-12
                                        bg-[#1f5d42]/40
                                    "
                                />
                            </div>

                            <p
                                className="
                                    mx-auto
                                    mt-5
                                    max-w-2xl
                                    text-sm
                                    leading-7
                                    text-slate-600
                                    sm:text-base
                                "
                            >
                                Explore timeless Vedic knowledge through
                                structured courses that connect ancient
                                wisdom with meaningful spiritual living.
                            </p>
                        </div>
                    </FadeUp>

                    {/* =================================================
                        COURSE CARDS
                    ================================================== */}

                    <div
                        className="
                            mt-12
                            grid
                            grid-cols-1
                            justify-items-center
                            gap-7
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-4
                        "
                    >
                        {isLoading ? (

                            /* Loading */
                            <div
                                className="
                                    col-span-full
                                    flex
                                    w-full
                                    flex-col
                                    items-center
                                    justify-center
                                    py-16
                                "
                            >
                                <div
                                    className="
                                        h-11
                                        w-11
                                        animate-spin
                                        rounded-full
                                        border-4
                                        border-amber-500
                                        border-t-transparent
                                    "
                                />

                                <p
                                    className="
                                        mt-4
                                        text-sm
                                        font-medium
                                        text-slate-500
                                    "
                                >
                                    Discovering Vedic courses...
                                </p>
                            </div>

                        ) : courses.length === 0 ? (

                            /* Empty State */
                            <div
                                className="
                                    col-span-full
                                    mx-auto
                                    max-w-xl
                                    rounded-2xl
                                    border
                                    border-amber-100
                                    bg-white
                                    px-6
                                    py-12
                                    text-center
                                    shadow-sm
                                "
                            >
                                <div
                                    className="
                                        mx-auto
                                        mb-5
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-amber-50
                                        text-2xl
                                        text-[#f59e0b]
                                    "
                                >
                                    ✦
                                </div>

                                <h3
                                    className="
                                        font-serif
                                        text-xl
                                        font-semibold
                                        text-[#1f5d42]
                                    "
                                >
                                    Vedic Courses Coming Soon
                                </h3>

                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    "
                                >
                                    No Vedic courses are available yet.
                                    Admin can add courses from the Admin
                                    Portal.
                                </p>
                            </div>

                        ) : (

                            /* Course Cards */
                            courses.map((course) => (
                                <FadeUp key={course._id}>
                                    <motion.div
                                        whileHover={{
                                            y: -6,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                        }}
                                        className="w-full"
                                    >
                                        <CourseCard
                                            imageUrl={course.imgUrl}
                                            title={course.title}
                                            price={course.price}
                                            courseId={course._id}
                                        />
                                    </motion.div>
                                </FadeUp>
                            ))
                        )}
                    </div>

                    {/* View All */}
                    <FadeUp>
                        <div className="mt-12 text-center">
                            <Link to="/lms">
                                <motion.div
                                    whileHover={{
                                        y: -2,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-[#1f5d42]/30
                                        bg-white
                                        px-6
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-[#1f5d42]
                                        shadow-sm
                                        transition
                                        hover:border-[#f59e0b]
                                        hover:bg-amber-50
                                    "
                                >
                                    View All Categories
                                    <span className="text-[#f59e0b]">
                                        →
                                    </span>
                                </motion.div>
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
                    px-5
                    py-16
                    text-center
                    sm:px-12
                    md:py-20
                "
            >

                {/* Decorative Glow */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-1/2
                        h-[300px]
                        w-[500px]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-[#f59e0b]/10
                        blur-[100px]
                    "
                />

                {/* Decorative Top Line */}
                <div
                    className="
                        absolute
                        left-1/2
                        top-0
                        h-px
                        w-2/3
                        -translate-x-1/2
                        bg-gradient-to-r
                        from-transparent
                        via-[#f59e0b]
                        to-transparent
                    "
                />

                <div className="relative z-10 mx-auto max-w-4xl">

                    <FadeUp>
                        <div
                            className="
                                mb-6
                                text-3xl
                                text-[#f59e0b]
                            "
                        >
                            ✦
                        </div>
                    </FadeUp>

                    <FadeUp>
                        <blockquote
                            className="
                                font-serif
                                text-xl
                                italic
                                leading-relaxed
                                text-white
                                sm:text-2xl
                                md:text-3xl
                            "
                        >
                            "This system of Bhagavad-gita is not a new thing.
                            It is eternal."
                        </blockquote>
                    </FadeUp>

                    <FadeUp>
                        <div
                            className="
                                mx-auto
                                mt-7
                                flex
                                items-center
                                justify-center
                                gap-3
                            "
                        >
                            <span
                                className="
                                    h-px
                                    w-10
                                    bg-white/30
                                "
                            />

                            <span
                                className="
                                    text-sm
                                    font-serif
                                    text-[#f59e0b]
                                "
                            >
                                A. C. Bhaktivedanta Swami Prabhupada
                            </span>

                            <span
                                className="
                                    h-px
                                    w-10
                                    bg-white/30
                                "
                            />
                        </div>
                    </FadeUp>

                </div>
            </section>
        </div>
    );
}