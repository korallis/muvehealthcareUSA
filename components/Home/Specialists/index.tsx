"use client";

import Image from "next/image";
import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const goodbyeItems = [
  "Overpromising recruiters",
  "Onboarding delays",
  "Costly cancellations",
];

const helloItems = [
  "Right first time",
  "Clear communication",
  "Reliable support",
];

const specialities = [
  {
    id: 1,
    title: "Allied Health",
    description:
      "We provide allied health professionals across surgery, respiratory care, laboratories, pharmacy, radiology, cardiovascular services and therapy roles.",
    image: "/blog/blog.png",
    alt: "Allied Health professionals smiling",
  },
  {
    id: 2,
    title: "Nurses",
    description:
      "We provide nurses across acute care, palliative care, rehabilitation, outpatient services and ambulatory care.",
    image: "/blog/blog.png",
    alt: "Nurse smiling at camera",
  },
  {
    id: 3,
    title: "Physicians, APRNs and Locum Tenens",
    description:
      "We provide physicians, APRNs and locum tenens professionals across all specialties.",
    image: "/blog/blog.png",
    alt: "Physicians and medical staff",
  },
];

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconX() {
  return (
    <span className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#4A79F7] text-white font-lexendBold text-[30px] select-none">
      ✕
    </span>
  );
}

function IconCheck() {
  return (
    <span className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#3DDDB3] text-white font-lexendBold text-[30px] select-none shadow-sm">
      ✓
    </span>
  );
}

interface SpecialtiesProps {
  title?: string;
  description?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Specialities({ title }:SpecialtiesProps) {
  return (
    <div 
      className="w-full relative overflow-hidden pt-12 pb-16 px-4"
      style={{
        background: "linear-gradient(180deg, #A5C2FF 0%, #A5C2FF 30%, #1A267F 65%, #07004C 75%, #07004C 100%)",
      }}
    >
      {/* Decorative background squiggles pattern */}
      <div id="specialities" className="absolute -top-205 inset-0 pointer-events-none select-none z-0">
        <Image
          src="/patterns/bg-squiggles.svg"
          alt=""
          fill
          className="object-contain opacity-80"
          priority
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* ─── Section 1: Comparison Cards ─── */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-6 mx-10 mt-20 mb-8">
          
          {/* Say Goodbye Card */}
          <div className="flex-1 border border-15 border-white rounded-4xl p-6 relative">
            <div className="absolute -top-3 -right-5">
              <IconX />
            </div>
            <h3 className="text-[48px] font-lexendBold text-[#07004C] mb-5 tracking-tight">
              Say{" "}
              <span className="bg-[#4A79F7] text-[# 07004C] font-lexendBold px-2 py-0.5 rounded-md mx-0.5">
                Goodbye
              </span>{" "}
              To
            </h3>
            <ul className="space-y-2.5">
              {goodbyeItems.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[20px] text-[#07004C] font-lexendBold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B256B] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Say Hello Card */}
          <div className="flex-1 bg-[#82AAFF] rounded-2xl p-6 relative shadow-sm">
            <div className="absolute -top-3 -right-5">
              <IconCheck />
            </div>
            <h3 className="text-[48px] font-lexendBold text-[#07004C] mb-5 tracking-tight">
              Say{" "}
              <span className="bg-white text-[#0B256B] px-2 py-0.5 rounded-md mx-0.5">
                Hello
              </span>{" "}
              To
            </h3>
            <ul className="space-y-2.5">
              {helloItems.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[20px] text-[#07004C] font-lexendBold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B256B] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="flex justify-center mb-10">
          <button className="bg-[#07004C] text-white font-lexendBold text-[25px] px-9 py-2.5 rounded-full hover:bg-[#03236d] transition-all tracking-wide">
            Get Started
          </button>
        </div>

        {/* Thin Divider Line */}
        <div className="w-[500px] h-[4px] bg-white mx-auto mb-12" />

        {/* ─── Section 2: Specialties Header ─── */}
        <div className="text-center mb-18">
          <h2 className="text-[60px] font-black text-white tracking-tight flex items-center justify-center gap-3">
            {title ? (
                    title
                  ) : (
                    <>
            <span className="bg-[#40E2B8] text-[#fff] px-3 py-0.5 rounded-md">
              Our
            </span>
            <span className="text-[#fff] px-3 py-0.5 rounded-md">Specialities</span>
            </>
          )}
          </h2>
        </div>

        {/* ─── Specialties Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {specialities.map((spec) => (
            <div
              key={spec.id}
              className="bg-white rounded-b-4xl overflow-hidden shadow-md flex flex-col"
            >
              {/* Image Box */}
              <div className="w-full h-60 relative overflow-hidden">
                <Image
                  src={spec.image}
                  alt={spec.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Text Context */}
              <div className="p-8 flex flex-col flex-grow bg-[#DBE7FF]">
                <h3 className="text-[#07004C] text-left font-lexendBold text-[26px] mb-2 transition-colors duration-300">
                  {spec.title}
                </h3>
                <p className="text-[#07004C] font-lexend text-left text-[16px] leading-relaxed">
                  {spec.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Find Your Team Button */}
        <div className="flex justify-center">
          <Link href="ApplicationForm" className="inline-block">
            <button className="bg-[#40E2B8] text-[#07004C] font-lexendBold text-[20px] px-8 py-2.5 rounded-full hover:bg-[#2bc49d] transition-all tracking-wide">
              Find Your Team
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
