"use client";
export const dynamic = "force-dynamic";
import { motion, Variants } from "framer-motion";
// import { Image } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type News = {
  id: string;
  title: string;
  content?: string | null;
  featuredImg?: string | null;
  slug: string;
};

// Container Animation (The Parent Grid)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between each card appearing
    },
  },
};

// Item Animation (The Individual Cards)
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function NewsList({ news }: { news: News[] }) {
  if (news.length === 0) {
    return <p className="text-white text-lg mt-20">No news available.</p>;
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }} // Triggers slightly before reaching the element
    >
      {/* Sliced to only the first 3 items */}
      {news.slice(0, 3).map((news) => (
        <motion.div
          key={news.id}
          variants={itemVariants}
          whileHover={{ y: -8 }}
          className="bg-white rounded-lg overflow-hidden flex flex-col"
        >
          {/* IMAGE */}
          <Image
            src={news.featuredImg || "/news.png"} // Fixed: Use root-relative path for fallback
            alt={news.title}
            width={600} // Add this
            height={400} // Add this
            className="w-full h-64 object-cover"
          />

          {/* CONTENT */}
          <div className="bg-[#918CF2] p-6 text-[#1F3154] flex-grow">
            <h4 className="font-lexendBold text-1xl mb-4 text-[#1F3154] leading-tight group-hover:text-[#00D9DA] transition-colors cursor-pointer">
              {news.title}
            </h4>

            {news.content && (
              <p className="text-sm mb-6 font-lexend leading-relaxed line-clamp-4">
                {news.content.replace(/<[^>]*>?/gm, "")}
              </p>
            )}

            <Link
              href={`/News/${news.slug}`}
              className="
                inline-block
                bg-[#1F3154] 
                text-white 
                px-6 py-2 
                rounded-full 
                font-medium
                hover:opacity-90
                transition-opacity
                font-lexendBold
              "
            >
              Learn more
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
