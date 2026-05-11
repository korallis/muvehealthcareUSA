"use client";

import ServiceForm from "@/components/ui/ServiceForm";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

interface MuveBrightProps {
  title?: string;
}

export default function MuveBright({ title }: MuveBrightProps) {
  // Orchestrates the sequential appearance of logo, text, and form
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

  // Defines the slide-up behavior for individual elements
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
      id="childrens-services"
      className="w-full bg-[#6BBBB2] relative overflow-hidden py-20"
    >
      {/* Decorative Background - Subtle Fade In */}
      <motion.img
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        src="/patterns/muvebright.svg"
        alt=""
        className="absolute inset-0 w-[1500px] h-[950px] object-cover pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-4 flex flex-col lg:flex-row items-center gap-16 z-10">
        {/* LEFT IMAGE - Slides in from left */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center md:justify-start"
        >
          <div className="overflow-hidden flex items-center justify-center">
            <img
              src="/buble/muvebright.png"
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
            <Image
              src="/logos/services/muvebright.svg"
              alt="MUVE Bright Logo"
              width={260}
              height={100}
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
                  MUVE Bright provides specialist children’s{" "}
                </span>{" "}
                services that create safe, nurturing spaces for young people to
                grow and thrive.
              </>
            )}
          </motion.p>

          {/* FORM BOX - Salmon/Orange theme */}
          <ServiceForm
            title="Invest in Bright Futures!"
            bgColor="bg-[#EB665F]"
          />
        </motion.div>
      </div>
    </section>
  );
}
