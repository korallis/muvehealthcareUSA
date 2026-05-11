"use client";

import ServiceForm from "@/components/ui/ServiceForm";
import { motion, Variants } from "framer-motion";

interface MuveCommunityProps {
  title?: string;
}

export default function MuveCommunity({ title }: MuveCommunityProps) {
  // Container variant to orchestrate staggered children (logo, text, form)
  const containerVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  // Individual item variant for elements inside the right column
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      id="community-care"
      className="w-full bg-muvecommunitycolor relative overflow-hidden py-20"
    >
      {/* Decorative Pattern Background - Fades in on scroll */}
      {/* <motion.img
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        src="/patterns/muvecommunity.svg"
        alt=""
        className="absolute inset-0 w-[900px] h-[750px] object-cover pointer-events-none"
      /> */}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-4 flex flex-col lg:flex-row items-center gap-16 z-10">
        {/* LEFT IMAGE - Slides in from Left */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center md:justify-start"
        >
          <div className="overflow-hidden flex items-center justify-center">
            <img
              src="/buble/muvecommunity.png"
              alt="Smiling woman"
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>

        {/* RIGHT SIDE — TEXT & FORM */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-6 items-end text-right"
        >
          <motion.div variants={itemVariants} className="flex justify-end">
            <img
              src="logos/services/muvecommunity.svg"
              alt="MUVE Community Logo"
              className="w-[200px] md:w-[260px]"
            />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-services leading-relaxed text-[#002B32] max-w-2xl"
          >
            {title ? (
              title
            ) : (
              <>
                <span className="font-bold">
                  MUVE Community delivers flexible, compassionate
                </span>{" "}
                support that helps people live independently within their own
                homes and communities.
              </>
            )}
          </motion.p>

          {/* FORM BOX - Staggered inputs */}
          <ServiceForm title="Join Our Community!" bgColor="bg-[#9ACF98]" />
        </motion.div>
      </div>
    </section>
  );
}
