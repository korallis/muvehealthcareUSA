"use client";

import { Render, type Data } from "@puckeditor/core";
import { config } from "@/puck.config";
import { usePathname } from "next/navigation";
import LatestNewsSmart from "@/components/Faq/LatestNews";
import EventsSmart from "@/components/Social/Events";
// import WorkWithUsSmart from "@/components/GetInTouch/WorkWithUs";

interface Job {
  id: string;
  title: string;
  location: string;
  salaryRange: string | null;
  featuredImg: string | null;
  category: string | null;
  description: string;
  slug: string;
}

interface PuckClientRenderProps {
  data: Data;
  events: unknown[];
  jobs: unknown[];
  news: unknown[];
  globalNavProps?: Record<string, unknown>;
}

export default function PuckClientRender({
  data,
  events,
  jobs,
  news,
}: PuckClientRenderProps) {
  const pathname = usePathname();

  // Detect if we are on the specific dashboard page for global settings
  const isEditingGlobal = pathname?.includes("global-settings");

  const liveConfig = {
    ...config,
    components: {
      ...config.components,
      Navbar: {
        ...config.components.Navbar,
        // Returns an empty fragment to satisfy TS and prevent duplicates
        render: isEditingGlobal ? config.components.Navbar.render : () => <></>,
      },
      LatestNews: {
        ...config.components.LatestNews,
        render: () => (
          <LatestNewsSmart
            news={
              news as {
                id: string;
                title: string;
                content?: string | null;
                featuredImg?: string | null;
                slug: string;
              }[]
            }
          />
        ),
      },
      Events: {
        ...config.components.Events,
        render: () => (
          <EventsSmart
            events={
              events as {
                id: string;
                title: string;
                description?: string | null;
                location?: string | null;
                startDate: string | Date;
                featuredImg?: string | null;
                slug: string;
              }[]
            }
          />
        ),
      },
      // WorkWithUs: {
      //   ...config.components.WorkWithUs,
      //   render: (puckFields: Record<string, unknown>) => (
      //     <WorkWithUsSmart
      //       title={puckFields.title as string | undefined}
      //       initialJobs={jobs as Job[]}
      //     />
      //   ),
      // },
    },
  };

  // Filter content: Remove "Navbar" from any page that isn't the global-settings editor
  const filteredData = isEditingGlobal
    ? data
    : {
        ...data,
        content:
          data?.content?.filter(
            (item: { type: string }) => item.type !== "Navbar",
          ) || [],
      };

  return <Render config={liveConfig} data={filteredData} />;
}
