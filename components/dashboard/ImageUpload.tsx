"use client";

import { X, Image as ImageIcon, Loader2, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { uploadImageAction } from "@/lib/actions/puckUpload";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  previewShape?: "rectangle" | "circle";
}

export default function ImageUpload({ value, onChange, previewShape = "rectangle" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        onChange(result.url);
      }
    } catch {
      alert("Failed to upload image. Please check your connection.");
    } finally {
      setIsUploading(false);
    }
  };

  // If an image is already uploaded, show the preview
  if (value) {
    return (
      <div className={`relative w-full overflow-hidden border-2 border-gray-100 group ${
        previewShape === "circle"
          ? "aspect-square rounded-full"
          : "aspect-video rounded-2xl"
      }`}>
        <img
          src={value}
          alt="Upload preview"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={() => onChange("")}
            className="bg-red-500 text-white p-3 rounded-xl shadow-xl hover:bg-red-600 transition-all transform hover:scale-110"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 p-12 transition-all hover:bg-gray-50 hover:border-[#00D9DA] cursor-pointer flex flex-col items-center justify-center gap-4"
    >
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/jpeg,image/png,image/gif,image/webp"
        disabled={isUploading}
      />

      <div className="bg-white p-4 rounded-full shadow-sm border border-gray-100">
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-[#00D9DA] animate-spin" />
        ) : (
          <Upload className="w-8 h-8 text-gray-400" />
        )}
      </div>

      <div className="text-center">
        <p className="text-[#1F3154] font-bold text-sm">
          {isUploading
            ? "Uploading image..."
            : "Click to upload featured image"}
        </p>
        <p className="text-gray-400 text-xs mt-1">PNG, JPG or WebP (Max 5MB)</p>
      </div>

      {!isUploading && (
        <button
          type="button"
          className="bg-[#1F3154] text-white hover:bg-[#00D9DA] hover:text-[#1F3154] transition-all rounded-xl px-8 py-2 font-bold text-sm mt-2"
        >
          Select File
        </button>
      )}
    </div>
  );
}
