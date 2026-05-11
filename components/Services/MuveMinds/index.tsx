"use client";

import ServiceForm from "@/components/ui/ServiceForm";
import { motion, Variants } from "framer-motion";

interface MuveMindsProps {
  title?: string;
}
export default function MuveMinds({ title }: MuveMindsProps) {
  // Container for orchestrated staggered children
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

  // Individual item variants for text and form elements
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
      id="independent-mental-health"
      className="w-full bg-muvemindscolor-500 relative overflow-hidden py-20"
    >
      {/* Background Pattern - Fades in subtly */}
      {/* <motion.img
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.8 }}
        transition={{ duration: 1.5 }}
        src="/patterns/muveminds.svg"
        alt=""
        className="absolute inset-0 w-[1750px] h-[850px] object-cover pointer-events-none"
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
              src="/buble/muveminds.png"
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
              src="logos/services/muveminds.svg"
              alt="MUVE Minds Logo"
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
                  MUVE Minds provides specialist mental health and
                </span>{" "}
                independent recovery services that promote wellbeing, stability,
                and self-confidence. independence, and connection.
              </>
            )}
          </motion.p>

          {/* FORM BOX - Orange background */}
          <ServiceForm
            title="Find Your Peace Of Mind!"
            bgColor="bg-[#EA9560]"
          />
        </motion.div>
      </div>
    </section>
  );
}
