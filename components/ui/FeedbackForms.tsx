"use client";
import { useState, useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FormState, sendFeedbackEmail } from "@/lib/actions/feedbackForm";

export default function FeedbackForms() {
  const [activeTab, setActiveTab] = useState("Compliments");

  const initialState: FormState = {
    success: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(
    sendFeedbackEmail,
    initialState,
  );

  return (
    <div>
      <form action={formAction}>
        <input type="hidden" name="feedbackType" value={activeTab} />

        {/* Selection Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex items-center gap-4 flex-wrap"
        >
          {["Compliments", "Complaints", "Suggestion"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative px-8 py-3 rounded-full font-lexendBold transition-colors duration-500 ${
                activeTab === tab
                  ? "text-white"
                  : "bg-white border-2 border-[#003366] text-[#003366]"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-[#003366] rounded-full z-0"
                  transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </motion.div>

        {/* Radio Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <p className="text-[16px] font-lexend text-[#003366]">I am a…</p>
          <div className="flex font-lexend items-center gap-6 mt-4 flex-wrap">
            {[
              "Client",
              "Family",
              "Friend",
              "Team Member",
              "Community Member",
              "Other",
            ].map((label) => (
              <label
                key={label}
                className="flex font-lexend items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="userType"
                  value={label}
                  className="sr-only peer font-lexend"
                  required
                />
                <span className="text-[#003366]">{label}</span>
                <span className="h-5 w-5 bg-white rounded-full border border-[#003366] peer-checked:bg-[#003366] peer-checked:ring-2 peer-checked:ring-white peer-checked:ring-inset transition-all duration-500"></span>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Input Forms */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          className="mt-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="font-lexend text-[#003366]">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="w-full mt-2 px-4 py-3 rounded-full bg-white outline-none shadow-sm focus:ring-2 focus:ring-[#003366]"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="font-lexend text-[#003366]">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="w-full mt-2 px-4 py-3 rounded-full bg-white outline-none shadow-sm focus:ring-2 focus:ring-[#003366]"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-lexend text-[#003366]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full mt-2 px-4 py-3 rounded-full bg-white outline-none shadow-sm focus:ring-2 focus:ring-[#003366]"
              />
            </div>
            <div>
              <label htmlFor="phone" className="font-lexend text-[#003366]">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                className="w-full mt-2 px-4 py-3 rounded-full bg-white outline-none shadow-sm focus:ring-2 focus:ring-[#003366]"
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="message" className="font-lexend text-[#003366]">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              className="w-full mt-2 h-48 rounded-3xl bg-white p-6 resize-none outline-none shadow-sm focus:ring-2 focus:ring-[#003366]"
            ></textarea>
          </div>

          <p className="mt-6 text-sm text-[#003366]/70">
            By submitting this form, you agree to our{" "}
            <Link href="/Privacy" className="underline text-[#003366]">
              Privacy Policy
            </Link>
            . We will only use your information to process your feedback.
          </p>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending}
            className="mt-8 px-10 py-3 rounded-full bg-[#003366] text-white font-lexendBold hover:bg-[#022c5a] transition duration-500 disabled:opacity-50"
          >
            {isPending ? "Submitting…" : "Submit"}
          </motion.button>

          <AnimatePresence>
            {/* Success State */}
            {state?.success && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-4 text-green-900 font-semibold"
              >
                Thank you! Your {activeTab.toLowerCase()} was sent successfully.
              </motion.p>
            )}

            {/* Error State: Only shows if success is false AND a message exists */}
            {state?.success === false && state.message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-red-600 font-semibold"
              >
                {state.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </form>
    </div>
  );
}
