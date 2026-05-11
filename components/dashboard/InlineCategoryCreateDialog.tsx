"use client";

import { useState, useRef, useEffect } from "react";
import { PlusCircle, X, Loader2 } from "lucide-react";

interface InlineCategoryCreateDialogProps {
  onCreated: (category: { id: string; name: string }) => void;
  createAction: (data: {
    name: string;
    description?: string;
  }) => Promise<{ id?: string; name?: string; error?: string } | unknown>;
}

export default function InlineCategoryCreateDialog({
  onCreated,
  createAction,
}: InlineCategoryCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
      inputRef.current?.focus();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  function handleOpen() {
    setName("");
    setError(null);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const result = await createAction({ name: name.trim() });
      const res = result as { id?: string; name?: string; error?: string };
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else if (res?.id && res?.name) {
        setOpen(false);
        setLoading(false);
        onCreated({ id: res.id, name: res.name });
      } else {
        setError("Unexpected response from server.");
        setLoading(false);
      }
    } catch {
      setError("Failed to create category.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-[10px] text-[#00D9DA] font-bold uppercase hover:underline flex items-center gap-1"
      >
        <PlusCircle size={10} /> New Category
      </button>

      <dialog
        ref={dialogRef}
        onClose={handleClose}
        className="rounded-2xl p-0 backdrop:bg-black/40 max-w-md w-[calc(100%-2rem)] open:m-auto"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1F3154]">New Category</h3>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}
            <div className="space-y-1">
              <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider">
                Name
              </label>
              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00D9DA] outline-none"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
