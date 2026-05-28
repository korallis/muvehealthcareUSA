"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { categories } from "@/constants/workData";

interface WorkwithusProps {
  title?: string;
  description?: string;
}

// Strictly type the nested location schema returned by the Nexus backend
interface JobLocation {
  city: string;
  state: string;
}

// Strictly type the unified LaborEdge job data model structure
interface LaborEdgeJob {
  jobId?: number | string;
  id?: number | string;
  title?: string;
  jobType?: string;
  type?: string;
  jobLocation?: JobLocation;
  location?: string;
  weeklyGrossPay?: number | string;
  listed?: string;
  status?: string;
  portalUrl?: string;
  jobUrl?: string;
  applyUrl?: string;
}

export default function WorkWithUsToo({ title }: WorkwithusProps) {
  const [current, setCurrent] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);
  const [liveJobs, setLiveJobs] = useState<LaborEdgeJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

    const [isMobile, setIsMobile] = useState(false);

  // Unified Lifecycle Effect: Sets up animations, state tracking, and pulls live jobs.
  useEffect(() => {
    // 1. Trigger the entry / onload animations
    const animationTimer = setTimeout(() => setMounted(true), 50);

    // 2. Safe mobile width viewport listener
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize(); // Evaluate instantly on load
    window.addEventListener('resize', handleResize);

    // 3. Connect to LaborEdge API endpoint
    async function loadJobsFromApi(): Promise<void> {
      try {
        const response = await fetch("/api/laborEdge"); // Calls File 1 directly
        if (response.ok) {
          const data = await response.json() as LaborEdgeJob[];
          setLiveJobs(data); // Injects the live jobs into table design
        }
      } catch (err) {
        console.error("Could not load jobs:", err);
      } finally {
        setLoading(false);
      }
    }

    loadJobsFromApi();

    // Cleanup all listeners and timers on unmount to prevent memory leaks
    return () => {
      clearTimeout(animationTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  // Handler to safely open specific job links in a new browser tab
  const handleJobRedirect = (job: LaborEdgeJob, isApplyAction: boolean = false): void => {
    // 1. Fallback cascade to catch any absolute links if provided by the backend response
    let destinationUrl = job.portalUrl || job.jobUrl || job.applyUrl;

    // 2. Structural resolution: Construct your agency's verified portal path dynamically
    if (!destinationUrl) {
      const activeId = job.jobId || job.id;
      if (activeId) {
        destinationUrl = `https://nexus-leap.laboredge.com/MUVE/job-details-view/${activeId}`;
        
        // Append the application workflow flag if the user clicked the "Apply" button
        if (isApplyAction) {
          destinationUrl += "?action=apply";
        }
      }
    }
    
    if (destinationUrl) {
      window.open(destinationUrl, "_blank", "noopener,noreferrer");
    } else {
      console.warn("Unable to resolve a valid destination context path for job entry configuration:", job);
    }
  };

  const prev = (): void => setCurrent((c) => (c === 0 ? categories.length - 1 : c - 1));
  const next = (): void => setCurrent((c) => (c === categories.length - 1 ? 0 : c + 1));

  const visible = [
    categories[current % categories.length],
    categories[(current + 1) % categories.length],
    categories[(current + 2) % categories.length],
  ];

  return (
    <div id="work-with-us" className="w-full relative overflow-hidden"
    style={{
        background: "linear-gradient(180deg, #40E2B8 0%, #45E3BA 35%, #78EACD 58%, #A2F0DC 80%, #B3F3E3 91%, #B3F3E3 100%)",
      }}
    >

      {/* ── WORK WITH US ── */}
      <div className="py-14 px-4 relative max-w-6xl mx-auto">
        <div className={`text-center mb-10 transition-all duration-700 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E1552] inline-flex items-center justify-center flex-wrap gap-3">
            {title ? (
              title
            ) : (
              <>
                <span className="bg-[#0E1552] text-white px-4 py-1 rounded-md">Work</span>
                <span>With Us</span>
              </>
            )}
          </h2>
        </div>

        <div className="relative flex items-center gap-0 w-full">
          {/* Previous Button - Overlay absolute on mobile to maximize viewport track */}
          <button onClick={prev} aria-label="Previous"
            className="flex-shrink-0 w-10 h-10 rounded-full bg-[#4C86FF] text-[#FFFFFF] font-lexendBold flex items-center justify-center
                    hover:scale-110 active:scale-95 transition-transform duration-200 z-20 absolute -left-2 sm:static">
            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Mask container preserving layout boundary bounds */}
          <div className="flex-1 overflow-hidden mx-0 sm:mx-0">
            <div 
              className="grid gap-4 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${(current * 100) / (isMobile ? 1 : 3)}%)`,
                width: `${(categories.length * 100) / (isMobile ? 1 : 3)}%`,
                display: 'grid',
                gridTemplateColumns: `repeat(${categories.length}, 1fr)`
              }}
            >
              {categories.map((cat, idx) => (
                <div
                  key={`${cat.id}-${idx}`}
                  style={{ transitionDelay: mounted ? `${idx * 120}ms` : '0ms' }}
                  className={`group rounded-b-4xl overflow-hidden bg-white
                              hover:-translate-y-2 hover:scale-[1.02]
                              transition-all duration-500 ease-out
                              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                  <div className="w-full h-48 sm:h-60 relative overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover  group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 bg-white">
                    <h3 className="text-[#0E1552] text-center font-lexendBold text-[24px] sm:text-[30px] mb-2 group-hover:text-teal-600 transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <p className="text-[#0E1552] font-lexend text-center text-[14px] sm:text-[16px] leading-relaxed">{cat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button - Overlay absolute on mobile to maximize viewport track */}
          <button onClick={next} aria-label="Next"
            className="flex-shrink-0 w-10 h-10 rounded-full bg-[#4C86FF] text-[#FFFF] flex items-center justify-center
                    hover:scale-110 active:scale-95 transition-transform duration-200 z-20 absolute -right-2 sm:static">
            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── IT STARTS HERE ── */}
      <div className="py-14 px-4 max-w-6xl mx-auto">
        <div className={`text-center mb-10 transition-all duration-700 delay-300 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 className="text-3xl sm:text-4xl font-lexendBold text-[#0E1552] inline-flex items-center justify-center flex-wrap gap-3">
            <span>It</span>
            <span className="bg-[#FFFFFF] text-[#0E1552] px-4 py-1 rounded-md">Starts</span>
            <span>Here</span>
          </h2>
        </div>

        {/* Display Jobs cards from LaborEdge API */}
        <div className={`w-full bg-[#0E1552] rounded-3xl sm:rounded-4xl p-4 sm:p-8
                      transition-all duration-700 delay-500 ease-out
                      ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ overflow: "hidden" }}>
        
          {/* Inner scroll wrapper */}
          <div className="overflow-y-auto space-y-3 pr-1"
            style={{
              maxHeight: "360px",
              scrollbarWidth: "thin",             /* Firefox */
              scrollbarColor: "#3DDDB3 #0E1552",  /* Firefox thumb / track */
            }}
          >
            {loading ? (
              <div className="text-white text-center py-8 font-lexend text-[16px]">
                Loading available jobs...
              </div>
            ) : liveJobs.length === 0 ? (
              <div className="text-white text-center py-8 font-lexend text-[16px]">
                No jobs available right now.
              </div>
            ) : (
              liveJobs.map((job, idx) => (
                <div
                  key={job.jobId || job.id || idx}
                  onClick={() => handleJobRedirect(job, false)}
                  style={{ transitionDelay: mounted ? `${600 + idx * 80}ms` : '0ms' }}
                  className={`bg-white rounded-2xl sm:rounded-full px-5 sm:px-10 py-5 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4
                              cursor-pointer transition-all duration-300 ease-out
                              ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}>

                  <div className="min-w-0 sm:min-w-[120px] text-center sm:text-left">
                    <p className="text-[#07004C] font-lexendBold text-[18px] sm:text-[20px] break-words">{job.title || 'Healthcare Assignment'}</p>
                    <p className="text-[#07004C] text-[14px] sm:text-[16px] font-lexend mt-1 sm:mt-0">
                      {job.jobType || job.type || 'Contract'} | {job.jobLocation ? `${job.jobLocation.city}, ${job.jobLocation.state}` : (job.location || 'Nationwide')}
                    </p>
                  </div>

                  {/* Show on mobile under the header, or seamlessly in grid on desktop */}
                  <p className="text-[#07004C] text-[15px] sm:text-[16px] font-lexend block text-center">
                    {job.weeklyGrossPay ? `Weekly Pay: $${job.weeklyGrossPay}` : `Listed ${job.listed || 'Recently'}`}
                  </p>

                  <p className="text-[#07004C] font-lexend text-[15px] sm:text-[16px] block sm:hidden md:block whitespace-nowrap text-center">
                    Status: <span className="text-[#0E1552] font-semibold">{job.status || 'Active'}</span>
                  </p>

                  <div className="flex gap-2 justify-center sm:justify-end flex-shrink-0" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                    <button onClick={() => handleJobRedirect(job, false)} className="bg-[#07004C] text-[#FFFF] text-[14px] sm:text-[16px] font-lexendBold px-5 sm:px-4 py-2 sm:py-1.5 rounded-full
                                       hover:brightness-110 active:scale-95 transition-all duration-150 flex-1 sm:flex-none">
                      View
                    </button>
                    <button onClick={() => handleJobRedirect(job, true)} className="bg-[#4C86FF] text-[#fff] text-[14px] sm:text-xs font-lexendBold px-5 sm:px-4 py-2 sm:py-1.5 rounded-full
                                       hover:bg-[#3DDDB3] hover:text-[#0E1552] active:scale-95 transition-all duration-150 flex-1 sm:flex-none">
                      Apply
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}