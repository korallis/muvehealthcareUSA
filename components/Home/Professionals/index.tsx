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
      className="w-full h-full object-cover opacity-90"
      priority
    />
  </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-10 mt-20 mb-8">
          
            {/* For Professionals Card */}
            <div className="flex-1 bg-[#40E2B8] rounded-[4em] p-6 relative">
                <h3 className="text-[48px] font-lexendBold text-[#07004C] mb-5 p-4 tracking-tight">
                  {title ? (
                    title
                  ) : (
                    <>
                For{" "}
                <span className="bg-[#fff] text-[#07004C] font-lexendBold px-2 py-0.5 rounded-md mx-0.5">
                    Professionals
                </span>
                </>
          )}
                </h3>
                <p className="font-lexendBold text-[21px] text-[#07004C] pl-4 pr-4">
                    24/7 Support
                    <br/>
                    Call, email or message anytime. We’re 
                    <br/>
                    always here to help.
                </p>
                <br/>
                <p className="font-lexendBold text-[21px] text-[#07004C] pl-4 pr-4">
                    Fast, Simple Applications<br/>
                    Apply from your phone with smooth<br/> 
                    onboarding and dedicated support.
                </p><br/>

                <p className="font-lexendBold text-[21px] text-[#07004C] pl-4 pr-4">
                    Training Support<br/>
                    We help with certifications, licensing and <br/>
                    compliance at no cost.
                </p>

                <div className="flex justify-left mt-18 mb-10 pl-4 pr-4">
                  <Link href="ApplicationForm" className="inline-block">
                    <button className="bg-[#07004C] text-[#fff] font-lexendBold text-[20px] px-8 py-2.5 rounded-full hover:bg-[#2bc49d] transition-all tracking-wide">
                        Find Your Team
                    </button>
                  </Link>
                </div>
                
            </div>

            {/* For Clients Card */}
            <div className="flex-1 bg-[#82AAFF] rounded-[4em] p-6 relative">
                <h3 className="text-[48px] font-lexendBold text-[#fff] mb-5 p-4 tracking-tight">
                For{" "}
                <span className="bg-[#07004C] text-[#fff] font-lexendBold px-2 py-0.5 rounded-md mx-0.5">
                    Clients
                </span>
                </h3>
                <p className="font-lexendBold text-[21px] text-[#07004C] pl-4 pr-4">
                    24/7 Support
                    <br/>
                    Call, email or message anytime. We’re 
                    <br/>
                    always here to help.
                </p>
                <br/>
                <p className="font-lexendBold text-[21px] text-[#07004C] pl-4 pr-4">
                    Fast, Simple Applications<br/>
                    Apply from your phone with smooth<br/> 
                    onboarding and dedicated support.
                </p><br/>

                <p className="font-lexendBold text-[21px] text-[#07004C] pl-4 pr-4">
                    Training Support<br/>
                    We help with certifications, licensing and <br/>
                    compliance at no cost.
                </p>

                <div className="flex justify-left mt-18 mb-10 pl-4 pr-4">
                  <Link href="ApplicationForm" className="inline-block">
                    <button className="bg-[#fff] text-[#07004C] font-lexendBold text-[20px] px-8 py-2.5 rounded-full hover:bg-[#2bc49d] transition-all tracking-wide">
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
