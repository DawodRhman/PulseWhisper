import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { AuditModule, PublicationStatus, SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/string";
import { purgeSnapshot } from "@/lib/cache";
import { ensureAdminSession, AdminAuthError, handleAdminApiError } from "@/lib/auth/guard";

const ENTITY_TYPE = z.enum(["category", "tag", "article"]);

const actionEnvelopeSchema = z.object({
  type: ENTITY_TYPE,
  payload: z.unknown(),
});

const orderField = z.coerce.number().int().min(0).optional();
const nullableString = z
  .union([z.string(), z.literal(null)])
  .transform((value) => (value === "" ? null : value))
  .optional();
const dateInput = z.union([z.string(), z.number(), z.date(), z.null()]).optional();

const createSchemas = {
  category: z.object({
    title: z.string().trim().min(3),
    slug: z.string().trim().optional(),
    order: orderField,
  }),
  tag: z.object({
    title: z.string().trim().min(2),
    slug: z.string().trim().optional(),
  }),
  article: z
    .object({
      categoryId: z.string().optional().nullable(),
      title: z.string().trim().min(3),
      slug: z.string().trim().optional(),
      summary: nullableString,
      contentBody: nullableString,
      status: z.nativeEnum(PublicationStatus).default(PublicationStatus.DRAFT),
      publishedAt: dateInput,
      heroMediaId: z.string().optional(),
      heroMediaUrl: z.string().url().optional(),
      tagIds: z.array(z.string()).optional(),
    })
    .refine((value) => Boolean(value.heroMediaId || value.heroMediaUrl || value.summary || value.contentBody), {
      message: "Provide at least summary or hero media",
      path: ["summary"],
    }),
};

const updateSchemas = {
  category: z.object({
    id: z.string().min(1),
    title: z.string().trim().min(3).optional(),
    slug: z.string().trim().optional(),
    order: orderField,
  }),
  tag: z.object({
    id: z.string().min(1),
    title: z.string().trim().min(2).optional(),
    slug: z.string().trim().optional(),
  }),
  article: z.object({
    id: z.string().min(1),
    categoryId: z.string().optional().nullable(),
    title: z.string().trim().min(3).optional(),
    slug: z.string().trim().optional(),
    summary: nullableString,
    contentBody: nullableString,
    status: z.nativeEnum(PublicationStatus).optional(),
    publishedAt: dateInput,
    heroMediaId: z.string().optional(),
    heroMediaUrl: z.string().url().optional(),
    tagIds: z.array(z.string()).optional(),
  }),
};

const deleteSchemas = {
  category: z.object({ id: z.string().min(1) }),
  tag: z.object({ id: z.string().min(1) }),
  article: z.object({ id: z.string().min(1) }),
};

const articleInclude = {
  category: true,
  heroMedia: true,
  tags: {
    include: { tag: true },
  },
};

async function fetchNewsPayload() {
  const [categories, tags, articles] = await Promise.all([
    prisma.newsCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.newsTag.findMany({ orderBy: { title: "asc" } }),
    prisma.newsArticle.findMany({
      orderBy: { createdAt: "desc" },
      include: articleInclude,
    }),
  ]);
  return { categories, tags, articles };
}

function coerceDate(value) {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw createHttpError("Invalid date value", 400);
  }
  return date;
}

async function resolveMediaAsset({ mediaId, mediaUrl, label }) {
  if (mediaId) return mediaId;
  if (!mediaUrl) return null;
  const existing = await prisma.mediaAsset.findUnique({ where: { url: mediaUrl } });
  if (existing) return existing.id;
  const asset = await prisma.mediaAsset.create({
    data: {
      url: mediaUrl,
      label: label || "News hero",
      category: "news",
    },
  });
  return asset.id;
}

async function syncArticleTags(articleId, tagIds = []) {
  await prisma.newsTagMap.deleteMany({ where: { articleId } });
  if (!tagIds?.length) return;
  const unique = Array.from(new Set(tagIds));
  await prisma.newsTagMap.createMany({
    data: unique.map((tagId) => ({ articleId, tagId })),
    skipDuplicates: true,
  });
}

async function purgeNewsSnapshot() {
  await purgeSnapshot(SnapshotModule.NEWS).catch(() => null);
}

async function logAudit({ session, action, recordId }) {
  await prisma.auditLog.create({
    data: {
      module: AuditModule.NEWS,
      action,
      recordId: recordId || null,
      actorId: session?.user?.id || null,
    },
  });
}

function createHttpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function parseActionPayload(request, schemaMap) {
  const body = await request.json();
  const envelope = actionEnvelopeSchema.parse(body);
  const data = schemaMap[envelope.type].parse(envelope.payload);
  return { type: envelope.type, data };
}

function pickDefined(updates) {
  return Object.fromEntries(
    Object.entries(updates).filter(([, value]) => value !== undefined)
  );
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
  if (error?.code === "P2002") {
    return NextResponse.json({ error: "Duplicate value violates unique constraint" }, { status: 409 });
  }
  if (error?.code === "P2003") {
    return NextResponse.json({ error: "Invalid reference. Ensure related records exist." }, { status: 400 });
  }
  if (error?.code === "P2025") {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }
  return handleAdminApiError(error, context);
}

async function handleCreate(type, data) {
  switch (type) {
    case "category": {
      const record = await prisma.newsCategory.create({
        data: {
          title: data.title,
          slug: slugify(data.slug || data.title),
          order: data.order ?? 0,
        },
      });
      return { record };
    }
    case "tag": {
      const record = await prisma.newsTag.create({
        data: {
          title: data.title,
          slug: slugify(data.slug || data.title),
        },
      });
      return { record };
    }
    case "article": {
      const heroMediaId = await resolveMediaAsset({
        mediaId: data.heroMediaId,
        mediaUrl: data.heroMediaUrl,
        label: data.title,
      });
      const record = await prisma.newsArticle.create({
        data: {
          categoryId: data.categoryId || null,
          title: data.title,
          slug: slugify(data.slug || data.title),
          summary: data.summary ?? null,
          content: { body: data.contentBody ?? "" },
          status: data.status || PublicationStatus.DRAFT,
          publishedAt: coerceDate(data.publishedAt),
          heroMediaId,
        },
      });
      await syncArticleTags(record.id, data.tagIds || []);
      return { record };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

async function handleUpdate(type, data) {
  switch (type) {
    case "category": {
      const existing = await prisma.newsCategory.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Category not found", 404);
      const updates = pickDefined({
        title: data.title,
        slug: data.slug ? slugify(data.slug) : data.title ? slugify(data.title) : undefined,
        order: data.order ?? undefined,
      });
      if (!Object.keys(updates).length) throw createHttpError("No updates provided", 400);
      const record = await prisma.newsCategory.update({ where: { id: data.id }, data: updates });
      return { record };
    }
    case "tag": {
      const existing = await prisma.newsTag.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Tag not found", 404);
      const updates = pickDefined({
        title: data.title,
        slug: data.slug ? slugify(data.slug) : data.title ? slugify(data.title) : undefined,
      });
      if (!Object.keys(updates).length) throw createHttpError("No updates provided", 400);
      const record = await prisma.newsTag.update({ where: { id: data.id }, data: updates });
      return { record };
    }
    case "article": {
      const existing = await prisma.newsArticle.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Article not found", 404);
      const heroMediaId = await resolveMediaAsset({
        mediaId: data.heroMediaId,
        mediaUrl: data.heroMediaUrl,
        label: data.title || existing.title,
      });
      const updates = pickDefined({
        categoryId: data.categoryId === undefined ? undefined : data.categoryId || null,
        title: data.title,
        slug: data.slug ? slugify(data.slug) : data.title ? slugify(data.title) : undefined,
        summary: data.summary ?? undefined,
        content: data.contentBody !== undefined ? { body: data.contentBody ?? "" } : undefined,
        status: data.status,
        publishedAt: data.publishedAt !== undefined ? coerceDate(data.publishedAt) : undefined,
        heroMediaId: heroMediaId ?? undefined,
      });
      if (!Object.keys(updates).length && !data.tagIds) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.newsArticle.update({ where: { id: data.id }, data: updates });
      if (data.tagIds) {
        await syncArticleTags(record.id, data.tagIds);
      }
      return { record };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

async function handleDelete(type, data) {
  switch (type) {
    case "category": {
      const existing = await prisma.newsCategory.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Category not found", 404);
      await prisma.newsCategory.delete({ where: { id: data.id } });
      return { record: existing };
    }
    case "tag": {
      const existing = await prisma.newsTag.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Tag not found", 404);
      await prisma.newsTag.delete({ where: { id: data.id } });
      return { record: existing };
    }
    case "article": {
      const existing = await prisma.newsArticle.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Article not found", 404);
      await prisma.newsArticle.delete({ where: { id: data.id } });
      return { record: existing };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

export async function GET() {
  try {
    await ensureAdminSession("news:write");
    const data = await fetchNewsPayload();
    return NextResponse.json({ data });
  } catch (error) {
    return handleKnownErrors(error, "GET /api/admin/news");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("news:write");
    const { type, data } = await parseActionPayload(request, createSchemas);
    const { record } = await handleCreate(type, data);
    await purgeNewsSnapshot();
    await logAudit({ session, action: `${type.toUpperCase()}_CREATE`, recordId: record.id });
    const payload = await fetchNewsPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "POST /api/admin/news");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("news:write");
    const { type, data } = await parseActionPayload(request, updateSchemas);
    const { record } = await handleUpdate(type, data);
    await purgeNewsSnapshot();
    await logAudit({ session, action: `${type.toUpperCase()}_UPDATE`, recordId: data.id });
    const payload = await fetchNewsPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "PATCH /api/admin/news");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("news:write");
    const { type, data } = await parseActionPayload(request, deleteSchemas);
    const { record } = await handleDelete(type, data);
    await purgeNewsSnapshot();
    await logAudit({ session, action: `${type.toUpperCase()}_DELETE`, recordId: data.id });
    const payload = await fetchNewsPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "DELETE /api/admin/news");
  }
}
