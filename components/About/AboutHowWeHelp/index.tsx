"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

// 1. Added ? to children to make it optional
const MobileReadMore = ({
  children,
  limit = 150,
  className = "",
}: {
  children?: string;
  limit?: number;
  className?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 2. Added a fallback to an empty string ("") to prevent the .length error
  const safeChildren = children || "";

  if (safeChildren.length <= limit)
    return <p className={className}>{safeChildren}</p>;

  return (
    <div className={className}>
      <p>
        {isExpanded ? safeChildren : `${safeChildren.substring(0, limit)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 flex items-center gap-1 text-sm font-bold md:hidden opacity-80 hover:opacity-100"
      >
        {isExpanded ? "Read Less" : "Read More"}
        <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown size={16} />
        </motion.span>
      </button>
    </div>
  );
};

// --- Animation Variants (Kept Exactly as provided) ---
const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.2 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

interface ServiceItem {
  id?: number | string;
  title: string;
  path: string;
  description: string;
  logo: string;
  alt: string;
}

interface AboutHowWeHelpProps {
  title?: string;
  subtitleHow?: string;
  subtitleHelp?: string;
  introText?: string;
  image?: string;
  services?: ServiceItem[];
}

export default function AboutHowWeHelp({
  title = "About",
  subtitleHow = "How",
  subtitleHelp = "We Help?",
  introText = "We combine professional expertise with genuine human connection to create care that moves with each person’s life. Our teams listen, adapt, and collaborate, designing support around individual needs, goals, and aspirations. Through compassion, consistency, and innovation, we deliver care that helps people live with greater confidence, independence, and wellbeing.",
  image = "/Section_ImageRight2.png",
  services = [
    {
      id: 1,
      title: "Supported Living",
      path: "/Services#supported-living",
      description:
        "Empowering individuals to live independently with flexible, person-centred support in their own homes or shared settings.",
      logo: "/logos/muve-living.svg",
      alt: "MUVE Living",
    },
    {
      id: 2,
      title: "Residential Care",
      path: "/Services#residential-care",
      description:
        "Providing safe, nurturing environments with 24-hour support focused on comfort, dignity, and personalised care",
      logo: "/logos/muve-horizons.svg",
      alt: "MUVE Horizons",
    },
    {
      id: 3,
      title: "Community Care",
      path: "/Services#community-care",
      description:
        "Delivering compassionate, in-home and outreach support that helps people stay connected, independent, and active within their communities.",
      logo: "/logos/move-community.svg",
      alt: "MUVE Community",
    },
    {
      id: 4,
      title: "Mental Health Services",
      path: "/Services#independent-mental-health",
      description:
        "Offering tailored therapeutic and recovery-focused care that promotes emotional wellbeing, resilience, and long-term independence.",
      logo: "/logos/muve-minds.svg",
      alt: "MUVE Minds",
    },
    {
      id: 5,
      title: "Children’s Services",
      path: "/Services#childrens-services",
      description:
        "Supporting children and young people through structured, nurturing care that builds confidence, stability, and brighter futures. ",
      logo: "/logos/muve-bright.svg",
      alt: "MUVE Bright",
    },
  ],
}: AboutHowWeHelpProps) {
  return (
    <section
      id="how-we-help"
      className="w-full bg-[#4056E3] py-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textVariants}
        >
          <motion.h1
            variants={textVariants}
            className="text-white font-extrabold text-5xl md:text-6xl leading-tight"
          >
            {title}
          </motion.h1>

          <motion.h2
            variants={textVariants}
            className="mt-4 text-subheading text-[#1F2A44] leading-snug"
          >
            <span className="bg-[#19E3D7] px-3 py-1 text-[#FFFF]">
              {subtitleHow}
            </span>{" "}
            <span className="text-[#FFFF]">{subtitleHelp}</span>
          </motion.h2>

          <motion.div
            variants={textVariants}
            className="mt-8 space-y-6 text-about text-[#FFFF] leading-relaxed"
          >
            <div className="md:hidden">
              <MobileReadMore limit={180}>{introText}</MobileReadMore>
            </div>
            <div className="hidden md:block space-y-6">
              <p>{introText}</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center md:justify-end relative"
        >
          <img
            src={image}
            alt="Feature Image"
            className="object-cover w-full h-full"
          />
        </motion.div>
      </div>

      <div className="w-full text-white py-16 space-y-15">
        {services.map((service, index) => (
          <ServiceRow
            key={index}
            {...service}
            id={index + 1} // Automatically generates 1, 2, 3...
          />
        ))}
      </div>
    </section>
  );
}

function ServiceRow({ id, title, path, description, logo, alt }: ServiceItem) {
  return (
    <motion.div
      layout
      variants={rowVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-10"
    >
      <div className="flex-1 flex items-start gap-8">
        <div className="text-numbers leading-none text-white opacity-95">
          {id}
        </div>
        <div className="flex flex-col gap-4 max-w-xl">
          <h3 className="text-numbershead">{title}</h3>
          <div className="md:hidden">
            <MobileReadMore
              limit={100}
              className="text-numbersbody leading-relaxed text-white/90"
            >
              {description}
            </MobileReadMore>
          </div>
          <p className="hidden md:block text-numbersbody leading-relaxed text-white/90">
            {description}
          </p>
          <Button
            onClick={() => (window.location.href = path)}
            className="text-numbersbutton cursor-pointer"
          >
            Learn More
          </Button>
        </div>
      </div>
      <div className="hidden md:block">
        <img src={logo} alt={alt} className="h-20 w-auto object-contain" />
      </div>
    </motion.div>
  );
}
