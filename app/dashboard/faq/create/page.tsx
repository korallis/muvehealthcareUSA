"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  HelpCircle,
  Tag,
  MessageSquare,
  Loader2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { createFAQAction } from "../actions";
import {
  createFAQCategoryAction,
  getFAQCategoriesAction,
} from "../../categories/faq/faq-category-actions";
import InlineCategoryCreateDialog from "@/components/dashboard/InlineCategoryCreateDialog";

const faqSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  answer: z.string().min(10, "Please provide a detailed answer"),
  categoryId: z.string().min(1, "Please select a category"), // Now validating UUID
});

type FAQFormValues = z.infer<typeof faqSchema>;

export default function CreateFAQPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  async function loadCategories() {
    const res = await getFAQCategoriesAction();
    console.log("Categories:", res)
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
  } = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      categoryId: "",
      question: "",
      answer: "",
    },
  });

  async function onSubmit(data: FAQFormValues) {
    setLoading(true);
    setServerError(null);

    // Result now sends categoryId instead of category string
    const result = await createFAQAction(data);

    if (result?.error) {
      setServerError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard/faq");
      router.refresh();
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
            Create New FAQ
          </h1>
          <p className="text-gray-500">
            Add a common question and answer for your users.
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
          {/* Category Select Dropdown */}
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
                {...register("categoryId")}
                className={`w-full px-4 py-3 rounded-xl border ${errors.categoryId ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#00D9DA] outline-none bg-white transition-all appearance-none cursor-pointer text-[#1F3154]`}
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {/* Custom arrow icon for the select */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>

            {errors.categoryId && (
              <p className="text-red-500 text-xs font-medium">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Question Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              <HelpCircle size={14} /> Question
            </label>
            <input
              {...register("question")}
              placeholder="e.g. How do I contact support after hours?"
              className={`w-full px-4 py-3 rounded-xl border ${errors.question ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#00D9DA] outline-none transition-all`}
            />
            {errors.question && (
              <p className="text-red-500 text-xs font-medium">
                {errors.question.message}
              </p>
            )}
          </div>

          {/* Answer Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={14} /> Answer
            </label>
            <textarea
              {...register("answer")}
              rows={6}
              placeholder="Provide a clear, concise answer..."
              className={`w-full px-4 py-3 rounded-xl border ${errors.answer ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#00D9DA] outline-none resize-none transition-all`}
            />
            {errors.answer && (
              <p className="text-red-500 text-xs font-medium">
                {errors.answer.message}
              </p>
            )}
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
                Publishing...
              </>
            ) : (
              "Publish FAQ"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
