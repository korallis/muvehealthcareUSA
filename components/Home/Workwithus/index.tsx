import React, { useState, useEffect } from "react";
import { categories } from "@/constants/workData";
import { Search, MapPin, Calendar, Briefcase, RotateCcw, SlidersHorizontal, Activity, ChevronLeft, ChevronRight} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  clientCity?: string;
  clientState?: string;
  clientStateCode?: string;
  weeklyPay?: number | string;
  week1Gross?: string;
  postedDate?: string;
  jobStatus?: string;
  jobStatusCode?: string;
  specialty?: string;
}

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida",
  GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine",
  MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
  VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming"
};

const getStateFullName = (stateStr?: string): string => {
  if (!stateStr) return "";
  const cleaned = stateStr.trim();
  if (cleaned.length === 2) {
    return STATE_NAMES[cleaned.toUpperCase()] || cleaned;
  }
  return cleaned;
};

// Global utility helpers to safely resolve location, state, and date values across mock or raw API structures
const getJobLocationString = (job: LaborEdgeJob): string => {
  if (job.clientCity) {
    const rawState = job.clientState || job.clientStateCode;
    const statePart = rawState ? getStateFullName(rawState) : "";
    return statePart ? `${job.clientCity}, ${statePart}` : job.clientCity;
  }
  if (job.jobLocation) {
    const statePart = getStateFullName(job.jobLocation.state);
    return `${job.jobLocation.city}, ${statePart}`;
  }
  if (job.location) {
    const parts = job.location.split(",");
    if (parts.length > 1) {
      const city = parts[0].trim();
      const st = getStateFullName(parts[parts.length - 1]);
      return `${city}, ${st}`;
    }
    return job.location || "Nationwide";
  }
  return "Nationwide";
};

const getJobStateString = (job: LaborEdgeJob): string => {
  if (job.clientState) return getStateFullName(job.clientState);
  if (job.clientStateCode) return getStateFullName(job.clientStateCode);
  if (job.jobLocation?.state) return getStateFullName(job.jobLocation.state);
  if (job.location) {
    const parts = job.location.split(",");
    if (parts.length > 1) {
      return getStateFullName(parts[parts.length - 1]);
    }
    return getStateFullName(job.location);
  }
  return "";
};


const getFormattedDate = (dateStr?: string): string => {
  if (!dateStr) return "Recently";
  const parsedMs = Date.parse(dateStr);
  if (isNaN(parsedMs)) return dateStr; // Support raw plain text handles
  return new Date(parsedMs).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

export default function WorkWithUsToo({ title }: WorkwithusProps) {
  const [current, setCurrent] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);
  const [liveJobs, setLiveJobs] = useState<LaborEdgeJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // ── FILTER STATES ──
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [jobType, setJobType] = useState<string>("All");
  const [location, setLocation] = useState<string>("All");
  const [datePosted, setDatePosted] = useState<string>("Any time");
  const [specialty, setSpecialty] = useState<string>("All");

  // Load animation, viewport size, and dynamic data streaming
  useEffect(() => {
    const animationTimer = setTimeout(() => setMounted(true), 50);

    // 2. Safe mobile width viewport listener
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize(); // Evaluate instantly on load
    window.addEventListener("resize", handleResize);

    // 3. Connect to unified full-stack proxy endpoint
    async function loadJobsFromApi(): Promise<void> {
      try {
        const response = await fetch("/api/laborEdge");
        if (response.ok) {
          const data = (await response.json()) as LaborEdgeJob[];
          setLiveJobs(data);
        }
      } catch (err) {
        console.error("Could not load jobs from LaborEdge endpoint:", err);
      } finally {
        setLoading(false);
      }
    }

    loadJobsFromApi();

    // Cleanup all listeners and timers on unmount to prevent memory leaks
    return () => {
      clearTimeout(animationTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  
  // ── FILTER LOGIC UTILITIES ──
  
  // Custom date range detector to support both absolute UTC/ISO strings and relative text phrases (e.g. '12 hours ago')
  const isDateWithinRange = (listedDateStr?: string, filterValue?: string): boolean => {
    if (!listedDateStr || !filterValue || filterValue === "Any time") return true;

    const parsedMs = Date.parse(listedDateStr);
    const isValidDateObj = !isNaN(parsedMs);

    if (isValidDateObj) {
      const jobDate = new Date(parsedMs);
      const now = new Date();
      const diffMs = Math.abs(now.getTime() - jobDate.getTime());
      const diffHours = diffMs / (1000 * 60 * 60);

      if (filterValue === "Last 24 hours") return diffHours <= 24;
      if (filterValue === "Last 7 days") return diffHours <= 7 * 24;
      if (filterValue === "Last 30 days") return diffHours <= 30 * 24;
    } else {
      // Relative plain English string parsing fallback (e.g., "7 hours ago", "Last week")
      const lowercaseText = listedDateStr.toLowerCase();
      
      // Standard immediate keywords
      if (
        lowercaseText.includes("second") ||
        lowercaseText.includes("minute") ||
        lowercaseText.includes("hour") ||
        lowercaseText.includes("today") ||
        lowercaseText.includes("now")
      ) {
        return true; // All within 24 hours
      }

      if (lowercaseText.includes("yesterday")) {
        return filterValue !== "Last 24 hours"; // Fits 7 days / 30 days
      }

      const numericalMatch = lowercaseText.match(/\d+/);
      if (numericalMatch) {
        const amount = parseInt(numericalMatch[0], 10);
        if (lowercaseText.includes("day")) {
          if (filterValue === "Last 24 hours") return amount <= 1;
          if (filterValue === "Last 7 days") return amount <= 7;
          if (filterValue === "Last 30 days") return amount <= 30;
        }
        if (lowercaseText.includes("week")) {
          if (filterValue === "Last 24 hours") return false;
          if (filterValue === "Last 7 days") return amount <= 1;
          if (filterValue === "Last 30 days") return amount <= 4;
        }
        if (lowercaseText.includes("month")) {
          if (filterValue === "Last 30 days") return amount <= 1;
          return false;
        }
      }
    }

    return filterValue === "Last 30 days" || filterValue === "Any time";
  };

  // Compile active checklist values for rendering
  const filteredJobs = liveJobs.filter((job) => {
    // 1. Job Type AND Logic
    if (jobType !== "All") {
      const jType = (job.jobType || job.type || "").toLowerCase().trim();
      const targetType = jobType.toLowerCase().trim();
      if (jType !== targetType) return false;
    }

    // 2. State-Only Location AND Logic
    if (location !== "All" && location.trim() !== "") {
      const targetState = location.toLowerCase().trim();
      const jobState = getJobStateString(job).toLowerCase().trim();
      if (jobState !== targetState) return false;
    }

    // 3. Specialty AND Logic
    if (specialty !== "All" && specialty.trim() !== "") {
      const spec = (job.specialty || "").toLowerCase().trim();
      const targetSpec = specialty.toLowerCase().trim();
      if (spec !== targetSpec) return false;
    }


    // 4. Date Posted AND Logic
    const dateToUse = job.postedDate || job.listed;
    if (!isDateWithinRange(dateToUse, datePosted)) return false;

    // 4. Existing Search Query AND Logic (stacked onto filters)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = (job.title || "").toLowerCase().includes(q);
      const categoryMatch = (job.jobType || job.type || "").toLowerCase().includes(q);
      const locMatch = getJobLocationString(job).toLowerCase().includes(q);
      
      if (!titleMatch && !categoryMatch && !locMatch) return false;
    }

    return true;
  });

  // Unique list of locations pulled dynamically from dataset to populate optional location options
  const uniqueAvailableLocations = Array.from(
    new Set(
      liveJobs
        .map((j) => getJobLocationString(j))
        .filter((l) => l !== "" && l !== "Nationwide")
    )
  ).sort();

  // Unique list of specialties dynamically parsed from dataset
  const uniqueAvailableSpecialties = Array.from(
    new Set(
      liveJobs
        .map((j) => j.specialty)
        .filter((s): s is string => !!s && s.trim() !== "")
    )
  ).sort();

  // Unique list of states pulled dynamically from dataset to populate optional state options
  const uniqueAvailableStates = Array.from(
    new Set(
      liveJobs
        .map((j) => getJobStateString(j))
        .filter((s) => s !== "" && s !== "Nationwide")
    )
  ).sort();

  // Clear all filters back to default values
  const handleClearFilters = (): void => {
    setSearchQuery("");
    setJobType("All");
    setLocation("All");
    setSpecialty("All");
    setDatePosted("Any time");
  };

  // Check if any filter has been modified from default
  const isAnyFilterActive =
    searchQuery !== "" ||
    jobType !== "All" ||
    location !== "All" ||
    specialty !== "All" ||
    datePosted !== "Any time";

  // Handler to safely open specific job links in a new browser tab
  const handleJobRedirect = (job: LaborEdgeJob, isApplyAction: boolean = false): void => {
    let destinationUrl = job.portalUrl || job.jobUrl || job.applyUrl;

    if (!destinationUrl) {
      const activeId = job.jobId || job.id;
      if (activeId) {
        destinationUrl = `https://nexus-leap.laboredge.com/MUVE/job-details-view/${activeId}`;
        
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

  // const prev = (): void => setCurrent((c) => (c === 0 ? categories.length - 1 : c - 1));
  // const next = (): void => setCurrent((c) => (c === categories.length - 1 ? 0 : c + 1));

  const visibleItems = isMobile ? 1 : 3; 
  // const maxIndex = Math.max(0, categories.length - visibleItems);
  
  // const next = () => { setCurrent((prev) => Math.min(prev + 1, maxIndex)); };
  // const prev = () => { setCurrent((prev) => Math.max(prev - 1, 0)); };

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
      const maxIndex = isDesktop ? categories.length - 3 : categories.length - 1;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
      const maxIndex = isDesktop ? categories.length - 3 : categories.length - 1;
      return prevIndex === 0 ? maxIndex : prevIndex - 1;
    });
  };

  return (
    <div id="work-with-us" className="w-full relative overflow-hidden font-sans pb-16"
      style={{
        display: "grid",
        background: "linear-gradient(180deg, #40E2B8 0%, #45E3BA 35%, #78EACD 58%, #A2F0DC 80%, #B3F3E3 91%, #B3F3E3 100%)",
      }}
    >
      {/* ── WORK WITH US CAROUSEL ── */}
      <div className="py-14 px-4 relative max-w-7xl mx-auto">
        <div className={`text-center mb-10 transition-all duration-700 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}>
          <h2 className="text-3xl sm:text-4xl font-lexendBold text-[#fff] inline-flex items-center justify-center flex-wrap gap-3 font-lexendBold">
            {title ? (
              title
            ) : (
              <>
                <span className="bg-[#07004C] text-white px-4 py-1 rounded-md">Work</span>
                <span>With Us</span>
              </>
            )}
          </h2>
        </div>

        <div className="relative flex items-center gap-0 w-full">
          {/* Previous Button - Overlay absolute on mobile to maximize viewport track */}
          <button 
            type="button" 
            onClick={prevSlide} 
            aria-label="Previous" 
            className="absolute -left-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#4C86FF] top-1/2 -translate-y-1/2"
          >
            <ChevronLeft size={30} strokeWidth={3} className="text-[#fff]" />
          </button>

          {/* Mask container preserving layout boundary bounds */}
          <div className="overflow-hidden w-full">
            <div 
              className="flex gap-3 transition-transform duration-300 ease-in-out"
              style={{ 
                transform: typeof window !== "undefined" && window.innerWidth >= 768 
                  ? `translateX(calc(-${currentIndex} * (33.333% + 8px)))` 
                  : `translateX(calc(-${currentIndex} * (100% + 12px)))` 
              }}
            >
              {categories.map((cat, idx) => (
                <div
                  key={`${cat.id}-${idx}`}
                  style={{ transitionDelay: mounted ? `${idx * 120}ms` : '0ms' }}
                  className={`group flex w-full md:w-[calc((100%-24px)/3)] shrink-0 flex-col items-center rounded-b-4xl overflow-hidden pt-3 text-center transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.01] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                  {/* Image Container with Relative Positioning for fill layout */}
                  <div className="w-full h-48 sm:h-60 relative overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Content Container */}
                  <div className="p-5 bg-white w-full flex-1">
                    <h3 className="text-[#07004C] text-center font-lexendBold text-[30px] sm:text-[30px] mb-2 group-hover:text-[#4C86FF] transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <p className="text-[#07004C] font-lexend text-center text-[20px] sm:text-[20px] leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button - Overlay absolute on mobile to maximize viewport track */}
          <button 
            type="button" 
            onClick={nextSlide} 
            aria-label="Next" 
            className="absolute -right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#4C86FF] top-1/2 -translate-y-1/2"
          >
            <ChevronRight size={30} strokeWidth={3} className="text-[#fff]" />
          </button>
        </div>

      </div>

      {/* ── IT STARTS HERE - JOB DIRECTORY VIEW ── */}
      <div className="py-14 px-4 max-w-6xl mx-auto">
        <div className={`text-center mb-10 transition-all duration-700 delay-300 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 className="text-3xl sm:text-4xl font-lexendBold text-[#0E1552] inline-flex items-center justify-center flex-wrap gap-3">
            <span>It</span>
            <span className="bg-[#FFFFFF] text-[#0E1552] px-4 py-1 rounded-md">Starts</span>
            <span>Here</span>
          </h2>
        </div>

        {/* Display Jobs card from LaborEdge API */}
        <div className={`w-full bg-[#0E1552] rounded-3xl sm:rounded-4xl p-4 sm:p-8 shadow-2xl shadow-indigo-950/40
                      transition-all duration-700 delay-500 ease-out
                      ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ overflow: "hidden" }}>

          {/* 🔍 FILTER SYSTEM CONTROLS WORKSPACE */}
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="text-[#3DDDB3] w-5 h-5" />
                <span className="text-white font-lexendBold text-base">Filter Assignments</span>
              </div>
              <span className="text-xs font-lexend text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
                Found {filteredJobs.length} of {liveJobs.length} active
              </span>
            </div>

            {/* Responsive grid mapping filter sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
              
              

              {/* Filter 1: Job Type */}
              <div className="col-span-1 lg:col-span-3 relative">
                <label className="block text-xs font-lexend text-slate-300 mb-1 pl-1">Job Type</label>
                <div className="relative text-white">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 text-[#3DDDB3]" />
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full font-lexend bg-white/10 text-white text-sm pl-9 pr-6 py-2.5 rounded-full border border-white/15 focus:outline-none focus:border-[#3DDDB3] focus:ring-1 focus:ring-[#3DDDB3] transition-all appearance-none cursor-pointer"
                  >
                    <option value="All" className="bg-[#0e1552] text-white font-lexend">All Types</option>
                    <option value="Allied Health" className="bg-[#0e1552] text-white font-lexend">Allied Health</option>
                    <option value="Locum Tenens" className="bg-[#0e1552] text-white font-lexend">Locum Tenens</option>
                    <option value="Travel" className="bg-[#0e1552] text-white font-lexend">Travel</option>
                    <option value="Per Diem" className="bg-[#0e1552] text-white font-lexend">Per Diem</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </div>
                </div>
              </div>

              {/* Filter 2: Location Dropdown with Text filter support */}
              <div className="col-span-1 lg:col-span-4 relative">
                <label className="block text-xs font-lexend text-slate-300 mb-1 pl-1">State</label>
                <div className="relative text-white">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 text-[#3DDDB3]" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full font-lexend bg-white/10 text-white text-sm pl-9 pr-6 py-2.5 rounded-full border border-white/15 focus:outline-none focus:border-[#3DDDB3] focus:ring-1 focus:ring-[#3DDDB3] transition-all appearance-none cursor-pointer"
                  >
                    <option value="All" className="bg-[#0e1552] text-white font-lexend">All States</option>
                    {uniqueAvailableStates.map((st) => (
                      <option key={st} value={st} className="bg-[#0e1552] text-white">
                        {st}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </div>
                </div>
              </div>

              {/* Filter 3: Spealiity */}
              <div className="col-span-1 lg:col-span-4 relative">
                <label className="block text-xs font-lexend text-slate-300 mb-1 pl-1">Specialty</label>
                <div className="relative text-white">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 text-[#3DDDB3]" />
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full font-lexend bg-white/10 text-white text-sm pl-9 pr-6 py-2.5 rounded-full border border-white/15 focus:outline-none focus:border-[#3DDDB3] focus:ring-1 focus:ring-[#3DDDB3] transition-all appearance-none cursor-pointer"
                  >
                    <option value="All" className="bg-[#0e1552] text-white font-lexend">All Specialties</option>
                    {uniqueAvailableSpecialties.map((spec) => (
                      <option key={spec} value={spec} className="bg-[#0e1552] text-white font-lexend">
                        {spec}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </div>
                </div>
              </div>

              {/* Action Column: Clear Filters */}
              <div className="col-span-1 lg:col-span-1 flex items-end">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  disabled={!isAnyFilterActive}
                  title="Clear all active filter values"
                  className={`flex items-center justify-center gap-2 text-xs font-lexendBold py-2.5 rounded-full border transition-all text-center w-full h-[40px] select-none
                    ${
                      isAnyFilterActive
                        ? "bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20 cursor-pointer active:scale-95"
                        : "bg-white/5 text-slate-400 border-white/10 cursor-not-allowed opacity-40"
                    }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 font-lexend" />
                  <span>Reset</span>
                </button>
              </div>

            </div>

            {/* Quick tag identifiers showing what criteria are set */}
            {isAnyFilterActive && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5">
                <span className="text-slate-400 text-xs font-lexendBold">Applied:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 bg-sky-950 text-sky-300 border border-sky-800/60 px-2 py-0.5 rounded-lg text-xs font-sans">
                    Keyword: "{searchQuery}"
                  </span>
                )}
                {jobType !== "All" && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-900/30 text-emerald-300 border border-emerald-800/30 px-2.5 py-0.5 rounded-lg text-xs font-sans">
                    Type: {jobType}
                  </span>
                )}
                {location !== "All" && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-900/30 text-amber-300 rounded-full border border-amber-800/30 px-2.5 py-0.5 rounded-lg text-xs font-sans">
                    Loc: {location}
                  </span>
                )}
                {datePosted !== "Any time" && (
                  <span className="inline-flex items-center gap-1.5 bg-white text-purple-300 px-2.5 py-0.5 rounded-full text-xs font-lexend">
                    Posted: {datePosted}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Inner scroll wrapper */}
          <div className="overflow-y-auto space-y-3 pr-1"
            style={{
              maxHeight: "440px"
            }}
          >
            {loading ? (
              <div className="text-white text-center py-12 font-lexend text-[16px] flex flex-col items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-[#3DDDB3]" />
                <span>{title || 'Loading available healthcare assignments...'}</span>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-white text-center py-12 font-lexend text-[16px] bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="font-lexendBold text-lg text-white">No matching assignments found</p>
                <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                  Try broadening or updating your criteria, or click "Reset" above to start fresh.
                </p>
                {isAnyFilterActive && (
                  <button 
                    onClick={handleClearFilters}
                    className="mt-4 px-4 py-2 bg-[#3DDDB3] text-[#0E1552] text-xs font-lexendBold rounded-full hover:brightness-110 active:scale-95 transition-all"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              filteredJobs.map((job, idx) => (
                <div
                  key={job.jobId || job.id || idx}
                  onClick={() => handleJobRedirect(job, false)}
                  style={{ transitionDelay: mounted ? `${600 + idx * 80}ms` : '0ms' }}
                  className={`bg-white rounded-2xl sm:rounded-full px-5 sm:px-10 py-5 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4
                              cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.005] border border-slate-100 hover:border-teal-100
                              transition-all duration-300 ease-out
                              ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}>

                  <div className="min-w-0 sm:min-w-[120px] text-center sm:text-left">
                    <p className="text-[#07004C] font-lexendBold text-[18px] sm:text-[20px] break-words">{job.title || 'Healthcare Assignment'}</p>
                    <p className="text-[#07004C] text-[14px] sm:text-[16px] font-lexend mt-1 sm:mt-0">
                      {job.jobType || job.type || 'Contract'} | {getJobLocationString(job)}
                    </p>
                  </div>

                  {/* Show on mobile under the header, or seamlessly in grid on desktop */}
                  <p className="text-[#07004C] text-[15px] sm:text-[16px] font-lexend block text-center">
                    {job.weeklyPay 
                      ? `Weekly Pay: $${Number(job.weeklyPay).toLocaleString()}` 
                      : (job.week1Gross 
                         ? `Weekly Pay: ${job.week1Gross}` 
                         : (job.weeklyGrossPay 
                            ? `Weekly Pay: $${Number(job.weeklyGrossPay).toLocaleString()}` 
                            : `Listed ${getFormattedDate(job.postedDate || job.listed)}`
                           )
                        )
                    }
                  </p>

                  <p className="text-[#07004C] font-lexend text-[15px] sm:text-[16px] block sm:hidden md:block whitespace-nowrap text-center">
                    Status: <span className="text-[#0E1552] font-semibold">{job.jobStatus || job.status || 'Active'}</span>
                  </p>

                  <div className="flex gap-2 justify-center sm:justify-end flex-shrink-0" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                    <button onClick={() => handleJobRedirect(job, false)} className="bg-[#07004C] text-[#FFFF] text-[14px] sm:text-[12px] font-lexendBold px-5 sm:px-4 py-2 sm:py-1.5 rounded-full
                                       hover:brightness-110 active:scale-95 transition-all duration-150 flex-1 sm:flex-none">
                      View
                    </button>
                    <button onClick={() => handleJobRedirect(job, true)} className="bg-[#4C86FF] text-[#fff] text-[14px] sm:text-[12px] font-lexendBold px-5 sm:px-4 py-2 sm:py-1.5 rounded-full
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

      <div className="flex justify-center w-full">
          <Link href="/ApplicationForm" target="_blank" rel="noopener noreferrer">
            <button 
              type="button" 
              className="mt-5 mb-6 rounded-full bg-[#fff] px-6 py-[10px] text-[25px] font-lexendBold leading-none text-[#07004C] "
            > 
              Find My Role 
            </button>
          </Link>
        </div>
    </div>
  );
}
