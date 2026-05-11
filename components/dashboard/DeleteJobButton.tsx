"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteJobAction } from "@/app/dashboard/jobs/actions";
import { useRouter } from "next/navigation";

export default function DeleteJobButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm(`Delete vacancy for "${title}"?`)) return;

    setIsDeleting(true);
    const result = await deleteJobAction(id);

    if (result?.error) {
      alert(result.error);
      setIsDeleting(false);
    } else {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
    >
      {isDeleting ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  );
}
