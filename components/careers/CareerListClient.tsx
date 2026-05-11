"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  type: string | null;
  description: string;
  featuredImg: string | null;
  requirements: string | null;
  salaryRange: string | null;
  status: string | null;
  createdAt: Date;
}

export default function CareerListClient({
  initialJobs,
}: {
  initialJobs: Job[];
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-gradient-to-b from-purple to-fadedpurple min-h-screen">
      {/* SECTION 1: HERO BANNER */}
      <div className=" py-12 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D9DA] opacity-10 rounded-full -mr-20 -mt-20 blur-3xl" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <span className="bg-[#00D9DA] text-[#1F3154] px-4 py-1 rounded-full text-sm font-lexendBold tracking-widest mb-4">
              Careers
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-lexendBold tracking-tighter">
              Join Our Team<span className="text-[#00D9DA]">.</span>
            </h1>
            {/* <div className="w-24 h-1 bg-[#00D9DA] mt-4 rounded-full" /> */}

            <p className="text-white mt-6 max-w-2xl text-lg font-lexend">
              Explore rewarding opportunities to grow your career and make a
              meaningful impact in healthcare and community wellness.
            </p>
          </motion.div>
        </div>
      </div>

      {/* SECTION 2: BREADCRUMBS */}
      <div className=" py-4">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center text-sm">
          <div className="flex gap-2 text-navyblue font-lexend">
            <Link href="/" className="hover:text-navyblue">
              Home
            </Link>
            <span>/</span>
            <span className="text-navyblue font-lexendBold">Careers</span>
          </div>
          <div className="hidden md:block text-navyblue font-lexend">
            Showing {initialJobs.length} open positions
          </div>
        </div>
      </div>

      {/* SECTION 3: JOBS GRID */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
        {initialJobs.length === 0 ? (
          <div className="text-center py-20 bg-[#80ECEC] rounded-2xl">
            <p className="text-navyblue text-lg font-lexend">
              No job openings are currently available. Check back soon!
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {initialJobs.map((job) => (
              <motion.article
                key={job.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="bg-[#80ECEC] rounded-2xl  overflow-hidden flex flex-col"
              >
                {/* CATEGORY & TYPE HEADER */}
                <div className="relative h-48 bg-[#1F3154] overflow-hidden flex items-center justify-center">
                  {job.featuredImg ? (
                    <img
                      src={job.featuredImg}
                      alt={job.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1F3154] to-[#2a4374]" />
                  )}

                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <span className="bg-[#00D9DA] text-[#1F3154] px-3 py-1 rounded-md text-[10px] font-bold tracking-widest">
                      {job.category}
                    </span>
                    <span className="text-white/80 text-xs font-lexend tracking-tighter">
                      {job.type || "Full-time"}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00D9DA]" />
                      <span className="text-xs font-lexendBold tracking-wider text-navyblue">
                        {job.location}
                      </span>
                    </div>
                    {job.status === "Open" && (
                      <span className="text-[10px] bg-navyblue text-white px-2 py-0.5 rounded-full font-lexendBold">
                        Hiring
                      </span>
                    )}
                  </div>

                  <Link href={`/Careers/${job.slug}`}>
                    <h5 className="font-lexendBold text-1xl mb-4 text-[#1F3154] leading-tight group-hover:text-[#00D9DA] transition-colors cursor-pointer">
                      {job.title}
                    </h5>
                  </Link>

                  <p className="text-navyblue mb-2 line-clamp-3 leading-relaxed font-lexend text-sm">
                    {job.description}
                  </p>

                  <div className="mb-8 rounded-lg ">
                    <p className="text-[11px] text-blue font-lexendBold mb-1 tracking-wider">
                      Salary Range
                    </p>
                    <p className="text-navyblue font-lexendBold text-sm">
                      {job.salaryRange ||
                        "Competitive / Discussed at Interview"}
                    </p>
                  </div>

                  <div className=" flex justify-between items-center">
                    <Link
                      href={`/Careers/${job.slug}`}
                      className="inline-block
                        bg-[#1F3154] 
                        font-lexendBold
                        text-white 
                        px-6 py-2 
                        rounded-full 
                        font-medium
                        hover:opacity-90
                        transition-opacity"
                    >
                      VIEW POSITION
                    </Link>
                    <span className="text-[10px] text-navyblue font-lexend uppercase">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
