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
import Prabhupada from "../../assets/January_20.jpg";
import AnimatedCard from '../../assets/components/AnimatedCard.jsx';
import { cloudinaryAsset } from "../../lib/cloudinary.js";
import AboutHero from "./AboutHero.jsx";
import WhoWeAre from "./WhoWeAre.jsx";

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

// const carouselImages = [
//   "/home/youth1.jpeg",
//   "/home/youth2.jpeg",
//   "/home/youth3.jpeg",
//   "/home/youth4.jpeg",
//   "/home/youth5.jpeg",
//   "/home/youth6.jpeg",
//   "/home/youth8.jpeg",
//   "/home/youth9.jpeg",
//   "/home/youth10.jpeg",
//   "/home/youth11.jpeg",
//   "/home/youth12.jpeg",
//   "/home/youth13.jpeg",
//   "/home/youth14.jpeg",
//   "/home/youth15.jpeg",
//   "/home/youth16.jpeg",
//   "/home/youth17.jpeg",
// ].map((image) => cloudinaryAsset(image, { width: 1600, crop: "limit" }));

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
  // const [isOpen, setIsOpen] = useState(true);
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [quoteImage, setQuoteImage] = useState(dailyQuote.url);
  

  // useEffect(() => {
  //   if (isPaused) return undefined;

  //   // const interval = window.setInterval(() => {
  //   //   setCurrentIndex((previous) => (previous + 1) % carouselImages.length);
  //   // }, 5000);

  //   return () => window.clearInterval(interval);
  // }, [isPaused]);

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
      <AboutHero />
      <WhoWeAre />
      
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