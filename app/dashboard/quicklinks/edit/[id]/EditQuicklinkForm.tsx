"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { updateQuicklinkAction } from "../../actions";
import {
  createQuicklinkCategoryAction,
  getQuicklinkCategoriesAction,
} from "../../../categories/quicklinks/quicklink-category-actions";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Tag,
  Link as LinkIcon,
  FileText,
  Download,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import InlineCategoryCreateDialog from "@/components/dashboard/InlineCategoryCreateDialog";

interface Quicklink {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  categoryName: string | null;
  downloadUrl: string | null;
}

type QuicklinkFormValues = {
  question: string;
  answer: string;
  categoryId: string;
  downloadUrl: string;
};

export default function EditQuicklinkForm({ link }: { link: Quicklink }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const router = useRouter();

  async function loadCategories() {
    const res = await getQuicklinkCategoriesAction();
    if (res.success && res.data) {
      setCategories(res.data);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuicklinkFormValues>({
    defaultValues: {
      question: link.question,
      answer: link.answer,
      categoryId: link.categoryId,
      downloadUrl: link.downloadUrl || "",
    },
  });

  const onSubmit = async (data: QuicklinkFormValues) => {
    setLoading(true);
    const res = await updateQuicklinkAction(link.id, data);
    if (res.success) {
      router.push("/dashboard/quicklinks");
      router.refresh();
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/quicklinks"
          className="hover:scale-110 transition-transform"
        >
          <ArrowLeft className="text-[#1F3154]" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[#1F3154]">Edit Link</h1>
          <p className="text-gray-500">
            Update the resource information below.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-3xl border shadow-xl space-y-6"
      >
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="font-bold text-[#1F3154] text-sm uppercase flex items-center gap-2">
              <Tag size={14} /> Category
            </label>
            {/* <InlineCategoryCreateDialog
              createAction={createQuicklinkCategoryAction}
              onCreated={(cat) =>
                setCategories((prev) =>
                  [...prev, cat].sort((a, b) => a.name.localeCompare(b.name))
                )
              }
            /> */}
          </div>

          <div className="relative">
            <select
              {...register("categoryId", { required: "Category is required" })}
              className={`w-full p-3 rounded-xl border ${errors.categoryId ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#00D9DA] outline-none bg-white appearance-none cursor-pointer text-[#1F3154]`}
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={16} />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 italic">
            Currently grouped under:{" "}
            <strong>{link.categoryName || "Uncategorized"}</strong>
          </p>
        </div>

        <div className="space-y-2">
          <label className="font-bold text-[#1F3154] text-sm uppercase flex items-center gap-2">
            <LinkIcon size={14} /> Resource Title
          </label>
          <input
            {...register("question")}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none"
            placeholder="Title"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-[#1F3154] text-sm uppercase flex items-center gap-2">
            <FileText size={14} /> Description
          </label>
          <textarea
            {...register("answer")}
            rows={4}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none"
            placeholder="Description"
          />
        </div>

        <div className="p-6 bg-[#00D9DA]/10 rounded-2xl border-2 border-dashed border-[#00D9DA] space-y-3">
          <label className="font-bold text-[#1F3154] text-sm uppercase flex items-center gap-2">
            <Download size={16} /> Download Link (Optional)
          </label>
          <input
            {...register("downloadUrl")}
            placeholder="Paste the URL here (e.g. website.com)"
            className="w-full p-3 rounded-xl border border-white bg-white shadow-sm focus:ring-2 focus:ring-[#00D9DA] outline-none"
          />
          <p className="text-xs text-[#1F3154]/60 italic">
            Provide a link here to automatically show a "Download Resource"
            button.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1F3154] hover:bg-[#1F3154]/90 text-white p-4 rounded-2xl font-bold flex justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Updating...
            </>
          ) : (
            "Update Quicklink"
          )}
        </button>
      </form>
    </div>
  );
}
