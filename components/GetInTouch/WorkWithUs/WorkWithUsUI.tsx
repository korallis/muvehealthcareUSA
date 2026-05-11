"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Define the Job type
interface Job {
  id: string;
  title: string;
  location: string;
  salaryRange: string | null;
  featuredImg: string | null;
  category: string;
  description: string;
  slug: string;
}

interface WorkWithUsUIProps {
  jobs?: Job[];
  title?: string;
}

export default function WorkWithUsUI({ jobs = [], title }: WorkWithUsUIProps) {
  // const [filter, setFilter] = useState<string | null>("Support");
  const [filter, setFilter] = useState<string | null>(null);

  const categories = [
    "Support",
    "Administration",
    "Clinical",
    "Maintenance",
    "Operations",
    "Finance",
  ];

  // const filteredJobs = filter
  //   ? jobs.filter((job) => job.category === filter)
  //   : jobs.slice(0, 3);

  const filteredJobs = filter
  ? jobs.filter((job) => job.category === filter)
  : jobs; 



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
        {/* 70 / 30 GRID SPLIT */}
        <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-10 items-center">
          {/* LEFT COLUMN — 70% */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-white text-6xl font-lexendBold mb-6">
              {title || "Work With Us"}
            </h1>

            <p className="text-white text-xl font-lexendBold mb-10">
              If you love working with people, you’ll love working with Muve.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((label) => (
                <button
                  key={label}
                  onClick={() => setFilter(filter === label ? null : label)}
                  className={`px-4 py-3 rounded-full font-lexendBold transition-colors text-sm ${
                    filter === label
                      ? "bg-[#003366] text-white"
                      : "bg-white text-[#003366]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN — 30% */}
          <div className="flex justify-center md:justify-end mt-10 md:mt-0">
            <div className="relative w-full max-w-[360px]">
              <Image
                src="/Section_ImageRight.png"
                alt="Muve Team"
                width={800}
                height={800}
                priority
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* JOB LISTINGS */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20"
        >
          {filteredJobs.slice(0, 3).map((job) => (
            
            <div
              key={job.id}
              className="bg-white rounded-2xl overflow-hidden flex flex-col"
            >
              <img
                src={job.featuredImg || "/blog/blog.png"}
                alt={job.title}
                className="w-full h-48 object-cover"
              />

              <div className="bg-[#94F1F2] p-6 flex-grow">
                <h4 className="font-lexendBold text-lg mb-2 text-[#1F3154]">
                  {job.title}
                </h4>

                <p className="text-sm opacity-80 line-clamp-2">
                  {job.description}
                </p>

                <Link
                  href={`/Careers/${job.slug}`}
                  className="inline-block mt-4 bg-[#1F3154] text-white px-6 py-2 rounded-full text-sm"
                >
                  View Job
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
