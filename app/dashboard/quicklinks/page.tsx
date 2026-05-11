import Link from "next/link";
import { db } from "@/db";
import { quicklinks, quicklinkCategories } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { deleteQuicklinkAction } from "./actions";
import { Plus, Pencil, Trash2, Link as LinkIcon } from "lucide-react";

export default async function QuicklinksDashboard() {
  // --- JOIN QUERY ---
  const allLinks = await db
    .select({
      id: quicklinks.id,
      question: quicklinks.question,
      categoryName: quicklinkCategories.name,
      createdAt: quicklinks.createdAt,
    })
    .from(quicklinks)
    .leftJoin(
      quicklinkCategories,
      eq(quicklinks.categoryId, quicklinkCategories.id),
    )
    .orderBy(desc(quicklinks.createdAt));

  // --- WRAPPER ACTION ---
  // This satisfies TypeScript by returning Promise<void>
  async function handleDelete(formData: FormData) {
    "use server";
    await deleteQuicklinkAction(formData);
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-lexend text-[#1F3154] tracking-tight">
            Quicklinks
          </h1>
          <p className="text-gray-500 mt-1 font-lexend">
            Total of {allLinks.length} active resources.
          </p>
        </div>

        <Link
          href="/dashboard/quicklinks/create"
          className="bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] text-white px-6 py-3 rounded-full text-center font-lexendBold transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} strokeWidth={3} />
          Add Quicklink
        </Link>
      </div>

      {/* Quicklinks Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
                  Title & URL
                </th>
                <th className="px-6 py-4 text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allLinks.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-20 text-center text-gray-400 font-lexend"
                  >
                    No quicklinks found. Click "Add Quicklink" to get started.
                  </td>
                </tr>
              ) : (
                allLinks.map((link) => (
                  <tr
                    key={link.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 flex-shrink-0">
                          <LinkIcon size={18} className="text-[#00D9DA]" />
                        </div>
                        <div>
                          <p className="font-lexendBold text-[#1F3154] group-hover:text-[#00D9DA] transition-colors">
                            {link.question}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="bg-[#00D9DA]/10 text-[#1F3154] px-3 py-1 rounded-full text-xs font-lexendBold uppercase tracking-wide">
                        {link.categoryName || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/quicklinks/edit/${link.id}`}
                          className="p-2 text-gray-400 hover:text-[#1F3154] hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <Pencil size={18} />
                        </Link>

                        {/* Changed action to the local handleDelete wrapper */}
                        <form action={handleDelete} className="inline">
                          <input type="hidden" name="id" value={link.id} />
                          <button
                            type="submit"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </form>
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
