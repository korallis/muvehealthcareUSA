"use client";

import { IoShareSocialOutline } from "react-icons/io5";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this article: ${title}`);

    const shareLinks: Record<string, string> = {
      Twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };

    window.open(shareLinks[platform], "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <h4 className="text-sm font-extrabold text-navyblue uppercase tracking-widest mb-4 flex items-center gap-2">
        <IoShareSocialOutline size={16} /> Share Article
      </h4>
      <div className="flex gap-4">
        {["Twitter", "LinkedIn", "Facebook"].map((platform) => (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className="text-sm font-bold text-navyblue hover:text-lightblue transition-colors"
          >
            {platform}
          </button>
        ))}
      </div>
    </div>
  );
}
