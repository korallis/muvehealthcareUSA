"use client";

import ServiceForm from "@/components/ui/ServiceForm";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

interface MuveHorizonsProps {
  title?: string;
}

export default function MuveHorizons({ title }: MuveHorizonsProps) {
  // Variants for the overall text/form container
  const containerVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15, //Delay between form inputs
      },
    },
  };

  // Variants for individual items (Logo, P, Inputs)
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
      id="residential-care"
      className="w-full bg-muvehorizonscolor relative overflow-hidden py-20"
    >
      {/* Decorative Pattern Background - Fades in */}
      {/* <motion.img
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
        transition={{ duration: 1.5 }}
        src="/patterns/muveminds.svg"
        alt=""
        className="absolute inset-0 w-[1750px] h-[850px] object-cover pointer-events-none"
      /> */}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-4 flex flex-col lg:flex-row items-center gap-16 z-10">
        {/* LEFT IMAGE - Slides from Left */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center md:justify-start"
        >
          <div className="overflow-hidden flex items-center justify-center">
            <img
              src="/buble/muvehorizons.png"
              alt="Smiling woman"
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>

        {/* RIGHT SIDE - TEXT & FORM */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-6 items-end text-right"
        >
          <motion.div variants={itemVariants} className="flex justify-end">
            <Image
              src="logos/services/muvehorizons.svg"
              alt="MUVE Horizons Logo"
              width={600}
              height={400}
              className="w-[200px] md:w-[260px]"
            />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-services text-[#002B32] max-w-2xl"
          >
            {title ? (
              title
            ) : (
              <>
                <span className="font-bold">
                  MUVE Horizons provides residential care in
                </span>{" "}
                warm, supportive environments where every person feels safe,
                valued, and at home.
              </>
            )}
          </motion.p>

          {/* FORM BOX */}
          <ServiceForm title="Find Your Dream Home!" bgColor="bg-[#A296C2]" />
        </motion.div>
      </div>
    </section>
  );
}
