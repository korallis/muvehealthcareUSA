"use client";

import ServiceForm from "@/components/ui/ServiceForm";
import { motion, Variants } from "framer-motion";

interface MuveLivingProps {
  title?: string;
}

export default function MuveLiving({ title }: MuveLivingProps) {
  // Variants for the overall text/form container
  const containerVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15, // Stagger inputs inside the form
      },
    },
  };

  // Variants for individual form elements
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      id="supported-living"
      className="w-full bg-gradient-to-br from-[#FEE27A] to-[#FFD46B] relative overflow-hidden py-20"
    >
      {/* Animated Decorative Pattern */}
      {/* <motion.img
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.5 }}
        src="/patterns/muvecommunity.svg"
        alt="pattern"
        className="absolute inset-0 w-[900px] h-[750px] object-cover pointer-events-none"
      /> */}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-4 flex flex-col lg:flex-row items-center gap-16 z-10">
        {/* LEFT IMAGE — Slides in from Left */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center md:justify-start"
        >
          <div className="overflow-hidden flex items-center justify-center">
            <motion.img
              src="/buble/muveliving.png"
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
              src="logos/services/muveliving.svg"
              alt="MUVE Living Logo"
              className="w-[200px] md:w-[260px]"
            />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-services leading-relaxed text-navyblue max-w-2xl"
          >
            {title ? (
              title
            ) : (
              <>
                <span className="font-bold">
                  MUVE Living helps people live independently and
                </span>{" "}
                confidently and adapts care to each person’s goals, promoting
                dignity, independence, and connection.
              </>
            )}
          </motion.p>

          {/* FORM BOX */}
          <ServiceForm
            title="Let’s Start a Conversation!"
            bgColor="bg-[#EE7943]"
          />
        </motion.div>
      </div>
    </section>
  );
}
