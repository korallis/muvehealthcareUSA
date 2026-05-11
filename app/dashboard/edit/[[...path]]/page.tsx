"use client";

import { Puck, Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { config } from "@/puck.config";
import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { savePageAction, getPageDataAction } from "@/lib/actions/editor";

function TailwindIframe({
  children,
  document,
}: {
  children: ReactNode;
  document?: Document;
}) {
  useEffect(() => {
    if (document && !document.getElementById("tw-v4")) {
      const s = document.createElement("script");
      s.id = "tw-v4";
      s.src = "https://unpkg.com/@tailwindcss/browser@4";
      document.head.appendChild(s);
    }
  }, [document]);
  return <>{children}</>;
}

export default function AdminEditor() {
  const params = useParams();

  const rawPath = Array.isArray(params.path) ? params.path.join("/") : "home";
  const slug = rawPath.replace(/^\/|\/$/g, "").toLowerCase() || "home";

  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    getPageDataAction(slug).then((res) => {
      setData(res || { content: [], root: {} });
    });
  }, [slug]);

  const onPublish = async (newData: Data) => {
    try {
      await savePageAction(slug, newData);
      alert(`Successfully published: /${slug}`);
    } catch (e) {
      alert("Error saving page. Check database connection.");
      console.error(e);
    }
  };

  if (!data)
    return (
      <div className="h-screen flex items-center justify-center font-bold text-[#1F3154] animate-pulse">
        Initializing Muve Editor...
      </div>
    );

  return (
    <div className="h-screen bg-white">
      <Puck
        config={config}
        data={data}
        onPublish={onPublish}
        overrides={{
          iframe: TailwindIframe,
        }}
      />
    </div>
  );
}
