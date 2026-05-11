export const dynamic = "force-dynamic";

import { authGuard } from "@/lib/authGuard";
import {
  getCategoriesWithCounts,
  getFAQCategoriesWithCounts,
  getQuicklinkCategoriesWithCounts,
  getJobCategoriesWithCounts,
} from "./actions";
import CategoryManagementClient from "./CategoryManagementClient";

export default async function CategoriesPage() {
  await authGuard("admin");

  const results = await Promise.allSettled([
    getCategoriesWithCounts(),
    getFAQCategoriesWithCounts(),
    getQuicklinkCategoriesWithCounts(),
    getJobCategoriesWithCounts(),
  ]);

  const sharedCategories = results[0].status === "fulfilled" ? results[0].value : [] as Awaited<ReturnType<typeof getCategoriesWithCounts>>;
  const faqCategories = results[1].status === "fulfilled" ? results[1].value : [] as Awaited<ReturnType<typeof getFAQCategoriesWithCounts>>;
  const quicklinkCategories = results[2].status === "fulfilled" ? results[2].value : [] as Awaited<ReturnType<typeof getQuicklinkCategoriesWithCounts>>;
  const jobCategories = results[3].status === "fulfilled" ? results[3].value : [] as Awaited<ReturnType<typeof getJobCategoriesWithCounts>>;

  const failedQueries = results
    .map((r, i) => (r.status === "rejected" ? i : null))
    .filter((i) => i !== null);

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#1F3154] tracking-tight">
          Categories
        </h1>
        <p className="text-gray-500 mt-1">
          Manage categories across News, Events, FAQ, Quick Links, and Jobs.
        </p>
      </div>

      {failedQueries.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          Some category tables could not be loaded. A database migration may be pending.
        </div>
      )}

      <CategoryManagementClient
        sharedCategories={sharedCategories}
        faqCategories={faqCategories}
        quicklinkCategories={quicklinkCategories}
        jobCategories={jobCategories}
      />
    </div>
  );
}
