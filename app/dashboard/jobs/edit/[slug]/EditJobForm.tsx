"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Save,
  Loader2,
  Link as LinkIcon,
  MapPin,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { updateJobAction } from "../../actions";
import ImageUpload from "@/components/dashboard/ImageUpload";

const jobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  salaryRange: z.string().optional(),
  featuredImg: z.string().optional().or(z.literal("")),
  applyUrl: z
    .string()
    .url("Must be a valid URL (https://...)")
    .optional()
    .or(z.literal("")),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface EditJobFormProps {
  job: {
    id: string;
    categoryId?: string | null;
    title?: string | null;
    description?: string | null;
    location?: string | null;
    salaryRange?: string | null;
    featuredImg?: string | null;
    applyUrl?: string | null;
  };
  categories: { id: string; name: string }[];
}

export default function EditJobForm({ job, categories }: EditJobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Find the category name that matches the job's categoryId to populate the dropdown
  const initialCategoryName =
    categories.find((c) => c.id === job.categoryId)?.name || "";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title || "",
      category: initialCategoryName, // Use the resolved name instead of raw UUID
      description: job?.description || "",
      location: job?.location || "",
      salaryRange: job?.salaryRange || "",
      featuredImg: job?.featuredImg || "",
      applyUrl: job?.applyUrl || "",
    },
  });

  const onSubmit = async (data: JobFormValues) => {
    setLoading(true);
    const res = await updateJobAction(job.id, data);
    if (res.success) {
      router.push("/dashboard/jobs");
      router.refresh();
    } else {
      alert(res.error || "An error occurred while updating the job.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 font-lexend">
      {/* Header - Consistent with dashboard style */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/jobs"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
        >
          <ArrowLeft
            size={24}
            className="text-[#1F3154] group-hover:text-[#00D9DA]"
          />
        </Link>
        <h1 className="text-4xl font-lexendBold text-[#1F3154]">
          Edit Vacancy
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
              Job Title
            </label>
            <input
              {...register("title")}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#00D9DA] outline-none transition-all font-lexend"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
              Category
            </label>
            <select
              {...register("category")}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:border-[#00D9DA] outline-none transition-all appearance-none font-lexend cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
              {categories.length === 0 && (
                <option value="">No categories available</option>
              )}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              <MapPin size={14} className="text-[#00D9DA]" /> Location
            </label>
            <input
              {...register("location")}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#00D9DA] outline-none transition-all font-lexend"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">
                {errors.location.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
              <DollarSign size={14} className="text-[#00D9DA]" /> Salary Range
            </label>
            <input
              {...register("salaryRange")}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#00D9DA] outline-none transition-all font-lexend"
            />
          </div>
        </div>

        <div className="p-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 space-y-3">
          <label className="text-xs font-lexendBold text-[#1F3154] uppercase flex items-center gap-2 tracking-wider">
            <LinkIcon size={14} className="text-[#00D9DA]" /> External
            Application Link (Optional)
          </label>
          <input
            {...register("applyUrl")}
            placeholder="https://external-careers-site.com"
            className="w-full p-3 rounded-xl border border-white bg-white shadow-sm focus:border-[#00D9DA] outline-none transition-all font-lexend"
          />
          <p className="text-[10px] text-gray-400 italic">
            If empty, the "Apply Now" button will default to an email link.
          </p>
          {errors.applyUrl && (
            <p className="text-red-500 text-xs mt-1 font-lexend">
              {errors.applyUrl.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
            Job Description
          </label>
          <textarea
            {...register("description")}
            rows={8}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#00D9DA] outline-none transition-all font-lexend"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1 font-lexend">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
            <ImageIcon size={14} className="text-[#00D9DA]" /> Featured Image
          </label>
          <Controller
            control={control}
            name="featuredImg"
            render={({ field }) => (
              <ImageUpload
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1F3154] text-white p-4 rounded-xl font-lexendBold hover:bg-[#00D9DA] hover:text-[#1F3154] transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Save size={18} /> Update Vacancy
            </>
          )}
        </button>
      </form>
    </div>
  );
}
