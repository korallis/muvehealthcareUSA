"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const MobileReadMore = ({
  children = "",
  limit = 200,
  className = "",
  arrowColor = "currentColor",
}: {
  children?: string;
  limit?: number;
  className?: string;
  arrowColor?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Safe check to prevent .length error
  const text = children || "";
  if (text.length <= limit) return <p className={className}>{text}</p>;

  return (
    <div className={className}>
      <p>{isExpanded ? text : `${text.substring(0, limit)}...`}</p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 flex items-center gap-1 text-sm font-bold md:hidden"
        style={{ color: arrowColor }}
      >
        {isExpanded ? "Read Less" : "Read More"}
        <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown size={18} />
        </motion.span>
      </button>
    </div>
  );
};

export interface WhoWeHelpProps {
  title?: string;
  subtitleHighlight?: string;
  subtitleMain?: string;
  mainDescription?: string;
  image?: string;
  strips?: {
    title: string;
    description: string;
    type: "purple" | "blue";
  }[];
}

export default function WhoWeHelp({
  title = "About",
  subtitleHighlight = "Who",
  subtitleMain = "We Help?",
  mainDescription = "At MUVE Healthcare Group, we support individuals with a range of complex needs, including autism, learning disabilities, mental health conditions, and behaviours that challenge.\n\n Our services are built around understanding each person’s unique strengths, preferences, and goals, ensuring care that is both high-quality and deeply human.",
  image = "/Section_ImageRight1.png",
  strips = [
    {
      title: "Profound and Multiple Learning Disabilities (PMLD)",
      description:
        "We provide specialist care for individuals with profound and multiple learning disabilities, offering consistent support that promotes comfort, engagement, and dignity in everyday life.",
      type: "purple",
    },
    {
      title: "Autism (ASC)",
      description:
        "Every autistic person is unique. We deliver tailored support that respects individuality, reduces anxiety, and encourages confidence, connection, and self-expression.",
      type: "blue",
    },
    {
      title: "Mental Health",
      description:
        "Our mental health services focus on recovery, resilience, and wellbeing, helping individuals manage challenges, build independence, and thrive in their own way.",
      type: "purple",
    },
    {
      title: "Behaviours of Concern",
      description:
        "We support individuals whose behaviours may challenge, using positive, person-centred strategies that promote safety, understanding, and emotional regulation.",
      type: "blue",
    },
  ],
}: WhoWeHelpProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ... Variants (textVariants, slideFromLeft, slideFromRight) remain exactly the same as your original
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 },
    },
  };
  const slideFromLeft: Variants = {
    hidden: { opacity: 0, x: isMobile ? -20 : -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  const slideFromRight: Variants = {
    hidden: { opacity: 0, x: isMobile ? 20 : 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      id="who-we-help"
      className="w-full bg-lightblue py-20 overflow-x-hidden"
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
            className="text-white leading-tight"
          >
            {title}
          </motion.h1>
          <motion.h2
            variants={textVariants}
            className="mt-4 text-subheading text-navyblue leading-snug"
          >
            <span className="bg-blue-500 px-3 py-1 text-[#FFFF]">
              {subtitleHighlight}
            </span>{" "}
            <span>{subtitleMain}</span>
          </motion.h2>

          <motion.div
            variants={textVariants}
            className="mt-8 space-y-6 text-about text-navyblue leading-relaxed"
          >
            <MobileReadMore
              limit={200}
              arrowColor="#1F2A44"
              className="md:hidden"
            >
              {mainDescription}
            </MobileReadMore>
            <div className="hidden md:block">
              {/* <p className="whitespace-pre-line">{mainDescription}</p> */}
              {mainDescription.split("\n").map((line, index) => (
                <p
                  key={index}
                  className="text-about text-navyblue leading-relaxed min-h-[1.5em]"
                >
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center md:justify-end relative"
        >
          <div className="overflow-hidden flex items-center justify-center">
            <img
              src={image}
              alt={title}
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>
      </div>

      <div className="w-full text-white py-16 overflow-hidden mx-auto px-4 md:px-6 flex flex-col gap-10 md:gap-16">
        {strips.map((strip, idx) => {
          const isLeft = strip.type === "purple";
          return (
            <motion.div
              key={idx}
              variants={isLeft ? slideFromLeft : slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className={`w-full ${isLeft ? "md:-ml-40 bg-purple" : "md:-mr-40 bg-blue"} mx-auto px-6 flex items-center justify-between gap-16 rounded-[40px] ${isLeft ? "md:pr-30" : "md:pr-50"}`}
            >
              <div
                className={`flex-1 flex ${isLeft ? "items-end" : "items-start"} gap-8`}
              >
                <div
                  className={`max-w-7xl mt-10 mb-10 flex flex-col gap-4 w-full ${isLeft ? "md:w-[90%] md:ml-[300px]" : "md:w-[80%] px-4 md:px-10"}`}
                >
                  <h3
                    className={`text-blades ${isLeft ? "text-navyblue" : "text-white"}`}
                  >
                    {strip.title}
                  </h3>
                  <MobileReadMore
                    limit={200}
                    className={`text-about leading-relaxed ${isLeft ? "text-navyblue" : "text-white/90"}`}
                    arrowColor={isLeft ? "#24345E" : "#FFFFFF"}
                  >
                    {strip.description}
                  </MobileReadMore>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
