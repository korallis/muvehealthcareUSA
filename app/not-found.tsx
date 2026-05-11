import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#918CF2] via-[#9590F2] to-[#B2AEF6] px-6">
      <div className="mx-auto max-w-7xl py-24">
        <h1 className="text-white text-5xl md:text-6xl font-lexendBold mb-6">
          Uh-oh!
        </h1>

        <h2 className="text-[#1E2A4A] text-6xl md:text-7xl font-lexendBold mb-6">
          404: Page Not Found
        </h2>

        <p className="max-w-xl text-[#1E2A4A]/80 text-lg mb-10 font-lexend">
          <b>Well, this is awkward.</b>
          <br />
          The link you followed might be missing or moved, but don’t worry,
          we’ll help you find your way back.
        </p>

        <div className="flex flex-wrap gap-4">
          <button className="rounded-full bg-[#1E2A4A] px-6 py-3 text-white font-semibold hover:bg-[#16203A] transition">
            Log this error
          </button>

          <Link
            href="/"
            className="rounded-full border-2 border-[#1E2A4A] px-6 py-3 font-semibold text-[#1E2A4A] hover:bg-[#1E2A4A] hover:text-white transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </section>
  );
}
