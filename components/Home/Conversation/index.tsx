"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { CONVERSATION_DATA, FOOTER_QUICK_LINKS, FooterColumn, FooterLink } from "@/constants/conversationConstants";

interface FooterSectionProps {
  copyright?: string;
}

export default function FooterSection({ copyright }: FooterSectionProps) {
  // Container variant to orchestrate children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Individual element variant
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      id="get-in-touch"
      className="w-full bg-[#4C86FF] py-20 px-6"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* LEFT SIDE — Conversation Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-white leading-tight">
            {copyright ? (
              copyright
            ) : (
              <>
                Let’s start
                <br />a conversation!
              </>
            )}
          </h2>

          <p className="mt-6 text-[28px] font-lexend text-[#07004C]">
            {CONVERSATION_DATA.subtitle}
          </p>

          {/* Buttons with Hover effects */}
          <div className="mt-2 flex flex-wrap gap-4">
            <motion.a
              href={CONVERSATION_DATA.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#07004c",
                color: "#fff",
              }}
              whileTap={{ scale: 0.95 }}
              className="text-buttons border-4 border-[#07004C] bg-[#07004C] text-[#fff] px-18 py-2 rounded-full transition-colors duration-100 inline-block cursor-pointer"
            >
              Email Us
            </motion.a>
            <motion.a
              href={CONVERSATION_DATA.callbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ backgroundColor: "#40E2B8" }}
              className="border-4 border-[#07004C] text-[#07004C] text-buttons text-white px-16 py-2 rounded-full inline-block cursor-pointer"
            >
              Call Back
            </motion.a>
          </div>

          {/* Email Subscribe */}
          <motion.div variants={itemVariants} className="mt-10">
            <div className="flex w-full max-w-lg bg-[#fff] rounded-full overflow-hidden font-lexend">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-6 py-3 text-gray-700 outline-none"
              />
              <motion.a 
                href={CONVERSATION_DATA.subscribeUrl} 
                target="_blank"
                whileHover={{ backgroundColor: "#40E2B8" }}
                className="bg-[#40E2B8] px-8 text-[#07004C] text-buttons px-10 py-3 rounded-full inline-block cursor-pointer"
              >
                Subscribe 
              </motion.a>
            </div>
            <p className="mt-2 text-[15px] font-lexend text-[#fff]">
              {CONVERSATION_DATA.disclaimer}
            </p>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE — Quick Links */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3">
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-[#40E2B8] text-[#fff] text-subheading px-3 py-1"
            >
              Quick
            </motion.span>
            <span className="text-white text-subheading">Links</span>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-8 text-white">
            {FOOTER_QUICK_LINKS.map((column: FooterColumn, idx: number) => (
              <motion.div key={idx} variants={itemVariants}>
                <h4 className="text-quicklinksheader text-[#07004c]">
                  {column.title}
                </h4>
                <ul className="mt-3 space-y-1 text-white">
                  {column.links.map((link: FooterLink, linkIdx: number) => {
                    const isObject = typeof link !== "string";
                    const linkName = isObject ? link.name : link;

                    const sectionId = linkName
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, "");

                    const finalHref =
                      isObject && link.customPath
                        ? link.customPath
                        : `${column.path || ""}#${sectionId}`;

                    return (
                      <li
                        key={linkIdx}
                        className="hover:text-[#40E2B8] text-quicklinks text-sm md:text-[#fff]"
                      >
                        <Link href={finalHref}>{linkName}</Link>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
