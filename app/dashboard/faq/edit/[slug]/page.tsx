import { db } from "@/db";
import { faqs, faqCategories } from "@/db/schema"; // Added categories for the join
import { eq } from "drizzle-orm";
import EditFAQForm from "./EditFAQForm";

export default async function EditFAQPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slugValue = resolvedParams.slug; // This is your UUID string

  // 1. REMOVE parseInt - UUIDs are strings, not numbers.

  // 2. Fetch the FAQ using the string slugValue
  const data = await db
    .select({
      id: faqs.id,
      question: faqs.question,
      answer: faqs.answer,
      categoryId: faqs.categoryId,
      categoryName: faqCategories.name, // Join to get the name for the UI
    })
    .from(faqs)
    .leftJoin(faqCategories, eq(faqs.categoryId, faqCategories.id))
    .where(eq(faqs.id, slugValue))
    .limit(1);

  const faq = data[0];

  if (!faq) {
    return (
      <div className="p-10 text-[#1F3154] font-lexend">FAQ not found.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      {/* faq.id is now a UUID string, which EditFAQForm expects */}
      <EditFAQForm faq={faq} />
    </div>
  );
}
