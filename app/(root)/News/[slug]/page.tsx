import { db } from "@/db/index";
import { newsArticles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sanitizeHTML } from "@/lib/sanitize";
import {
  IoCalendarOutline,
  IoArrowBack,
  IoTimeOutline,
  IoPricetagOutline,
} from "react-icons/io5";
// Import your Client Component
import ShareButtons from "@/components/ShareButtons";
import NewsGalleryLightbox from "@/components/NewsGalleryLightbox";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await db.query.newsArticles.findFirst({
    where: eq(newsArticles.slug, slug),
    with: { category: true },
  });

  if (!news) {
    return {
      title: "News Article | Muve Healthcare",
    };
  }

  const plainContent = news.content
    ?.replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);

  return {
    title: `${news.title} | Muve Healthcare`,
    description: news.seoDesc || plainContent || "",
    openGraph: {
      title: news.title,
      description: news.seoDesc || plainContent || "",
      images: news.featuredImg ? [{ url: news.featuredImg }] : [],
      type: "article",
    },
  };
}

export default async function NewsPage({ params }: PageProps) {
  const { slug } = await params;

  const news = await db.query.newsArticles.findFirst({
    where: eq(newsArticles.slug, slug),
    with: {
      category: true,
      images: { orderBy: (img, { asc }) => [asc(img.order)] },
    },
  });

  if (!news) notFound();

  const SidebarInfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <div className="flex items-start gap-4">
      <div className="bg-lightblue/20 p-3 rounded-xl">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-widest text-white font-lexendBold">
          {label}
        </p>
        <p className="text-sm font-lexend mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-purple w-full py-8 md:py-16 overflow-hidden font-lexend">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl p-5 sm:p-8 md:p-14">
        <div className="mb-10">
          <Link
            href="/News"
            className="inline-flex items-center gap-2 text-navyblue hover:text-lightblue transition-colors font-lexendBold group"
          >
            <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
            Back to News
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8">
            {news.featuredImg && (
              <div className="relative h-48 sm:h-64 md:h-96 w-full rounded-xl md:rounded-[2rem] overflow-hidden mb-8 md:mb-12 shadow-xl">
                <Image
                  src={news.featuredImg}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <h2 className="text-navyblue font-lexendBold leading-tight mb-6">
              {news.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500 mb-6 md:mb-10 pb-4 md:pb-6 border-b border-navyblue">
              <div className="flex items-center gap-2">
                <IoCalendarOutline size={16} />
                <span>
                  {new Date(news.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <IoTimeOutline size={16} />
                <span>5 Minute Read</span>
              </div>
            </div>

            <div
              className="prose prose-lg max-w-none font-lexend 
                          prose-headings:text-navyblue 
                          prose-p:text-navyblue/80 
                          prose-a:text-lightblue 
                          prose-strong:text-navyblue
                          prose-img:rounded-3xl"
            >
              {news.excerpt && (
                <p className="text-xl italic text-navyblue/70 mb-8">
                  {news.excerpt}
                </p>
              )}
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(news.content || ""),
                }}
              />
            </div>

            {/* Functional Client Component */}
            <ShareButtons title={news.title} />
          </div>

          <div className="lg:col-span-4 space-y-6 lg:space-y-8 lg:sticky lg:top-28 h-fit">
            <div className="bg-navyblue rounded-xl md:rounded-[2rem] p-5 sm:p-8 text-white shadow-2xl">
              <h3 className="text-xl font-extrabold mb-8 border-b border-white/10 pb-4">
                Article Details
              </h3>
              <div className="space-y-6">
                {/* Display category from the joined relation */}
                <SidebarInfoItem
                  icon={
                    <IoPricetagOutline size={24} className="text-lightblue" />
                  }
                  label="Category"
                  value={news.category?.name || "Uncategorized"}
                />
              </div>
              <div className="mt-8">
                <a
                  href="https://www.cognitoforms.com/ICare24Group1/EmailSubscriptionConsentForm"
                  target="_blank"
                  className="block w-full bg-lightblue text-navyblue font-lexendBold py-4 rounded-full hover:bg-white transition-all text-center"
                >
                  Join Newsletter
                </a>
              </div>
            </div>

            {news.images && news.images.length > 0 && (
              <NewsGalleryLightbox
                images={news.images}
                articleTitle={news.title}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
