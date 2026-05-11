"use client";
export const dynamic = "force-dynamic";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

type Event = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startDate: string | Date;
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

export default function EventsList({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return <p className="text-white text-lg mt-20">No events available.</p>;
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }} // Triggers slightly before reaching the element
    >
      {events.slice(0, 3).map((event) => (
        <motion.div
          key={event.id}
          variants={itemVariants}
          whileHover={{ y: -8 }}
          className="bg-white rounded-lg overflow-hidden flex flex-col"
        >
          {/* IMAGE */}
          <Image
            src={event.featuredImg || "../news.png"}
            alt={event.title}
            width={600}
            height={400}
            className="w-full h-64 object-cover"
          />

          {/* CONTENT */}
          <div className="bg-[#80ECEC] p-6 text-[#1F3154] flex-grow">
            <h3 className="font-lexendBold text-xl mb-2">{event.title}</h3>

            {event.location && (
              <p className="font-lexendBold text-sm">{event.location}</p>
            )}

            <h4 className="text-sm mb-3 font-lexendBold">
              {new Date(event.startDate).toLocaleDateString()}
            </h4>

            {event.description && (
              <p className="font-lexend text-sm mb-6 leading-relaxed line-clamp-4">
                {event.description}
              </p>
            )}

            <a
              href={`/events/${event.slug}`}
              className="
                inline-block
                bg-[#1F3154] 
                font-lexendBold
                text-white 
                px-6 py-2 
                rounded-full 
                font-medium
                hover:opacity-90
                transition-opacity
              "
            >
              More Info
            </a>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
