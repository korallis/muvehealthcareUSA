"use client";

import { useState, useEffect } from "react";
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
    <span className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#4A79F7] text-white font-lexendBold text-[30px] select-none shadow-md group-hover:scale-110 transition-transform duration-300">
      ✕
    </span>
  );
}

function IconCheck() {
  return (
    <span className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#3DDDB3] text-white font-lexendBold text-[30px] select-none shadow-md group-hover:scale-110 transition-transform duration-300">
      ✓
    </span>
  );
}

interface SpecialtiesProps {
  title?: string;
  description?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Specialities({ title }: SpecialtiesProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div 
      className="w-full relative overflow-hidden pt-12 pb-16 px-4"
      style={{
        background: "linear-gradient(180deg, #A5C2FF 0%, #A5C2FF 30%, #1A267F 65%, #07004C 75%, #07004C 100%)",
      }}
    >
      {/* Decorative background squiggles pattern - Ultra-slow ambient load zoom */}
      <div id="specialities" className="absolute -top-205 inset-0 pointer-events-none select-none z-0">
        <Image
          src="/patterns/bg-squiggles.svg"
          alt=""
          fill
          className="object-contain opacity-80 transition-transform duration-[10000ms] ease-out"
          style={{ transform: mounted ? "scale(1.03)" : "scale(1)" }}
          priority
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* ─── Section 1: Comparison Cards ─── */}
        <div 
          className={`flex flex-col sm:flex-row justify-center items-stretch gap-6 mx-2 sm:mx-10 mt-10 sm:mt-20 mb-8 transition-all duration-700 ease-out
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          
          {/* Say Goodbye Card */}
          <div className="group/card flex-1 border border-15 border-white rounded-4xl p-6 relative bg-transparent hover:-translate-y-2 hover:bg-white/5 hover:shadow-[0_20px_40px_rgba(7,0,76,0.1)] transition-all duration-500 ease-out">
            <div className="absolute -top-3 right-4 sm:-right-5">
              <IconX />
            </div>
            <h3 className="text-[32px] sm:text-[48px] font-lexendBold text-[#07004C] mb-5 tracking-tight">
              Say{" "}
              <span className="inline-block bg-[#4A79F7] text-[#07004C] font-lexendBold px-2 py-0.5 rounded-md mx-0.5 group-hover/card:scale-105 transition-transform duration-300">
                Goodbye
              </span>{" "}
              To
            </h3>
            <ul className="space-y-2.5">
              {goodbyeItems.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[18px] sm:text-[20px] text-[#07004C] font-lexendBold transition-transform duration-300 hover:translate-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B256B] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Say Hello Card */}
          <div className="group/card flex-1 bg-[#82AAFF] rounded-4xl p-6 relative shadow-sm hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(7,0,76,0.15)] transition-all duration-500 ease-out">
            <div className="absolute -top-3 right-4 sm:-right-5">
              <IconCheck />
            </div>
            <h3 className="text-[32px] sm:text-[48px] font-lexendBold text-[#07004C] mb-5 tracking-tight">
              Say{" "}
              <span className="inline-block bg-white text-[#0B256B] px-2 py-0.5 rounded-md mx-0.5 group-hover/card:scale-105 transition-transform duration-300">
                Hello
              </span>{" "}
              To
            </h3>
            <ul className="space-y-2.5">
              {helloItems.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[18px] sm:text-[20px] text-[#07004C] font-lexendBold transition-transform duration-300 hover:translate-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B256B] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Get Started Button */}
        <div 
          className={`flex justify-center mb-10 transition-all duration-700 delay-200 ease-out
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <button className="bg-[#07004C] text-white font-lexendBold text-[22px] sm:text-[25px] px-9 py-2.5 rounded-full hover:scale-105 hover:bg-[#03236d] active:scale-95 transition-all duration-200 tracking-wide shadow-md">
            Get Started
          </button>
        </div>

        {/* Thin Divider Line */}
        <div className="w-full max-w-[500px] h-[4px] bg-white mx-auto mb-12" />

        {/* ─── Section 2: Specialties Header ─── */}
        <div 
          className={`text-center mb-10 sm:mb-18 transition-all duration-700 delay-300 ease-out
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2 className="text-[36px] sm:text-[60px] font-black text-white tracking-tight flex items-center justify-center flex-wrap gap-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 mb-10">
          {specialities.map((spec, idx) => (
            <div
              key={spec.id}
              style={{ transitionDelay: mounted ? `${400 + idx * 120}ms` : "0ms" }}
              className={`group/spec bg-white rounded-b-4xl overflow-hidden shadow-md flex flex-col
                hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(7,0,76,0.2)]
                transition-all duration-500 ease-out
                ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
            >
              {/* Image Box */}
              <div className="w-full h-48 sm:h-60 relative overflow-hidden">
                <Image
                  src={spec.image}
                  alt={spec.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover/spec:scale-110 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Text Context */}
              <div className="p-6 sm:p-8 flex flex-col flex-grow bg-[#DBE7FF]">
                <h3 className="text-[#07004C] text-left font-lexendBold text-[22px] sm:text-[26px] mb-2 group-hover/spec:text-teal-600 transition-colors duration-300">
                  {spec.title}
                </h3>
                <p className="text-[#07004C] font-lexend text-left text-[14px] sm:text-[16px] leading-relaxed">
                  {spec.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Find Your Team Button */}
        <div 
          className={`flex justify-center transition-all duration-700 delay-700 ease-out
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Link href="ApplicationForm" className="inline-block w-full sm:w-auto text-center">
            <button className="w-full sm:w-auto bg-[#40E2B8] text-[#07004C] font-lexendBold text-[18px] sm:text-[20px] px-8 py-2.5 rounded-full hover:scale-105 hover:bg-[#2bc49d] active:scale-95 transition-all duration-200 tracking-wide shadow-md">
              Find Your Team
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
