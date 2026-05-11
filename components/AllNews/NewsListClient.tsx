"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  seoDesc: string | null;
  featuredImg: string | null;
}

export default function NewsListClient({
  initialNews = [],
}: {
  initialNews: News[];
}) {
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

  return (
    <section className="bg-gradient-to-b from-lightblue to-[#99F0F0] min-h-screen">
      {/* SECTION 1: TOP EVENTS BANNER (Styled like News) */}
      <div className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full -mr-20 -mt-20 blur-3xl" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <span className="bg-navyblue text-[#fff] px-4 py-1 rounded-full text-sm font-lexendBold tracking-widest mb-4">
              Join Us
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-lexendBold tracking-tighter">
              Latest News<span className="text-[#00D9DA]">.</span>
            </h1>
            {/* <div className="w-24 h-1 bg-navyblue mt-4 rounded-full" /> */}
          </motion.div>
        </div>
      </div>

      {/* SECTION 2: BREADCRUMBS */}
      <div className=" py-4">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center text-sm">
          <div className="flex gap-2 text-gray-500">
            <Link href="/" className="hover:text-[#00D9DA] font-lexend">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#1F3154] font-lexendBold">News</span>
          </div>
          <div className="hidden md:block text-navyblue font-lexend">
            Showing all the latest news
          </div>
        </div>
      </div>

      {/* SECTION 3: EVENTS GRID */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
        {initialNews?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              No news are currently scheduled.
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
            {initialNews.map((newsArticles) => (
              <motion.article
                key={newsArticles.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="bg-purple rounded-2xl overflow-hidden flex flex-col"
              >
                {/* IMAGE WRAPPER */}
                <Link
                  href={`/news/${newsArticles.slug}`}
                  className="relative overflow-hidden h-60 block"
                >
                  {newsArticles.featuredImg ? (
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      src={newsArticles.featuredImg}
                      className="w-full h-full object-cover"
                      alt={newsArticles.title}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </Link>

                <div className="p-8 flex flex-col flex-grow">
                  <Link href={`/News/${newsArticles.slug}`}>
                    <h5 className="font-lexendBold text-1xl mb-4 text-[#1F3154] leading-tight group-hover:text-[#00D9DA] transition-colors cursor-pointer">
                      {newsArticles.title}
                    </h5>
                  </Link>

                  <p className="font-lexend text-navyblue mb-8 line-clamp-3 leading-relaxed">
                    {newsArticles.excerpt ||
                      newsArticles.seoDesc ||
                      "Read the full article for more details..."}
                  </p>

                  <div className="mt-auto pt-6 flex justify-between items-center">
                    <Link
                      href={`/News/${newsArticles.slug}`}
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
                      Read more
                    </Link>
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
