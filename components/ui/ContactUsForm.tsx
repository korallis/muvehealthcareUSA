"use client";
import { useActionState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FormState, sendContactEmail } from "@/lib/actions/contactEmails";
export default function ContactForm() {
  const initialState: FormState = {
    success: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(
    sendContactEmail,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input
        name="fullName"
        placeholder="Full Name*"
        required
        className="w-full font-lexend bg-white rounded-[25px] py-3 px-5 text-sm outline-none focus:ring-2 focus:ring-[#12D7E8]"
      />
      <input
        name="phone"
        placeholder="Phone Number*"
        required
        className="w-full bg-white font-lexend rounded-[25px] py-3 px-5 text-sm outline-none focus:ring-2 focus:ring-[#12D7E8]"
      />
      <input
        name="email"
        type="email"
        placeholder="Email Address*"
        required
        className="w-full bg-white font-lexend rounded-[25px] py-3 px-5 text-sm outline-none focus:ring-2 focus:ring-[#12D7E8]"
      />
      <textarea
        name="message"
        placeholder="Message*"
        rows={4}
        required
        className="w-full bg-white font-lexend rounded-[25px] py-3 px-5 text-sm outline-none resize-none focus:ring-2 focus:ring-[#12D7E8]"
      />

      <p className="text-xs text-gray-400">
        By submitting this form, you agree to our{" "}
        <Link href="/Privacy" className="underline text-[#12D7E8]">
          Privacy Policy
        </Link>
        . We will only use your information to respond to your enquiry.
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isPending}
        className="w-full text-white font-lexendBold text-lg bg-[#12D7E8] py-3 rounded-[25px] hover:brightness-110 shadow-lg disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Submit"}
      </motion.button>

      {state?.message && (
        <p
          className={`text-center text-sm mt-4 ${state.success ? "text-green-400" : "text-red-400"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
