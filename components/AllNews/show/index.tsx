"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NewsShowPage() {
  const dummyPost = {
    title: "Innovating Community Care: A 2025 Vision for Supported Living",
    category: "Community Care",
    date: "December 20, 2025",
    author: "Jane Doe",
    readTime: "6 min read",
    headerImage: "/blog/header-large.png", // Replace with your actual path
    content: [
      "The landscape of supported living is undergoing a significant transformation. As we move further into 2025, the integration of smart technology and personalized care plans is setting new standards for the industry.",
      "Our team has been at the forefront of these changes, implementing digital health monitoring systems that empower residents while ensuring staff can provide more targeted support. This blend of 'human-first' care with 'tech-enabled' safety is proving to be a game-changer.",
      "Looking ahead, the focus remains on community integration. We believe that supported living shouldn't just be about providing a safe space, but about fostering a sense of belonging and purpose within the wider neighborhood.",
    ],
  };

  const recommendations = [
    {
      id: 1,
      title: "Top Skills for Nurses in 2025",
      date: "Dec 18, 2025",
      category: "Training",
    },
    {
      id: 2,
      title: "Mental Health Awareness Week Recap",
      date: "Dec 15, 2025",
      category: "Wellness",
    },
    {
      id: 3,
      title: "New Facilities Opening in Birmingham",
      date: "Dec 12, 2025",
      category: "Company",
    },
  ];

  return (
    <section className="bg-white min-h-screen">
      {/* 1. ARTICLE HEADER */}
      <header className="max-w-[1000px] mx-auto pt-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-[#00D9DA] font-bold uppercase tracking-wider text-sm">
            {dummyPost.category}
          </span>
          <h1 className="text-[#1F3154] text-4xl md:text-6xl font-black mt-4 leading-tight">
            {dummyPost.title}
          </h1>
          <div className="flex items-center gap-6 mt-8 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <span className="font-semibold text-[#1F3154]">
                {dummyPost.author}
              </span>
            </div>
            <span>{dummyPost.date}</span>
            <span>{dummyPost.readTime}</span>
          </div>
        </motion.div>
      </header>

      {/* 2. HERO IMAGE */}
      <div className="max-w-[1200px] mx-auto mt-12 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-video w-full bg-gray-100 rounded-3xl overflow-hidden shadow-2xl"
        >
          <img
            src={dummyPost.headerImage}
            className="w-full h-full object-cover"
            alt="Healthcare header"
            onError={(e) => (e.currentTarget.src = "via.placeholder.com")}
          />
        </motion.div>
      </div>

      {/* 3. ARTICLE CONTENT */}
      <article className="max-w-[800px] mx-auto py-16 px-6">
        <div className="prose prose-lg prose-slate max-w-none">
          {dummyPost.content.map((para, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-6 text-xl">
              {para}
            </p>
          ))}
        </div>

        {/* Social Share Dummy */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex gap-4">
          <span className="font-bold text-[#1F3154]">Share:</span>
          {["Twitter", "LinkedIn", "Facebook"].map((s) => (
            <button
              key={s}
              className="text-sm hover:text-[#00D9DA] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </article>

      {/* 4. RECOMMENDATIONS SECTION */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-[#1F3154] text-3xl font-bold">Latest News</h2>
              <p className="text-gray-500 mt-2">Recommended for you</p>
            </div>
            <Link
              href="/news"
              className="text-[#1F3154] font-bold border-b-2 border-[#00D9DA]"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group"
              >
                <span className="text-[#00D9DA] text-xs font-bold uppercase">
                  {item.category}
                </span>
                <h3 className="text-[#1F3154] text-xl font-bold mt-3 group-hover:text-[#00D9DA] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm mt-4">{item.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
