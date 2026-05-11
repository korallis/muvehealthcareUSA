import { db } from "@/db/index";
import { jobs, jobCategories } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Pencil, Plus, Briefcase, MapPin, ExternalLink } from "lucide-react";
import DeleteJobButton from "@/components/dashboard/DeleteJobButton";
import Image from "next/image";

export default async function DashboardJobsPage() {
  const allJobs = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      slug: jobs.slug,
      featuredImg: jobs.featuredImg,
      location: jobs.location,
      createdAt: jobs.createdAt,
      categoryName: jobCategories.name,
    })
    .from(jobs)
    .leftJoin(jobCategories, eq(jobs.categoryId, jobCategories.id))
    .orderBy(desc(jobs.createdAt));

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-lexend text-[#1F3154] tracking-tight">
            Careers Portal<span className="text-[#00D9DA]"></span>
          </h1>
          <p className="text-gray-500 mt-1 font-lexend">
            Total of {allJobs.length} active job postings.
          </p>
        </div>

        <Link
          href="/dashboard/jobs/create"
          className="bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] text-white px-6 py-3 rounded-full font-lexendBold transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} strokeWidth={3} />
          New Posting
        </Link>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
                  Job Info
                </th>
                <th className="px-6 py-4 text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
                  Category
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
              {allJobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-20 text-center text-gray-400 font-lexend"
                  >
                    No jobs found. Click &quot;New Posting&quot; to get started.
                  </td>
                </tr>
              ) : (
                allJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {job.featuredImg ? (
                          <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                            <Image
                              src={job.featuredImg}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 flex-shrink-0">
                            <Briefcase size={20} className="text-gray-300" />
                          </div>
                        )}
                        <div>
                          <p className="font-lexendBold text-[#1F3154] group-hover:text-[#00D9DA] transition-colors">
                            {job.title}
                          </p>
                          <Link
                            href={`/Careers/${job.slug}`}
                            target="_blank"
                            className="text-xs text-gray-400 flex items-center gap-1 hover:underline font-lexend"
                          >
                            View Live <ExternalLink size={10} />
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="bg-[#00D9DA]/10 text-[#1F3154] px-3 py-1 rounded-full text-xs font-lexendBold uppercase">
                        {job.categoryName || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-lexend">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#00D9DA]" />
                        {job.location}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/jobs/edit/${job.slug}`}
                          className="p-2 text-gray-400 hover:text-[#1F3154] hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <Pencil size={18} />
                        </Link>
                        <DeleteJobButton id={job.id} title={job.title} />
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
