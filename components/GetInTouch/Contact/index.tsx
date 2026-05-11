"use client"; // Required for Framer Motion in Next.js App Router

import ContactForm from "@/components/ui/ContactUsForm";
import { motion } from "framer-motion";

interface ContactProps {
  heading?: string;
  email?: string;
}
export default function Contact({ heading, email }: ContactProps) {
  // Shared Animation Variants for Reusability
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }, // Staggers the appearance of child elements
    },
  };

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/muve-healthcare/?viewAsMember=true",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/muvehealthcaregroup/",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/profile.php?viewas=100000686899395&id=61583092695274",
    },
  ];

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen  bg-[#C8BDED] pt-20 pb-2 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* LEFT SIDE - Onload Slide In From Left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-white mb-2">{heading || "Contact"}</h1>
            <p className="text-navyblue text-[30px] font-lexendBold mb-4">
              Let’s start a conversation!
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 text-[#1F3154] text-lg"
            >
              <motion.div variants={fadeIn}>
                <h4 className="font-lexendBold">Email</h4>
                <p className="font-lexend">
                  {email || "hello@muvehealthcare.co.uk"}
                </p>
              </motion.div>
              <motion.div variants={fadeIn}>
                <h4 className="font-lexendBold">Contact No.</h4>
                <p className="font-lexend">0808 1754091</p>
              </motion.div>
              <motion.div variants={fadeIn}>
                <h4 className="font-lexendBold">Address</h4>
                <p className="font-lexend">
                  Suite 1 | Aqueous II | Rocky Lane | Birmingham | B6 5RQ
                </p>
              </motion.div>
            </motion.div>

            {/* Social Icons with Hover Effects */}
            <div className="flex items-center gap-6 mt-10">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit iCare 24 on ${social.name}`}
                >
                  {/* Ensure your icons are located in the public/icons/footer directory */}
                  <img
                    src={`/icons/${social.name}.svg`}
                    className="w-7"
                    alt={social.name}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE FORM - Onload Slide In From Right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-[#1F3154] rounded-[30px] p-10 w-full"
          >
            <ContactForm />
          </motion.div>
        </div>

        {/* DIVIDER LINE - Expands on Scroll */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }} // Triggers when user scrolls here
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="h-[6px] bg-[#12D7E8] mt-24 rounded-full"
        />
      </div>
    </section>
  );
}
