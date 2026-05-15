"use client";

import { motion } from "framer-motion";

// 1. Added Prop Interface to match your puck.config.ts
interface PathProps {
  title?: string;
}

interface HoverPopupProps {
  title: string;
  description: string;
}

/* Hover popup component */
function HoverPopup({ title, description }: HoverPopupProps) {
  return (
    <div
      className="absolute bottom-full -mb-25 left-1/2 -translate-x-1/2 
      opacity-0 
      group-hover:opacity-100 
      group-active:opacity-100 
      group-focus:opacity-100
      transition-opacity duration-200 
      z-50 pointer-events-auto"
    >
      <div className="bg-[#26E6DB] text-[#1F3154] px-8 py-4 rounded-[15px] lg:rounded-[30px] w-[260px] lg:w-[250px]">
        <h4 className="text-[16px] lg:text-[20px] font-lexendBold mb-2">
          {title}
        </h4>
        <p className="text-[10px] lg:text-[14px] font-lexend leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

// 2. Updated function to accept 'title' prop
export default function Path({ title }: PathProps) {
  return (
    <section className="relative bg-[#130D55] overflow-hidden min-h-screen lg:min-h-[700px] flex flex-col lg:flex-row lg:items-center pt-10 pb-0 lg:py-0">
      {/* TOP RIGHT PATTERN */}
      <img
        src="/care-path-pattern.svg"
        alt=""
        className="absolute top-0 right-0 w-[300px] md:w-[520px] opacity-50 pointer-events-none select-none z-0"
      />


      {/* TWO-GUYS IMAGE */}
      <motion.img
        src="/young-man.png"
        alt=""
        className="relative lg:absolute order-last lg:order-none mt-2 lg:mt-0 -right-0 bottom-0 w-[100%] -mr-[0%] md:w-[850px] lg:w-[1100px] object-contain z-10"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      />

      {/* CONTENT CONTAINER */}
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 w-full z-20 flex flex-col">
        {/* HEADER + CALLOUT */}
        <motion.div
          className="relative lg:absolute lg:-top-50 max-w-2xl"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
        >
          {/* 3. Render dynamic title or fallback to original */}
          <h2 className="text-white text-hero-header sm:text-5xl lg:text-[60px] mb-8">
            {title ? (
              title
            ) : (
              <>
                <span className="bg-[#4C86FF] text-[#fff] px-4 py-1 rounded-lg">
                  Muve
                </span>{" "}
                Our Way
              </>
            )}
          </h2>

          <p className="text-white text-[23px] font-lexend">
            At MUVE Healthcare, we connect healthcare professionals with meaningful opportunities and support clients with reliable, high-quality staffing solutions.
          </p>
          <br/>
          <br/>
          <p className="text-white text-[23px] font-lexend">
            Whether you're looking for flexibility, career progression or dependable coverage, we make the process simple, transparent and effective.
          </p>

          <div className="flex justify-left mt-10">
          <button className="bg-[#40E2B8] text-[#07004C] font-lexendBold text-[20px] px-8 py-2.5 rounded-full hover:bg-[#2bc49d] transition-all tracking-wide">
            Get in Touch
          </button>
        </div>

        </motion.div>


      </div>
    </section>
  );
}
