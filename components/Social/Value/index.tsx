"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";

interface Card {
  num: string;
  title: string;
  desc: string;
}

export interface SocialProps {
  title?: string;
  description?: string;
  cards?: {
    num: string;
    title: string;
    desc: string;
  }[];
  buttonText?: string;
  buttonLink?: string;
  visionText?: string;
  directorName?: string;
  directorRole?: string;
}

export default function Social({
  title = "Social Value",
  description = "This Social Impact Commitment reflects not only our progress but our promise to keep care personal, inclusive, and empowering for everyone we support. Every  achievement shared here is the result of dedicated teams who go above and beyond each day, and the individuals, families, and communities who inspire us to do more. As we look ahead, our commitment remains the same: to build a future where every act of care enriches lives and leaves a lasting impact.",
  cards = [
    {
      num: "1",
      title: "Care Through Employment",
      desc: "Create inclusive, fair, and long-term employment pathways across our healthcare divisions.",
    },
    {
      num: "2",
      title: "Care For Community",
      desc: "Strengthen local partnerships that create belonging and social connection.",
    },
    {
      num: "3",
      title: "Care For The Environment",
      desc: "Reduce our environmental footprint and promote greener care operations.",
    },
    {
      num: "4",
      title: "Care For Well-being",
      desc: "Prioritise mental, physical, and emotional wellbeing for every member of our care community.",
    },
    {
      num: "5",
      title: "Care Through Education",
      desc: "Build capacity and career progression across the care sector.",
    },
  ],
  buttonText = "Learn More",
  buttonLink = "https://www.canva.com/design/DAG2Cu2y5aY/ObtlRT4S8SJRPiXCRJW5gg/view?utm_content=DAG2Cu2y5aY&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2ef854bd8a",
  visionText = "Our vision for MUVE is to create a global community of healthcare professionals dedicated to making a positive impact on people’s lives. Together, we are transforming the future of healthcare.",
  directorName = "David Swali",
  directorRole = "Director",
}: SocialProps) {
  // Variants for the 5 value cards container
  const cardContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Variants for the individual cards (Pop in effect)
  const cardItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  // Standard slide-up variant
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      id="social-value"
      className="w-full bg-gradient-to-b from-[#4C6FFF] to-[#3BB4C5] text-white py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* TOP SECTION */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        >
          {/* LEFT TEXT */}
          <div>
            <h1 className=" mb-6">{title || "Social Value"}</h1>
            <p className="text-footer leading-relaxed max-w-xl">
              {/* This Social Impact Commitment reflects not only our progress but our promise to 
              keep care personal, inclusive, and empowering for everyone we support. Every 
              achievement shared here is the result of dedicated teams who go above and beyond 
              each day, and the individuals, families, and communities who inspire us to do more.
              As we look ahead, our commitment remains the same: to build a future where every 
              act of care enriches lives and leaves a lasting impact. */}
              {description}
            </p>
          </div>

          {/* RIGHT LOGO */}
          <div className="flex md:justify-end justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-end"
            >
              <Image
                src="/logos/muveforgood.svg"
                alt="MUVE For Good"
                width={400}
                height={300}
                className="mb-3"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* VALUE CARDS */}
        <motion.div
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardItemVariants}
              whileHover={{ y: -10 }}
              className="bg-[#20E3D8] w-full 
             aspect-auto rounded-[3rem] py-12 px-8
             lg:aspect-[1/2] lg:rounded-full lg:px-6 lg:py-0
             flex flex-col items-center justify-center text-center 
             text-[#002B32] cursor-default"
            >
              <h3 className="text-social font-black">{card.num}</h3>
              <h4 className="text-socialcardheader">{card.title}</h4>
              <p className="text-socialcardbody mt-2">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* BUTTON */}
        <div className="flex justify-center mt-12">
          <motion.a
            href="https://www.canva.com/design/DAG2Cu2y5aY/ObtlRT4S8SJRPiXCRJW5gg/view?utm_content=DAG2Cu2y5aY&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2ef854bd8a"
            target="_blank"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            viewport={{ once: true }}
            className="text-buttons bg-navyblue text-white px-10 py-3 rounded-full inline-block cursor-pointer"
          >
            {/* Learn More */}
            {buttonText}
          </motion.a>
        </div>

        {/* BOTTOM CQC CARD */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mt-20 w-full bg-white rounded-[120px] overflow-hidden flex flex-col md:flex-row items-center"
        >
          {/* LEFT LOGO */}
          <div className="bg-[#FFFFF] w-full md:w-[20%] p-10 flex flex-col items-start justify-center gap-4">
            <Image
              src="/logos/cqc.svg"
              alt="CQC Logo"
              width={130}
              height={130}
            />
            <a
              href="#"
              className="text-[#002B32] underline font-lexendBold text-lg"
            >
              See Report
            </a>
          </div>

          {/* RIGHT TEXT & IMAGE */}
          <div className="bg-[#4056E3] text-white w-full md:w-[80%] p-10 rounded-l-[120px] flex flex-col md:flex-row items-center gap-8">
            {/* TEXT */}
            <div className="flex-1 ml-10">
              <p className="text-about leading-relaxed">
                {/* Our vision for <strong>MUVE</strong> is to create a global community of healthcare
                professionals dedicated to making a positive impact on people’s lives. 
                Together, we are transforming the future of healthcare. */}
                {visionText}
              </p>
              <p className="mt-6 font-lexendBold">{directorName}</p>
              <p className="text-sm opacity-80 font-lexend">{directorRole}</p>
            </div>

            {/* IMAGE */}
            <Image
              src="/davidswali.png"
              alt="David Swali"
              width={160}
              height={160}
              className="rounded-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
