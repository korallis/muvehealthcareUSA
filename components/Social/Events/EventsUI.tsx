"use client";
import Link from "next/link";
import EventsList from "./EventsList";

type Event = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startDate: string | Date;
  featuredImg?: string | null;
  slug: string;
};

export default function EventsUI({ events = [] }: { events?: Event[] }) {
  return (
    <section
      id="events"
      className="bg-gradient-to-b from-purple to-fadedpurple pt-24 pb-32 relative"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <h1 className="text-white text-6xl font-lexendBold mb-6">Events</h1>
        <EventsList events={events} />
        <div className="flex justify-start mt-16">
          <Link
            href="/events"
            className="bg-[#1F3154] text-white px-12 py-3 rounded-full text-lg font-lexendBold"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
