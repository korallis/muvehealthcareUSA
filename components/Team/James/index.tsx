"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react"; // Install lucide-react or use an SVG

// --- Sub-component for Truncation ---
const MobileReadMore = ({
  text,
  limit = 120,
}: {
  text: string;
  limit?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= limit) return <p>{text}</p>;

  return (
    <div>
      <p>{isExpanded ? text : `${text.substring(0, limit)}...`}</p>
      <button
        type="button"
        aria-expanded={isExpanded}
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

interface JamesProps {
  title?: string;
}
export default function James({ title }: JamesProps) {
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
    <section id="bobby" className="w-full bg-purple py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2
            variants={textVariants}
            className="mt-12 text-subheading text-navyblue leading-snug"
          >
            {" "}
            {title || "James McAlpine"}
            {/* <span>James McAlpine</span> */}
          </motion.h2>

          <motion.h5
            variants={textVariants}
            className="mt-4 text-navyblue leading-snug text-left flex justify-start"
          >
            <span className="bg-lightblue px-4 w-64 py-1 inline-block">
              NI + DIRECTOR
            </span>
          </motion.h5>

          <motion.div
            variants={textVariants}
            className="mt-8 space-y-6 text-about text-navyblue leading-relaxed"
          >
            {/* Wrapped the long paragraph in the ReadMore component */}
            <p>
              MUVE Healthcare Group exists to make quality care human,
              accessible, and empowering.
            </p>

            <div className="hidden md:block">
              <p>
                We bring together specialist services, from supported living and
                residential care to community, mental health, and children’s
                services, all united by one purpose: to move care forward.
              </p>
              <p className="mt-4">
                Our teams are guided by compassion, professionalism, and
                respect. Every day, we work alongside individuals, families, and
                local authorities to deliver meaningful, person-centred care
                that helps people live with confidence, dignity, and
                independence.
              </p>
            </div>

            {/* Mobile View with Truncation */}
            <div className="md:hidden">
              <MobileReadMore
                limit={200}
                text="We bring together specialist services, from supported living and residential care to community, mental health, and children's services, all united by one purpose: to move care forward. Our teams are guided by compassion, professionalism, and respect. Every day, we work alongside individuals, families, and local authorities to deliver meaningful, person-centred care that helps people live with confidence, dignity, and independence."
              />
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
              transition={{ duration: 0.4 }}
              src="/Section_ImageRight.png"
              alt="Smiling woman"
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
