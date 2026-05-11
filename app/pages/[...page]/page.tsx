import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "@/components/builder";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

export default async function Page(props: { params: { page: string[] } }) {
  const content = await builder
    .get("page", {
      userAttributes: { urlPath: "/" + (props.params.page?.join("/") || "") },
    })
    .toPromise();

  return <RenderBuilderContent content={content} model="page" />;
}
