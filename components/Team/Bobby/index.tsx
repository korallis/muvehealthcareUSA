"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react"; // Install lucide-react or use an SVG

// --- Sub-component for Truncation ---
const MobileReadMore = ({
  children,
  limit = 120,
}: {
  children: string;
  limit?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If text is short, just return it
  if (children.length <= limit) return <p>{children}</p>;

  return (
    <div>
      <p>{isExpanded ? children : `${children.substring(0, limit)}...`}</p>
      {/* Arrow Toggle - Only visible/functional for long text */}
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

interface BobbyProps {
  title?: string;
  subtitle?: string;
  name?: string;
  role?: string;
  experience?: string | React.ReactNode;
  education?: string | React.ReactNode;
  funFact?: string | React.ReactNode;
  image?: string;
  bgColor?: string;
}

export default function Bobby({
  title,
  subtitle,
  name,
  role,
  experience,
  education,
  funFact,
  image,
  bgColor,
}: BobbyProps) {
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
    <section id="bobby" className={`w-full py-20 overflow-hidden ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
        >
          <motion.h1
            variants={textVariants}
            className="text-white font-lexendBold text-5xl md:text-6xl leading-tight"
          >
            {title}
          </motion.h1>
          <motion.h5
            variants={textVariants}
            className="text-white font-lexendBold text-[40px] leading-tight"
          >
            {subtitle}
          </motion.h5>

          <motion.h2
            variants={textVariants}
            className="mt-12 text-subheading text-navyblue leading-snug"
          >
            <span>{name}</span>
          </motion.h2>

          <motion.h5
            variants={textVariants}
            className="mt-4 text-navyblue leading-snug text-left flex justify-start"
          >
            <span className="bg-lightblue font-lexend px-4 py-1 w-64 inline-block">
              {role}
            </span>
          </motion.h5>

          <motion.div
            variants={textVariants}
            className="mt-8 space-y-6 text-about text-navyblue leading-relaxed"
          >
            <h5 className="font-lexendBold">Experience</h5>
            <p>{experience || "Experience text goes here..."}</p>

            {/* Desktop View */}
            <div className="hidden md:block mt-8 space-y-6 text-about text-navyblue leading-relaxed">
              <h5 className="font-lexendBold">Education</h5>
              <p>{education || "Education text goes here..."}</p>
              <h5 className="font-lexendBold mt-6">Fun Fact</h5>
              <p className="mt-4">{funFact || "Fun fact text goes here..."}</p>
            </div>

            {/* Mobile View with Truncation */}
            <div className="md:hidden">
              <MobileReadMore limit={200}>
                {`${education} ${funFact}`}
              </MobileReadMore>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={imageVariants}
          className="w-72 h-72 md:w-130 md:h-130 rounded-full overflow-hidden mx-auto items-center justify-center"
        >
          <motion.img
            src={image} // This now pulls from your local /public/uploads/
            alt={name}
            className="object-cover w-full h-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
