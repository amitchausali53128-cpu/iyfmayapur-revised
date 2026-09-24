import { createElement, useEffect, useState } from "react";
import { motion } from 'framer-motion';
import {
  FiArrowUpRight,
  FiBookOpen,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiUsers,
} from "react-icons/fi";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import Prabhupada from "../assets/January_20.jpg";
import AnimatedCard from '../assets/components/AnimatedCard.jsx';
import { cloudinaryAsset } from "../lib/cloudinary";

const lifeImages = [
  "img0.jpg",
  "img1.jpg",
  "img2.jpg",
  "img3.jpg",
  "img4.jpg",
  "img5.jpg",
  "img6.jpg",
  "img7.jpg",
  "img8.jpg",
  "img11.jpg",
  "img9.jpg",
  "img10.jpg",
].map((img) => cloudinaryAsset(`/life/${img}`, { width: 900, crop: "limit" }));

const homepageGalleryPreview = lifeImages.slice(0, 3);

const getDailyQuote = () => {
  const today = new Date();
  const month = today.toLocaleString("en-US", { month: "long" });
  const day = String(today.getDate()).padStart(2, "0");

  return {
    label: `${month} ${today.getDate()}`,
    url: `https://raw.githubusercontent.com/Namit210/q/main/output/${month}_${day}.jpg`,
  };
};

const carouselImages = [
  "/home/youth1.jpeg",
  "/home/youth2.jpeg",
  "/home/youth3.jpeg",
  "/home/youth4.jpeg",
  "/home/youth5.jpeg",
  "/home/youth6.jpeg",
  "/home/youth8.jpeg",
  "/home/youth9.jpeg",
  "/home/youth10.jpeg",
  "/home/youth11.jpeg",
  "/home/youth12.jpeg",
  "/home/youth13.jpeg",
  "/home/youth14.jpeg",
  "/home/youth15.jpeg",
  "/home/youth16.jpeg",
  "/home/youth17.jpeg",
].map((image) => cloudinaryAsset(image, { width: 1600, crop: "limit" }));

const pathways = [
  {
    icon: FiBookOpen,
    eyebrow: "Learn",
    title: "Wisdom for everyday life",
    description:
      "Explore practical courses rooted in the Bhagavad Gita and timeless Vedic wisdom.",
    link: "/courses",
    label: "Explore courses",
  },
  {
    icon: FiCalendar,
    eyebrow: "Connect",
    title: "Gather, celebrate, grow",
    description:
      "Meet a vibrant youth community through retreats, festivals and weekly gatherings.",
    link: "/events",
    label: "View events",
  },
  {
    icon: FiHeart,
    eyebrow: "Contribute",
    title: "Make your time meaningful",
    description:
      "Use your energy and talents in service while building friendships that last.",
    link: "/seva",
    label: "Discover seva",
  },
];

export default function Home() {
  const dailyQuote = getDailyQuote();
  const [isOpen, setIsOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [quoteImage, setQuoteImage] = useState(dailyQuote.url);
  const visibleCarouselImages = [
    currentIndex,
    (currentIndex + 1) % carouselImages.length,
  ];

  useEffect(() => {
    if (isPaused) return undefined;

    const interval = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % carouselImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const showPrevious = () => {
    setCurrentIndex((previous) =>
      previous === 0 ? carouselImages.length - 1 : previous - 1
    );
  };

  const showNext = () => {
    setCurrentIndex((previous) => (previous + 1) % carouselImages.length);
  };

  return (
    <div className="home-page">
      <motion.section
        className="home-hero"
        aria-label="Life at IYF Mayapur slideshow"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="home-hero__images">
          {visibleCarouselImages.map((imageIndex) => (
            <img
              key={carouselImages[imageIndex]}
              src={carouselImages[imageIndex]}
              alt={`IYF Mayapur youth gathering ${imageIndex + 1}`}
              className={`home-hero__image ${
                imageIndex === currentIndex ? "is-active" : ""
              }`}
              loading={imageIndex === currentIndex ? "eager" : "lazy"}
              fetchPriority={imageIndex === currentIndex ? "high" : "low"}
              decoding="async"
            />
          ))}
        </div>

        <div className="home-hero__shade" />

        <motion.div
          className="home-hero__content home-shell"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        >
          <p className="home-hero__eyebrow">ISKCON Youth Forum · Sridham Mayapur</p>
          <h1>Find your purpose.<br />Live with wisdom.</h1>
          <p className="home-hero__lead">
            A joyful community helping young people discover clarity, character
            and a deeper connection through timeless spiritual wisdom.
          </p>
          <div className="home-hero__actions">
            <Link to="/courses" className="home-button home-button--gold">
              Begin your journey <FiArrowUpRight aria-hidden="true" />
            </Link>
            <Link to="/events" className="home-button home-button--glass">
              Upcoming events
            </Link>
          </div>
        </motion.div>

        <button
          type="button"
          onClick={showPrevious}
          className="home-hero__arrow home-hero__arrow--left"
          aria-label="Show previous image"
        >
          <FiChevronLeft aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={showNext}
          className="home-hero__arrow home-hero__arrow--right"
          aria-label="Show next image"
        >
          <FiChevronRight aria-hidden="true" />
        </button>

        <div className="home-hero__pagination" aria-label="Choose slideshow image">
          {carouselImages.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={index === currentIndex ? "is-active" : ""}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === currentIndex ? "true" : undefined}
            />
          ))}
        </div>
      </motion.section>

      <motion.div
        className="home-highlights home-shell"
        aria-label="IYF highlights"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45 }}
      >
        <div><strong>15+</strong><span>Transformative courses</span></div>
        <div><strong>500+</strong><span>Young lives inspired</span></div>
        <div><FiUsers aria-hidden="true" /><span>A welcoming community</span></div>
      </motion.div>

      {/* Uncompressed, Full-Width Section Wrapper */}
      <div className="w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.section
            className="relative overflow-hidden py-16 md:py-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Background Energetic Glow */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-purple-500/10 rounded-full blur-3xl pointer-events-none" 
              aria-hidden="true" 
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
              
              {/* Left Column: High-Energy Content Block */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                
                {/* Badge / Subtitle */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold tracking-wider uppercase w-fit">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  Who We Are
                </div>

                {/* Main Catchy Heading */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                  Ignite Your Spirit, <br />
                  <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                    Empower Your Future.
                  </span>
                </h2>

                {/* Engaging Description */}
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  The ISKCON Youth Forum (IYF) is a vibrant global movement designed to help young minds discover inner strength, authentic connection, and profound personal growth through timeless wisdom.
                </p>

                {/* Action Link / Button */}
                <div className="pt-2">
                  <Link 
                    to="/sp" 
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gray-900 hover:bg-orange-600 text-white font-medium shadow-lg hover:shadow-orange-500/25 transition-all duration-300 group"
                  >
                    <span>Our Inspiration</span>
                    <FiArrowUpRight className="text-lg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
                  </Link>
                </div>

              </div>

              {/* Right Column: Dynamic Visual & Image Presentation */}
              <div className="lg:col-span-6 relative w-full">
                <div className="home-intro__sun absolute -top-6 -right-6 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl" aria-hidden="true" />
                
                {/* Modern Framed Image with Hover Effect */}
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 z-10 pointer-events-none" />
                  
                  <img 
                    src={cloudinaryAsset("/youth.jpg", { width: 1200, crop: "limit" })} 
                    alt="Who we are at IYF Mayapur" 
                    loading="lazy" 
                    decoding="async"
                    className="w-full h-[380px] sm:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />

                  {/* Floating Glassmorphism Tag */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 backdrop-blur-md bg-white/10 dark:bg-black/30 border border-white/20 p-4 rounded-2xl flex items-center justify-between text-white">
                    <div>
                      <p className="text-xs font-semibold tracking-wider uppercase text-orange-400">Global Movement</p>
                      <p className="text-sm font-medium">Join thousands of vibrant youth</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      ✨
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.section>
        </div>
      </div>

        <motion.section
          className="home-pathways home-shell"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
        >
          <div className="home-pathways__heading">
            <p>There is a place for you here</p>
            <h2>Grow in every dimension of life.</h2>
          </div>
          <div className="home-pathways__grid">
            {pathways.map(({ icon, eyebrow, title, description, link, label }, index) => (
              <AnimatedCard
                key={title}
                element="article"
                variantIndex={index}
                className="home-pathway-card"
              >
                <div className="home-pathway-card__icon">
                  {createElement(icon, { "aria-hidden": true })}
                </div>
                <p>{eyebrow}</p>
                <h3>{title}</h3>
                <span>{description}</span>
                <Link to={link}>{label} <FiArrowUpRight aria-hidden="true" /></Link>
              </AnimatedCard>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="home-quote-wrap"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="home-quote home-shell">
            <div className="home-quote__heading">
              <span className="home-quote__mark" aria-hidden="true">“</span>
              <h2>Prabhupada Daily Quote</h2>
              <span className="home-title-rule" />
            </div>
            <div className="home-quote__image-wrap">
              <img
                src={quoteImage}
                alt={`Srila Prabhupada daily quote for ${dailyQuote.label}`}
                onError={() => setQuoteImage(Prabhupada)}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="home-gallery home-shell"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
        >
          <div className="home-gallery__heading">
            <h2>Life at IYF Mayapur</h2>
            <span className="home-title-rule" />
          </div>

          <Masonry
            breakpointCols={{ default: 3, 900: 2, 600: 1 }}
            className="home-masonry"
            columnClassName="home-masonry__column"
          >
            {homepageGalleryPreview.map((src, index) => (
              <figure className="home-gallery__item" key={src}>
                <img
                  src={src}
                  alt={`Life at IYF Mayapur ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </Masonry>
          <div className="home-gallery__action">
            <Link to="/gallery" className="home-button home-button--dark">
              Explore the gallery <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </motion.section>

        <motion.section
          className="home-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="home-cta__content home-shell">
            <p>Your journey can begin today.</p>
            <h2>Come as you are.<br />Grow into who you can be.</h2>
            <Link to="/events" className="home-button home-button--gold">
              Meet the community <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </motion.section>
    </div>
  );
}