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

interface ProfessionalsProps {
  title?: string;
  description?: string;
}
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

// ─── Component ───────────────────────────────────────────────────────────────

export default function Professionals({ title }: ProfessionalsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div 
      className="w-full relative overflow-hidden pt-12 pb-16 px-4 bg-[#D4E2FF]"
    >
      {/* Decorative background squiggles pattern */}
      <div id="for-professionals-and-clients" className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/patterns/background.svg"
          alt=""
          fill
          className="w-full h-full object-cover opacity-90 transition-transform duration-[10000ms] ease-out scale-100"
          style={{ transform: mounted ? "scale(1.05)" : "scale(1)" }}
          priority
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-10 mt-10 sm:mt-20 mb-8">
          
            {/* For Professionals Card */}
            <div 
              style={{ transitionDelay: mounted ? "100ms" : "0ms" }}
              className={`group flex-1 bg-[#40E2B8] rounded-[2.5em] sm:rounded-[4em] p-4 sm:p-6 relative
                hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(7,0,76,0.15)]
                transition-all duration-500 ease-out
                ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
            >
                <h3 className="text-[34px] sm:text-[48px] font-lexendBold text-[#07004C] mb-5 p-2 sm:p-4 tracking-tight flex flex-wrap gap-2">
                  {title ? (
                    title
                  ) : (
                    <>
                      For{" "}
                      <span className="bg-[#fff] text-[#07004C] font-lexendBold px-2 py-0.5 rounded-md group-hover:tracking-wide transition-all duration-300">
                        Professionals
                      </span>
                    </>
                  )}
                </h3>
                
                <div className="space-y-6 pl-2 sm:pl-4 pr-2 sm:pr-4">
                  <div className="group/item transition-transform duration-300 hover:translate-x-1">
                    <p className="font-lexendBold text-[18px] sm:text-[21px] text-[#07004C] leading-snug">
                        24/7 Support
                    </p>
                    <p className="font-lexend text-[16px] sm:text-[18px] text-[#07004C] opacity-90 mt-1">
                        Call, email or message anytime. We’re always here to help.
                    </p>
                  </div>

                  <div className="group/item transition-transform duration-300 hover:translate-x-1">
                    <p className="font-lexendBold text-[18px] sm:text-[21px] text-[#07004C] leading-snug">
                        Fast, Simple Applications
                    </p>
                    <p className="font-lexend text-[16px] sm:text-[18px] text-[#07004C] opacity-90 mt-1">
                        Apply from your phone with smooth onboarding and dedicated support.
                    </p>
                  </div>

                  <div className="group/item transition-transform duration-300 hover:translate-x-1">
                    <p className="font-lexendBold text-[18px] sm:text-[21px] text-[#07004C] leading-snug">
                        Training Support
                    </p>
                    <p className="font-lexend text-[16px] sm:text-[18px] text-[#07004C] opacity-90 mt-1">
                        We help with certifications, licensing and compliance at no cost.
                    </p>
                  </div>
                </div>

                <div className="flex justify-start mt-10 sm:mt-18 mb-6 sm:mb-10 pl-2 sm:pl-4 pr-2 sm:pr-4">
                  <Link href="ApplicationForm" className="inline-block w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-[#07004C] text-[#fff] font-lexendBold text-[18px] sm:text-[20px] px-8 py-2.5 rounded-full 
                                       hover:scale-105 hover:bg-[#0d176d] active:scale-95 transition-all duration-200 tracking-wide shadow-md">
                        Find Your Team
                    </button>
                  </Link>
                </div>
                
            </div>

            {/* For Clients Card */}
            <div 
              style={{ transitionDelay: mounted ? "250ms" : "0ms" }}
              className={`group flex-1 bg-[#82AAFF] rounded-[2.5em] sm:rounded-[4em] p-4 sm:p-6 relative
                hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(7,0,76,0.15)]
                transition-all duration-500 ease-out
                ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
            >
                <h3 className="text-[34px] sm:text-[48px] font-lexendBold text-[#fff] mb-5 p-2 sm:p-4 tracking-tight flex flex-wrap gap-2">
                  For{" "}
                  <span className="bg-[#07004C] text-[#fff] font-lexendBold px-2 py-0.5 rounded-md group-hover:tracking-wide transition-all duration-300">
                      Clients
                  </span>
                </h3>

                <div className="space-y-6 pl-2 sm:pl-4 pr-2 sm:pr-4">
                  <div className="group/item transition-transform duration-300 hover:translate-x-1">
                    <p className="font-lexendBold text-[18px] sm:text-[21px] text-[#07004C] leading-snug">
                        24/7 Support
                    </p>
                    <p className="font-lexend text-[16px] sm:text-[18px] text-[#07004C] opacity-90 mt-1">
                        Call, email or message anytime. We’re always here to help.
                    </p>
                  </div>

                  <div className="group/item transition-transform duration-300 hover:translate-x-1">
                    <p className="font-lexendBold text-[18px] sm:text-[21px] text-[#07004C] leading-snug">
                        Fast, Simple Applications
                    </p>
                    <p className="font-lexend text-[16px] sm:text-[18px] text-[#07004C] opacity-90 mt-1">
                        Apply from your phone with smooth onboarding and dedicated support.
                    </p>
                  </div>

                  <div className="group/item transition-transform duration-300 hover:translate-x-1">
                    <p className="font-lexendBold text-[18px] sm:text-[21px] text-[#07004C] leading-snug">
                        Training Support
                    </p>
                    <p className="font-lexend text-[16px] sm:text-[18px] text-[#07004C] opacity-90 mt-1">
                        We help with certifications, licensing and compliance at no cost.
                    </p>
                  </div>
                </div>

                <div className="flex justify-start mt-10 sm:mt-18 mb-6 sm:mb-10 pl-2 sm:pl-4 pr-2 sm:pr-4">
                  <Link href="ApplicationForm" className="inline-block w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-[#fff] text-[#07004C] font-lexendBold text-[18px] sm:text-[20px] px-8 py-2.5 rounded-full 
                                       hover:scale-105 hover:bg-[#f0f4ff] active:scale-95 transition-all duration-200 tracking-wide shadow-md">
                        Find Your Team
                    </button>
                  </Link>
                </div>
                
            </div>

        </div>

      </div>
    </div>
  );
}
