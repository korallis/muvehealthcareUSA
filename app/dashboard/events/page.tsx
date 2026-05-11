export const dynamic = "force-dynamic";

import { db } from "@/db/index";
import { events } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import {
  Plus,
  Calendar,
  MapPin,
  Pencil,
  ExternalLink,
  Tag,
} from "lucide-react";
import { authGuard } from "@/lib/authGuard";
import DeleteEventButton from "./DeleteEventButton";
import Image from "next/image";

export default async function DashboardEventsPage() {
  await authGuard("admin");

  // UPDATED: Using relational query to fetch the category name
  const allEvents = await db.query.events.findMany({
    with: {
      category: true, // This joins the independent categories table
    },
    orderBy: [desc(events.startDate)],
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-lexend text-[#1F3154] tracking-tight">
            Manage Events
          </h1>
          <p className="text-gray-500 mt-1 font-lexend">
            Total of {allEvents.length} events scheduled.
          </p>
        </div>

        <Link
          href="/dashboard/events/create"
          className="bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] text-white px-6 py-3 rounded-full text-center font-lexendBold transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} strokeWidth={3} />
          Create New Event
        </Link>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
                  Event Info
                </th>
                <th className="px-6 py-4 text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allEvents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20 text-center text-gray-400"
                  >
                    No events found. Click "Create New Event" to get started.
                  </td>
                </tr>
              ) : (
                allEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {event.featuredImg && (
                          <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                            <Image
                              src={event.featuredImg}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#1F3154] group-hover:text-[#00D9DA] transition-colors">
                            {event.title}
                          </p>
                          <Link
                            href={`/events/${event.slug}`}
                            target="_blank"
                            className="text-xs text-gray-400 flex items-center gap-1 hover:underline"
                          >
                            View Live <ExternalLink size={10} />
                          </Link>
                        </div>
                      </div>
                    </td>

                    {/* NEW: Category Column */}
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                        <Tag size={10} />{" "}
                        {event.category?.name || "Uncategorized"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#00D9DA]" />
                        <div>
                          <div>
                            {new Date(event.startDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          {event.endDate && (
                            <div className="text-xs text-gray-400">
                              to{" "}
                              {new Date(event.endDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#00D9DA]" />
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/events/edit/${event.slug}`}
                          className="p-2 text-gray-400 hover:text-[#1F3154] hover:bg-gray-100 rounded-lg transition-all"
                          title="Edit Event"
                        >
                          <Pencil size={18} />
                        </Link>
                        <DeleteEventButton id={event.id} title={event.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
