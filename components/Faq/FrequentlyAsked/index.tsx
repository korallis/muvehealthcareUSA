"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { getFAQsAction } from "@/app/dashboard/faq/actions";

// Updated Interface to match your UUID schema
interface FAQItem {
  id: string; // Changed from number to string for UUID
  question: string;
  answer: string;
  categoryId: string;
  categoryName: string; // Using the joined category name
}

interface FrequentlyAskedProps {
  title?: string;
}

export default function FrequentlyAsked({ title }: FrequentlyAskedProps) {
  const [faqData, setFaqData] = useState<Record<string, FAQItem[]>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const result = await getFAQsAction();

        if (result.success && result.data) {
          // Grouping by categoryName (the human-readable name from the independent table)
          const grouped = result.data.reduce(
            (acc, item) => {
              const cat = item.categoryName || "General";
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(item as FAQItem);
              return acc;
            },
            {} as Record<string, FAQItem[]>,
          );

          const dynamicCats = Object.keys(grouped).sort();

          setFaqData(grouped);
          setCategories(dynamicCats);

          if (dynamicCats.length > 0) {
            setActiveCategory(dynamicCats[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load FAQs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFAQs();
  }, []);

  const currentFAQs = faqData[activeCategory] || [];

  return (
    <main
      id="fAQs"
      className="min-h-screen bg-gradient-to-b from-[#A89DF8] to-[#B9A8FF] px-6 md:px-20 py-16"
    >
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="text-5xl md:text-6xl font-lexendBold text-white"
      >
        {title ? (
          title
        ) : (
          <>
            Frequently Asked
            <br />
            Questions
          </>
        )}
      </motion.h1>

      <motion.div layout className="flex flex-wrap gap-4 mt-10">
        {categories.map((cat) => (
          <motion.button
            key={cat}
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
      </motion.div>

      <section className="mt-10 space-y-4">
        {loading ? (
          <p className="text-white font-lexend animate-pulse">
            Loading questions...
          </p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {currentFAQs.length === 0 ? (
                <p className="text-[#003366] font-lexend text-lg italic">
                  {categories.length === 0
                    ? "No FAQs found."
                    : "No questions available in this category."}
                </p>
              ) : (
                currentFAQs.map((item, idx) => (
                  <FAQAccordion
                    key={item.id}
                    item={item}
                    isOpen={openIndex === idx}
                    toggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </main>
  );
}

function FAQAccordion({
  item,
  isOpen,
  toggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  toggle: () => void;
}) {
  return (
    <motion.div
      layout
      className="bg-white/30 backdrop-blur border border-white/40 rounded-md overflow-hidden mb-4"
    >
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center p-5 text-left text-xl font-lexendBold text-[#2D3559]"
      >
        {item.question}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-3xl font-light leading-none"
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
              <p className="mb-4 text-navyblue font-lexend text-lg whitespace-pre-line">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
