import { NextResponse } from "next/server";
import { AuditModule, SnapshotModule } from "@prisma/client";
import { z, ZodError } from "zod";
import prisma from "@/lib/prisma";
import { purgeSnapshot } from "@/lib/cache";
import { ensureAdminSession, AdminAuthError, handleAdminApiError } from "@/lib/auth/guard";

const ENTITY_TYPE = z.enum(["member"]);

const actionEnvelopeSchema = z.object({
  type: ENTITY_TYPE,
  payload: z.unknown(),
});

const orderField = z.coerce.number().int().min(0).optional();
const nullableString = z.string().trim().optional().nullable();
const nullableUrl = z.string().url().optional().nullable();
const socialSchema = z
  .object({
    linkedin: z.string().url().optional().nullable(),
    twitter: z.string().url().optional().nullable(),
    email: z.string().email().optional().nullable(),
  })
  .partial();

const seoPayloadSchema = z
  .object({
    title: z.string().trim().min(3).optional(),
    description: nullableString,
    keywords: nullableString,
    canonicalUrl: nullableUrl,
    ogTitle: nullableString,
    ogDescription: nullableString,
    ogImageUrl: nullableUrl,
    twitterCard: nullableString,
    allowIndexing: z.boolean().optional(),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, { message: "Provide at least one SEO field" });

const createSchemas = {
  member: z
    .object({
      name: z.string().trim().min(3),
      designation: z.string().trim().min(2),
      bio: nullableString,
      priority: orderField,
      mediaId: z.string().optional(),
      mediaUrl: z.string().url().optional(),
      socials: socialSchema.optional(),
      seo: seoPayloadSchema.optional(),
    })
    .refine((value) => Boolean(value.mediaId || value.mediaUrl), {
      message: "Provide mediaId or mediaUrl",
      path: ["mediaId"],
    }),
};

const updateSchemas = {
  member: z.object({
    id: z.string().min(1),
    name: z.string().trim().min(3).optional(),
    designation: z.string().trim().min(2).optional(),
    bio: nullableString,
    priority: orderField,
    mediaId: z.string().optional(),
    mediaUrl: z.string().url().optional(),
    socials: socialSchema.optional(),
    seo: seoPayloadSchema.optional(),
  }),
};

const deleteSchemas = {
  member: z.object({ id: z.string().min(1) }),
};

const leadershipInclude = {
  portrait: true,
  seo: true,
};

async function fetchLeadershipPayload() {
  const members = await prisma.leadershipMember.findMany({
    orderBy: { priority: "asc" },
    include: leadershipInclude,
  });
  return { members };
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
  return Object.fromEntries(
    Object.entries(entries).filter(([, value]) => value !== undefined)
  );
}

function coerceNullable(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }
  return value;
}

function sanitizeSocials(socials) {
  if (!socials) return undefined;
  const cleaned = Object.fromEntries(
    Object.entries(socials).flatMap(([key, value]) => {
      if (value === undefined || value === null) return [];
      const trimmed = typeof value === "string" ? value.trim() : value;
      if (!trimmed) return [];
      return [[key, trimmed]];
    })
  );
  return Object.keys(cleaned).length ? cleaned : null;
}

async function resolveMediaAsset({ mediaId, mediaUrl, label }) {
  if (mediaId) return mediaId;
  if (!mediaUrl) return null;
  const existing = await prisma.mediaAsset.findUnique({ where: { url: mediaUrl } });
  if (existing) return existing.id;
  const asset = await prisma.mediaAsset.create({
    data: {
      url: mediaUrl,
      label: label || "Leadership portrait",
      category: "leadership",
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
      module: AuditModule.LEADERSHIP,
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

async function parseActionPayload(request, schemaMap) {
  const body = await request.json();
  const envelope = actionEnvelopeSchema.parse(body);
  const data = schemaMap[envelope.type].parse(envelope.payload);
  return { type: envelope.type, data };
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
    case "member": {
      const mediaId = await resolveMediaAsset({ mediaId: data.mediaId, mediaUrl: data.mediaUrl, label: data.name });
      if (!mediaId) {
        throw createHttpError("Unable to resolve media asset", 400);
      }
      const seoId = data.seo ? await upsertSeoMeta({ baseTitle: data.name, seoPayload: data.seo }) : null;
      const record = await prisma.leadershipMember.create({
        data: {
          name: data.name,
          designation: data.designation,
          bio: coerceNullable(data.bio) ?? null,
          priority: data.priority ?? 0,
          mediaId,
          seoId,
          socials: sanitizeSocials(data.socials) ?? null,
        },
        include: leadershipInclude,
      });
      return { record, diff: { before: null, after: record } };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

async function handleUpdate(type, data) {
  switch (type) {
    case "member": {
      const existing = await prisma.leadershipMember.findUnique({ where: { id: data.id } });
      if (!existing) {
        throw createHttpError("Member not found", 404);
      }
      let mediaUpdate;
      if (data.mediaId) {
        mediaUpdate = data.mediaId;
      } else if (data.mediaUrl) {
        mediaUpdate = await resolveMediaAsset({ mediaUrl: data.mediaUrl, label: data.name || existing.name });
        if (!mediaUpdate) {
          throw createHttpError("Unable to resolve media asset", 400);
        }
      }
      const updates = pickDefined({
        name: data.name,
        designation: data.designation,
        bio: coerceNullable(data.bio),
        priority: data.priority ?? undefined,
        mediaId: mediaUpdate,
        socials: data.socials === undefined ? undefined : sanitizeSocials(data.socials),
      });
      const seoId = data.seo
        ? await upsertSeoMeta({ baseTitle: data.name || existing.name, seoPayload: data.seo, existingSeoId: existing.seoId })
        : existing.seoId;
      if (data.seo && seoId !== existing.seoId) {
        updates.seoId = seoId;
      }
      if (!Object.keys(updates).length && !data.seo) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.leadershipMember.update({ where: { id: data.id }, data: updates, include: leadershipInclude });
      return { record, diff: { before: existing, after: record } };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

async function handleDelete(type, data) {
  switch (type) {
    case "member": {
      const existing = await prisma.leadershipMember.findUnique({ where: { id: data.id }, include: leadershipInclude });
      if (!existing) {
        throw createHttpError("Member not found", 404);
      }
      await prisma.leadershipMember.delete({ where: { id: data.id } });
      return { record: existing, diff: { before: existing, after: null } };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

export async function GET() {
  try {
    await ensureAdminSession("leadership:write");
    const data = await fetchLeadershipPayload();
    return NextResponse.json({ data });
  } catch (error) {
    return handleKnownErrors(error, "GET /api/admin/leadership");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("leadership:write");
    const { type, data } = await parseActionPayload(request, createSchemas);
    const { record, diff } = await handleCreate(type, data);
    await purgeHomeSnapshot();
    await logAudit({ session, action: `${type.toUpperCase()}_CREATE`, recordId: record.id, diff, request });
    const payload = await fetchLeadershipPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "POST /api/admin/leadership");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("leadership:write");
    const { type, data } = await parseActionPayload(request, updateSchemas);
    const { record, diff } = await handleUpdate(type, data);
    await purgeHomeSnapshot();
    await logAudit({ session, action: `${type.toUpperCase()}_UPDATE`, recordId: data.id, diff, request });
    const payload = await fetchLeadershipPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "PATCH /api/admin/leadership");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("leadership:write");
    const { type, data } = await parseActionPayload(request, deleteSchemas);
    const { record, diff } = await handleDelete(type, data);
    await purgeHomeSnapshot();
    await logAudit({ session, action: `${type.toUpperCase()}_DELETE`, recordId: data.id, diff, request });
    const payload = await fetchLeadershipPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "DELETE /api/admin/leadership");
  }
}
