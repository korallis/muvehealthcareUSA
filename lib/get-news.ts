"use server";

import { db } from "../db";
import { newsArticles } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export async function getNewsData() {
  const data = await db.query.newsArticles.findMany({
    where: eq(newsArticles.status, "PUBLISHED"),
    orderBy: desc(newsArticles.createdAt),
  });
  return data;
}
