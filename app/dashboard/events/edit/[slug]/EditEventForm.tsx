"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Loader2,
  Tag,
  FileText,
  Type,
  Save,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { updateEventAction, getAllCategoriesAction, createCategoryAction } from "../../actions";
import ImageUpload from "@/components/dashboard/ImageUpload";
import InlineCategoryCreateDialog from "@/components/dashboard/InlineCategoryCreateDialog";

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Please provide a detailed description"),
  seoDesc: z.string().min(10, "Sub-headline is too short"),
  excerpt: z.string().min(10, "Overview is too short"),
  location: z.string().min(3, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().catch(""),
  featuredImg: z.string().url("Must be a valid image URL").catch(""),
  applyUrl: z.string().url("Must be a valid URL (https://...)").catch(""),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventData {
  id: string;
  title: string;
  categoryId: string | null;
  seoDesc: string | null;
  excerpt: string | null;
  description: string | null;
  location: string | null;
  startDate: Date | string | null;
  endDate: Date | string | null;
  featuredImg: string | null;
  applyUrl?: string | null;
}

export default function EditEventForm({ event }: { event: EventData }) {
  const [loading, setLoading] = useState(false);
  // Updated: Store full category objects {id, name}
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const router = useRouter();

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
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      categoryId: event?.categoryId || "", // Use ID from relationship
      seoDesc: event?.seoDesc || "",
      excerpt: event?.excerpt || "",
      description: event?.description || "",
      location: event?.location || "",
      startDate: event?.startDate
        ? new Date(event.startDate).toISOString().slice(0, 16)
        : "",
      endDate: event?.endDate
        ? new Date(event.endDate).toISOString().slice(0, 16)
        : "",
      featuredImg: event?.featuredImg || "",
      applyUrl: event?.applyUrl || "",
    },
  });

  async function onSubmit(data: EventFormValues) {
    setLoading(true);
    const res = await updateEventAction(event.id, data);
    if (res.success) {
      router.push("/dashboard/events");
      router.refresh();
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/events"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-[#1F3154]" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[#1F3154] tracking-tight">
            Edit Event
          </h1>
          <p className="text-gray-500">
            Update the details for this community event.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              <Type size={14} /> Event Title
            </label>
            <input
              {...register("title")}
              placeholder="e.g. Annual Community Wellness Day"
              className={`w-full px-4 py-3 rounded-xl border ${errors.title ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#00D9DA] outline-none transition-all`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs font-medium">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Sub-headline (seoDesc) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider">
              Sub-Headline (SEO Description)
            </label>
            <input
              {...register("seoDesc")}
              placeholder="Brief summary for listings..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none"
            />
          </div>

          {/* Brief Overview (excerpt) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider">
              Brief Overview (Italic Quote)
            </label>
            <textarea
              {...register("excerpt")}
              placeholder="Short introductory overview..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none italic resize-none"
            />
          </div>

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
              <option value="">Select a category...</option>
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

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} /> Start Date & Time
              </label>
              <input
                type="datetime-local"
                {...register("startDate")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} /> End Date & Time
              </label>
              <input
                type="datetime-local"
                {...register("endDate")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none"
              />
              <p className="text-[10px] text-gray-400 italic">Optional — leave blank for single-time events</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              <MapPin size={14} /> Location
            </label>
            <input
              {...register("location")}
              placeholder="e.g. Birmingham Central Hub"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} /> Description
            </label>
            <textarea
              {...register("description")}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-lexendBold uppercase tracking-wider flex items-center gap-2">
              <LinkIcon size={14} /> Application Link (Optional)
            </label>
            <input 
              {...register("applyUrl")} 
              placeholder="https://muvehealthcaresitestaging.vercel.app/"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none font-lexend" 
            />
            {errors.applyUrl && <p className="text-red-500 text-xs mt-1">{errors.applyUrl.message}</p>}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1F3154] uppercase">
              Featured Image
            </label>
            <Controller
              control={control}
              name="featuredImg"
              render={({ field }) => (
                <ImageUpload
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  previewShape="circle"
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={20} /> Update Event
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
