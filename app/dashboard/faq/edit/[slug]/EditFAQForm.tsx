"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { updateFAQAction } from "../../actions";
import {
  createFAQCategoryAction,
  getFAQCategoriesAction,
} from "../../../categories/faq/faq-category-actions";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  HelpCircle,
  MessageSquare,
  Tag,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import InlineCategoryCreateDialog from "@/components/dashboard/InlineCategoryCreateDialog";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  // FIX: Change to string | null to match Drizzle's database output
  categoryName: string | null;
}

export default function EditFAQForm({ faq }: { faq: FAQ }) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const router = useRouter();

  async function loadCategories() {
    const res = await getFAQCategoriesAction();
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
  } = useForm({
    defaultValues: {
      question: faq.question,
      answer: faq.answer,
      categoryId: faq.categoryId,
    },
  });

  async function onSubmit(data: {
    question: string;
    answer: string;
    categoryId: string;
  }) {
    setLoading(true);
    setServerError(null);

    const res = await updateFAQAction(faq.id, data);

    if (res.success) {
      router.push("/dashboard/faq");
      router.refresh();
    } else {
      setServerError(res.error || "An error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/faq"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-[#1F3154]" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[#1F3154] tracking-tight">
            Edit FAQ
          </h1>
          <p className="text-gray-500">
            Update the question or answer for this entry.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {serverError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
            {serverError}
          </div>
        )}

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
                <Tag size={14} /> Category
              </label>
              {/* <InlineCategoryCreateDialog
                createAction={createFAQCategoryAction}
                onCreated={(cat) =>
                  setCategories((prev) =>
                    [...prev, cat].sort((a, b) => a.name.localeCompare(b.name))
                  )
                }
              /> */}
            </div>

            <div className="relative">
              <select
                {...register("categoryId", {
                  required: "Please select a category",
                })}
                className={`w-full px-4 py-3 rounded-xl border ${errors.categoryId ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#00D9DA] outline-none bg-white transition-all appearance-none cursor-pointer text-[#1F3154]`}
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
            {errors.categoryId && (
              <p className="text-red-500 text-xs font-medium">
                {errors.categoryId.message}
              </p>
            )}
            <p className="text-[10px] text-gray-400 italic">
              Currently grouped under:{" "}
              <strong>{faq.categoryName || "Uncategorized"}</strong>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              <HelpCircle size={14} /> Question
            </label>
            <input
              {...register("question", { required: "Question is required" })}
              placeholder="Question"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={14} /> Answer
            </label>
            <textarea
              {...register("answer", { required: "Answer is required" })}
              rows={6}
              placeholder="Answer"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none resize-none transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Updating...
              </>
            ) : (
              "Update FAQ"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
