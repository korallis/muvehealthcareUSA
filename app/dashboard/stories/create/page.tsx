"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, User, FileText, Loader2, Award } from "lucide-react";
import Link from "next/link";
import { createStoryAction } from "../actions";
import ImageUpload from "@/components/dashboard/ImageUpload";

// Validation Schema
const storySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role/Title is required (e.g. Impact Story)"),
  content: z.string().min(10, "Please provide a detailed story content"),
  imageUrl: z
    .string()
    .url("Please upload an image")
    .min(1, "Image is required"),
});

type StoryFormValues = z.infer<typeof storySchema>;

export default function CreateStoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      name: "",
      role: "Impact Story",
      content: "",
      imageUrl: "",
    },
  });

  async function onSubmit(data: StoryFormValues) {
    setLoading(true);
    setServerError(null);

    const result = await createStoryAction(data);

    if (result?.error) {
      setServerError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard/stories");
      router.refresh();
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/stories"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-[#1F3154]" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[#1F3154] tracking-tight">
            Add Impact Story
          </h1>
          <p className="text-gray-500">
            Share a new story of impact and community success.
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
          {/* Image Upload - Consistent with Events */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              Profile Image
            </label>
            <Controller
              control={control}
              name="imageUrl"
              render={({ field }) => (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                  <ImageUpload
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                  <p className="text-[10px] text-gray-400 mt-2 italic text-center">
                    Upload a high-quality square image for the best results.
                  </p>
                </div>
              )}
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-xs font-medium text-center">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
                <User size={14} /> Full Name
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Jane Doe"
                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#00D9DA] outline-none transition-all`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Role Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
                <Award size={14} /> Label / Role
              </label>
              <input
                {...register("role")}
                placeholder="e.g. Impact Story"
                className={`w-full px-4 py-3 rounded-xl border ${errors.role ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#00D9DA] outline-none transition-all`}
              />
              {errors.role && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} /> The Story
            </label>
            <textarea
              {...register("content")}
              rows={8}
              placeholder="Describe the journey, the challenge, and the positive outcome..."
              className={`w-full px-4 py-3 rounded-xl border ${errors.content ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#00D9DA] outline-none resize-none transition-all`}
            />
            {errors.content && (
              <p className="text-red-500 text-xs font-medium">
                {errors.content.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
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
              "Publish Story"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
