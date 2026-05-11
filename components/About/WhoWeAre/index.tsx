"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const MobileReadMore = ({
  children,
  limit = 120,
}: {
  children: string;
  limit?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (children.length <= limit) return <p>{children}</p>;

  return (
    <div>
      <p>{isExpanded ? children : `${children.substring(0, limit)}...`}</p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 flex items-center gap-1 text-sm font-bold text-[#1F2A44] md:hidden"
      >
        {isExpanded ? "Read Less" : "Read More"}
        <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown size={18} />
        </motion.span>
      </button>
    </div>
  );
};

interface WhoWeAreProps {
  title?: string;
  subtitleWho?: string;
  subtitleAre?: string;
  introText?: string;
  mainBody?: string;
  buttonText?: string;
  buttonPath?: string;
  image?: string;
}

export default function WhoWeAre({
  title = "About",
  subtitleWho = "Who",
  subtitleAre = "We Are?",
  introText = "MUVE Healthcare Group exists to make quality care human, accessible, and empowering.",
  mainBody = "We bring together specialist services, from supported living and residential care to community, mental health, and children’s services, all united by one purpose: to move care forward. Our teams are guided by compassion, professionalism, and respect. Every day, we work alongside individuals, families, and local authorities to deliver meaningful, person-centred care that helps people live with confidence, dignity, and independence.",
  buttonText = "Meet The Team",
  buttonPath = "/team",
  image = "/Section_ImageRight.png",
}: WhoWeAreProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, x: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <section id="who-we-are" className="w-full bg-purple py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h1
            variants={textVariants}
            className="text-white font-extrabold text-5xl md:text-6xl leading-tight"
          >
            {title}
          </motion.h1>

          <motion.h2
            variants={textVariants}
            className="mt-4 text-subheading text-navyblue leading-snug"
          >
            <span className="bg-lightblue px-3 py-1">{subtitleWho}</span>{" "}
            <span>{subtitleAre}</span>
          </motion.h2>

          <motion.div
            variants={textVariants}
            className="mt-8 space-y-6 text-about text-navyblue leading-relaxed"
          >
            <p>{introText}</p>

            <div className="hidden md:block">
              <p className="whitespace-pre-line">{mainBody}</p>
            </div>

            <div className="flex justify-left mt-10">
              <motion.a
                href={buttonPath}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-buttons bg-navyblue text-white px-10 py-3 rounded-full inline-block cursor-pointer"
              >
                {buttonText}
              </motion.a>
            </div>

            <div className="md:hidden">
              <MobileReadMore limit={200}>{mainBody}</MobileReadMore>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={imageVariants}
          className="flex justify-center md:justify-end relative"
        >
          <div className="overflow-hidden flex items-center justify-center">
            <motion.img
              src={image}
              alt="Who We Are"
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
