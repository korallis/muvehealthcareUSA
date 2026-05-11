// app/privacy/page.tsx
import { Render } from "@puckeditor/core";
import { config } from "../../../puck.config"; // Path to the config we created earlier
import { getPageDataAction } from "@/lib/actions/editor"; // Your function to fetch saved JSON

export default async function PrivacyPolicyPage() {
  // 1. Fetch the data you saved from the Puck editor
  const data = await getPageDataAction("privacy-policy");

  // 2. If no data exists yet, you can provide a fallback or redirect
  if (!data) {
    return (
      <div>No policy data found. Please edit the page in the dashboard.</div>
    );
  }

  // 3. Render the dynamic content using your Puck config
  return <Render config={config} data={data} />;
}
