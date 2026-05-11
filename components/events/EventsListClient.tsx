"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  featuredImg: string | null;
}

function formatEventTime(start: Date, end: Date | null): string {
  const s = new Date(start);
  const time = s.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (!end) return time;
  const e = new Date(end);
  const endTime = e.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${time} – ${endTime}`;
}

export default function EventsListClient({
  initialEvents,
}: {
  initialEvents: Event[];
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
    <section className="bg-gradient-to-b from-purple to-fadedpurple min-h-screen">
      {/* SECTION 1: TOP EVENTS BANNER (Styled like News) */}
      <div className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D9DA] opacity-10 rounded-full -mr-20 -mt-20 blur-3xl" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <span className="bg-navyblue text-white px-4 py-1 rounded-full text-sm font-lexendBold tracking-widest mb-4">
              Join Us
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-lexendBold tracking-tighter">
              Events<span className="text-[#00D9DA]"></span>
            </h1>
            {/* <div className="w-24 h-1 bg-navyblue mt-4 rounded-full" /> */}

            {/* <p className="text-gray-300 mt-6 max-w-2xl text-lg font-lexend">
              Mark your calendars for our upcoming wellness programs, community outreach, and healthcare seminars.
            </p> */}
          </motion.div>
        </div>
      </div>

      {/* SECTION 2: BREADCRUMBS */}
      <div className="py-4">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center text-sm">
          <div className="flex gap-2 text-gray-500">
            <Link href="/" className="hover:text-[#00D9DA] font-lexend">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#1F3154] font-lexendBold">Events</span>
          </div>
          <div className="hidden md:block text-white font-lexend">
            Showing all scheduled events
          </div>
        </div>
      </div>

      {/* SECTION 3: EVENTS GRID */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
        {initialEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg font-lexend">
              No events are currently scheduled.
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
            {initialEvents.map((event) => (
              <motion.article
                key={event.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="bg-[#80ECEC] rounded-2xl overflow-hidden flex flex-col"
              >
                {/* IMAGE WRAPPER */}
                <Link
                  href={`/events/${event.slug}`}
                  className="relative overflow-hidden h-60 block"
                >
                  <div className="absolute top-4 left-4 z-10 bg-[#1F3154]/90 backdrop-blur px-3 py-1.5 rounded text-xs font-bold text-white tracking-widest">
                    <div>
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-[10px] font-normal text-white/80 tracking-normal">
                      {formatEventTime(event.startDate, event.endDate)}
                    </div>
                  </div>
                  {event.featuredImg ? (
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      src={event.featuredImg}
                      className="w-full h-full object-cover"
                      alt={event.title}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </Link>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    {/* <span className="w-2 h-2 rounded-full bg-[#00D9DA]" /> */}
                    <span className="text-xs font-lexendBold tracking-wider text-white">
                      {event.location || "Location TBD"}
                    </span>
                  </div>

                  <Link href={`/events/${event.slug}`}>
                    <h5 className="font-lexendBold text-1xl mb-4 text-[#1F3154] leading-tight group-hover:text-[#00D9DA] transition-colors cursor-pointer">
                      {event.title}
                    </h5>
                  </Link>

                  <p className="font-lexend text-navyblue mb-8 line-clamp-3 leading-relaxed">
                    {event.description ||
                      "Join us for this upcoming event. Detailed information and schedules will be provided at the venue..."}
                  </p>

                  <div className="mt-auto pt-6 flex justify-between items-center">
                    <Link
                      href={`/events/${event.slug}`}
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
                      More Info
                    </Link>
                    <span className="text-xs text-navyblue font-lexendBold">
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
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
