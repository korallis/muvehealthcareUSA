"use client";

import { motion } from "framer-motion";

interface LocationsProps {
  title?: string;
}

const locations = [
  {
    title: "Head Office",
    lines: [
      "Marva Group",
      "Suite 1",
      "Aqueous II",
      "Rocky Lane",
      "Birmingham",
      "B6 5RQ",
    ],
  },
  {
    title: "Manchester",
    lines: ["Conavon Court", "Blackfriars Street", "Manchester", "M3 5BQ"],
  },
];

export default function Locations({ title }: LocationsProps) {
  return (
    <section
      id="locations"
      className="relative w-full min-h-screen bg-[#C8BDED] overflow-hidden pt-12"
    >
      <div className=" max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-white font-lexendBold text-[3.75rem] mb-12"
        >
          {title || "Locations"}
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {locations.map((loc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-lexendBold text-[#1F3154] text-[1.5625rem] mb-4">
                {loc.title}
              </h4>
              <p className="text-[#1F3154] leading-relaxed font-lexend text-[1.125rem]">
                {loc.lines.map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
