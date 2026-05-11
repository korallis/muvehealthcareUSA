import { db } from "@/db/index";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sanitizeHTML } from "@/lib/sanitize";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoArrowBack,
  IoPricetagOutline,
} from "react-icons/io5";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Update: Included relation for metadata consistency
  const event = await db.query.events.findFirst({
    where: eq(events.slug, slug),
    with: { category: true },
  });

  if (!event) {
    return {
      title: "Event Details | Muve Healthcare",
    };
  }


  return {
    title: `${event.title} | Muve Healthcare`,
    description: event.seoDesc || event.description?.substring(0, 160) || "",
    openGraph: {
      title: event.title,
      description: event.seoDesc || event.description?.substring(0, 160) || "",
      images: event.featuredImg ? [{ url: event.featuredImg }] : [],
      type: "article",
    },
  };
}



export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;

  // CRITICAL UPDATE: Use db.query.events.findFirst with 'with' to fetch the category name
  const event = await db.query.events.findFirst({
    where: eq(events.slug, slug),
    with: {
      category: true, // This joins the independent categories table
    },
  });

  if (!event) notFound();

  /**
 * Logic for Apply Button:
 */
//   const rawUrl = events.applyUrl;
// const applicationLink = rawUrl
//   ? rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`
//   : `mailto:careers@muvehealthcare.co.uk?subject=${encodeURIComponent(event.title)}`;

const applicationLink = event.applyUrl
    ? event.applyUrl
    : `mailto:careers@muvehealthcare.co.uk?subject=${encodeURIComponent(event.title)}`;

  return (
    <div className="bg-purple w-full py-20 overflow-hidden">
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-6 grid md:grid-cols-2 gap-12 items-center">
        <Link
          href="/events"
          className="flex items-center gap-2 text-white/70 hover:text-lightblue transition-colors font-extrabold group"
        >
          <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Link>
      </div>

      <article>
        {/* Hero Section - Matched to WhoWeAre Layout */}
        <div className="max-w-7xl mx-auto px-6 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="mt-8 space-y-6">
              <h2 className=" font-lexendBold text-white leading-tight">
                {event.title}
              </h2>
              <p className="text-about text-white/80 leading-relaxed max-w-2xl mb-4">
                {event.seoDesc ||
                  "MUVE Healthcare Group exists to make quality care human, accessible, and empowering."}
              </p>
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(event.description || ""),
              }}
              className="mt-8 space-y-6 text-about text-navyblue leading-relaxed whitespace-pre-wrap"
            />

            {/* {!event.description?.includes('<') && <p className="font-lexend">{event.description}</p>} */}

            <div className="lg:col-span-4 mt-16">
              <div className="sticky top-28 bg-navyblue rounded-[2rem] p-8 text-white">
                {/* Info Grid: Two columns for Category and Published */}
                <h3 className="text-2xl font-bold font-lexend mb-8 border-b border-white/10 pb-4">
                  Event Details
                </h3>
                <div className="grid grid-cols-2 gap-6 border-b border-white/10 pb-8">
                  {/* Category Column */}
                  <div className="flex items-start gap-4">
                    <div className="bg-[#00D9DA]/20 p-3 rounded-xl">
                      <IoLocationOutline size={24} className="text-[#00D9DA]" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/50 font-lexendBold">
                        Location
                      </p>
                      <p className="text-lg font-lexend">{event.location}</p>
                    </div>
                  </div>

                  {/* Published Column */}
                  <div className="flex items-start gap-4">
                    <div className="bg-[#00D9DA]/20 p-3 rounded-xl">
                      <IoCalendarOutline size={24} className="text-[#00D9DA]" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/50 font-lexendBold">
                        Date + Time
                      </p>
                      <p className="text-lg font-lexend">
                        {new Date(event.startDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {" at "}
                        {new Date(event.startDate).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        {event.endDate && (
                          <>
                            {new Date(event.startDate).toDateString() === new Date(event.endDate).toDateString()
                              ? ` — ${new Date(event.endDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
                              : ` — ${new Date(event.endDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} at ${new Date(event.endDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
                            }
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Centered Button */}
                <Link
                  href={applicationLink}
                  target={event.applyUrl ? "_blank" : "_self"}
                  rel={event.applyUrl ? "noopener noreferrer" : ""}
                  className="block rounded-full text-center w-full mt-10 bg-[#00D9DA] hover:bg-white text-[#1F3154] font-lexendBold py-5 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#00D9DA]/20"
                >
                  Register for Event
                </Link>
              </div>
            </div>
          </div>

          {/* Right side image */}
          <div className="flex justify-center md:justify-end">
            <div className="relative h-[500px] w-[500px] rounded-full overflow-hidden justify-center">
              <Image
                src={event.featuredImg || "/event.png"}
                alt={event.title}
                fill
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
