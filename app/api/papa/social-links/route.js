import { NextResponse } from "next/server";
import { AuditModule, SnapshotModule } from "@prisma/client";
import { z, ZodError } from "zod";
import prisma from "@/lib/prisma";
import { purgeSnapshot } from "@/lib/cache";
import { ensureAdminSession, AdminAuthError, handleAdminApiError } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

const ENTITY_TYPE = z.enum(["link"]);

const actionEnvelopeSchema = z.object({
  type: ENTITY_TYPE,
  payload: z.unknown(),
});

const nullableString = z.string().trim().optional().nullable();
const orderField = z.coerce.number().int().min(0).optional();

const createSchemas = {
  link: z.object({
    title: z.string().trim().min(2),
    platform: nullableString,
    url: z.string().url(),
    order: orderField,
    isActive: z.boolean().optional(),
  }),
};

const updateSchemas = {
  link: z.object({
    id: z.string().min(1),
    title: z.string().trim().min(2).optional(),
    platform: nullableString,
    url: z.string().url().optional(),
    order: orderField,
    isActive: z.boolean().optional(),
  }),
};

const deleteSchemas = {
  link: z.object({ id: z.string().min(1) }),
};

async function fetchSocialLinksPayload() {
  const links = await prisma.socialLink.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return { links };
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

async function purgeSocialLinksSnapshots() {
  await Promise.all([
    purgeSnapshot(SnapshotModule.SOCIAL_LINKS),
    purgeSnapshot(SnapshotModule.HOME).catch(() => null),
  ]).catch(() => null);
}

async function logAudit({ session, action, recordId, diff, request }) {
  try {
    await prisma.auditLog.create({
      data: {
        module: AuditModule.SETTINGS,
        action,
        recordId: recordId || null,
        diff,
        actorId: session?.user?.id || null,
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip"),
        userAgent: request.headers.get("user-agent") || null,
      },
    });
  } catch (error) {
    console.warn("Failed to write audit log", error);
  }
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

async function handleCreate(type, data) {
  switch (type) {
    case "link": {
      const record = await prisma.socialLink.create({
        data: {
          title: data.title,
          platform: data.platform?.trim() || null,
          url: data.url,
          order: data.order ?? 0,
          isActive: data.isActive ?? true,
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
    case "link": {
      const existing = await prisma.socialLink.findUnique({ where: { id: data.id } });
      if (!existing) {
        throw createHttpError("Link not found", 404);
      }
      const updates = {};
      if (data.title !== undefined) updates.title = data.title;
      if (data.platform !== undefined) updates.platform = data.platform?.trim() || null;
      if (data.url !== undefined) updates.url = data.url;
      if (data.order !== undefined) updates.order = data.order;
      if (data.isActive !== undefined) updates.isActive = data.isActive;
      if (!Object.keys(updates).length) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.socialLink.update({ where: { id: data.id }, data: updates });
      return { record, diff: { before: existing, after: record } };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

async function handleDelete(type, data) {
  switch (type) {
    case "link": {
      const existing = await prisma.socialLink.findUnique({ where: { id: data.id } });
      if (!existing) {
        throw createHttpError("Link not found", 404);
      }
      await prisma.socialLink.delete({ where: { id: data.id } });
      return { record: existing, diff: { before: existing, after: null } };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

export async function GET() {
  try {
    await ensureAdminSession("settings:write");
    const data = await fetchSocialLinksPayload();
    return NextResponse.json({ data });
  } catch (error) {
    return handleKnownErrors(error, "GET /api/papa/social-links");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("settings:write");
    const { type, data } = await parseActionPayload(request, createSchemas);
    const { record, diff } = await handleCreate(type, data);
    await purgeSocialLinksSnapshots();
    await logAudit({ session, action: `${type.toUpperCase()}_CREATE`, recordId: record.id, diff, request });
    const payload = await fetchSocialLinksPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "POST /api/papa/social-links");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("settings:write");
    const { type, data } = await parseActionPayload(request, updateSchemas);
    const { record, diff } = await handleUpdate(type, data);
    await purgeSocialLinksSnapshots();
    await logAudit({ session, action: `${type.toUpperCase()}_UPDATE`, recordId: data.id, diff, request });
    const payload = await fetchSocialLinksPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "PATCH /api/papa/social-links");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("settings:write");
    const { type, data } = await parseActionPayload(request, deleteSchemas);
    const { record, diff } = await handleDelete(type, data);
    await purgeSocialLinksSnapshots();
    await logAudit({ session, action: `${type.toUpperCase()}_DELETE`, recordId: data.id, diff, request });
    const payload = await fetchSocialLinksPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "DELETE /api/papa/social-links");
  }
}
