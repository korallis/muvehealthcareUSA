"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteNewsAction } from "@/app/dashboard/news/actions";
import { useRouter } from "next/navigation";

interface DeleteNewsButtonProps {
  id: string;
  title: string;
}

export default function DeleteNewsButton({ id, title }: DeleteNewsButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    // 2025 Browser confirmation - simple and effective for admin safety
    const confirmed = window.confirm(
      `Are you sure you want to delete the article: "${title}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const result = await deleteNewsAction(id);

      if (result?.error) {
        alert(result.error);
        setIsDeleting(false);
      } else {
        // Refresh the page data to show the item is gone
        router.refresh();
      }
    } catch (error) {
      alert("An unexpected error occurred while deleting the article.");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-2 rounded-lg transition-all flex items-center justify-center 
        ${
          isDeleting
            ? "bg-gray-100 text-gray-400"
            : "text-gray-400 hover:text-red-600 hover:bg-red-50"
        }`}
      title="Delete Article"
    >
      {isDeleting ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  );
}
