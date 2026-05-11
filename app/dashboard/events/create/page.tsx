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
  Type,
  FileText,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { createEventAction, getAllCategoriesAction, createCategoryAction } from "../actions";
import ImageUpload from "@/components/dashboard/ImageUpload";
import InlineCategoryCreateDialog from "@/components/dashboard/InlineCategoryCreateDialog";

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  categoryId: z.string().min(1, "Please select a category"), // Changed to categoryId
  seoDesc: z.string().min(10, "Sub-headline is too short"),
  excerpt: z.string().min(10, "Overview is too short"),
  description: z.string().min(10, "Please provide a detailed description"),
  location: z.string().min(3, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  featuredImg: z
    .string()
    .url("Must be a valid image URL")
    .optional()
    .or(z.literal("")),
  applyUrl: z
      .string()
      .url("Must be a valid URL (https://...)")
      .optional()
      .or(z.literal("")),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Store full category objects {id, name}
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
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      seoDesc: "",
      excerpt: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      featuredImg: "",
      applyUrl: "",
    },
  });

  async function onSubmit(data: EventFormValues) {
    setLoading(true);
    setServerError(null);

    // Submits categoryId (UUID) to the database
    const result = await createEventAction(data);

    if (result?.error) {
      setServerError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard/events");
      router.refresh();
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
            Create New Event
          </h1>
          <p className="text-gray-500">
            Fill in the details to publish a new community event.
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

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider">
              Sub-Headline (SEO Description)
            </label>
            <input
              {...register("seoDesc")}
              placeholder="Brief summary for event listings..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider">
              Brief Overview (Italic Quote)
            </label>
            <textarea
              {...register("excerpt")}
              placeholder="The introductory overview shown on the event page..."
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

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} /> Full Description
            </label>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Detailed event information..."
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
              "Publish Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
