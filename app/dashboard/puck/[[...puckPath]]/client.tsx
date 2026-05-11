"use client";

import { Puck, type Data } from "@puckeditor/core";
import { config } from "@/puck.config";
import "@puckeditor/core/dist/index.css";
import "@/app/globals.css";

interface PuckClientEditorProps {
  data: Data | null;
  slug: string;
  savePageAction: (path: string, data: Data) => Promise<void>;
}

export default function PuckClientEditor({
  data,
  slug,
  savePageAction,
}: PuckClientEditorProps) {
  return (
    <Puck
      config={config}
      data={data || { content: [], root: {} }}
      iframe={{ enabled: true }}
      onPublish={async (newData) => {
        await savePageAction(slug, newData);
      }}
    />
  );
}
