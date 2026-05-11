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
    <section className="relative bg-[#1F3154] overflow-hidden min-h-screen lg:min-h-[900px] flex flex-col lg:flex-row lg:items-center pt-10 pb-0 lg:py-0">
      {/* TOP RIGHT PATTERN */}
      <img
        src="/care-path-pattern.svg"
        alt=""
        className="absolute top-0 right-0 w-[300px] md:w-[520px] opacity-50 pointer-events-none select-none z-0"
      />

      {/* CARE PATH (Desktop Only) */}
      <motion.img
        src="/path-care.svg"
        alt=""
        className="hidden lg:block absolute left-0 right-30 top-[180px] w-screen h-auto opacity-90 pointer-events-none select-none z-10"
        initial={{ opacity: 0.5 }}
        whileInView={{ opacity: 0.9 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        viewport={{ once: true, amount: 0.5 }}
      />

      {/* TWO-GUYS IMAGE */}
      <motion.img
        src="/two-guys.png"
        alt=""
        className="relative lg:absolute order-last lg:order-none mt-2 lg:mt-0 -right-0 bottom-0 w-[120%] -mr-[10%] md:w-[750px] lg:w-[1180px] object-contain z-10"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      />

      {/* CONTENT CONTAINER */}
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 w-full z-20 flex flex-col">
        {/* HEADER + CALLOUT */}
        <motion.div
          className="relative lg:absolute lg:-top-100 max-w-xl"
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
                The{" "}
                <span className="bg-[#26E6DB] text-[#1F3154] px-4 py-1 rounded-lg">
                  Path
                </span>{" "}
                to Care
              </>
            )}
          </h2>
        </motion.div>

        {/* WAVE LABELS */}
        <div className="relative mt-12 lg:mt-0 grid grid-cols-2 gap-4 lg:block text-white font-lexendBold">
          {/* Listen */}
          <motion.h3
            tabIndex={0}
            className="group relative z-50 lg:absolute lg:left-[8%] lg:-top-[290px] text-[20px] lg:text-[25px] bg-white/10 lg:bg-transparent p-3 rounded-xl lg:p-0 text-center lg:text-left
            xl:left-[2%] xl:-top-[320px] xl:text-[28px] 2xl:-left-[2%] 2xl:-top-[280px]"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Listen
            <HoverPopup
              title="Listen"
              description="We start by understanding you and what matters most."
            />
          </motion.h3>

          {/* Plan */}
          <motion.h3
            tabIndex={0}
            className="group relative z-40 lg:absolute lg:left-[14%] lg:-top-[85px] text-[20px] lg:text-[25px] bg-white/10 lg:bg-transparent p-3 rounded-xl lg:p-0 text-center lg:text-left
            xl:left-[2%] xl:-top-[320px] xl:text-[28px] 2xl:left-[5%] 2xl:-top-[35px]"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Plan
            <HoverPopup
              title="Plan"
              description="Together, we create a personalised care plan."
            />
          </motion.h3>

          {/* Match */}
          <motion.h3
            tabIndex={0}
            className="group relative z-40 lg:absolute lg:left-[30px] lg:top-[140px] text-[20px] lg:text-[25px] bg-white/10 lg:bg-transparent p-3 rounded-xl lg:p-0 text-center lg:text-left
            xl:left-[2%] xl:-top-[320px] xl:text-[28px] 2xl:-left-[10%] 2xl:top-[260px]"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Match
            <HoverPopup
              title="Match"
              description="We connect you with the right care professionals."
            />
          </motion.h3>

          {/* Support */}
          <motion.h3
            tabIndex={0}
            className="group relative z-40 lg:absolute lg:left-[410px] lg:top-[125px] text-[20px] lg:text-[25px] bg-white/10 lg:bg-transparent p-3 rounded-xl lg:p-0 text-center lg:text-left
            xl:left-[2%] xl:-top-[320px] xl:text-[28px] 2xl:left-[28%] 2xl:top-[240px]"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Support
            <HoverPopup
              title="Support"
              description="Compassionate care begins, centered on your comfort."
            />
          </motion.h3>

          {/* Adjust */}
          <motion.h3
            tabIndex={0}
            className="group relative z-40 lg:absolute lg:left-[400px] lg:-top-[70px] text-[20px] lg:text-[25px] bg-white/10 lg:bg-transparent p-3 rounded-xl lg:p-0 text-center lg:text-left
            xl:left-[2%] xl:-top-[320px] xl:text-[28px] 2xl:left-[25%] 2xl:-top-[10px]"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Adjust
            <HoverPopup
              title="Adjust"
              description="We adapt your plan as your needs change."
            />
          </motion.h3>
          

          {/* Evaluate */}
          <motion.h3
            tabIndex={0}
            className="group relative z-40 lg:absolute lg:left-[650px] lg:-top-[160px] text-[20px] lg:text-[25px] bg-white/10 lg:bg-transparent p-3 rounded-xl lg:p-0 text-center lg:text-left
            xl:left-[2%] xl:-top-[320px] xl:text-[28px] 2xl:left-[52%] 2xl:-top-[130px]"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            Evaluate
            <HoverPopup
              title="Evaluate"
              description="Your feedback helps us keep improving your care."
            />
          </motion.h3>
        </div>
      </div>
    </section>
  );
}
