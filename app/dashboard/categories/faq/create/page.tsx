"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Tag, FileText, Loader2, PlusCircle } from "lucide-react";
import { createFAQCategoryAction } from "../faq-category-actions"; // Point to FAQ action

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CreateFAQCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" },
  });

  async function onSubmit(data: CategoryFormValues) {
    setLoading(true);
    setServerError(null);

    const result = await createFAQCategoryAction(data);

    if (result && "error" in result) {
      setServerError(result.error);
      setLoading(false);
    } else {
      // Go back to the FAQ creation form
      router.back();
      setTimeout(() => router.refresh(), 100);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-[#1F3154]" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#1F3154] tracking-tight">
            New FAQ Category<span className="text-[#00D9DA]">.</span>
          </h1>
          <p className="text-gray-500">
            Create a specific category to group your FAQ questions.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
            {serverError}
          </div>
        )}

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              <Tag size={14} /> FAQ Category Name
            </label>
            <input
              {...register("name")}
              placeholder="e.g. General Support, Care Services, Employment"
              className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#00D9DA] outline-none transition-all`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} /> Category Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Briefly describe what this FAQ group covers..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none resize-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1F3154] text-white py-4 rounded-2xl font-bold hover:bg-[#00D9DA] hover:text-[#1F3154] transition-all flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <PlusCircle size={20} />
              Save FAQ Category
            </>
          )}
        </button>
      </form>
    </div>
  );
}
