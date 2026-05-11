"use client";

import { X, Loader2, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { uploadImageAction } from "@/lib/actions/puckUpload";
import Image from "next/image";

interface GalleryUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export default function GalleryUpload({
  images,
  onChange,
  max = 50,
}: GalleryUploadProps) {
  const [uploading, setUploading] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = max - images.length;
    const filesToUpload = Array.from(files).slice(0, remaining);

    if (filesToUpload.length === 0) return;

    setUploading(filesToUpload.length);
    const newUrls: string[] = [];

    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const result = await uploadImageAction(formData);
        if ("url" in result) {
          newUrls.push(result.url);
        }
      } catch {
        // Skip failed uploads silently
      }
      setUploading((prev) => prev - 1);
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
    }

    // Reset file input so the same files can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 p-8 transition-all hover:bg-gray-50 hover:border-[#00D9DA] cursor-pointer flex flex-col items-center justify-center gap-3"
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          disabled={uploading > 0 || images.length >= max}
        />

        <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100">
          {uploading > 0 ? (
            <Loader2 className="w-6 h-6 text-[#00D9DA] animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-gray-400" />
          )}
        </div>

        <div className="text-center">
          <p className="text-[#1F3154] font-bold text-sm">
            {uploading > 0
              ? `Uploading ${uploading} image${uploading > 1 ? "s" : ""}...`
              : "Click to upload gallery images"}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Select multiple files. Recommended: 1200x800px. Max 5MB per image.
          </p>
        </div>
      </div>

      {/* Gallery preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded-2xl border border-dashed border-gray-200">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white"
            >
              <Image
                src={img}
                alt={`Gallery image ${idx + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
        <span>Images Added</span>
        <span className={images.length >= max ? "text-red-500" : "text-[#00D9DA]"}>
          {images.length} / {max}
        </span>
      </div>
    </div>
  );
}
