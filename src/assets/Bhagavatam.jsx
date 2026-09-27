import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiArrowUpRight,
  FiPhone,
} from "react-icons/fi";

const BhagavatamFeature = () => {
  return (
    <motion.section
      className="w-full bg-[#f7efe2] py-3 sm:py-6 md:py-8 lg:py-12"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7 }}
    >
      <div
        className="
          relative mx-auto
          w-[calc(100%-1rem)]
          max-w-7xl
          overflow-hidden
          rounded-2xl
          bg-gradient-to-br from-[#fffaf1] to-[#f2dfc1]
          px-4 py-5

          shadow-[0_12px_35px_rgba(80,50,20,0.12)]

          sm:w-[calc(100%-2rem)]
          sm:rounded-[24px]
          sm:px-7 sm:py-8

          md:px-10 md:py-10

          lg:rounded-[28px]
          lg:px-14 lg:py-14
        "
      >
        {/* Decorative background */}
        <div
          className="
            pointer-events-none
            absolute -right-20 -top-20
            h-48 w-48
            rounded-full
            bg-[#acb108]/10
            blur-3xl
            sm:h-64 sm:w-64
          "
        />

        <div
          className="
            pointer-events-none
            absolute -bottom-24 -left-20
            h-48 w-48
            rounded-full
            bg-[#8b5e34]/10
            blur-3xl
            sm:h-64 sm:w-64
          "
        />

        {/* Badge */}
        <div
          className="
            relative
            mb-5
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-[#8b5e34]/10
            px-3 py-1.5
            text-[11px]
            font-bold
            uppercase
            tracking-wider
            text-[#8b5e34]

            sm:mb-7
            sm:px-4 sm:py-2
            sm:text-sm
          "
        >
          <FiBookOpen
            aria-hidden="true"
            className="h-4 w-4"
          />

          <span>Śrīmad-Bhāgavatam</span>
        </div>

        {/* Main content */}
        <div
          className="
            relative
            flex
            flex-col
            gap-5

            sm:gap-8

            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:gap-12
          "
        >
          {/* LEFT CONTENT */}
          <div
            className="
              min-w-0
              flex-1

              text-center

              lg:text-left
            "
          >
            {/* Eyebrow */}
            <p
              className="
                mb-2
                text-[11px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-[#9a6a3a]

                sm:mb-3
                sm:text-sm
              "
            >
              Bring timeless wisdom into your home
            </p>

            {/* Heading */}
            <h2
              className="
                m-0
                text-[2rem]
                font-bold
                leading-[1.08]
                tracking-tight
                text-[#4a301d]

                sm:text-[2.6rem]
                md:text-[3rem]
                lg:text-[3.4rem]
                xl:text-[3.8rem]
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
                mx-auto
                mt-4
                max-w-xl
                text-[13px]
                leading-6
                text-[#625344]

                sm:mt-5
                sm:text-base
                sm:leading-7

                lg:mx-0
              "
            >
              For one who regularly studies Śrīmad-Bhāgavatam,
              each letter carries the merit of giving a Kapilā cow
              in charity.
            </p>

            {/* Source */}
            <p
              className="
                mt-1.5
                text-xs
                italic
                text-[#8b6b4a]

                sm:mt-2
                sm:text-sm
              "
            >
              — Padma Purāṇa
            </p>

            {/* CTA + Contact */}
            <div
              className="
                mt-5
                flex
                flex-col
                items-center
                justify-center
                gap-3

                sm:mt-6
                sm:flex-row
                sm:flex-wrap

                lg:justify-start
              "
            >
              {/* Button */}
              <a
                href="https://forms.gle/rVodJUC1FQBCB7yX9"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  min-h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#8d9206]
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-[#fffaf1]
                  no-underline

                  shadow-[0_7px_18px_rgba(100,60,25,0.18)]

                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#8b7203]
                  hover:shadow-[0_10px_22px_rgba(100,60,25,0.25)]

                  sm:w-auto
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
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  whitespace-nowrap
                  text-[12px]

                  sm:text-sm
                "
              >
                <span className="text-[#3f3329]">
                  For more information:
                </span>

                <a
                  href="tel:+917047582554"
                  className="
                    inline-flex
                    items-center
                    gap-1
                    font-semibold
                    text-blue-500
                    no-underline
                    hover:underline

                    sm:text-base
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

          {/* RIGHT IMAGE */}
          <div
            className="
              flex
              w-full
              shrink-0
              justify-center

              sm:mt-1

              lg:mt-0
              lg:w-[44%]
              xl:w-[45%]
            "
          >
            <img
              src="/Bhagwatam.png"
              alt="Śrīmad-Bhāgavatam"
              className="
                block
                w-[300px]
                max-w-[92%]
                object-contain

                drop-shadow-[12px_16px_22px_rgba(70,40,10,0.18)]

                transition-transform
                duration-300
                hover:-translate-y-1

                sm:w-[360px]
                sm:max-w-[85%]

                md:w-[410px]

                lg:w-[420px]
                lg:max-w-full

                xl:w-[480px]
              "
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default BhagavatamFeature;