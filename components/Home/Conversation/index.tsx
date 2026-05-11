"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

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
      className="w-full bg-purple py-20 px-6"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* LEFT SIDE — Conversation Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-subheading text-white leading-tight">
            {copyright ? (
              copyright
            ) : (
              <>
                Let’s start
                <br />a conversation!
              </>
            )}
          </h2>

          <p className="mt-6 text-xl font-lexend text-navyblue">
            Speak with a team member
          </p>

          {/* Buttons with Hover effects */}
          <div className="mt-6 flex flex-wrap gap-4">
            {/* <motion.a 
              href="https://wa.me/27737194634" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-buttons bg-navyblue text-white px-10 py-3 rounded-full inline-block cursor-pointer"
            >
              Whatsapp
            </motion.a> */}

            <motion.a
              href="https://www.cognitoforms.com/ICare24Group1/MuveCallBackForm"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#24345E",
                color: "#fff",
              }}
              whileTap={{ scale: 0.95 }}
              className="text-buttons border-4 border-navyblue text-navyblue px-10 py-2 rounded-full transition-colors duration-100 inline-block cursor-pointer"
            >
              Call Back
            </motion.a>
            <motion.a
              href="https://www.cognitoforms.com/ICare24Group1/EmailAndSMSSubscriptionConsentForm"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ backgroundColor: "#0fbdbd" }}
              className="bg-[#14D8D8] px-8 text-[#16203B] text-buttons text-white px-10 py-3 rounded-full inline-block cursor-pointer"
            >
              Subscribe
            </motion.a>
          </div>

          {/* Email Subscribe */}
          <motion.div variants={itemVariants} className="mt-10">
            <div className="flex w-full max-w-lg rounded-full overflow-hidden font-lexend">
              {/* <input
                type="email"
                placeholder="Email"
                className="flex-1 px-6 py-3 text-gray-700 outline-none"
              /> */}
              {/* <motion.a href="https://www.cognitoforms.com/ICare24Group1/EmailSubscriptionConsentForm" target="_blank"
                whileHover={{ backgroundColor: "#0fbdbd" }}
                className="bg-[#14D8D8] px-8 text-[#16203B] text-buttons text-white px-10 py-3 rounded-full inline-block cursor-pointer"
              >
                Subscribe 
              </motion.a> */}
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE — Quick Links */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3">
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-[#14D8D8] text-[#16203B] text-subheading px-3 py-1"
            >
              Quick
            </motion.span>
            <span className="text-white text-subheading">Links</span>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-8 text-white">
            {[
              {
                title: "About",
                path: "/About",
                links: [
                  "Who we are",
                  "Who we help",
                  "How we help",
                  { name: "Our People", customPath: "/team" },
                ],
              },
              {
                title: "Services",
                path: "/Services",
                links: [
                  "Supported Living",
                  "Residential Care",
                  "Community Care",
                  {
                    name: "Mental Health",
                    customPath: "Services/#independent-mental-health",
                  },
                  {
                    name: "Children’s Services",
                    customPath: "Services/#childrens-services",
                  },
                ],
              },
              {
                title: "Resources",
                path: "/resources",
                links: [
                  "FAQ’s",
                  "Quick Links",
                  "Latest News",
                  { name: "Privacy Policy", customPath: "/privacy" },
                ],
              },
              {
                title: "Stories + Impact",
                path: "/stories",
                links: ["Social Value", "Impact Stories", "Events"],
              },
              {
                title: "Get in Touch",
                path: "/Contact",
                links: ["Contact", "Locations", "Feedback Form", "Careers"],
              },
            ].map((column, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <h4 className="text-quicklinksheader text-navyblue">
                  {column.title}
                </h4>
                <ul className="mt-3 space-y-1 text-white/90">
                  {column.links.map((link, linkIdx) => {
                    // 1. Check if link is an object or string
                    const isObject = typeof link !== "string";
                    const linkName = isObject ? link.name : link;

                    // 2. Generate the ID safely using the string name
                    const sectionId = linkName
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, "");

                    // 3. Decide the final URL (use customPath if it exists, otherwise use the hash)
                    const finalHref =
                      isObject && link.customPath
                        ? link.customPath
                        : `${column.path}#${sectionId}`;

                    return (
                      <li
                        key={linkIdx}
                        className="hover:text-navyblue transition-colors text-quicklinks text-sm md:text-base"
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
