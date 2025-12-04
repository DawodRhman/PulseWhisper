import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { AuditModule, SnapshotModule, PublicationStatus, RequirementType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/string";
import { purgeSnapshot } from "@/lib/cache";
import { ensureAdminSession, AdminAuthError, handleAdminApiError } from "@/lib/auth/guard";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const ENTITY_TYPE = z.enum(["program", "opening", "requirement"]);

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
  program: z.object({
    title: z.string().trim().min(3),
    heroTitle: nullableString,
    heroBody: nullableString,
    slug: z.string().trim().optional(),
    eligibility: z.array(z.string().trim()).optional(),
  }),
  opening: z.object({
    programId: z.string().optional().nullable(),
    title: z.string().trim().min(3),
    slug: z.string().trim().optional(),
    department: nullableString,
    location: nullableString,
    jobType: nullableString,
    compensation: nullableString,
    summary: nullableString,
    description: nullableString,
    status: z.nativeEnum(PublicationStatus).default(PublicationStatus.DRAFT),
    publishAt: dateInput,
    expireAt: dateInput,
    applyUrl: nullableString,
    applyEmail: nullableString,
  }),
  requirement: z.object({
    careerOpeningId: z.string().min(1),
    type: z.nativeEnum(RequirementType).default(RequirementType.QUALIFICATION),
    content: z.string().trim().min(3),
    order: orderField,
  }),
};

const updateSchemas = {
  program: z.object({
    id: z.string().min(1),
    title: z.string().trim().min(3).optional(),
    heroTitle: nullableString,
    heroBody: nullableString,
    slug: z.string().trim().optional(),
    eligibility: z.array(z.string().trim()).optional(),
  }),
  opening: z.object({
    id: z.string().min(1),
    programId: z.string().optional().nullable(),
    title: z.string().trim().min(3).optional(),
    slug: z.string().trim().optional(),
    department: nullableString,
    location: nullableString,
    jobType: nullableString,
    compensation: nullableString,
    summary: nullableString,
    description: nullableString,
    status: z.nativeEnum(PublicationStatus).optional(),
    publishAt: dateInput,
    expireAt: dateInput,
    applyUrl: nullableString,
    applyEmail: nullableString,
  }),
  requirement: z.object({
    id: z.string().min(1),
    type: z.nativeEnum(RequirementType).optional(),
    content: z.string().trim().min(3).optional(),
    order: orderField,
  }),
};

const deleteSchemas = {
  program: z.object({ id: z.string().min(1) }),
  opening: z.object({ id: z.string().min(1) }),
  requirement: z.object({ id: z.string().min(1) }),
};

const openingInclude = {
  program: true,
  requirements: {
    orderBy: { order: "asc" },
  },
};

async function fetchCareerPayload() {
  const [programs, openings] = await Promise.all([
    prisma.careerProgram.findMany({ orderBy: { title: "asc" } }),
    prisma.careerOpening.findMany({
      orderBy: { createdAt: "desc" },
      include: openingInclude,
    }),
  ]);
  return { programs, openings };
}

function coerceDate(value) {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw createHttpError("Invalid date value", 400);
  }
  return date;
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

async function purgeCareerSnapshot() {
  await purgeSnapshot(SnapshotModule.CAREERS).catch(() => null);
}

async function logAudit({ session, action, recordId }) {
  await prisma.auditLog.create({
    data: {
      module: AuditModule.CAREERS,
      action,
      recordId: recordId || null,
      actorId: session?.user?.id || null,
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
    case "program": {
      const record = await prisma.careerProgram.create({
        data: {
          title: data.title,
          slug: slugify(data.slug || data.title),
          heroTitle: data.heroTitle ?? null,
          heroBody: data.heroBody ?? null,
          eligibility: data.eligibility?.length ? data.eligibility : [],
        },
      });
      return { record };
    }
    case "opening": {
      const record = await prisma.careerOpening.create({
        data: {
          programId: data.programId || null,
          title: data.title,
          slug: slugify(data.slug || `${data.title}-${Date.now()}`),
          department: data.department ?? null,
          location: data.location ?? null,
          jobType: data.jobType ?? null,
          compensation: data.compensation ?? null,
          summary: data.summary ?? null,
          description: data.description ?? null,
          status: data.status || PublicationStatus.DRAFT,
          publishAt: coerceDate(data.publishAt),
          expireAt: coerceDate(data.expireAt),
          applyUrl: data.applyUrl ?? null,
          applyEmail: data.applyEmail ?? null,
        },
      });
      return { record };
    }
    case "requirement": {
      const record = await prisma.careerRequirement.create({
        data: {
          careerOpeningId: data.careerOpeningId,
          type: data.type || RequirementType.QUALIFICATION,
          content: data.content,
          order: data.order ?? 0,
        },
      });
      return { record };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

async function handleUpdate(type, data) {
  switch (type) {
    case "program": {
      const existing = await prisma.careerProgram.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Program not found", 404);
      const updates = pickDefined({
        title: data.title,
        slug: data.slug ? slugify(data.slug) : data.title ? slugify(data.title) : undefined,
        heroTitle: data.heroTitle ?? undefined,
        heroBody: data.heroBody ?? undefined,
        eligibility: data.eligibility ?? undefined,
      });
      if (!Object.keys(updates).length) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.careerProgram.update({ where: { id: data.id }, data: updates });
      return { record };
    }
    case "opening": {
      const existing = await prisma.careerOpening.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Opening not found", 404);
      const updates = pickDefined({
        programId: data.programId === undefined ? undefined : data.programId || null,
        title: data.title,
        slug: data.slug ? slugify(data.slug) : undefined,
        department: data.department ?? undefined,
        location: data.location ?? undefined,
        jobType: data.jobType ?? undefined,
        compensation: data.compensation ?? undefined,
        summary: data.summary ?? undefined,
        description: data.description ?? undefined,
        status: data.status,
        publishAt: data.publishAt !== undefined ? coerceDate(data.publishAt) : undefined,
        expireAt: data.expireAt !== undefined ? coerceDate(data.expireAt) : undefined,
        applyUrl: data.applyUrl ?? undefined,
        applyEmail: data.applyEmail ?? undefined,
      });
      if (!Object.keys(updates).length) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.careerOpening.update({ where: { id: data.id }, data: updates });
      return { record };
    }
    case "requirement": {
      const existing = await prisma.careerRequirement.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Requirement not found", 404);
      const updates = pickDefined({
        type: data.type,
        content: data.content,
        order: data.order ?? undefined,
      });
      if (!Object.keys(updates).length) {
        throw createHttpError("No updates provided", 400);
      }
      const record = await prisma.careerRequirement.update({ where: { id: data.id }, data: updates });
      return { record };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

async function handleDelete(type, data) {
  switch (type) {
    case "program": {
      const existing = await prisma.careerProgram.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Program not found", 404);
      await prisma.careerProgram.delete({ where: { id: data.id } });
      return { record: existing };
    }
    case "opening": {
      const existing = await prisma.careerOpening.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Opening not found", 404);
      await prisma.careerOpening.delete({ where: { id: data.id } });
      return { record: existing };
    }
    case "requirement": {
      const existing = await prisma.careerRequirement.findUnique({ where: { id: data.id } });
      if (!existing) throw createHttpError("Requirement not found", 404);
      await prisma.careerRequirement.delete({ where: { id: data.id } });
      return { record: existing };
    }
    default:
      throw createHttpError("Unsupported entity type", 400);
  }
}

export async function GET() {
  try {
    await ensureAdminSession("careers:write");
    const data = await fetchCareerPayload();
    return NextResponse.json({ data });
  } catch (error) {
    return handleKnownErrors(error, "GET /api/papa/careers");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("careers:write");
    const { type, data } = await parseActionPayload(request, createSchemas);
    const { record } = await handleCreate(type, data);
    await purgeCareerSnapshot();
    revalidatePath("/careers");
    revalidatePath("/workwithus");
    await logAudit({ session, action: `${type.toUpperCase()}_CREATE`, recordId: record.id });
    const payload = await fetchCareerPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "POST /api/papa/careers");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("careers:write");
    const { type, data } = await parseActionPayload(request, updateSchemas);
    const { record } = await handleUpdate(type, data);
    await purgeCareerSnapshot();
    revalidatePath("/careers");
    revalidatePath("/workwithus");
    await logAudit({ session, action: `${type.toUpperCase()}_UPDATE`, recordId: data.id });
    const payload = await fetchCareerPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "PATCH /api/papa/careers");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("careers:write");
    const { type, data } = await parseActionPayload(request, deleteSchemas);
    const { record } = await handleDelete(type, data);
    await purgeCareerSnapshot();
    revalidatePath("/careers");
    revalidatePath("/workwithus");
    await logAudit({ session, action: `${type.toUpperCase()}_DELETE`, recordId: data.id });
    const payload = await fetchCareerPayload();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    return handleKnownErrors(error, "DELETE /api/papa/careers");
  }
}
