"use server";

import { put, del } from "@vercel/blob";
import { authGuard } from "@/lib/authGuard";
import { validateImageFile, validateBlobUrl } from "@/lib/upload-validation";

export async function uploadImageAction(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  await authGuard("admin");

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  try {
    const { buffer, safeFilename } = await validateImageFile(file);

    const blob = await put(safeFilename, buffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    return { url: blob.url };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Upload failed. Please try again.";
    console.error("uploadImageAction error:", message);
    return { error: message };
  }
}

export async function deleteImageAction(url: string): Promise<void> {
  await authGuard("admin");

  validateBlobUrl(url);
  await del(url);
}
