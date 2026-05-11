import { db } from "@/db/index";
import { newsArticles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { authGuard } from "@/lib/authGuard";
import EditNewsForm from "./EditNewsForm";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // await authGuard(undefined, ["ADMIN"]);
  await authGuard("admin");
  const { slug } = await params;

  const article = await db.query.newsArticles.findFirst({
    where: eq(newsArticles.slug, slug),
  });

  if (!article) notFound();

  return <EditNewsForm article={article} />;
}
