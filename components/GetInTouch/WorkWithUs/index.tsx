"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getJobsAction } from "@/app/dashboard/jobs/actions";

interface Job {
  id: string;
  title: string;
  location: string;
  salaryRange: string | null;
  featuredImg: string | null;
  category: string | null;
  description: string;
  slug: string;
}

// THE FIX: Added categories and initialJobs to satisfy the TypeScript compiler
interface WorkWithUsProps {
  initialJobs?: Job[];
  categories?: string[];
  title?: string;
}

export default function WorkWithUs({
  initialJobs = [],
  categories = [],
  title,
}: WorkWithUsProps) {
  // 1. Logic state from FAQ component
  const [jobData, setJobData] = useState<Record<string, Job[]>>({});
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<string | null>("Support");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        // If categories are passed from server, use them; otherwise fetch
        const result = await getJobsAction();
        const dataToProcess =
          result.success && result.data ? result.data : initialJobs;

        if (dataToProcess) {
          // 2. Group by category string (Dynamic grouping like FAQ)
          const grouped = dataToProcess.reduce(
            (acc: Record<string, Job[]>, item: Job) => {
              const cat = item.category || "General";
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(item);
              return acc;
            },
            {} as Record<string, Job[]>,
          );

          const dynamicCats = Object.keys(grouped).sort();
          setJobData(grouped);
          setDynamicCategories(dynamicCats);

          // If "Support" doesn't exist, default to the first found category
          if (dynamicCats.length > 0 && !dynamicCats.includes("Support")) {
            setFilter(dynamicCats[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [initialJobs]);

  // 3. Filtered data logic
  const filteredJobs = filter ? jobData[filter] || [] : [];

  const fadeInUp = {
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0.1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" },
    },
  };

  return (
    <section
      id="careers"
      className="bg-[#918CF2] pt-24 pb-32 relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <motion.div
            className="md:col-span-7"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-white text-6xl font-lexendBold mb-6">
              {title || "Work With Us"}
            </h1>
            <p className="text-navyblue text-xl font-lexendBold mb-10">
              If you love working with people, you’ll love working with Muve.
            </p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mt-10 flex items-center gap-4 flex-wrap"
            >
              {/* Mapping dynamic categories calculated from data */}
              {dynamicCategories.map((label) => (
                <motion.button
                  key={label}
                  onClick={() => setFilter(filter === label ? null : label)}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-8 py-3 rounded-full font-lexendBold transition-colors duration-500 ${
                    filter === label
                      ? "text-white"
                      : "bg-white border-2 border-[#003366] text-[#003366]"
                  }`}
                >
                  {filter === label && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-[#003366] rounded-full z-0"
                      transition={{
                        type: "spring",
                        bounce: 0.1,
                        duration: 0.8,
                      }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-5 flex justify-center md:justify-center"
          >
            <img
              src="/contact-image.svg"
              alt="Muve Team"
              className="object-contain w-[30rem] h-[30rem]"
            />
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-6"
        >
          {loading ? (
            <div className="col-span-full text-center py-10 text-white font-lexendBold animate-pulse">
              Loading positions...
            </div>
          ) : filteredJobs.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  variants={fadeInUp}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white overflow-hidden flex flex-col"
                >
                  <img
                    src={job.featuredImg || "/blog/blog.png"}
                    className="w-full h-64 object-cover"
                    alt={job.title}
                  />
                  <div className="bg-[#94F1F2] p-8 text-[#1F3154] flex-grow flex flex-col">
                    <h4 className="font-lexendBold text-1xl mb-4 text-[#1F3154] leading-tight group-hover:text-[#00D9DA] transition-colors cursor-pointer">
                      {job.title}
                    </h4>
                    <p className="font-lexendBold text-sm ">{job.location}</p>
                    <p className="font-lexendBold text-sm mb-2 text-[#918CF2]">
                      {job.salaryRange || "Competitive Pay"}
                    </p>
                    <p className="text-sm mb-8 font-lexend leading-relaxed opacity-90 line-clamp-3">
                      {job.description}
                    </p>
                    <div className="mt-auto">
                      <Link href={`/Careers/${job.slug}`}>
                        <motion.button className="inline-block bg-[#1F3154] font-lexendBold text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity">
                          View Job
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="col-span-full text-center py-10 text-white font-lexendBold text-xl">
              No open positions in {filter} at the moment.
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex justify-start mt-16"
        >
          <Link href="/Careers">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-[#1F3154] text-white px-16 py-4 rounded-full text-lg font-lexendBold tracking-tighter"
            >
              View All
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
