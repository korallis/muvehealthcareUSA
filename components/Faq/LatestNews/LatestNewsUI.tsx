"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import NewsList from "./NewsList";
import { getNewsData } from "@/lib/get-news";

type News = {
  id: string;
  title: string;
  content?: string | null;
  featuredImg?: string | null;
  slug: string;
};

interface LatestNewsUIProps {
  news?: News[];
}

export default function LatestNewsUI({ news: initialNews }: LatestNewsUIProps) {
  const [news, setNews] = useState<News[]>(initialNews ?? []);

  useEffect(() => {
    if (initialNews && initialNews.length > 0) return;
    getNewsData().then((data) => {
      setNews(
        data.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          featuredImg: item.featuredImg,
          slug: item.slug,
        })),
      );
    });
  }, [initialNews]);

  return (
    <section
      id="latest-news"
      className="bg-lightblue pt-24 pb-32 relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <h1 className="text-white text-6xl font-lexendBold mb-6">
            Latest News
          </h1>
        </div>

        <NewsList news={news} />

        <div className="flex justify-start mt-16">
          <Link
            href="/News"
            className="bg-[#1F3154] text-white px-12 py-3 rounded-full text-lg font-lexendBold transition-all"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
