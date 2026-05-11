"use client";
import LatestNewsUI from "./LatestNewsUI";

type News = {
  id: string;
  title: string;
  content?: string | null;
  featuredImg?: string | null;
  slug: string;
};

export default function LatestNewsSmart({ news = [] }: { news?: News[] }) {
  return <LatestNewsUI news={news} />;
}
