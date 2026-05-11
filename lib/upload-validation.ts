export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILENAME_LENGTH = 200;
export const VERCEL_BLOB_HOSTNAME = ".public.blob.vercel-storage.com";

/** Magic byte signatures for allowed image types */
export const MAGIC_BYTES: Record<
  string,
  { offset: number; bytes: number[] }[]
> = {
  "image/jpeg": [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }],
  "image/png": [
    {
      offset: 0,
      bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    },
  ],
  "image/gif": [
    { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] }, // GIF87a
    { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] }, // GIF89a
  ],
  "image/webp": [
    { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF....WEBP
  ],
};

export const ALLOWED_TYPES = Object.keys(MAGIC_BYTES);

export const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

/**
 * Validate that the file's actual bytes match the claimed MIME type.
 */
export function validateMagicBytes(
  buffer: ArrayBuffer,
  mimeType: string,
): boolean {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return false;

  const uint8 = new Uint8Array(buffer);

  if (mimeType === "image/webp") {
    if (uint8.length < 12) return false;
    const hasRiff = signatures[0].bytes.every(
      (byte, i) => uint8[signatures[0].offset + i] === byte,
    );
    const webpMarker = [0x57, 0x45, 0x42, 0x50];
    const hasWebp = webpMarker.every((byte, i) => uint8[8 + i] === byte);
    return hasRiff && hasWebp;
  }

  return signatures.some((sig) => {
    if (uint8.length < sig.offset + sig.bytes.length) return false;
    return sig.bytes.every((byte, i) => uint8[sig.offset + i] === byte);
  });
}

/**
 * Sanitize a filename by removing dangerous characters.
 */
export function sanitizeFilename(name: string): string {
  const lastDot = name.lastIndexOf(".");
  const ext = lastDot > 0 ? name.slice(lastDot) : "";
  const base = lastDot > 0 ? name.slice(0, lastDot) : name;

  let sanitized = base.replace(/\.\./g, "").replace(/\0/g, "");
  sanitized = sanitized.replace(/[/\\]/g, "");
  sanitized = sanitized.replace(/[^a-zA-Z0-9\-_. ]/g, "");
  sanitized = sanitized
    .replace(/\s+/g, " ")
    .replace(/\.{2,}/g, ".")
    .trim();

  if (!sanitized) {
    sanitized = "upload";
  }

  const maxBaseLength = MAX_FILENAME_LENGTH - ext.length;
  if (sanitized.length > maxBaseLength) {
    sanitized = sanitized.slice(0, maxBaseLength).trimEnd();
  }

  return sanitized + ext;
}

/**
 * Validate an image file: check type, size, magic bytes, and sanitize filename.
 * Returns the validated buffer and safe filename with forced extension.
 */
export async function validateImageFile(
  file: File,
): Promise<{ buffer: ArrayBuffer; safeFilename: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Allowed: JPEG, PNG, WebP, GIF");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large (max 5MB)");
  }

  const buffer = await file.arrayBuffer();
  if (!validateMagicBytes(buffer, file.type)) {
    throw new Error("File content does not match its declared type");
  }

  const safeName = sanitizeFilename(file.name);
  const forcedExt = MIME_TO_EXT[file.type] || ".bin";
  const lastDot = safeName.lastIndexOf(".");
  const baseName = lastDot > 0 ? safeName.slice(0, lastDot) : safeName;
  const safeFilename = baseName + forcedExt;

  return { buffer, safeFilename };
}

/**
 * Validate that a URL points to our Vercel Blob store (prevents SSRF).
 */
export function validateBlobUrl(url: string): void {
  const parsed = new URL(url);
  if (!parsed.hostname.endsWith(VERCEL_BLOB_HOSTNAME)) {
    throw new Error("Invalid blob URL");
  }
}
