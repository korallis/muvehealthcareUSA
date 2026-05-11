"use client";
import { motion, Variants } from "framer-motion";
import { useRef } from "react";

// 1. Define the interface for your props
interface ParallaxMissionSectionProps {
  title?: string;
  description?: string;
}

// 2. Accept props in the function arguments
export default function ParallaxMissionSection({
  title,
  description,
}: ParallaxMissionSectionProps) {
  const containerRef = useRef(null);

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative h-[70vh] w-full bg-lightblue flex items-center justify-center overflow-hidden"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={textVariants}
        className="max-w-3xl mx-auto text-center "
      >
        {/* 3. Use the props here instead of the hardcoded text */}
        <h4 className="text-healthcare text-navyblue">
          {title ||
            "“MUVE Healthcare Group exists to make quality healthcare accessible and empowering, transforming lives through compassionate, person-centered care. To unify, strengthen, and humanise healthcare services under one trusted identity.” "}
        </h4>
        {description && (
          <p className="mt-4 text-gray-700">
            {description ||
              "“MUVE Healthcare Group exists to make quality healthcare accessible and empowering, transforming lives through compassionate, person-centered care. To unify, strengthen, and humanise healthcare services under one trusted identity.” "}
          </p>
        )}
      </motion.div>
    </section>
  );
}
