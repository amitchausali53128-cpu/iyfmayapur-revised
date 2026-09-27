import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiArrowUpRight,
  FiPhone,
} from "react-icons/fi";

const BhagavatamFeature = () => {
  return (
    <motion.section
      className="w-full bg-[#f7efe2] py-10 sm:py-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div
        className="
          relative mx-auto w-[calc(100%-2rem)] max-w-7xl
          overflow-hidden rounded-[28px]
          bg-gradient-to-br from-[#fffaf1] to-[#f2dfc1]
          px-6 py-10
          shadow-[0_18px_50px_rgba(80,50,20,0.12)]
          sm:px-10 sm:py-12
          lg:px-16 lg:py-14
        "
      >
        {/* Badge */}
        <div
          className="
            mb-7 inline-flex items-center gap-2
            rounded-full
            bg-[#8b5e34]/10
            px-4 py-2
            text-xs font-bold uppercase tracking-wider
            text-[#8b5e34]
            sm:text-sm
          "
        >
          <FiBookOpen
            aria-hidden="true"
            className="h-[17px] w-[17px]"
          />

          <span>Śrīmad-Bhāgavatam</span>
        </div>

        {/* Main Content */}
        <div
          className="
            flex flex-col items-center justify-between
            gap-10
            lg:flex-row lg:gap-14
          "
        >
          {/* Text */}
          <div className="min-w-0 flex-1">

            {/* Eyebrow */}
            <p
              className="
                mb-3
                text-sm font-bold uppercase tracking-[0.08em]
                text-[#9a6a3a]
              "
            >
              Bring timeless wisdom into your home
            </p>

            {/* Heading */}
            <h2
              className="
                m-0
                text-[2.4rem] font-bold leading-[1.05]
                text-[#4a301d]
                sm:text-[3rem]
                lg:text-[3.8rem]
              "
            >
              Invite
              <br />

              <span className="text-[#acb108]">
                Śrīmad-Bhāgavatam
              </span>

              <br />

              to your home
            </h2>

            {/* Description */}
            <p
              className="
                mt-5 max-w-2xl
                text-[0.95rem] leading-7
                text-[#625344]
                sm:text-base sm:leading-7
              "
            >
              For one who regularly studies Śrīmad-Bhāgavatam, each
              letter carries the merit of giving a Kapilā cow in
              charity.
            </p>

            {/* Source */}
            <p
              className="
                mt-2
                text-sm italic
                text-[#8b6b4a]
              "
            >
              — Padma Purāṇa
            </p>

            {/* Button + Contact */}
            <div
              className="
                mt-6
                flex flex-wrap items-center gap-4
              "
            >
              {/* Get Bhagavatam Button */}
              <a
                href="https://forms.gle/rVodJUC1FQBCB7yX9"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex min-h-12
                  items-center justify-center gap-2
                  rounded-xl
                  bg-[#8d9206]
                  px-5 py-3
                  text-sm font-bold text-[#fffaf1]
                  no-underline
                  shadow-[0_8px_20px_rgba(100,60,25,0.18)]
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#8b7203]
                  hover:shadow-[0_12px_25px_rgba(100,60,25,0.25)]
                "
              >
                <span>Get Śrīmad-Bhāgavatam</span>
                <FiArrowUpRight
                  aria-hidden="true"
                  className="h-[17px] w-[17px] shrink-0"
                />
              </a>

              {/* Contact */}
              <div
                className="
                  inline-flex items-center gap-1.5
                  whitespace-nowrap
                  text-xs
                  sm:text-sm
                "
              >
                <span className="text-black text-lg">
                  For more information:
                </span>

                <a
                  href="tel:+917047582554"
                  className="
                    inline-flex items-center gap-1.5
                    font-semibold
                    text-blue-500
                    no-underline
                    hover:underline
                    text-lg
                  "
                >
                  <FiPhone
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0"
                  />

                  <span>+91 70475 82554</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bhagavatam Image */}
          <div className="flex shrink-0 justify-center lg:w-[44%]">
            <img
              src="/Bhagwatam.png"
              alt="Śrīmad-Bhāgavatam"
              className="
                block
                w-[300px]
                max-w-full
                object-contain
                drop-shadow-[15px_20px_25px_rgba(70,40,10,0.18)]
                transition-transform duration-300
                hover:-translate-y-1
                sm:w-[360px]
                md:w-[400px]
                lg:w-[480px]
              "
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default BhagavatamFeature;