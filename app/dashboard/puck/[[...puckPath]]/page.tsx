import { getPageDataAction, savePageAction } from "@/lib/actions/editor";
import PuckClientEditor from "./client";

export default async function PuckEditorPage({
  params,
}: {
  params: Promise<{ puckPath?: string[] }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.puckPath?.join("/") || "home";
  const data = await getPageDataAction(slug);

  return (
    <div className="min-h-screen">
      <PuckClientEditor
        data={data}
        slug={slug}
        savePageAction={savePageAction}
      />
    </div>
  );
}
