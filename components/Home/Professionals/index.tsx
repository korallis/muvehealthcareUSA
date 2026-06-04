"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROFESSIONALS_ASSETS, PROFESSIONALS_CARD_DATA, CLIENTS_CARD_DATA } from "@/constants/professionalsConstants";

interface ProfessionalsProps {
  title?: string;
  description?: string;
}

export default function Professionals({ title }: ProfessionalsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full relative overflow-hidden pt-12 pb-16 px-4 bg-[#D4E2FF]">
      {/* Decorative background squiggles pattern */}
      <div id="for-professionals-and-clients" className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src={PROFESSIONALS_ASSETS.bgImageSrc}
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
              hover:-translate-y-2
              transition-all duration-500 ease-out
              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <h3 className="text-[34px] sm:text-[48px] font-lexendBold text-[#07004C] mb-5 p-2 sm:p-4 tracking-tight flex flex-wrap gap-2">
              {title ? (
                title
              ) : (
                <>
                  {PROFESSIONALS_CARD_DATA.fallbackTitleMain}{" "}
                  <span className="bg-[#fff] text-[#07004C] font-lexendBold px-2 py-0.5 rounded-md">
                    {PROFESSIONALS_CARD_DATA.fallbackTitleSpan}
                  </span>
                </>
              )}
            </h3>
            
            <div className="space-y-6 pl-2 sm:pl-4 pr-2 sm:pr-4">
              {PROFESSIONALS_CARD_DATA.benefits.map((benefit, idx) => (
                <div key={idx} className="group/item transition-transform">
                  <p className="font-lexendBold text-[18px] sm:text-[21px] text-[#07004C] leading-snug">
                    {benefit.title}
                  </p>
                  <p className="font-lexendBold text-[16px] sm:text-[21px] text-[#07004C] opacity-90">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-start mt-10 sm:mt-18 mb-6 sm:mb-10 pl-2 sm:pl-4 pr-2 sm:pr-4">
              <Link href={PROFESSIONALS_CARD_DATA.btnHref} className="inline-block w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-[#07004C] text-[#fff] font-lexendBold text-[18px] sm:text-[20px] px-8 py-2 rounded-full 
                                   hover:scale-105 hover:bg-[#0d176d] active:scale-95 transition-all duration-200 tracking-wide">
                  {PROFESSIONALS_CARD_DATA.btnText}
                </button>
              </Link>
            </div>
          </div>

          {/* For Clients Card */}
          <div 
            style={{ transitionDelay: mounted ? "250ms" : "0ms" }}
            className={`group flex-1 bg-[#82AAFF] rounded-[2.5em] sm:rounded-[4em] p-4 sm:p-6 relative
              hover:-translate-y-2
              transition-all duration-500 ease-out
              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <h3 className="text-[34px] sm:text-[48px] font-lexendBold text-[#fff] mb-5 p-2 sm:p-4 tracking-tight flex flex-wrap gap-2">
              {CLIENTS_CARD_DATA.fallbackTitleMain}{" "}
              <span className="bg-[#07004C] text-[#fff] font-lexendBold px-2 py-0.5 rounded-md">
                {CLIENTS_CARD_DATA.fallbackTitleSpan}
              </span>
            </h3>

            <div className="space-y-6 pl-2 sm:pl-4 pr-2 sm:pr-4">
              {CLIENTS_CARD_DATA.benefits.map((benefit, idx) => (
                <div key={idx} className="group/item transition-transform duration-300">
                  <p className="font-lexendBold text-[18px] sm:text-[21px] text-[#fff] leading-snug">
                    {benefit.title}
                  </p>
                  <p className="font-lexendBold text-[16px] sm:text-[21px] text-[#fff] opacity-90 mt-0">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-start mt-10 sm:mt-18 mb-6 sm:mb-10 pl-2 sm:pl-4 pr-2 sm:pr-4">
              <Link href={CLIENTS_CARD_DATA.btnHref} className="inline-block w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-[#07004C] text-[#fff] font-lexendBold text-[18px] sm:text-[20px] px-8 py-2 rounded-full 
                                   hover:scale-105 hover:bg-[#0d176d] active:scale-95 transition-all duration-200 tracking-wide">
                  {CLIENTS_CARD_DATA.btnText}
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
