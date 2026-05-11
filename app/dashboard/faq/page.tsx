import Link from "next/link";
import { db } from "@/db";
import { faqs, faqCategories } from "@/db/schema"; // Added faqCategories
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Plus, Pencil, Trash2, HelpCircle } from "lucide-react";

// --- DELETE ACTION ---
async function deleteFaq(formData: FormData) {
  "use server";
  const id = formData.get("id");
  if (id) {
    // REMOVED Number(id) because IDs are now UUID strings
    await db.delete(faqs).where(eq(faqs.id, id.toString()));
    revalidatePath("/dashboard/faq");
  }
}

export default async function FAQDashboard() {
  // --- JOIN QUERY ---
  // We join with faqCategories to get the readable 'name' instead of the UUID
  const allFaqs = await db
    .select({
      id: faqs.id,
      question: faqs.question,
      categoryName: faqCategories.name, // Pulling from the category table
      createdAt: faqs.createdAt,
    })
    .from(faqs)
    .leftJoin(faqCategories, eq(faqs.categoryId, faqCategories.id))
    .orderBy(desc(faqs.createdAt));

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-lexend text-[#1F3154] tracking-tight">
            Manage FAQs
          </h1>
          <p className="text-gray-500 mt-1 font-lexend">
            Total of {allFaqs.length} questions in your database.
          </p>
        </div>

        <Link
          href="/dashboard/faq/create"
          className="bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] text-white px-6 py-3 rounded-full text-center font-lexendBold transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} strokeWidth={3} />
          Add New FAQ
        </Link>
      </div>

      {/* FAQ Table/List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
                  Question
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
              {allFaqs.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-20 text-center text-gray-400 font-lexend"
                  >
                    No FAQs found. Click "Add New FAQ" to get started.
                  </td>
                </tr>
              ) : (
                allFaqs.map((faq) => (
                  <tr
                    key={faq.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 flex-shrink-0">
                          <HelpCircle size={18} className="text-[#00D9DA]" />
                        </div>
                        <p className="font-lexendBold text-[#1F3154] group-hover:text-[#00D9DA] transition-colors line-clamp-1">
                          {faq.question}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="bg-[#00D9DA]/10 text-[#1F3154] px-3 py-1 rounded-full text-xs font-lexendBold uppercase tracking-wide">
                        {faq.categoryName || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/faq/edit/${faq.id}`}
                          className="p-2 text-gray-400 hover:text-[#1F3154] hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <Pencil size={18} />
                        </Link>

                        <form action={deleteFaq} className="inline">
                          <input type="hidden" name="id" value={faq.id} />
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
