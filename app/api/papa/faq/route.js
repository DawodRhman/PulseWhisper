import { NextResponse } from "next/server";
import { AuditModule, SnapshotModule } from "@prisma/client";
import { z, ZodError } from "zod";
import prisma from "@/lib/prisma";
import { purgeSnapshot } from "@/lib/cache";
import { ensureAdminSession, handleAdminApiError } from "@/lib/auth/guard";

const createSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  categoryId: z.string().optional(),
  order: z.coerce.number().int().default(0),
});

const updateSchema = createSchema.partial().extend({
  id: z.string().min(1),
});

const deleteSchema = z.object({
  id: z.string().min(1),
});

async function fetchFaqs() {
  return await prisma.faq.findMany({ orderBy: { order: "asc" }, include: { category: true } });
}

export async function GET() {
  try {
    await ensureAdminSession("faq:write");
    const data = await fetchFaqs();
    return NextResponse.json({ data });
  } catch (error) {
    return handleAdminApiError(error, "GET /api/papa/faq");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("faq:write");
    const body = await request.json();
    const data = createSchema.parse(body);

    const record = await prisma.faq.create({ data });

    await purgeSnapshot(SnapshotModule.FAQ).catch(() => null);

    await prisma.auditLog.create({
      data: {
        module: AuditModule.FAQ,
        action: "FAQ_CREATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchFaqs();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "POST /api/papa/faq");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("faq:write");
    const body = await request.json();
    const { id, ...updates } = updateSchema.parse(body);

    const record = await prisma.faq.update({ where: { id }, data: updates });

    await purgeSnapshot(SnapshotModule.FAQ).catch(() => null);

    await prisma.auditLog.create({
      data: {
        module: AuditModule.FAQ,
        action: "FAQ_UPDATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchFaqs();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "PATCH /api/papa/faq");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("faq:delete");
    const body = await request.json();
    const { id } = deleteSchema.parse(body);

    const record = await prisma.faq.delete({ where: { id } });

    await purgeSnapshot(SnapshotModule.FAQ).catch(() => null);

    await prisma.auditLog.create({
      data: {
        module: AuditModule.FAQ,
        action: "FAQ_DELETE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchFaqs();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "DELETE /api/papa/faq");
  }
}
