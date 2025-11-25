import path from "node:path";
import { promises as fs } from "node:fs";
import crypto from "node:crypto";
import imageSize from "image-size";

const MIME_MAP = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
};

export function guessMimeType(filename = "", fallback = "application/octet-stream") {
  if (!filename) return fallback;
  const ext = path.extname(filename).toLowerCase();
  return MIME_MAP[ext] || fallback;
}

function parseNumericAttribute(value) {
  if (!value) return null;
  const sanitized = value.replace(/[^0-9.\-]/g, "");
  const parsed = Number.parseFloat(sanitized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseSvgDimensions(svgContent = "") {
  const widthMatch = svgContent.match(/width\s*=\s*"([^"]+)/i);
  const heightMatch = svgContent.match(/height\s*=\s*"([^"]+)/i);
  if (widthMatch && heightMatch) {
    return {
      width: parseNumericAttribute(widthMatch[1]),
      height: parseNumericAttribute(heightMatch[1]),
    };
  }
  const viewBoxMatch = svgContent.match(/viewBox\s*=\s*"([0-9.\s\-]+)/i);
  if (viewBoxMatch) {
    const values = viewBoxMatch[1]
      .trim()
      .split(/\s+/)
      .map((part) => Number.parseFloat(part));
    const width = values[2];
    const height = values[3];
    if (Number.isFinite(width) && Number.isFinite(height)) {
      return { width, height };
    }
  }
  return { width: null, height: null };
}

export function describeBuffer(buffer, { filename, mimeType } = {}) {
  const detectedMime = mimeType || guessMimeType(filename);
  const checksum = crypto.createHash("md5").update(buffer).digest("hex");
  const fileSize = buffer.length;
  let width = null;
  let height = null;

  try {
    const size = imageSize(buffer);
    if (Number.isFinite(size?.width) && Number.isFinite(size?.height)) {
      width = size.width;
      height = size.height;
    }
  } catch (error) {
    // image-size may throw for unsupported formats; fall back below
    if (process.env.DEBUG_MEDIA_METADATA) {
      console.warn("image-size failed", error.message);
    }
  }

  if ((!width || !height) && detectedMime === "image/svg+xml") {
    const svgStats = parseSvgDimensions(buffer.toString("utf-8"));
    width = svgStats.width;
    height = svgStats.height;
  }

  return {
    mimeType: detectedMime,
    checksum,
    fileSize,
    width,
    height,
  };
}

export async function describeFile(filePath, options = {}) {
  const buffer = await fs.readFile(filePath);
  const stats = await fs.stat(filePath);
  const filename = options.filename || path.basename(filePath);
  const mimeType = options.mimeType || guessMimeType(filename);
  const base = describeBuffer(buffer, { filename, mimeType });
  return {
    ...base,
    fileSize: stats.size,
  };
}

export default {
  guessMimeType,
  describeBuffer,
  describeFile,
};
