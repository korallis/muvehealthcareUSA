"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2, Image as ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import { updateStoryAction } from "../../actions";
// Import your new Vercel Blob action
import { uploadImageAction } from "@/lib/actions/puckUpload";

interface StoryData {
  id: number;
  name: string;
  role: string | null;
  content: string;
  imageUrl: string;
}

export default function EditStoryForm({ story }: { story: StoryData }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(story.imageUrl);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: story.name,
      role: story.role,
      content: story.content,
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImageAction(formData);

      if ("error" in result) {
        alert(result.error);
      } else {
        setImageUrl(result.url);
      }
    } catch {
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: {
    name: string;
    role: string | null;
    content: string;
  }) => {
    setLoading(true);
    const res = await updateStoryAction(story.id, {
      ...data,
      role: data.role ?? undefined,
      imageUrl,
    });

    if (res.success) {
      router.push("/dashboard/stories");
      router.refresh();
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/stories">
          <ArrowLeft className="text-[#1F3154] hover:scale-110 transition-transform" />
        </Link>
        <h1 className="text-3xl font-black text-[#1F3154]">
          Edit Story: {story.name}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-3xl border shadow-xl space-y-6"
      >
        {/* Updated Image Upload Area */}
        <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-2xl bg-gray-50 border-[#00D9DA]/30">
          <div className="relative">
            <img
              src={imageUrl || "/api/placeholder/400/400"}
              alt="Preview"
              className={`w-40 h-40 rounded-full object-cover mb-4 border-4 border-[#00D9DA] transition-opacity ${isUploading ? "opacity-50" : "opacity-100"}`}
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center mb-4">
                <Loader2 className="animate-spin text-[#1F3154]" size={32} />
              </div>
            )}
          </div>

          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/gif,image/webp"
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isUploading ? (
              "Uploading..."
            ) : (
              <>
                <Upload size={16} /> Change Photo
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 mt-2">
            Recommended: Square image, max 4MB
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-bold text-[#1F3154] text-sm uppercase">
              Name
            </label>
            <input
              {...register("name")}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="font-bold text-[#1F3154] text-sm uppercase">
              Role / Tagline
            </label>
            <input
              {...register("role")}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-bold text-[#1F3154] text-sm uppercase">
            Full Story Content
          </label>
          <textarea
            {...register("content")}
            rows={8}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || isUploading}
          className="w-full bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] text-white p-4 rounded-2xl font-bold flex justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Update Story"}
        </button>
      </form>
    </div>
  );
}
