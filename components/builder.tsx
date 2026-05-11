"use client";
import { BuilderComponent, useIsPreviewing } from "@builder.io/react";
import { builder, type BuilderContent } from "@builder.io/sdk";
import DefaultErrorPage from "next/error";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

interface BuilderPageProps {
  content?: BuilderContent;
  model: string;
}

export function RenderBuilderContent({ content, model }: BuilderPageProps) {
  const isPreviewing = useIsPreviewing();

  // If content is found or we are in the editor preview, render the component
  if (content || isPreviewing) {
    return <BuilderComponent content={content} model={model} />;
  }

  // If no content is found and not in preview, show a 404
  return <DefaultErrorPage statusCode={404} />;
}
