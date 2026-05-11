"use client";
import Image from "next/image";
import { motion } from "framer-motion";

interface HowWeHelpProps {
  title?: string;
  description?: string;
}

export default function HowWeHelp({ title }: HowWeHelpProps) {
  const fadeInRow = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const itemFade = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="bg-gradient-to-b from-[#4250e3] to-[#5a6eea] py-16 md:py-24 px-6 relative overflow-hidden">
      {/* Decorative Line */}
      <motion.img
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 2.4 }}
        viewport={{ once: true }}
        src="/Section_Graphic.svg"
        alt="Decorative Line"
        className="hidden md:block absolute left-[42%] top-0 -translate-x-1/2 h-[2710px] w-auto opacity-40 pointer-events-none"
      />

      {/* --- TITLE --- */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="text-center md:text-right mb-16 md:mb-28 relative max-w-7xl mx-auto flex flex-col z-10"
      >
        <h2 className="text-hero-header sm:text-5xl lg:text-[60px]">
          {title ? (
            title
          ) : (
            <>
              How can we{" "}
              <span className="bg-[#00D9D4] text-[#ffff] px-3 py-1 rounded-md">
                help
              </span>{" "}
              you?
            </>
          )}
        </h2>
      </motion.div>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="relative max-w-7xl mx-auto flex flex-col gap-20 md:gap-28 z-10">
        {/* ROW 1: Supported Living (Standard Desktop) */}
        <motion.div
          variants={fadeInRow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 items-center gap-10"
        >
          <motion.div
            variants={itemFade}
            className="flex justify-center md:justify-start order-1 md:order-1"
          >
            <Image
              src="/supported-living.png"
              width={350}
              height={350}
              alt="SL"
              className="rounded-full w-64 h-64 md:w-80 md:h-80 lg:w-90 lg:h-90 object-cover"
            />
          </motion.div>
          <motion.div
            variants={itemFade}
            className="flex justify-center order-2 md:order-2"
          >
            <Image
              src="/logos/muve-living.svg"
              alt="Logo"
              width={250}
              height={100}
            />
          </motion.div>
          <motion.div
            variants={itemFade}
            className="text-center md:text-left text-white order-3 md:order-3"
          >
            <h3 className="text-help-header mb-3">Supported Living</h3>
            <p className="text-help-body leading-relaxed">
              Empowering individuals to live independently with flexible,
              person-centred support in their own homes or shared settings.
            </p>
          </motion.div>
        </motion.div>

        {/* ROW 2: Residential Care (Reversed Desktop) */}
        <motion.div
          variants={fadeInRow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 items-center gap-10"
        >
          {/* Mobile: Order 3 (Description) | Desktop: Order 1 */}
          <motion.div
            variants={itemFade}
            className="text-center md:text-left text-white order-3 md:order-1"
          >
            <h3 className="text-help-header mb-3">Residential Care</h3>
            <p className="text-help-body">
              Providing safe, nurturing environments with 24-hour support
              focused on comfort, dignity, and personalised care.
            </p>
          </motion.div>
          {/* Mobile: Order 2 (Logo) | Desktop: Order 2 */}
          <motion.div
            variants={itemFade}
            className="flex justify-center order-2 md:order-2"
          >
            <Image
              src="/logos/muve-horizons.svg"
              alt="Logo"
              width={250}
              height={100}
            />
          </motion.div>
          {/* Mobile: Order 1 (Image) | Desktop: Order 3 */}
          <motion.div
            variants={itemFade}
            className="flex justify-center md:justify-end order-1 md:order-3"
          >
            <Image
              src="/residential-care.png"
              width={350}
              height={350}
              alt="RC"
              className="rounded-full w-64 h-64 md:w-80 md:h-80 lg:w-90 lg:h-90 object-cover"
            />
          </motion.div>
        </motion.div>

        {/* ROW 3: Community Care (Standard Desktop) */}
        <motion.div
          variants={fadeInRow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 items-center gap-10"
        >
          <motion.div
            variants={itemFade}
            className="flex justify-center md:justify-start order-1 md:order-1"
          >
            <Image
              src="/stacking-hands-of-multiracial-women-multi-genera.png"
              width={350}
              height={350}
              alt="CC"
              className="rounded-full w-64 h-64 md:w-80 md:h-80 lg:w-90 lg:h-90 object-cover"
            />
          </motion.div>
          <motion.div
            variants={itemFade}
            className="flex justify-center order-2 md:order-2"
          >
            <Image
              src="/logos/muve-community.svg"
              alt="Logo"
              width={250}
              height={100}
            />
          </motion.div>
          <motion.div
            variants={itemFade}
            className="text-center md:text-left text-white order-3 md:order-3"
          >
            <h3 className="text-help-header mb-3">Community Care</h3>
            <p className="text-help-body">
              Delivering compassionate, in-home and outreach support that helps
              people stay connected, independent, and active within their
              communities.
            </p>
          </motion.div>
        </motion.div>

        {/* ROW 4: Mental Health (Reversed Desktop) */}
        <motion.div
          variants={fadeInRow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 items-center gap-10"
        >
          <motion.div
            variants={itemFade}
            className="text-center md:text-left text-white order-3 md:order-1"
          >
            <h3 className="text-help-header mb-3">Mental Health Services</h3>
            <p className="text-help-body justify-right">
              Offering tailored therapeutic and recovery-focused care that
              promotes emotional wellbeing, resilience, and long-term
              independence.
            </p>
          </motion.div>
          <motion.div
            variants={itemFade}
            className="flex justify-center order-2 md:order-2"
          >
            <Image
              src="/logos/muve-minds.svg"
              alt="Logo"
              width={250}
              height={100}
            />
          </motion.div>
          <motion.div
            variants={itemFade}
            className="flex justify-center md:justify-end order-1 md:order-3"
          >
            <Image
              src="/social-worker-talking-to-family.png"
              width={350}
              height={350}
              alt="MH"
              className="rounded-full w-64 h-64 md:w-80 md:h-80 lg:w-90 lg:h-90 object-cover"
            />
          </motion.div>
        </motion.div>

        {/* ROW 5: Children's Services (Standard Desktop) */}
        <motion.div
          variants={fadeInRow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 items-center gap-10"
        >
          <motion.div
            variants={itemFade}
            className="flex justify-center md:justify-start order-1 md:order-1"
          >
            <Image
              src="/a-group-of-primary-schoolers-lying-on-the-ground.png"
              width={350}
              height={350}
              alt="CS"
              className="rounded-full w-64 h-64 md:w-80 md:h-80 lg:w-90 lg:h-90 object-cover"
            />
          </motion.div>
          <motion.div
            variants={itemFade}
            className="flex justify-center order-2 md:order-2"
          >
            <Image
              src="/logos/muve-bright.svg"
              alt="Logo"
              width={250}
              height={100}
            />
          </motion.div>
          <motion.div
            variants={itemFade}
            className="text-center md:text-left text-white order-3 md:order-3"
          >
            <h3 className="text-help-header mb-3">Children’s Services</h3>
            <p className="text-help-body">
              Supporting children and young people through structured, nurturing
              care that builds confidence, stability, and brighter futures.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
