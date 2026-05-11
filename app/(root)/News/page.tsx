export const dynamic = "force-dynamic";

import { db } from "@/db/index";
import { newsArticles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import NewsListClient from "@/components/AllNews/NewsListClient";

export default async function NewsPage() {
  const allNews = await db
    .select({
      id: newsArticles.id,
      title: newsArticles.title,
      slug: newsArticles.slug,
      excerpt: newsArticles.excerpt,
      seoDesc: newsArticles.seoDesc,
      featuredImg: newsArticles.featuredImg,
    })
    .from(newsArticles)
    .where(eq(newsArticles.status, "PUBLISHED"))
    .orderBy(desc(newsArticles.createdAt));

  return <NewsListClient initialNews={allNews} />;
}
