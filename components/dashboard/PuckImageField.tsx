"use client";

import { uploadImageAction } from "@/lib/actions/puckUpload";

interface PuckImageFieldProps {
  onChange: (val: string) => void;
  value: string | undefined;
  previewClassName?: string;
}

export default function PuckImageField({
  onChange,
  value,
  previewClassName = "w-20 h-20 object-cover rounded",
}: PuckImageFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {value && <img src={value} className={previewClassName} alt="preview" />}
      <input
        type="file"
        className="text-xs"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const formData = new FormData();
            formData.append("file", file);
            const result = await uploadImageAction(formData);
            if ("error" in result) {
              alert(result.error);
            } else {
              onChange(result.url);
            }
          }
        }}
      />
    </div>
  );
}
