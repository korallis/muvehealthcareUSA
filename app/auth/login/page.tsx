"use client";

import { useState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className="text-center text-3xl font-lexendBold text-[#1F3154]">
          Welcome Back<span className="text-[#00D9DA]">.</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-lexend">
          Sign in to manage your events and careers.
        </p>
      </motion.div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-lexend">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-lexendBold text-gray-700">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] focus:border-transparent outline-none transition-all"
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500 font-lexend">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/auth/signup"
              className="text-[#00D9DA] font-lexendBold hover:underline"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
