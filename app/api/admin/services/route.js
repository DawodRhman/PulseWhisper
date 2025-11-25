import { NextResponse } from "next/server";
import { AuditModule, SnapshotModule } from "@prisma/client";
import { z, ZodError } from "zod";
import prisma from "@/lib/prisma";
import { purgeSnapshot } from "@/lib/cache";
import { slugify } from "@/lib/string";
import { ensureAdminSession, handleAdminApiError, AdminAuthError } from "@/lib/auth/guard";

const ENTITY_TYPE = z.enum(["category", "card", "detail", "resource"]);

const actionEnvelopeSchema = z.object({
  type: ENTITY_TYPE,
  payload: z.unknown(),
});

const servicesInclude = {
  cards: {
    orderBy: { order: "asc" },
    include: {
      details: {
        orderBy: { order: "asc" },
      },
      media: true,
    },
  },
  resources: {
    orderBy: { createdAt: "desc" },
    include: { media: true },
  },
};

const orderField = z.coerce.number().int().min(0).optional();

const createSchemas = {
  category: z.object({
    title: z.string().trim().min(3),
    summary: z.string().trim().max(500).optional().nullable(),
    heroCopy: z.string().trim().max(500).optional().nullable(),
    order: orderField,
    slug: z.string().trim().optional(),
  }),
  card: z.object({
    categoryId: z.string().min(1),
    title: z.string().trim().min(3),
    summary: z.string().trim().optional().nullable(),
    description: z.string().trim().optional().nullable(),
    iconKey: z.string().trim().optional().default("FaTint"),
    gradientClass: z.string().trim().optional().default("from-blue-100 to-blue-300"),
    order: orderField,
    mediaId: z.string().optional(),
  }),
  detail: z.object({
    serviceCardId: z.string().min(1),
    heading: z.string().trim().min(3),
    body: z.string().trim().optional().nullable(),
    bulletPoints: z.array(z.string().trim()).optional().default([]),
    order: orderField,
  }),
  resource: z
    .object({
      categoryId: z.string().min(1),
      title: z.string().trim().min(3),
      description: z.string().trim().optional().nullable(),
      externalUrl: z.string().url().optional().nullable(),
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
    title: z.string().trim().min(3).optional(),
    summary: z.string().trim().max(500).optional().nullable(),
    heroCopy: z.string().trim().max(500).optional().nullable(),
    order: orderField,
    slug: z.string().trim().optional(),
  }),
  card: z.object({
    id: z.string().min(1),
    categoryId: z.string().min(1).optional(),
    title: z.string().trim().min(3).optional(),
    summary: z.string().trim().optional().nullable(),
    description: z.string().trim().optional().nullable(),
    iconKey: z.string().trim().optional(),
    gradientClass: z.string().trim().optional(),
    order: orderField,
    mediaId: z.string().optional(),
  }),
  detail: z.object({
    id: z.string().min(1),
    heading: z.string().trim().min(3).optional(),
    body: z.string().trim().optional().nullable(),
    bulletPoints: z.array(z.string().trim()).optional(),
    order: orderField,
  }),
  resource: z.object({
    id: z.string().min(1),
    categoryId: z.string().min(1).optional(),
    title: z.string().trim().min(3).optional(),
    description: z.string().trim().optional().nullable(),
    externalUrl: z.string().url().optional().nullable(),
    mediaId: z.string().optional(),
    mediaUrl: z.string().url().optional(),
  }),
};

const deleteSchemas = {
  category: z.object({ id: z.string().min(1) }),
  card: z.object({ id: z.string().min(1) }),
  detail: z.object({ id: z.string().min(1) }),
  resource: z.object({ id: z.string().min(1) }),
};

async function fetchServicesTree() {
  return prisma.serviceCategory.findMany({
    orderBy: { order: "asc" },
    include: servicesInclude,
  });
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

async function resolveMediaId({ mediaId, mediaUrl, title }) {
  if (mediaId) return mediaId;
  if (!mediaUrl) return null;

  const existing = await prisma.mediaAsset.findUnique({ where: { url: mediaUrl } });
  if (existing) return existing.id;

  const asset = await prisma.mediaAsset.create({
    data: {
      url: mediaUrl,
      label: title || "Resource Asset",
      category: "resource",
    },
  });

  return asset.id;
}

async function purgeServicesSnapshot() {
  await purgeSnapshot(SnapshotModule.SERVICES).catch(() => null);
}

async function logAudit({ session, action, recordId, diff, request }) {
  await prisma.auditLog.create({
    data: {
      module: AuditModule.SERVICES,
      action,
      recordId: recordId || null,
      diff,
      actorId: session?.user?.id || null,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    },
  });
}

function buildCategoryData(payload) {
  return {
    title: payload.title,
    slug: slugify(payload.slug || payload.title),
    summary: payload.summary ?? null,
    heroCopy: payload.heroCopy ?? null,
    order: payload.order ?? 0,
  };
}

function pickDefined(updates) {
  return Object.fromEntries(
    Object.entries(updates).filter(([, value]) => value !== undefined)
  );
}

function handleKnownErrors(error, context) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Invalid payload", details: error.flatten() },
      { status: 400 }
    );
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
      const record = await prisma.serviceCategory.create({ data: buildCategoryData(data) });
      return { record, diff: { before: null, after: record } };
    }
    case "card": {
      const record = await prisma.serviceCard.create({
        data: {
          categoryId: data.categoryId,
          title: data.title,
          summary: data.summary ?? null,
          description: data.description ?? null,
          iconKey: data.iconKey || "FaTint",
          gradientClass: data.gradientClass || "from-blue-100 to-blue-300",
          order: data.order ?? 0,
          mediaId: data.mediaId || null,
        },
      });
      return { record, diff: { before: null, after: record } };
    }
    case "detail": {
      const record = await prisma.serviceDetail.create({
        data: {
          serviceCardId: data.serviceCardId,
          heading: data.heading,
          body: data.body ?? null,
          bulletPoints: data.bulletPoints ?? [],
          order: data.order ?? 0,
        },
      });
      return { record, diff: { before: null, after: record } };
    }
    case "resource": {
      const mediaId = await resolveMediaId({ mediaId: data.mediaId, mediaUrl: data.mediaUrl, title: data.title });
      if (!mediaId) {
        throw createHttpError("Unable to resolve media asset", 400);
      }
      const record = await prisma.downloadResource.create({
        data: {
          serviceCategoryId: data.categoryId,
          title: data.title,
          description: data.description ?? null,
          externalUrl: data.externalUrl ?? null,
          mediaId,
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
      const existing = await prisma.serviceCategory.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Category not found", 404);
      const updates = pickDefined({
        title: data.title,
        slug: data.slug ? slugify(data.slug) : data.title ? slugify(data.title) : undefined,
        summary: data.summary ?? undefined,
        heroCopy: data.heroCopy ?? undefined,
        order: data.order ?? undefined,
      });
      if (!Object.keys(updates).length) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.serviceCategory.update({ where: { id: data.id }, data: updates });
      return { record, diff: { before: existing, after: record } };
    }
    case "card": {
      const existing = await prisma.serviceCard.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Card not found", 404);
      const updates = pickDefined({
        categoryId: data.categoryId,
        title: data.title,
        summary: data.summary ?? undefined,
        description: data.description ?? undefined,
        iconKey: data.iconKey,
        gradientClass: data.gradientClass,
        order: data.order ?? undefined,
        mediaId: data.mediaId ?? undefined,
      });
      if (!Object.keys(updates).length) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.serviceCard.update({ where: { id: data.id }, data: updates });
      return { record, diff: { before: existing, after: record } };
    }
    case "detail": {
      const existing = await prisma.serviceDetail.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Detail not found", 404);
      const updates = pickDefined({
        heading: data.heading,
        body: data.body ?? undefined,
        bulletPoints: data.bulletPoints ?? undefined,
        order: data.order ?? undefined,
      });
      if (!Object.keys(updates).length) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.serviceDetail.update({ where: { id: data.id }, data: updates });
      return { record, diff: { before: existing, after: record } };
    }
    case "resource": {
      const existing = await prisma.downloadResource.findUnique({ where: { id: data.id }, include: { media: true } });
      if (!existing) throw createHttpError("Resource not found", 404);
      let mediaIdUpdate;
      if (data.mediaId) {
        mediaIdUpdate = data.mediaId;
      } else if (data.mediaUrl) {
        mediaIdUpdate = await resolveMediaId({ mediaUrl: data.mediaUrl, title: data.title || existing.title });
        if (!mediaIdUpdate) {
          throw createHttpError("Unable to resolve media asset", 400);
        }
      }
      const updates = pickDefined({
        serviceCategoryId: data.categoryId,
        title: data.title,
        description: data.description ?? undefined,
        externalUrl: data.externalUrl ?? undefined,
        mediaId: mediaIdUpdate,
      });
      if (!Object.keys(updates).length) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.downloadResource.update({ where: { id: data.id }, data: updates });
      return { record, diff: { before: existing, after: record } };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

async function handleDelete(type, data) {
  switch (type) {
    case "category": {
      const existing = await prisma.serviceCategory.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Category not found", 404);
      await prisma.serviceCategory.delete({ where: { id: data.id } });
      return { record: existing, diff: { before: existing, after: null } };
    }
    case "card": {
      const existing = await prisma.serviceCard.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Card not found", 404);
      await prisma.serviceCard.delete({ where: { id: data.id } });
      return { record: existing, diff: { before: existing, after: null } };
    }
    case "detail": {
      const existing = await prisma.serviceDetail.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Detail not found", 404);
      await prisma.serviceDetail.delete({ where: { id: data.id } });
      return { record: existing, diff: { before: existing, after: null } };
    }
    case "resource": {
      const existing = await prisma.downloadResource.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Resource not found", 404);
      await prisma.downloadResource.delete({ where: { id: data.id } });
      return { record: existing, diff: { before: existing, after: null } };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

export async function GET() {
  try {
    await ensureAdminSession("services:write");
    const categories = await fetchServicesTree();
    return NextResponse.json({ data: categories });
  } catch (error) {
    return handleKnownErrors(error, "GET /api/admin/services");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("services:write");
    const { type, data } = await parseActionPayload(request, createSchemas);
    const { record, diff } = await handleCreate(type, data);
    await purgeServicesSnapshot();
    await logAudit({ session, action: `${type.toUpperCase()}_CREATE`, recordId: record.id, diff, request });
    const categories = await fetchServicesTree();
    return NextResponse.json({ data: categories, record });
  } catch (error) {
    return handleKnownErrors(error, "POST /api/admin/services");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("services:write");
    const { type, data } = await parseActionPayload(request, updateSchemas);
    const { record, diff } = await handleUpdate(type, data);
    await purgeServicesSnapshot();
    await logAudit({ session, action: `${type.toUpperCase()}_UPDATE`, recordId: data.id, diff, request });
    const categories = await fetchServicesTree();
    return NextResponse.json({ data: categories, record });
  } catch (error) {
    return handleKnownErrors(error, "PATCH /api/admin/services");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("services:write");
    const { type, data } = await parseActionPayload(request, deleteSchemas);
    const { record, diff } = await handleDelete(type, data);
    await purgeServicesSnapshot();
    await logAudit({ session, action: `${type.toUpperCase()}_DELETE`, recordId: data.id, diff, request });
    const categories = await fetchServicesTree();
    return NextResponse.json({ data: categories, record });
  } catch (error) {
    return handleKnownErrors(error, "DELETE /api/admin/services");
  }
}
