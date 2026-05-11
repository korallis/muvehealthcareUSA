"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Save,
  Loader2,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Plus,
  X,
  Check,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import {
  createJobAction,
  createCategoryAction,
  getJobCategoriesAction,
} from "../actions";
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

export default function CreateJobForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isCatLoading, setIsCatLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      location: "",
      salaryRange: "",
      featuredImg: "",
      applyUrl: "",
    },
  });

  // Load job categories on mount
  useEffect(() => {
    async function loadCategories() {
      const data = await getJobCategoriesAction();
      if (data && data.length > 0) {
        setCategories(data);
        if (!watch("category")) {
          setValue("category", data[0].name);
        }
      }
    }
    loadCategories();
  }, [setValue, watch]);

  const handleQuickAddCategory = async () => {
    if (!newCatName.trim()) return;
    setIsCatLoading(true);
    const res = await createCategoryAction(newCatName);
    if (res.success && res.category) {
      setCategories([...categories, res.category]);
      setValue("category", res.category.name);
      setIsAddingNew(false);
      setNewCatName("");
    } else {
      alert(res.error);
    }
    setIsCatLoading(false);
  };

  const onSubmit = async (data: JobFormValues) => {
    setLoading(true);
    const res = await createJobAction(data);
    if (res.success) {
      router.push("/dashboard/jobs");
      router.refresh();
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 font-lexend">
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
        <h1 className="text-4xl font-lexendBold text-[#1F3154]">New Vacancy</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
              Job Title
            </label>
            <input
              {...register("title")}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none transition-all font-lexend"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-lexendBold text-[#1F3154] uppercase tracking-wider">
                Category
              </label>
            </div>

            {isAddingNew ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="New category"
                  className="flex-1 p-3 rounded-xl border border-[#00D9DA] outline-none font-lexend"
                />
                <button
                  type="button"
                  onClick={handleQuickAddCategory}
                  className="bg-[#1F3154] text-white px-4 rounded-xl"
                >
                  {isCatLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Check size={16} />
                  )}
                </button>
              </div>
            ) : (
              <select
                {...register("category")}
                className="w-full p-3 rounded-xl border border-gray-200 bg-white cursor-pointer outline-none font-lexend"
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
            )}
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-lexendBold uppercase flex items-center gap-2 tracking-wider">
              <MapPin size={14} /> Location
            </label>
            <input
              {...register("location")}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none font-lexend"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-lexendBold uppercase flex items-center gap-2 tracking-wider">
              <DollarSign size={14} /> Salary Range
            </label>
            <input
              {...register("salaryRange")}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none font-lexend"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-lexendBold uppercase tracking-wider">
            Job Description
          </label>
          <textarea
            {...register("description")}
            rows={6}
            className="w-full p-3 rounded-xl border border-gray-200 outline-none font-lexend"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1 font-lexend">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-lexendBold uppercase tracking-wider flex items-center gap-2">
            <ImageIcon size={14} /> Featured Image
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1F3154] text-white p-4 rounded-xl font-lexendBold hover:bg-[#00D9DA] hover:text-[#1F3154] transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Save size={18} /> Post Vacancy
            </>
          )}
        </button>
      </form>
    </div>
  );
}
