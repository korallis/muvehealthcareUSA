"use client";

import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1F3154]">Dashboard Error</h2>
        <p className="mt-2 text-gray-600">
          Something went wrong loading this page.
        </p>
        <div className="mt-4 flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded bg-[#1F3154] px-4 py-2 text-white hover:bg-[#2a4170]"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="rounded border border-[#1F3154] px-4 py-2 text-[#1F3154] hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
