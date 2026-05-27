import path from "path";
import fs from "fs";

export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

export function ensureUploadDirExists(subDir?: string) {
  const dir = subDir ? path.join(UPLOADS_DIR, subDir) : UPLOADS_DIR;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function getPublicUrl(filePath: string): string {
  // Convert absolute path to public URL
  const relative = filePath
    .replace(path.join(process.cwd(), "public"), "")
    .replace(/\\/g, "/");
  return relative;
}

export function deleteFile(publicUrl: string): void {
  try {
    const fullPath = path.join(process.cwd(), "public", publicUrl);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}
