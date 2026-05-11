"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1F3154]">
          Something went wrong
        </h2>
        <p className="mt-2 text-gray-600">
          We apologise for the inconvenience. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-4 rounded bg-[#1F3154] px-4 py-2 text-white hover:bg-[#2a4170]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
