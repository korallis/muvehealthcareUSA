"use client";

import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackForms from "@/components/ui/FeedbackForms";

type FeedbackState = {
  success: boolean;
};

interface FeedbackFormProps {
  title?: string;
}

export default function FeedbackForm({ title }: FeedbackFormProps) {
  const [activeTab, setActiveTab] = useState("Compliments");

  const [state, formAction, isPending] = useActionState(
    async (
      prevState: FeedbackState,
      formData: FormData,
    ): Promise<FeedbackState> => {
      const data = {
        feedbackType: formData.get("feedbackType"),
        userType: formData.get("userType"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
      };

      await fetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify(data),
      });

      return { success: true };
    },
    { success: false },
  );

  return (
    <section
      id="feedback-form"
      className="w-full bg-[#62E5E7] relative py-20 px-6 lg:px-20 overflow-hidden"
    >
      {/* Heading - Scroll Triggered */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl"
      >
        <h1 className="text-[48px] font-lexendBold text-white leading-none">
          {title || "Chat To Us"}
        </h1>
        <p className="text-[24px] font-lexendBold text-[#003366] mt-2">
          We Love Feedback
        </p>
      </motion.div>

      <FeedbackForms />
    </section>
  );
}
