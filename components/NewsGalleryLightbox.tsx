"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
}

interface NewsGalleryLightboxProps {
  images: GalleryImage[];
  articleTitle: string;
}

export default function NewsGalleryLightbox({
  images,
  articleTitle,
}: NewsGalleryLightboxProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, prev, next]);

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl">
      <h3 className="text-2xl font-lexendBold text-navyblue mb-6">
        Photo Gallery
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {images.map((img, idx) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightboxIndex(idx)}
            className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:scale-[1.05] transition-transform cursor-pointer"
          >
            <Image
              src={img.url}
              alt={img.alt || articleTitle}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${lightboxIndex + 1} of ${images.length}: ${images[lightboxIndex].alt || articleTitle}`}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={close}
        >
          {/* Top bar: counter + close */}
          <div className="absolute top-20 left-0 right-0 flex items-center justify-between px-6 z-[110]">
            <span className="text-white/80 text-sm font-lexendBold bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
              {lightboxIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              aria-label="Close lightbox"
              className="w-12 h-12 flex items-center justify-center text-white hover:bg-white transition-all shadow-xl active:scale-95"
            >
              <X size={28} strokeWidth={3} />
            </button>
          </div>

          {/* Prev button — hidden on small screens to avoid overlap */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] items-center justify-center text-white/70 hover:text-white rounded-full bg-black/40 hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[80vh] w-full h-full mt-12"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt || articleTitle}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next button — hidden on small screens to avoid overlap */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] items-center justify-center text-white/70 hover:text-white rounded-full bg-black/40 hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
}
