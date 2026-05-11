"use client";

import { useState, Suspense } from "react";
import { signupAction } from "@/lib/actions/auth";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Get token and email from URL (e.g., /register?token=123&email=test@me.com)
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const invitedEmail = searchParams.get("email");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Explicitly add the token to the formData if it exists in the URL
    if (token) {
      formData.append("token", token);
    }

    const result = await signupAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(
        token ? "Admin account created!" : "Account created! Redirecting...",
      );
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
      {/* Invitation Badge */}
      {token && (
        <div className="mb-6 p-3 bg-cyan-50 border border-cyan-100 text-[#1F3154] text-xs rounded-xl font-lexendBold flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#00D9DA]"></span>
          Admin Invitation Active
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-lexend">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-lexend">
            {success}
          </div>
        )}

        <div>
          <label className="block text-sm font-lexendBold text-gray-700">
            Full Name
          </label>
          <input
            name="name"
            type="text"
            required
            className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-lexendBold text-gray-700">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            required
            defaultValue={invitedEmail || ""}
            readOnly={!!invitedEmail} // Prevent invited admins from changing their email
            className={`mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] focus:border-transparent outline-none transition-all ${invitedEmail ? "bg-gray-50 text-gray-500" : ""}`}
          />
        </div>

        <div>
          <label className="block text-sm font-lexendBold text-gray-700">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] focus:border-transparent outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-lexendBold text-white bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] transition-all disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : token
              ? "Complete Admin Setup"
              : "Create Account"}
        </button>
      </form>
    </div>
  );
}

// Wrapper to handle Suspense for useSearchParams
export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md mb-8"
      >
        <h2 className="text-center text-3xl font-lexendBold text-[#1F3154]">
          Join the Team<span className="text-[#00D9DA]">.</span>
        </h2>
      </motion.div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense
          fallback={
            <div className="text-center font-lexend">Loading form...</div>
          }
        >
          <SignupForm />
        </Suspense>

        <div className="mt-6 text-center text-sm font-lexend">
          <Link
            href="/auth/login"
            className="text-gray-500 hover:text-[#00D9DA]"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
