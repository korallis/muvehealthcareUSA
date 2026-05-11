"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { getStoriesAction } from "@/app/dashboard/stories/actions";
import Image from "next/image";

export default function MeetOmar() {
  const [storiesList, setStoriesList] = useState<
    {
      id: number;
      name: string;
      role: string | null;
      content: string;
      imageUrl: string;
      createdAt: Date | null;
    }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getStoriesAction();
      if (res.success) setStoriesList(res.data);
      setLoading(false);
    }
    load();
  }, []);

  // Force scroll once loading is finished
  useEffect(() => {
    if (!loading && window.location.hash === "#impact-stories") {
      const el = document.getElementById("impact-stories");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1 === storiesList.length ? 0 : prev + 1));
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev === 0 ? storiesList.length - 1 : prev - 1));
  };

  // FIX: Added ID to loading state so the jump-link doesn't "fail" immediately
  if (loading) {
    return (
      <div
        id="impact-stories"
        className="min-h-screen bg-[#d4c8f8] flex items-center justify-center text-navyblue font-lexendBold"
      >
        Loading Stories...
      </div>
    );
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#d4c8f8] flex items-center justify-center">
        Loading Stories...
      </div>
    );
  if (storiesList.length === 0) return null;

  const currentStory = storiesList[currentIndex];

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      id="impact-stories"
      className="relative w-full min-h-screen bg-gradient-to-br from-[#d4c8f8] to-[#a1b0f6] py-20 px-6 md:px-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory.id}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeUp}
          >
            <h3 className="text-navyblue mb-3 uppercase font-lexendBold tracking-widest">
              {currentStory.role || "Stories"}
            </h3>
            <h1 className="text-5xl md:text-6xl font-lexendBold text-white mb-8">
              {currentStory.name}
            </h1>

            <div className="text-navyblue font-lexend leading-relaxed mb-6 text-lg whitespace-pre-wrap">
              {currentStory.content}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-10">
              <button
                onClick={prevStory}
                className="border-4 border-[#1F3154] text-[#1F3154] px-10 py-3 rounded-full font-lexendBold hover:bg-[#1F3154] hover:text-white transition-all"
              >
                Previous
              </button>
              <button
                onClick={nextStory}
                className="bg-[#1F3154] text-white px-10 py-3 rounded-full font-lexendBold hover:bg-opacity-90 transition-all"
              >
                Next
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          key={`img-${currentStory.id}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center md:justify-end"
        >
          <div className="w-72 h-72 md:w-120 md:h-120 rounded-full overflow-hidden">
            <Image
              src={currentStory.imageUrl}
              alt={currentStory.name}
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
