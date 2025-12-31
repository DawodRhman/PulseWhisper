import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { z, ZodError } from "zod";
import { AuditModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ensureAdminSession, AdminAuthError, handleAdminApiError } from "@/lib/auth/guard";
import { describeBuffer, guessMimeType } from "@/lib/media/metadata";

const ENTITY_TYPE = z.enum(["external", "metadata", "asset", "album", "albumItem"]);
const actionEnvelopeSchema = z.object({
  type: ENTITY_TYPE,
  payload: z.unknown(),
});
const createSchemas = {
  external: z.object({
    url: z.string().url(),
    label: z.string().trim().min(2),
    category: z.string().trim().optional(),
    altText: z.string().trim().optional().nullable(),
  }),
  album: z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    description: z.string().optional(),
    seo: z.any().optional(), // We'll handle SEO serialization manually or loosely
    isVisible: z.boolean().optional(),
  }),
  albumItem: z.object({
    albumId: z.string().min(1),
    mediaId: z.string().min(1),
    caption: z.string().optional(),
    order: z.number().optional(),
  }),
};
const updateSchemas = {
  metadata: z.object({
    id: z.string().min(1),
    label: z.string().trim().optional(),
    category: z.string().trim().optional(),
    altText: z.string().trim().optional().nullable(),
  }),
  album: z.object({
    id: z.string().min(1),
    title: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    description: z.string().optional(),
    seo: z.any().optional(),
    isVisible: z.boolean().optional(),
  }),
};
const deleteSchemas = {
  asset: z.object({ id: z.string().min(1) }),
  album: z.object({ id: z.string().min(1) }),
  albumItem: z.object({ id: z.string().min(1) }),
};

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function fetchLibraryPayload() {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });
  const albums = await prisma.mediaAlbum.findMany({
    include: {
      items: {
        include: { media: true },
        orderBy: { order: "asc" },
      },
      seo: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return { assets, albums };
}

async function parseJsonPayload(request, schemaMap) {
  const body = await request.json();
  const envelope = actionEnvelopeSchema.parse(body);
  const data = schemaMap[envelope.type].parse(envelope.payload);
  return { type: envelope.type, data };
}

function createHttpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function isUploadUrl(url) {
  return typeof url === "string" && url.startsWith("/uploads/");
}

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

async function saveUploadedFile(file, { category } = {}) {
  if (!file || typeof file === "string") {
    throw createHttpError("Invalid file payload", 400);
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const originalName = file.name || `asset-${Date.now()}`;
  const ext = path.extname(originalName) || ".bin";
  const safeName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext.toLowerCase()}`;
  const metadata = describeBuffer(buffer, { filename: originalName });

  await ensureUploadDir();
  const absolutePath = path.join(UPLOAD_DIR, safeName);
  await fs.writeFile(absolutePath, buffer);
  return {
    buffer,
    filename: originalName,
    storedName: safeName,
    absolutePath,
    url: `/uploads/${safeName}`,
    metadata,
  };
}

async function deleteLocalFile(url) {
  if (!url || typeof url !== "string") return;

  if (!isUploadUrl(url)) return;
  const relative = url.replace(/^\/+/, "");
  const target = path.join(process.cwd(), "public", relative);
  await fs.unlink(target).catch(() => null);
}

async function logAudit({ session, action, recordId, diff }) {
  await prisma.auditLog.create({
    data: {
      module: AuditModule.MEDIA,
      action,
      recordId: recordId || null,
      actorId: session?.user?.id || null,
      diff: diff || null,
    },
  });
}

function handleKnownErrors(error, context) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Invalid payload", details: error.flatten() }, { status: 400 });
  }
  if (error instanceof AdminAuthError) {
    return handleAdminApiError(error, context);
  }
  if (typeof error?.status === "number") {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error?.code === "P2025") {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }
  return handleAdminApiError(error, context);
}

export async function GET() {
  try {
    await ensureAdminSession("media:write");
    const data = await fetchLibraryPayload();
    return NextResponse.json({ data });
  } catch (error) {
    return handleKnownErrors(error, "GET /api/papa/media");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("media:write");
    const contentType = request.headers.get("content-type") || "";
    let record;
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      if (!file) {
        throw createHttpError("Upload requires a file field", 400);
      }
      const category = formData.get("category")?.toString().trim() || "uploads";
      const label = formData.get("label")?.toString().trim() || file.name || "Uploaded media";
      const altTextValue = formData.get("altText");
      const altText = altTextValue ? altTextValue.toString() : null;

      // Read file buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const metadata = describeBuffer(buffer, { filename: file.name });

      // Generate ID and URL
      const id = crypto.randomUUID();
      const url = `/api/assets/${id}`;

      // Store in DB
      record = await prisma.mediaAsset.create({
        data: {
          id,
          url,
          label,
          category,
          altText,
          data: buffer, // Store binary data
          mimeType: metadata.mimeType,
          fileSize: metadata.fileSize,
          width: metadata.width,
          height: metadata.height,
          checksum: metadata.checksum,
        },
      });
      await logAudit({ session, action: "MEDIA_UPLOAD", recordId: record.id });
    } else {
      const { type, data } = await parseJsonPayload(request, createSchemas);
      switch (type) {
        case "external": {
          record = await prisma.mediaAsset.create({
            data: {
              url: data.url,
              label: data.label,
              category: data.category || "external",
              altText: data.altText ?? null,
              mimeType: guessMimeType(data.url),
            },
          });
          await logAudit({ session, action: "MEDIA_EXTERNAL_CREATE", recordId: record.id });
          break;
        }
        case "album": {
          record = await prisma.mediaAlbum.create({
            data: {
              title: data.title,
              slug: data.slug,
              description: data.description,
              description: data.description,
              seo: data.seo ? { create: data.seo } : undefined,
              isVisible: data.isVisible ?? true,
            },
          });
          await logAudit({ session, action: "ALBUM_CREATE", recordId: record.id });
          break;
        }
        case "albumItem": {
          record = await prisma.mediaItem.create({
            data: {
              albumId: data.albumId,
              mediaId: data.mediaId,
              caption: data.caption,
              order: data.order || 0,
            },
          });
          await logAudit({ session, action: "ALBUM_ITEM_ADD", recordId: record.id });
          break;
        }
        default:
          throw createHttpError("Unsupported entity type", 400);
      }
    }
    const data = await fetchLibraryPayload();
    return NextResponse.json({ data, record });
  } catch (error) {
    return handleKnownErrors(error, "POST /api/papa/media");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("media:write");
    const { type, data } = await parseJsonPayload(request, updateSchemas);
    let record;
    switch (type) {
      case "metadata": {
        const updates = Object.fromEntries(
          Object.entries({
            label: data.label?.trim(),
            category: data.category?.trim(),
            altText: data.altText === undefined ? undefined : data.altText?.trim() || null,
          }).filter(([, value]) => value !== undefined)
        );
        if (!Object.keys(updates).length) {
          throw createHttpError("Provide at least one field to update", 400);
        }
        record = await prisma.mediaAsset.update({ where: { id: data.id }, data: updates });
        await logAudit({ session, action: "MEDIA_UPDATE", recordId: data.id });
        break;
      }
      case "album": {
        const updates = {
          title: data.title,
          slug: data.slug,
          slug: data.slug,
          description: data.description,
          isVisible: data.isVisible,
        };
        if (data.seo) {
          updates.seo = {
            upsert: {
              create: data.seo,
              update: data.seo,
            },
          };
        }
        record = await prisma.mediaAlbum.update({ where: { id: data.id }, data: updates });
        await logAudit({ session, action: "ALBUM_UPDATE", recordId: data.id });
        break;
      }
      default:
        throw createHttpError("Unsupported entity type", 400);
    }
    const payload = await fetchLibraryPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "PATCH /api/papa/media");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("media:delete");
    const { type, data } = await parseJsonPayload(request, deleteSchemas);

    if (type === "asset") {
      const existing = await prisma.mediaAsset.findUnique({ where: { id: data.id } });
      if (!existing) {
        throw createHttpError("Asset not found", 404);
      }
      await prisma.mediaAsset.delete({ where: { id: data.id } });
      await deleteLocalFile(existing.url);
      await logAudit({ session, action: "MEDIA_DELETE", recordId: data.id });
      const payload = await fetchLibraryPayload();
      return NextResponse.json({ data: payload, record: existing });
    } else if (type === "album") {
      await prisma.mediaAlbum.delete({ where: { id: data.id } });
      await logAudit({ session, action: "ALBUM_DELETE", recordId: data.id });
      const payload = await fetchLibraryPayload();
      return NextResponse.json({ data: payload });
    } else if (type === "albumItem") {
      await prisma.mediaItem.delete({ where: { id: data.id } });
      await logAudit({ session, action: "ALBUM_ITEM_DELETE", recordId: data.id });
      const payload = await fetchLibraryPayload();
      return NextResponse.json({ data: payload });
    } else {
      throw createHttpError("Unsupported entity type", 400);
    }
  } catch (error) {
    return handleKnownErrors(error, "DELETE /api/papa/media");
  }
}
