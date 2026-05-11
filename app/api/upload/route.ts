import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { authGuard } from "@/lib/authGuard";
import { validateImageFile, validateBlobUrl } from "@/lib/upload-validation";

export async function POST(request: Request) {
  try {
    await authGuard("admin");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const { buffer, safeFilename } = await validateImageFile(file);

    const blob = await put(safeFilename, buffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    const status =
      message.includes("Invalid") || message.includes("too large") ? 400 : 500;
    if (status === 500) console.error("Upload error:", error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    await authGuard("admin");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  try {
    validateBlobUrl(url);
  } catch {
    return NextResponse.json({ error: "Invalid blob URL" }, { status: 400 });
  }

  try {
    await del(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete blob error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
