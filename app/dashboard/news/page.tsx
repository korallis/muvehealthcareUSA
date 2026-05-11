export const dynamic = "force-dynamic";

import { db } from "@/db/index";
import { newsArticles } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import {
  Plus,
  Newspaper,
  Pencil,
  ExternalLink,
  Calendar,
  Tag,
} from "lucide-react";
import DeleteNewsButton from "@/components/dashboard/DeleteNewsButton";
import { authGuard } from "@/lib/authGuard";
import Image from "next/image";

export default async function DashboardNewsPage() {
  await authGuard("admin");

  // UPDATED: Use findMany with 'with' to fetch the linked category record
  const allNews = await db.query.newsArticles.findMany({
    with: {
      category: true,
    },
    orderBy: [desc(newsArticles.createdAt)],
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-[#1F3154] tracking-tight">
            Manage News
          </h1>
          <p className="text-gray-500 mt-1">
            Currently displaying {allNews.length} articles in your feed.
          </p>
        </div>

        <Link
          href="/dashboard/news/create"
          className="bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] text-white px-6 py-3 rounded-full text-center font-bold transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} strokeWidth={3} />
          Write New Article
        </Link>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-[#1F3154] uppercase tracking-wider">
                  Article Details
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#1F3154] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#1F3154] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allNews.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-20 text-center text-gray-400 font-medium"
                  >
                    No articles found in the database.
                  </td>
                </tr>
              ) : (
                allNews.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-[#1F3154] flex-shrink-0 relative overflow-hidden">
                          {post.featuredImg ? (
                            <Image
                              src={post.featuredImg}
                              fill
                              className="object-cover rounded-lg"
                              alt={post.title}
                            />
                          ) : (
                            <Newspaper size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#1F3154] line-clamp-1">
                            {post.title}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />{" "}
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <Link
                              href={`/News/${post.slug}`}
                              target="_blank"
                              className="hover:text-[#00D9DA] flex items-center gap-1"
                            >
                              View Live <ExternalLink size={10} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {/* UPDATED: Display the name from the linked category object */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                        <Tag size={10} />{" "}
                        {post.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/news/edit/${post.slug}`}
                          className="p-2 text-gray-400 hover:text-[#1F3154] hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <Pencil size={18} />
                        </Link>
                        <DeleteNewsButton id={post.id} title={post.title} />
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
