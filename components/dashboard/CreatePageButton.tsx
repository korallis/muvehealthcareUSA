"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreatePageButton() {
  const router = useRouter();

  const handleCreate = () => {
    const slug = prompt(
      "Enter the URL slug for the new page (e.g., 'about-us' or 'services')",
    );

    if (slug) {
      // Basic normalization: lowercase and replace spaces with dashes
      const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, "-");

      // Redirect to the dynamic editor route
      router.push(`/dashboard/edit/${cleanSlug}`);
    }
  };

  return (
    <button
      onClick={handleCreate}
      title="Create New Page"
      className="bg-[#00D9DA] text-[#1F3154] p-3 rounded-xl hover:scale-105 transition-transform"
    >
      <Plus size={20} strokeWidth={3} />
    </button>
  );
}
