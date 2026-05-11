import { db } from "@/db/index";
import { jobs, jobCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sanitizeHTML } from "@/lib/sanitize";
import {
  IoBriefcaseOutline,
  IoLocationOutline,
  IoArrowBack,
  IoCashOutline,
  IoLayersOutline,
} from "react-icons/io5";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Find the job and join the category name
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.slug, slug),
    with: {
      category: true, // Assuming you have defined a relation in your schema
    },
  });

  if (!job) {
    return {
      title: "Job Opportunity | Muve Healthcare",
    };
  }

  return {
    title: `${job.title} | Muve Healthcare Careers`,
    description: job.description?.substring(0, 160) || "",
    openGraph: {
      title: job.title,
      description: job.description?.substring(0, 160) || "",
      images: job.featuredImg ? [{ url: job.featuredImg }] : [],
      type: "article",
    },
  };
}

export default async function CareerPage({ params }: PageProps) {
  const { slug } = await params;

  // Use the relational query to pull the category name from the joined table
  const jobData = await db
    .select({
      job: jobs,
      categoryName: jobCategories.name,
    })
    .from(jobs)
    .leftJoin(jobCategories, eq(jobs.categoryId, jobCategories.id))
    .where(eq(jobs.slug, slug))
    .limit(1);

  const data = jobData[0];

  if (!data) notFound();
  const { job, categoryName } = data;

  /**
   * Logic for Apply Button:
   */
  const applicationLink = job.applyUrl
    ? job.applyUrl
    : `mailto:careers@muvehealthcare.co.uk?subject=${encodeURIComponent(job.title)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    jobLocation: {
      "@type": "Place",
      address: job.location,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: "Muve Healthcare",
      sameAs: "https://www.muvehealthcare.com",
    },
  };

  return (
    <div className="bg-[#C8BDED] min-h-screen font-lexend">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/Careers"
          className="flex items-center gap-2 text-navyblue hover:text-[#00D9DA] transition-colors font-lexendBold group"
        >
          <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
          Back to Careers
        </Link>
      </div>

      <article>
        {/* Hero Section */}
        <header className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7">
            <div className="flex gap-3 mb-6">
              <div className="inline-block bg-[#00D9DA] text-navyblue px-4 py-1 rounded-full text-sm font-lexendBold tracking-wide uppercase">
                {categoryName || "General"}
              </div>
              <div className="inline-block bg-gray-100 text-gray-600 px-4 py-1 rounded-full text-sm font-lexendBold tracking-wide uppercase">
                {job.type}
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-lexendBold text-[#1F3154] leading-tight">
              {job.title}
            </h2>
            <p className="mt-6 font-lexend text-gray-600 leading-relaxed max-w-2xl">
              Join our mission-driven team and help us shape the future of
              healthcare excellence in {job.location}.
            </p>
          </div>

          <div className="lg:col-span-5 relative h-[400px] w-full rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
            {job.featuredImg ? (
              <Image
                src={job.featuredImg}
                alt={job.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1F3154] to-[#2a4374] text-white/20">
                <IoBriefcaseOutline size={120} />
              </div>
            )}
          </div>
        </header>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 pb-24">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="prose prose-lg prose-headings:font-lexendBold prose-headings:text-[#1F3154] prose-p:text-gray-700 max-w-none">
              <h2 className="text-3xl mb-6">Role Overview</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(job.description || ""),
                }}
                className="text-navyblue leading-relaxed whitespace-pre-wrap"
              />

              {job.requirements && (
                <>
                  <h2 className="text-3xl mt-12 mb-6">Requirements</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(job.requirements || ""),
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Sticky Sidebar Details */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-[#1F3154] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-400/20">
              <h3 className="text-2xl font-lexendBold mb-8 border-b border-white/10 pb-4">
                Job Details
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#00D9DA]/20 p-3 rounded-xl">
                    <IoLocationOutline size={24} className="text-[#00D9DA]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/50 font-lexendBold">
                      Location
                    </p>
                    <p className="text-lg font-lexendBold">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#00D9DA]/20 p-3 rounded-xl">
                    <IoLayersOutline size={24} className="text-[#00D9DA]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/50 font-lexendBold">
                      Department
                    </p>
                    <p className="text-lg font-lexendBold">
                      {categoryName || "General"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#00D9DA]/20 p-3 rounded-xl">
                    <IoCashOutline size={24} className="text-[#00D9DA]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/50 font-lexendBold">
                      Salary Range
                    </p>
                    <p className="text-lg font-lexendBold">
                      {job.salaryRange || "Competitive"}
                    </p>
                  </div>
                </div>
              </div>

              {/* APPLY BUTTON */}
              <Link
                href={applicationLink}
                target={job.applyUrl ? "_blank" : "_self"}
                rel={job.applyUrl ? "noopener noreferrer" : ""}
                className="block rounded-full text-center w-full mt-10 bg-[#00D9DA] hover:bg-white text-[#1F3154] font-lexendBold py-5 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#00D9DA]/20"
              >
                Apply Now
              </Link>

              <div className="mt-6 flex flex-col gap-2 text-center text-[10px] uppercase tracking-wider text-white/40 font-lexendBold">
                <p>
                  Status: <span className="text-[#00D9DA]">{job.status}</span>
                </p>
                <p>
                  Posted: {new Date(job.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
