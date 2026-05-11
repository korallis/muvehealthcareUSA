// components/Social/Events/index.tsx
"use client";
import EventsUI from "./EventsUI";

type Event = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startDate: string | Date;
  featuredImg?: string | null;
  slug: string;
};

export default function EventsSmart({ events = [] }: { events?: Event[] }) {
  return <EventsUI events={events} />;
}
