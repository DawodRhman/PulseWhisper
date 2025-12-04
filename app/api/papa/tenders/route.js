import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { AuditModule, SnapshotModule, TenderStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/string";
import { purgeSnapshot } from "@/lib/cache";
import { ensureAdminSession, AdminAuthError, handleAdminApiError } from "@/lib/auth/guard";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const ENTITY_TYPE = z.enum(["category", "tender", "attachment"]);

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
    label: z.string().trim().min(3),
    description: nullableString,
    order: orderField,
    slug: z.string().trim().optional(),
  }),
  tender: z.object({
    tenderNumber: z.string().trim().min(3),
    title: z.string().trim().min(3),
    summary: nullableString,
    status: z.nativeEnum(TenderStatus).default(TenderStatus.OPEN),
    publishedAt: dateInput,
    closingAt: dateInput,
    contactEmail: nullableString,
    contactPhone: nullableString,
    categoryId: z.string().optional().nullable(),
  }),
  attachment: z
    .object({
      tenderId: z.string().min(1),
      label: nullableString,
      mediaId: z.string().optional(),
      mediaUrl: z.string().url().optional(),
    })
    .refine((value) => Boolean(value.mediaId || value.mediaUrl), {
      message: "Provide mediaId or mediaUrl",
      path: ["mediaId"],
    }),
};

const updateSchemas = {
  category: z.object({
    id: z.string().min(1),
    label: z.string().trim().min(3).optional(),
    description: nullableString,
    order: orderField,
    slug: z.string().trim().optional(),
  }),
  tender: z.object({
    id: z.string().min(1),
    title: z.string().trim().min(3).optional(),
    summary: nullableString,
    status: z.nativeEnum(TenderStatus).optional(),
    publishedAt: dateInput,
    closingAt: dateInput,
    contactEmail: nullableString,
    contactPhone: nullableString,
    categoryId: z.string().optional().nullable(),
  }),
  attachment: z
    .object({
      id: z.string().min(1),
      label: nullableString,
      mediaId: z.string().optional(),
      mediaUrl: z.string().url().optional(),
    })
    .refine((value) => Boolean(value.mediaId || value.mediaUrl), {
      message: "Provide mediaId or mediaUrl",
      path: ["mediaId"],
    }),
};

const deleteSchemas = {
  category: z.object({ id: z.string().min(1) }),
  tender: z.object({ id: z.string().min(1) }),
  attachment: z.object({ id: z.string().min(1) }),
};

const tenderInclude = {
  category: true,
  attachments: {
    include: { media: true },
    orderBy: { createdAt: "desc" },
  },
};

async function fetchTenderPayload() {
  const [tenders, categories] = await Promise.all([
    prisma.tender.findMany({
      orderBy: { createdAt: "desc" },
      include: tenderInclude,
    }),
    prisma.tenderCategory.findMany({ orderBy: { order: "asc" } }),
  ]);
  return { tenders, categories };
}

function coerceDate(value) {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw createHttpError("Invalid date value", 400);
  }
  return date;
}

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",").shift()?.trim() || null;
  }
  return request.headers.get("x-real-ip") || null;
}

function getUserAgent(request) {
  return request.headers.get("user-agent") || null;
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

async function resolveMediaAsset({ mediaId, mediaUrl, label }) {
  if (mediaId) return mediaId;
  if (!mediaUrl) return null;

  const existing = await prisma.mediaAsset.findUnique({ where: { url: mediaUrl } });
  if (existing) return existing.id;

  const asset = await prisma.mediaAsset.create({
    data: {
      url: mediaUrl,
      label: label || "Tender attachment",
      category: "tender",
    },
  });
  return asset.id;
}

async function purgeTenderSnapshot() {
  await purgeSnapshot(SnapshotModule.TENDERS).catch(() => null);
}

async function logAudit({ session, action, recordId, diff, request }) {
  await prisma.auditLog.create({
    data: {
      module: AuditModule.TENDERS,
      action,
      recordId: recordId || null,
      diff,
      actorId: session?.user?.id || null,
      ipAddress: request ? getClientIp(request) : null,
      userAgent: request ? getUserAgent(request) : null,
    },
  });
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
      const record = await prisma.tenderCategory.create({
        data: {
          label: data.label,
          slug: slugify(data.slug || data.label),
          description: data.description ?? null,
          order: data.order ?? 0,
        },
      });
      return { record, diff: { before: null, after: record } };
    }
    case "tender": {
      const record = await prisma.tender.create({
        data: {
          tenderNumber: data.tenderNumber,
          title: data.title,
          summary: data.summary ?? null,
          status: data.status || TenderStatus.OPEN,
          publishedAt: coerceDate(data.publishedAt),
          closingAt: coerceDate(data.closingAt),
          contactEmail: data.contactEmail ?? null,
          contactPhone: data.contactPhone ?? null,
          categoryId: data.categoryId || null,
        },
      });
      return { record, diff: { before: null, after: record } };
    }
    case "attachment": {
      const mediaId = await resolveMediaAsset({
        mediaId: data.mediaId,
        mediaUrl: data.mediaUrl,
        label: data.label || undefined,
      });
      if (!mediaId) {
        throw createHttpError("Unable to resolve media asset", 400);
      }
      const record = await prisma.tenderAttachment.create({
        data: {
          tenderId: data.tenderId,
          mediaId,
          label: data.label ?? null,
        },
      });
      return { record, diff: { before: null, after: record } };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

async function handleUpdate(type, data) {
  switch (type) {
    case "category": {
      const existing = await prisma.tenderCategory.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Category not found", 404);
      const updates = pickDefined({
        label: data.label,
        slug: data.slug ? slugify(data.slug) : data.label ? slugify(data.label) : undefined,
        description: data.description ?? undefined,
        order: data.order ?? undefined,
      });
      if (!Object.keys(updates).length) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.tenderCategory.update({ where: { id: data.id }, data: updates });
      return { record, diff: { before: existing, after: record } };
    }
    case "tender": {
      const existing = await prisma.tender.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Tender not found", 404);
      const updates = pickDefined({
        title: data.title,
        summary: data.summary ?? undefined,
        status: data.status,
        publishedAt: data.publishedAt !== undefined ? coerceDate(data.publishedAt) : undefined,
        closingAt: data.closingAt !== undefined ? coerceDate(data.closingAt) : undefined,
        contactEmail: data.contactEmail ?? undefined,
        contactPhone: data.contactPhone ?? undefined,
        categoryId: data.categoryId === undefined ? undefined : data.categoryId || null,
      });
      if (!Object.keys(updates).length) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.tender.update({ where: { id: data.id }, data: updates });
      return { record, diff: { before: existing, after: record } };
    }
    case "attachment": {
      const existing = await prisma.tenderAttachment.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Attachment not found", 404);
      const mediaIdUpdate = await resolveMediaAsset({
        mediaId: data.mediaId,
        mediaUrl: data.mediaUrl,
        label: data.label || undefined,
      });
      const updates = pickDefined({
        label: data.label ?? undefined,
        mediaId: mediaIdUpdate ?? undefined,
      });
      if (!Object.keys(updates).length) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.tenderAttachment.update({ where: { id: data.id }, data: updates });
      return { record, diff: { before: existing, after: record } };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

async function handleDelete(type, data) {
  switch (type) {
    case "category": {
      const existing = await prisma.tenderCategory.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Category not found", 404);
      await prisma.tenderCategory.delete({ where: { id: data.id } });
      return { record: existing, diff: { before: existing, after: null } };
    }
    case "tender": {
      const existing = await prisma.tender.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Tender not found", 404);
      await prisma.tender.delete({ where: { id: data.id } });
      return { record: existing, diff: { before: existing, after: null } };
    }
    case "attachment": {
      const existing = await prisma.tenderAttachment.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Attachment not found", 404);
      await prisma.tenderAttachment.delete({ where: { id: data.id } });
      return { record: existing, diff: { before: existing, after: null } };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

export async function GET() {
  try {
    await ensureAdminSession("tenders:write");
    const data = await fetchTenderPayload();
    return NextResponse.json({ data });
  } catch (error) {
    return handleKnownErrors(error, "GET /api/papa/tenders");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("tenders:write");
    const { type, data } = await parseActionPayload(request, createSchemas);
    const { record, diff } = await handleCreate(type, data);
    await purgeTenderSnapshot();
    revalidatePath("/tenders");
    await logAudit({ session, action: `${type.toUpperCase()}_CREATE`, recordId: record.id, diff, request });
    const payload = await fetchTenderPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "POST /api/papa/tenders");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("tenders:write");
    const { type, data } = await parseActionPayload(request, updateSchemas);
    const { record, diff } = await handleUpdate(type, data);
    await purgeTenderSnapshot();
    revalidatePath("/tenders");
    await logAudit({ session, action: `${type.toUpperCase()}_UPDATE`, recordId: data.id, diff, request });
    const payload = await fetchTenderPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "PATCH /api/papa/tenders");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("tenders:write");
    const { type, data } = await parseActionPayload(request, deleteSchemas);
    const { record, diff } = await handleDelete(type, data);
    await purgeTenderSnapshot();
    revalidatePath("/tenders");
    await logAudit({ session, action: `${type.toUpperCase()}_DELETE`, recordId: data.id, diff, request });
    const payload = await fetchTenderPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "DELETE /api/papa/tenders");
  }
}
