"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Loader2,
  Tag,
  FileText,
  Type,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/dashboard/ImageUpload";
import GalleryUpload from "@/components/dashboard/GalleryUpload";
import RichTextEditor from "@/components/dashboard/RichTextEditor";
import InlineCategoryCreateDialog from "@/components/dashboard/InlineCategoryCreateDialog";
import { updateNewsAction, getAllCategoriesAction, createCategoryAction } from "../../actions";

const newsSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  categoryId: z.string().min(1, "Category is required"),
  seoDesc: z.string().min(10, "Sub-headline is too short"),
  excerpt: z.string().min(10, "Overview is too short"),
  content: z.string().min(20, "Content is too short"),
  featuredImg: z.string().min(1, "Image is required"),
  galleryImages: z.array(z.string()).max(50, "Maximum 50 images allowed"),
});

type NewsFormValues = z.infer<typeof newsSchema>;

interface ArticleData {
  id: string;
  title: string;
  categoryId: string | null;
  seoDesc: string | null;
  excerpt: string | null;
  content: string;
  featuredImg: string | null;
  images?: { url: string }[];
}

export default function EditNewsForm({ article }: { article: ArticleData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  async function loadCategories() {
    const data = await getAllCategoriesAction();
    if (data) setCategories(data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: article.title || "",
      categoryId: article.categoryId || "",
      seoDesc: article?.seoDesc || "",
      excerpt: article?.excerpt || "",
      content: article.content || "",
      featuredImg: article.featuredImg || "",
      galleryImages:
        article.images?.map((img: { url: string }) => img.url) || [],
    },
  });

  const onSubmit = async (data: NewsFormValues) => {
    setLoading(true);
    setServerError(null);

    const res = await updateNewsAction(article.id, data);

    // 1. Check if res exists
    // 2. Use "in" to prove 'error' property is there
    if (res && "error" in res) {
      setServerError(res.error);
      setLoading(false);
    } else {
      // If it's not an error, it must be a success!
      router.push("/dashboard/news");
      router.refresh();
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 font-lexend">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/news"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-[#1F3154]" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[#1F3154] tracking-tight">
            Edit Article
          </h1>
          <p className="text-gray-500">
            Update the details of your published insight.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
            {serverError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
                <Type size={14} /> Title
              </label>
              <input
                {...register("title")}
                className={`w-full px-4 py-3 rounded-xl border ${errors.title ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#00D9DA] outline-none transition-all`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider">
                Sub-Headline (SEO Description)
              </label>
              <input
                {...register("seoDesc")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider">
                Brief Overview
              </label>
              <textarea
                {...register("excerpt")}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none italic resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} /> Content
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
            {/* Relationship-based Category Selection */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
                  <Tag size={14} /> Category
                </label>
                {/* <InlineCategoryCreateDialog
                  createAction={createCategoryAction}
                  onCreated={(cat) =>
                    setCategories((prev) =>
                      [...prev, cat].sort((a, b) => a.name.localeCompare(b.name))
                    )
                  }
                /> */}
              </div>
              <select
                {...register("categoryId")}
                className={`w-full px-4 py-3 rounded-xl border ${errors.categoryId ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#00D9DA] outline-none bg-white transition-all appearance-none`}
              >
                <option value="">Select an event type...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
                <ImageIcon size={14} /> Featured Image
              </label>
              <p className="text-gray-400 text-xs">
                Recommended: 1200x630px
              </p>
              <Controller
                control={control}
                name="featuredImg"
                render={({ field }) => (
                  <ImageUpload value={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            {/* Gallery Section — Multi-upload */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <Controller
                control={control}
                name="galleryImages"
                render={({ field }) => (
                  <GalleryUpload
                    images={Array.isArray(field.value) ? field.value : []}
                    onChange={field.onChange}
                    max={50}
                  />
                )}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1F3154] text-white py-4 rounded-2xl font-bold hover:bg-[#00D9DA] hover:text-[#1F3154] transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin mx-auto" />
              ) : (
                "Publish Article"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
