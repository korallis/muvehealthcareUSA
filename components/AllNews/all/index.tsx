"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

export default function AllNews() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
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

  // Dummy titles to simulate unique posts
  const titles = [
    "Expanding our Community Care reach in Birmingham",
    "Top Skills Required for Support Workers in 2025",
    "New Safety Protocols for Residential Managers",
    "How to Support Adults with Learning Disabilities",
    "The Future of Mental Health Care in 2025",
    "Annual Staff Excellence Awards Ceremony",
  ];

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* SECTION 1: TOP NEWS BANNER */}
      <div className="bg-[#1F3154] py-12 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D9DA] opacity-10 rounded-full -mr-20 -mt-20 blur-3xl" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <span className="bg-[#00D9DA] text-[#1F3154] px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase mb-4">
              Our Updates
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter">
              News<span className="text-[#00D9DA]">.</span>
            </h1>
            <div className="w-24 h-1 bg-[#00D9DA] mt-4 rounded-full" />

            <p className="text-gray-300 mt-6 max-w-2xl text-lg">
              The latest insights, industry updates, and company announcements
              from our team.
            </p>
          </motion.div>
        </div>
      </div>

      {/* SECTION 2: BREADCRUMBS */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center text-sm">
          <div className="flex gap-2 text-gray-500">
            <Link href="/" className="hover:text-[#00D9DA]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#1F3154] font-bold">News</span>
          </div>
          <div className="hidden md:block text-gray-400">
            Showing all articles
          </div>
        </div>
      </div>

      {/* SECTION 3: NEWS GRID */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {titles.map((title, i) => {
            // Logic to create a slug for the URL (e.g., "my-post-title")
            const slug = title
              .toLowerCase()
              .replace(/ /g, "-")
              .replace(/[^\w-]+/g, "");

            return (
              <motion.article
                key={i}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col group border border-gray-100"
              >
                {/* IMAGE WRAPPER - Entire top area is clickable */}
                <Link
                  href={`/news/${slug}`}
                  className="relative overflow-hidden h-60 block"
                >
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-[#1F3154]">
                    MARCH 20, 2025
                  </div>
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src="/blog/blog.png"
                    className="w-full h-full object-cover"
                    alt="news thumbnail"
                  />
                </Link>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#00D9DA]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Industry Insight
                    </span>
                  </div>

                  <Link href={`/news/${slug}`}>
                    <h3 className="font-bold text-2xl mb-4 text-[#1F3154] leading-tight group-hover:text-[#00D9DA] transition-colors cursor-pointer">
                      {title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed">
                    We continue to grow our presence by providing high-quality
                    support for adults with learning disabilities and autism,
                    ensuring safety and excellence...
                  </p>

                  <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
                    {/* CHANGED: button -> Link for redirection */}
                    <Link
                      href="/News/show"
                      className="text-[#1F3154] font-bold text-sm flex items-center gap-2 group/btn hover:text-[#00D9DA] transition-colors"
                    >
                      READ STORY
                      <span className="group-hover/btn:translate-x-1 transition-transform">
                        →
                      </span>
                    </Link>
                    <span className="text-xs text-gray-400">5 min read</span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* PAGINATION / LOAD MORE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex flex-col items-center mt-20"
        >
          <button className="bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg">
            Load More Articles
          </button>
          <p className="text-gray-400 mt-4 text-sm font-medium">
            1 - 6 of 24 Articles
          </p>
        </motion.div>
      </div>
    </section>
  );
}
