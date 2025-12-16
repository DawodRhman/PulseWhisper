import { NextResponse } from "next/server";
import { AuditModule, SnapshotModule } from "@prisma/client";
import { z, ZodError } from "zod";
import prisma from "@/lib/prisma";
import { purgeSnapshot } from "@/lib/cache";
import { ensureAdminSession, AdminAuthError, handleAdminApiError } from "@/lib/auth/guard";

const ENTITY_TYPE = z.enum(["project"]);

const actionEnvelopeSchema = z.object({
  type: ENTITY_TYPE,
  payload: z.unknown(),
});

const orderField = z.coerce.number().int().min(0).optional();
const nullableString = z.string().trim().optional().nullable();
const nullableUrl = z.string().trim().optional().nullable();
const seoPayloadSchema = z
  .object({
    title: z.string().trim().min(3).optional().nullable(),
    description: nullableString,
    keywords: nullableString,
    canonicalUrl: nullableUrl,
    ogTitle: nullableString,
    ogDescription: nullableString,
    ogImageUrl: nullableUrl,
    twitterCard: nullableString,
    structuredData: z.any().optional().nullable(),
    allowIndexing: z.boolean().optional(),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one SEO field",
  });

const createSchemas = {
  project: z
    .object({
      title: z.string().trim().min(3),
      summary: nullableString,
      status: z.string().trim().optional(),
      order: orderField,
      linkUrl: nullableUrl,
      mediaId: z.string().optional(),
      mediaUrl: z.string().trim().optional(),
      seo: seoPayloadSchema.optional(),
    })
    .refine((value) => Boolean(value.mediaId || value.mediaUrl), {
      message: "Provide mediaId or mediaUrl",
      path: ["mediaId"],
    }),
};

const updateSchemas = {
  project: z.object({
    id: z.string().min(1),
    title: z.string().trim().min(3).optional(),
    summary: nullableString,
    status: z.string().trim().optional(),
    order: orderField,
    linkUrl: nullableUrl,
    mediaId: z.string().optional(),
    mediaUrl: z.string().trim().optional(),
    seo: seoPayloadSchema.optional(),
  }),
};

const deleteSchemas = {
  project: z.object({ id: z.string().min(1) }),
};

const projectInclude = {
  media: true,
  seo: true,
};

async function fetchProjectsPayload() {
  const projects = await prisma.projectHighlight.findMany({
    orderBy: { order: "asc" },
    include: projectInclude,
  });
  return { projects };
}

function getClientIp(request) {
  if (!request) return null;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",").shift()?.trim() || null;
  }
  return request.headers.get("x-real-ip") || null;
}

function getUserAgent(request) {
  if (!request) return null;
  return request.headers.get("user-agent") || null;
}

function createHttpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function pickDefined(entries) {
  return Object.fromEntries(Object.entries(entries).filter(([, value]) => value !== undefined));
}

function coerceNullable(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = typeof value === "string" ? value.trim() : value;
  return trimmed === "" ? null : trimmed;
}

async function parseActionPayload(request, schemaMap) {
  const body = await request.json();
  const envelope = actionEnvelopeSchema.parse(body);
  const data = schemaMap[envelope.type].parse(envelope.payload);
  return { type: envelope.type, data };
}

async function resolveMediaAsset({ mediaId, mediaUrl, label }) {
  if (mediaId) return mediaId;
  if (!mediaUrl) return null;
  const existing = await prisma.mediaAsset.findUnique({ where: { url: mediaUrl } });
  if (existing) return existing.id;
  const asset = await prisma.mediaAsset.create({
    data: {
      url: mediaUrl,
      label: label || "Project image",
      category: "project",
    },
  });
  return asset.id;
}

function normalizeSeoPayload(baseTitle, seoPayload) {
  if (!seoPayload) return null;
  const normalized = pickDefined({
    title: coerceNullable(seoPayload.title) ?? baseTitle,
    description: coerceNullable(seoPayload.description),
    keywords: coerceNullable(seoPayload.keywords),
    canonicalUrl: coerceNullable(seoPayload.canonicalUrl),
    ogTitle: coerceNullable(seoPayload.ogTitle),
    ogDescription: coerceNullable(seoPayload.ogDescription),
    ogImageUrl: coerceNullable(seoPayload.ogImageUrl),
    twitterCard: coerceNullable(seoPayload.twitterCard),
    structuredData: seoPayload.structuredData ?? undefined,
    allowIndexing: seoPayload.allowIndexing,
  });
  if (!normalized.title) {
    normalized.title = baseTitle;
  }
  return Object.keys(normalized).length ? normalized : null;
}

async function upsertSeoMeta({ baseTitle, seoPayload, existingSeoId }) {
  if (!seoPayload) return existingSeoId || null;
  const data = normalizeSeoPayload(baseTitle, seoPayload);
  if (!data) return existingSeoId || null;
  if (existingSeoId) {
    await prisma.seoMeta.update({ where: { id: existingSeoId }, data });
    return existingSeoId;
  }
  const record = await prisma.seoMeta.create({ data });
  return record.id;
}

async function logAudit({ session, action, recordId, diff, request }) {
  await prisma.auditLog.create({
    data: {
      module: AuditModule.PORTFOLIO,
      action,
      recordId: recordId || null,
      diff,
      actorId: session?.user?.id || null,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    },
  });
}

async function purgeHomeSnapshot() {
  await purgeSnapshot(SnapshotModule.HOME).catch(() => null);
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
    case "project": {
      const mediaId = await resolveMediaAsset({ mediaId: data.mediaId, mediaUrl: data.mediaUrl, label: data.title });
      if (!mediaId) {
        throw createHttpError("Unable to resolve media asset", 400);
      }
      const seoId = data.seo ? await upsertSeoMeta({ baseTitle: data.title, seoPayload: data.seo }) : null;
      const record = await prisma.projectHighlight.create({
        data: {
          title: data.title,
          summary: coerceNullable(data.summary) ?? null,
          status: coerceNullable(data.status) || "PLANNED",
          order: data.order ?? 0,
          linkUrl: coerceNullable(data.linkUrl) ?? null,
          mediaId,
          seoId,
        },
        include: projectInclude,
      });
      return { record, diff: { before: null, after: record } };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

async function handleUpdate(type, data) {
  switch (type) {
    case "project": {
      const existing = await prisma.projectHighlight.findUnique({ where: { id: data.id } });
      if (!existing) {
        throw createHttpError("Project not found", 404);
      }
      let mediaUpdate;
      if (data.mediaId) {
        mediaUpdate = data.mediaId;
      } else if (data.mediaUrl) {
        mediaUpdate = await resolveMediaAsset({
          mediaUrl: data.mediaUrl,
          label: data.title || existing.title,
        });
        if (!mediaUpdate) {
          throw createHttpError("Unable to resolve media asset", 400);
        }
      }
      const updates = pickDefined({
        title: data.title,
        summary: coerceNullable(data.summary),
        status: coerceNullable(data.status),
        order: data.order ?? undefined,
        linkUrl: coerceNullable(data.linkUrl),
        mediaId: mediaUpdate,
      });
      const seoId = data.seo
        ? await upsertSeoMeta({ baseTitle: data.title || existing.title, seoPayload: data.seo, existingSeoId: existing.seoId })
        : existing.seoId;
      if (data.seo && seoId !== existing.seoId) {
        updates.seoId = seoId;
      }
      if (!Object.keys(updates).length && !data.seo) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.projectHighlight.update({ where: { id: data.id }, data: updates, include: projectInclude });
      return { record, diff: { before: existing, after: record } };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

async function handleDelete(type, data) {
  switch (type) {
    case "project": {
      const existing = await prisma.projectHighlight.findUnique({ where: { id: data.id }, include: projectInclude });
      if (!existing) {
        throw createHttpError("Project not found", 404);
      }
      await prisma.projectHighlight.delete({ where: { id: data.id } });
      return { record: existing, diff: { before: existing, after: null } };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

export async function GET() {
  try {
    await ensureAdminSession("projects:write");
    const data = await fetchProjectsPayload();
    return NextResponse.json({ data });
  } catch (error) {
    return handleKnownErrors(error, "GET /api/papa/projects");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("projects:write");
    const { type, data } = await parseActionPayload(request, createSchemas);
    const { record, diff } = await handleCreate(type, data);
    await purgeHomeSnapshot();
    await logAudit({ session, action: `${type.toUpperCase()}_CREATE`, recordId: record.id, diff, request });
    const payload = await fetchProjectsPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "POST /api/papa/projects");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("projects:write");
    const { type, data } = await parseActionPayload(request, updateSchemas);
    const { record, diff } = await handleUpdate(type, data);
    await purgeHomeSnapshot();
    await logAudit({ session, action: `${type.toUpperCase()}_UPDATE`, recordId: data.id, diff, request });
    const payload = await fetchProjectsPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "PATCH /api/papa/projects");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("projects:delete");
    const { type, data } = await parseActionPayload(request, deleteSchemas);
    const { record, diff } = await handleDelete(type, data);
    await purgeHomeSnapshot();
    await logAudit({ session, action: `${type.toUpperCase()}_DELETE`, recordId: data.id, diff, request });
    const payload = await fetchProjectsPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "DELETE /api/papa/projects");
  }
}
