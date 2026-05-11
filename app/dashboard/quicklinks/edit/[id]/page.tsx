import { db } from "@/db";
import { quicklinks, quicklinkCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import EditQuicklinkForm from "./EditQuicklinkForm";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Removed Number(id) - UUIDs are strings
  // 2. Added leftJoin to get the categoryName for the edit form dropdown
  const data = await db
    .select({
      id: quicklinks.id,
      question: quicklinks.question,
      answer: quicklinks.answer,
      downloadUrl: quicklinks.downloadUrl,
      categoryId: quicklinks.categoryId,
      categoryName: quicklinkCategories.name,
    })
    .from(quicklinks)
    .leftJoin(
      quicklinkCategories,
      eq(quicklinks.categoryId, quicklinkCategories.id),
    )
    .where(eq(quicklinks.id, id))
    .limit(1);

  const link = data[0];

  if (!link)
    return (
      <div className="p-10 text-center font-lexend text-[#1F3154]">
        Quicklink not found
      </div>
    );

  return <EditQuicklinkForm link={link} />;
}
