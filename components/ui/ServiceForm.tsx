"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { sendServiceEmail } from "@/lib/actions/email";
import { useRef } from "react";

interface ServiceFormProps {
  title: string;
  bgColor: string;
  buttonColor?: string;
  inputFocusColor?: string;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ServiceForm({
  title,
  bgColor,
  buttonColor = "bg-[#1E2F5C]",
  inputFocusColor = "focus:ring-[#1E2F5C]",
}: ServiceFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleFormAction(formData: FormData) {
    const result = await sendServiceEmail(formData);
    if (result.success) {
      alert(`Inquiry for "${title}" sent successfully!`);
      formRef.current?.reset();
    } else {
      alert("Failed to send email. Please try again.");
    }
  }

  return (
    <motion.div
      variants={itemVariants}
      className={`${bgColor} p-8 rounded-3xl shadow-lg w-full`}
    >
      <h3 className="text-[35px] font-lexendBold mb-6 text-navyblue text-center">
        {title}
      </h3>

      <form
        ref={formRef}
        action={handleFormAction}
        className="flex flex-col gap-4"
      >
        <input type="hidden" name="form_title" value={title} />

        {["Full Name*", "Phone Number*", "Email Address*"].map(
          (placeholder, idx) => (
            <motion.input
              key={idx}
              name={placeholder}
              required
              variants={itemVariants}
              type={placeholder.includes("Email") ? "email" : "text"}
              placeholder={placeholder}
              className={`w-full px-5 py-3 font-lexend rounded-full bg-white text-[#002B32] placeholder-[#9BA9AC] text-lg outline-none focus:ring-2 ${inputFocusColor} transition-all`}
            />
          ),
        )}

        <p className="text-xs text-center text-navyblue/60">
          By submitting, you agree to our{" "}
          <Link href="/Privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className={`w-1/2 mx-auto mt-2 px-6 py-3 rounded-full ${buttonColor} text-white text-lg text-buttons shadow transition-colors cursor-pointer`}
        >
          Submit
        </motion.button>
      </form>
    </motion.div>
  );
}
