"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { categories, jobs } from "@/constants/workData"; // Update path if needed

export default function WorkWithUs() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const prev = () => setCurrent((c) => (c === 0 ? categories.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === categories.length - 1 ? 0 : c + 1));

  const visible = [
    categories[current % categories.length],
    categories[(current + 1) % categories.length],
    categories[(current + 2) % categories.length],
  ];

  return (
    <div className="w-full relative overflow-hidden"
    style={{
        background: "linear-gradient(180deg, #40E2B8 0%, #45E3BA 35%, #78EACD 58%, #A2F0DC 80%, #B3F3E3 91%, #B3F3E3 100%)",
      }}
    >


      {/* ── WORK WITH US ── */}
      <div className="py-14 px-4">
        <div className={`text-center mb-10 transition-all duration-700 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}>
          <h2 className="text-4xl font-extrabold text-[#0E1552] inline-flex items-center gap-3">
            <span className="bg-[#0E1552] text-white px-4 py-1 rounded-md">Work</span>
            <span>With Us</span>
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={prev} aria-label="Previous"
            className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-[#0E1552] flex items-center justify-center
                    hover:scale-110 active:scale-95 transition-transform duration-200 z-10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {visible.map((cat, idx) => (
              <div
                key={`${cat.id}-${idx}`}
                style={{ transitionDelay: `${idx * 120}ms` }}
                className={`group rounded-b-4xl overflow-hidden bg-white
                            hover:-translate-y-2 hover:scale-[1.02]
                            transition-all duration-500 ease-out
                            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <div className="w-full h-60 relative overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover opacity-75 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 bg-white">
                  <h3 className="text-[#0E1552] text-center font-lexendBold text-[30px] mb-2 group-hover:text-teal-600 transition-colors duration-300">
                    {cat.title}
                  </h3>
                  <p className="text-[#0E1552] font-lexend text-center text-[16px] leading-relaxed">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={next} aria-label="Next"
            className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-[#0E1552] flex items-center justify-center
                    hover:scale-110 active:scale-95 transition-transform duration-200 z-10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── IT STARTS HERE ── */}
      <div className="py-14 px-4">
        <div className={`text-center mb-10 transition-all duration-700 delay-300 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 className="text-4xl font-lexendBold text-[#0E1552] inline-flex items-center gap-3">
            <span>It</span>
            <span className="bg-[#3DDDB3] text-[#0E1552] px-4 py-1 rounded-md">Starts</span>
            <span>Here</span>
          </h2>
        </div>

        {/* Jobs cards */}
        <div className={`max-w-6xl mx-auto bg-[#0E1552] rounded-4xl p-8
                      transition-all duration-700 delay-500 ease-out
                      ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ overflow: "hidden" }}>
        
          {/* Inner scroll wrapper */}
          <div className="overflow-y-auto space-y-3 pr-1"
            style={{
              maxHeight: "320px",
              scrollbarWidth: "thin",             /* Firefox */
              scrollbarColor: "#3DDDB3 #0E1552",  /* Firefox thumb / track */
            }}
          >
            {jobs.map((job, idx) => (
              <div
                key={job.id}
                style={{ transitionDelay: `${600 + idx * 80}ms` }}
                className={`bg-white rounded-full px-10 py-8 flex items-center justify-between gap-4
                            cursor-pointer transition-all duration-300 ease-out
                            ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}>

                <div className="min-w-[120px]">
                  <p className="text-[#07004C] font-lexendBold text-[20px]">{job.title}</p>
                  <p className="text-[#07004C] text-[16px] font-lexend">{job.type} | {job.location}</p>
                </div>

                <p className="text-[#07004C] text-[16px] font-lexend hidden sm:block text-center">
                  Listed {job.listed}
                </p>

                <p className="text-[#07004C] font-lexend text-[16px] hidden sm:block whitespace-nowrap">
                  Status: <span className="text-[#0E1552] font-semibold">{job.status}</span>
                </p>

                <div className="flex gap-2 flex-shrink-0">
                  <button className="bg-[#07004C] text-[#FFFF] text-[16px] font-lexendBold px-4 py-1.5 rounded-full
                                     hover:brightness-110 active:scale-95 transition-all duration-150">
                    View
                  </button>
                  <button className="bg-[#4C86FF] text-[#fff] text-xs font-lexendBold px-4 py-1.5 rounded-full
                                     hover:bg-[#3DDDB3] hover:text-[#0E1552] active:scale-95 transition-all duration-150">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
