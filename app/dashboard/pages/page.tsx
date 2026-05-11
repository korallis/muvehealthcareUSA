import { authGuard } from "@/lib/authGuard";
import { getAllPagesAction } from "@/lib/actions/editor";
import Link from "next/link";
import { Edit3, ExternalLink, FileText, Globe } from "lucide-react";
import { CreatePageButton } from "@/components/dashboard/CreatePageButton";

export default async function ManagePages() {
  await authGuard("admin");
  const allPages = await getAllPagesAction();

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* Header - Consistent with Events/Jobs/Stories */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-lexend text-[#1F3154] tracking-tight">
            Website Pages
          </h1>
          <p className="text-gray-500 mt-1 font-lexend">
            Total of {allPages.length} custom pages published.
          </p>
        </div>

        {/* CreatePageButton should ideally contain the same styling as your other "New" buttons */}
        <CreatePageButton />
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
                  Route / Slug
                </th>
                <th className="px-6 py-4 text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allPages.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-20 text-center text-gray-400 font-lexend"
                  >
                    No custom pages found.
                  </td>
                </tr>
              ) : (
                allPages.map((page) => (
                  <tr
                    key={page.slug}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 flex-shrink-0">
                          <FileText size={18} className="text-[#00D9DA]" />
                        </div>
                        <div>
                          <p className="font-lexendBold text-[#1F3154] group-hover:text-[#00D9DA] transition-colors">
                            /{page.slug}
                          </p>
                          <Link
                            href={`/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 flex items-center gap-1 hover:underline font-lexend"
                          >
                            View Live Site <ExternalLink size={10} />
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-3">
                        {/* Live Preview Icon */}
                        <Link
                          href={`/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-[#00D9DA] hover:bg-gray-100 rounded-lg transition-all"
                          title="View Live"
                        >
                          <Globe size={20} />
                        </Link>

                        {/* Edit Design Button */}
                        <Link
                          href={`/dashboard/edit/${page.slug}`}
                          className="flex items-center gap-2 bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] text-white px-4 py-2 font-lexendBold text-sm transition-all rounded-full text-center"
                        >
                          <Edit3 size={16} />
                          Edit Design
                        </Link>
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
