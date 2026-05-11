"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { getQuicklinksAction } from "@/app/dashboard/quicklinks/actions";
import { Download } from "lucide-react";

interface QuicklinkItem {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  categoryName: string | null;
  downloadUrl: string | null;
  createdAt: Date | null;
}

interface QuickLinksProps {
  title?: string;
}

export default function QuickLinks({ title }: QuickLinksProps) {
  const [faqData, setFaqData] = useState<Record<string, QuicklinkItem[]>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getQuicklinksAction();
      if (result.success && result.data) {
        // Grouping by categoryName (the readable name from the independent table)
        const grouped = result.data.reduce(
          (acc: Record<string, QuicklinkItem[]>, item: QuicklinkItem) => {
            const cat = item.categoryName || "General";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item as QuicklinkItem);
            return acc;
          },
          {},
        );

        const dynamicCats = Object.keys(grouped).sort();

        setFaqData(grouped);
        setCategories(dynamicCats);

        if (dynamicCats.length > 0) {
          setActiveCategory(dynamicCats[0]);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const currentItems = faqData[activeCategory] || [];

  return (
    <main
      id="quick-links"
      className="min-h-screen bg-gradient-to-b from-[#00D9DA] to-[#99F0F0] px-6 md:px-20 py-16"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-5xl md:text-6xl font-lexendBold text-white"
      >
        {title ? title : "Quick Links"}
      </motion.h1>

      <div className="flex flex-wrap gap-4 mt-10">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveCategory(cat);
              setOpenIndex(null);
            }}
            className={clsx(
              "relative px-8 py-3 rounded-full font-lexendBold transition-colors duration-500",
              activeCategory === cat
                ? "text-white"
                : "bg-white border-2 border-[#003366] text-[#003366]",
            )}
          >
            {activeCategory === cat && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-[#003366] rounded-full z-0"
                transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </motion.button>
        ))}
      </div>

      <section className="mt-10 space-y-4">
        {loading ? (
          <p className="text-[#2D3559] animate-pulse font-lexendBold">
            Loading links...
          </p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentItems.length === 0 ? (
                <p className="text-[#2D3559] font-lexend text-lg italic">
                  {categories.length === 0
                    ? "No resources found."
                    : "No resources available in this category."}
                </p>
              ) : (
                currentItems.map((item, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <motion.div
                      layout
                      key={item.id}
                      className="bg-white/30 backdrop-blur border border-white/40 rounded-md overflow-hidden mb-4"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className="w-full flex justify-between items-center p-5 text-left text-xl font-lexendBold text-[#2D3559]"
                      >
                        <span>{item.question}</span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          className="text-3xl font-light"
                        >
                          {isOpen ? "−" : "+"}
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="p-5 pt-0 border-t border-white/10 mt-2">
                              {/* Using whitespace-pre-line to support line breaks from dashboard */}
                              <p className="mb-4 text-navyblue font-lexend text-lg whitespace-pre-line">
                                {item.answer}
                              </p>

                              {item.downloadUrl && (
                                <a
                                  href={item.downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#003366] bg-[#003366] text-white px-5 py-2 text-sm font-lexendBold hover:bg-[#1F3154] transition-colors"
                                >
                                  <Download size={16} />
                                  Click to view
                                </a>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </main>
  );
}
