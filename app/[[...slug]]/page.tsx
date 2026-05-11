import { notFound } from "next/navigation";
import { getEventsData } from "@/lib/get-events";
import { getJobs } from "@/lib/get-jobs";
import { getNewsData } from "@/lib/get-news";
import { getPageDataAction } from "@/lib/actions/editor";
import PuckClientRender from "@/components/PuckClientRender";
import { config } from "@/puck.config";

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  // Use slug from the dynamic route segment
  const slugPath = resolvedParams.slug?.join("/") || "home";

  // Fetch everything on the SERVER
  const [data, globalData, events, jobs, news] = await Promise.all([
    getPageDataAction(slugPath),
    getPageDataAction("global-settings"), // Fetching the source of truth for Nav
    getEventsData(),
    getJobs(),
    getNewsData(),
  ]);

  if (!data) return notFound();

  // FIX: Added optional chaining to prevent "Cannot read properties of undefined"
  const navItem = globalData?.content?.find(
    (item: { type: string; props?: Record<string, unknown> }) =>
      item.type === "Navbar",
  );

  // Use a safe fallback for the default props
  const globalNavProps = navItem?.props ||
    config?.components?.Navbar?.defaultProps || { links: [] };

  const isHomePage = slugPath === "home";

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Muve Healthcare",
    url: "https://www.muvehealthcare.com",
    logo: "https://www.muvehealthcare.com/muve-logo.svg",
  };

  return (
    <>
      {isHomePage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      )}
      <PuckClientRender
        data={data}
        events={events}
        jobs={jobs}
        news={news}
        globalNavProps={globalNavProps}
      />
    </>
  );
}
