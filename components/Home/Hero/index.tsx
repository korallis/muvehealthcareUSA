// components/Hero.tsx
"use client";
import Image from "next/image";
import { motion } from "framer-motion";

interface HeroProps {
  title?: string;
  subtitle?: string;
  patternImage?: string;
  personImage?: string;
  button1Text?: string;
  button1Link?: string;
  button2Text?: string;
  button2Link?: string;
}

export default function Hero({
  title,
  subtitle,
  patternImage,
  personImage,
  button1Text,
  button1Link,
  button2Text,
  button2Link,
}: HeroProps) {
  return (
    <section className="relative w-full bg-[#918CF2] overflow-hidden min-h-screen lg:min-h-0">
      <motion.img
        src={patternImage || "/hero-pattern.svg"}
        alt=""
        className="absolute opacity-30 pointer-events-none w-full aspect-square max-w-sm left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:inset-0 md:w-[900px] md:h-[800px] md:-ml-[120px] md:left-0 md:top-0 md:translate-x-0 md:translate-y-0 md:max-w-none"
        style={{
          maskImage: "radial-gradient(circle, black 50%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle, black 50%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pb-12 lg:pb-0">
        <motion.div
          /* ADDED: z-40 (safety), h-auto (flexible height), and overflow-visible */
          className="lg:absolute lg:top-20 lg:right-0 lg:w-[55%] h-auto pt-12 md:pt-20 lg:pt-0 z-40 overflow-visible"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-hero-header">
            {title ? (
              title
            ) : (
              <>
                {/* ADDED: pb-1 and leading-snug to prevent the span from clipping its own background */}
                <span className="bg-lightblue px-2 pb-1 rounded-md inline-block mb-2 lg:mb-0 leading-snug">
                  Redefining
                </span>{" "}
                the healthcare journey for everyone, everywhere.
              </>
            )}
          </h2>
        </motion.div>

        <div className="relative mt-8 lg:mt-16 flex flex-col lg:flex-row justify-center lg:justify-start">
          <motion.div
            className="relative z-30 pointer-events-none w-[115%] -mx-[7.5%] sm:w-[110%] sm:-mx-[5%] md:w-full md:mx-0 lg:w-fit lg:max-w-none mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Image
              src={personImage || "/waist-up.png"}
              alt="Person"
              width={1000}
              height={1000}
              className="object-contain"
              priority
            />
          </motion.div>

          <motion.div
            className="hidden lg:grid absolute top-[540px] -translate-y-1/2 left-[550px] z-10 bg-lightblue p-10 rounded-3xl w-[720px] grid-cols-[1fr_4fr] gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div></div>
            <div className="text-left">
              <p className="text-hero-body text-[#0A0440]">
                {subtitle ||
                  "“We exist to make care feel human again. Empowering people to live with dignity, independence, and connection, and making quality care available to every community we serve.”"}
              </p>
              <motion.div className="mt-6 flex flex-wrap justify-start gap-4">
                <motion.a
                  href={button1Link || "About"}
                  className="px-6 py-3 bg-[#4A4CFF] text-buttons text-white rounded-full hover:bg-[#3d3fff] cursor-pointer"
                >
                  {button1Text || "Learn More"}
                </motion.a>
                <motion.a
                  href={button2Link || "#"}
                  target="_blank"
                  className="px-6 py-3 border-2 border-[#0A0440] text-[#0A0440] text-buttons rounded-full hover:bg-[#0A0440] hover:text-white transition-all"
                >
                  {button2Text || "Make a Referral"}
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="lg:hidden relative z-40 -mt-10 md:-mt-20 bg-[#00E1D6] p-8 sm:p-10 rounded-3xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p className="text-[#0A0440] text-hero-body font-medium">
            {subtitle ||
              "““We exist to make care feel human again. Empowering people to live with dignity, independence, and connection, and making quality care available to every community we serve.”"}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href={button1Link || "About"}
              className="px-8 py-4 bg-[#4A4CFF] text-white text-center text-buttons rounded-full"
            >
              Learn More
            </a>
            <a
              href={button2Link || "#"}
              className="px-8 py-4 border-2 border-[#0A0440] text-[#0A0440] text-center text-buttons rounded-full transition-colors"
            >
              Make a Referral
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
