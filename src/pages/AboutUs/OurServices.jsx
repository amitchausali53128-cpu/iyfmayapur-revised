import React from "react";
import { motion } from "motion/react";

const services = [
  {
    number: "01",
    title: "Youth Spiritual Lodging",
    description: "A safe and spiritual home for youth visiting Mayapur.",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Hare_krishna_devote.jpg",
    gradient: "from-orange-400 to-amber-600",
  },
  {
    number: "02",
    title: "Youth Spiritual Food",
    description: "Pure, healthy and sattvic food for body and soul.",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Prasadam_thali.jpg",
    gradient: "from-emerald-400 to-teal-700",
  },
  {
    number: "03",
    title: "Youth Counselling",
    description: "Guidance for a happier, purposeful life.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85",
    gradient: "from-fuchsia-400 to-purple-700",
  },
  {
    number: "04",
    title: "Youth Festivals",
    description: "Celebrating devotion, culture and unity.",
    image: "https://i1.sndcdn.com/artworks-RMRDP8tzqfbFlYeB-7KOHcA-t500x500.jpg",
    gradient: "from-violet-500 to-indigo-700",
  },
  {
    number: "05",
    title: "Youth Gita Distribution",
    description: "Sharing the wisdom of Bhagavad Gita with the world.",
    image: "https://iskconnews.org/media/images/2018/05-May/bk3.jpg",
    gradient: "from-sky-400 to-blue-700",
  },
  {
    number: "06",
    title: "Value Skills Training",
    description: "Managerial, leadership, lingual skills, cooking, driving and more.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
    gradient: "from-teal-400 to-cyan-700",
  },
  {
    number: "07",
    title: "Youth Spiritual Education",
    description: "Bhagavad Gita & Srimad Bhagavatam courses.",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=85",
    gradient: "from-amber-400 to-orange-700",
  },
];

const decorations = [
  { left: "3%", top: "20%", rotate: -25, delay: 0 },
  { left: "8%", top: "75%", rotate: 20, delay: 1 },
  { left: "94%", top: "18%", rotate: 35, delay: 1.5 },
  { left: "90%", top: "76%", rotate: -20, delay: 2 },
  { left: "45%", top: "3%", rotate: 15, delay: 0.5 },
];

const FloatingLeaf = ({ item }) => (
  <motion.div
    className="pointer-events-none absolute z-10"
    style={{ left: item.left, top: item.top }}
    animate={{
      y: [0, -12, 0],
      x: [0, 8, 0],
      rotate: [item.rotate, item.rotate + 12, item.rotate],
      opacity: [0.25, 0.7, 0.25],
    }}
    transition={{
      duration: 5,
      delay: item.delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <path d="M8 33C8 17 19 7 35 8C35 23 24 35 8 33Z" fill="#86A66A" opacity="0.55" />
      <path d="M10 31C18 24 25 17 33 10" stroke="#526B42" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </motion.div>
);

const ServiceCard = ({ service, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 25, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{
      duration: 0.6,
      delay: index * 0.06,
      ease: [0.22, 1, 0.36, 1],
    }}
    whileHover={{ y: -6, scale: 1.015 }}
    className="group relative h-[245px] w-full overflow-hidden rounded-[14px] border border-white/80 bg-white shadow-[0_5px_18px_rgba(0,0,0,0.14)] sm:h-[280px] lg:h-[305px]"
  >
    <div className="relative h-[175px] w-full overflow-hidden bg-gray-100 sm:h-[125px] lg:h-[220px]">
      <motion.img
        src={service.image}
        alt={service.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-center"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/20" />

      <motion.div
        initial={{ x: "-130%" }}
        whileHover={{ x: "130%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />

      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.08, 0.22, 0.08] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/30 blur-3xl"
      />
    </div>

    <div className={`relative h-[100px] bg-gradient-to-br ${service.gradient} px-2.5 pb-2.5 pt-2 text-white sm:h-[155px] sm:px-3 sm:pt-2.5 lg:h-[160px] lg:px-4 lg:pb-4 lg:pt-3`}>
      <motion.div
        animate={{
          x: [-20, 20, -20],
          y: [0, -8, 0],
          opacity: [0.08, 0.25, 0.08],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/30 blur-3xl"
      />

      <motion.h3
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 + index * 0.05 }}
        className="relative z-10 max-w-none text-[12px] font-bold leading-[1.08] sm:text-[16px] lg:text-[19px]"
      >
        {service.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.22 + index * 0.05 }}
        className="relative z-10 mt-1 max-w-none text-[8px] leading-[1.3] text-white/95 sm:text-[10px] lg:mt-2 lg:text-[12px]"
      >
        {service.description}
      </motion.p>

      <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between sm:bottom-3 sm:left-3 sm:right-3 lg:left-4 lg:right-4">
        <motion.span
          initial={{ opacity: 0, x: 8 }}
          whileInView={{ opacity: 0.35, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 + index * 0.05 }}
          className="text-2xl font-semibold leading-none sm:text-3xl"
        >
          {service.number}
        </motion.span>
      </div>
    </div>

    <motion.div
      initial={{ x: "-120%" }}
      whileHover={{ x: "120%" }}
      transition={{ duration: 0.8 }}
      className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-white to-transparent"
    />
  </motion.article>
);

const OurServices = () => {
  const sliderServices = [...services, ...services];

  return (
    <section className="relative overflow-hidden bg-[#fbfaf5] py-5 sm:py-10 lg:py-16">
      <style>{`
        @keyframes serviceScroll {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .service-track {
          display: flex;
          width: max-content;
          animation: serviceScroll 35s linear infinite;
          will-change: transform;
        }

        .service-track:hover {
          animation-play-state: paused;
        }

        @media (max-width: 640px) {
          .service-track {
            animation-duration: 20s;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 top-5 h-64 w-64 rounded-full bg-amber-200/25 blur-[90px]"
        />

        <motion.div
          animate={{
            x: [0, -45, 0],
            y: [0, 25, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-20 -right-32 h-80 w-80 rounded-full bg-green-200/20 blur-[100px]"
        />

        {decorations.map((item, index) => (
          <FloatingLeaf key={`leaf-${index}`} item={item} />
        ))}
      </div>

      <div className="relative z-20 mx-auto max-w-[1500px] px-4 sm:px-8 lg:px-12">
        <div className="mb-4 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                animate={{ rotate: [0, 8, 0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex h-7 w-7 shrink-0 items-center justify-center sm:h-11 sm:w-11"
              >
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none" className="h-7 w-7 sm:h-[42px] sm:w-[42px]">
                  <circle cx="21" cy="21" r="8" stroke="#4C8C43" strokeWidth="2.5" />
                  <path d="M21 3V9M21 33V39M3 21H9M33 21H39M8 8L12 12M30 30L34 34M34 8L30 12M12 30L8 34" stroke="#4C8C43" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </motion.div>

              <div>
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#176653] sm:text-xs sm:tracking-[0.25em]"
                >
                  Our Services
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 }}
                  className="max-w-[300px] font-serif text-[17px] font-semibold leading-tight text-[#172B50] sm:max-w-none sm:text-3xl md:text-4xl"
                >
                  Seven Ways We Serve, One Mission We Share.
                </motion.h2>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative overflow-hidden">
          <div className="service-track gap-2.5 sm:gap-3">
            {sliderServices.map((service, index) => (
              <div
                key={`${service.number}-${index}`}
                className="w-[calc((100vw-2.5rem)/2)] shrink-0 sm:w-[calc((100vw-5rem)/4)] lg:w-[calc((100vw-8rem)/4)]"
              >
                <ServiceCard
                  service={service}
                  index={index % services.length}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-3 h-8 overflow-hidden sm:mt-8 sm:h-12">
        <motion.div
          animate={{ x: ["-5%", "0%", "-5%"] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-16 left-[-5%] h-28 w-[110%] rounded-[50%] bg-[#17372d]"
        />

        {[...Array(8)].map((_, index) => ( 
          <motion.span
            key={index}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#f59e0b]"
            style={{
              left: `${10 + index * 11}%`,
              top: `${8 + (index % 3) * 7}px`,
            }}
            animate={{
              y: [0, -6, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 2.5 + index * 0.2,
              delay: index * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default OurServices;