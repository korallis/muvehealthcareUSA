"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { useCallback, useState } from "react";
// Import your new Vercel Blob action
import { uploadImageAction } from "@/lib/actions/puckUpload";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-2xl shadow-lg my-8 max-w-full h-auto",
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm focus:outline-none max-w-none min-h-[400px] px-4 py-3 font-lexend",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addLocalImage = useCallback(() => {
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/gif,image/webp";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append("file", file);

          const result = await uploadImageAction(formData);

          if ("error" in result) {
            alert(result.error);
          } else {
            editor.chain().focus().setImage({ src: result.url }).run();
          }
        } catch {
          alert("Failed to upload image. Please check your connection.");
        } finally {
          setIsUploading(false);
        }
      }
    };

    input.click();
  }, [editor]);

  if (!editor) return null;

  const MenuButton = ({
    onClick,
    isActive,
    children,
    disabled,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`p-2 rounded-lg transition-all disabled:opacity-50 ${
        isActive
          ? "bg-[#00D9DA] text-[#1F3154]"
          : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full border border-gray-200 rounded-2xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#00D9DA] transition-all">
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center">
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 size={18} />
        </MenuButton>

        <div className="w-px h-4 bg-gray-300 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic size={18} />
        </MenuButton>

        <MenuButton onClick={addLocalImage} disabled={isUploading}>
          {isUploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ImageIcon size={18} />
          )}
        </MenuButton>

        <div className="w-px h-4 bg-gray-300 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List size={18} />
        </MenuButton>

        <div className="flex-grow" />

        <MenuButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={18} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={18} />
        </MenuButton>
      </div>

      <div className="bg-white cursor-text min-h-[400px]">
        <EditorContent editor={editor} />
      </div>

      <div className="bg-gray-50 border-t border-gray-100 px-4 py-1 flex justify-between items-center">
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
          {isUploading ? "Uploading Media..." : "Rich Text Mode"}
        </span>
      </div>
    </div>
  );
}
