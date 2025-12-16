import { NextResponse } from "next/server";
import { AuditModule, SnapshotModule } from "@prisma/client";
import { z, ZodError } from "zod";
import prisma from "@/lib/prisma";
import { purgeSnapshot } from "@/lib/cache";
import { ensureAdminSession, handleAdminApiError } from "@/lib/auth/guard";
import { revalidatePath } from "next/cache";

const createSchema = z.object({
  label: z.string().min(1),
  value: z.coerce.number().int(),
  suffix: z.string().optional(),
  order: z.coerce.number().int().default(0),
});

const updateSchema = createSchema.partial().extend({
  id: z.string().min(1),
});

const deleteSchema = z.object({
  id: z.string().min(1),
});

async function fetchStats() {
  return await prisma.counterStat.findMany({ orderBy: { order: "asc" } });
}

export async function GET() {
  try {
    await ensureAdminSession("settings:write");
    const data = await fetchStats();
    return NextResponse.json({ data });
  } catch (error) {
    return handleAdminApiError(error, "GET /api/papa/stats");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("settings:write");
    const body = await request.json();
    const data = createSchema.parse(body);

    const record = await prisma.counterStat.create({ data });

    await purgeSnapshot(SnapshotModule.HOME).catch(() => null);
    revalidatePath("/");

    await prisma.auditLog.create({
      data: {
        module: AuditModule.SETTINGS,
        action: "STAT_CREATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchStats();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "POST /api/papa/stats");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("settings:write");
    const body = await request.json();
    const { id, ...updates } = updateSchema.parse(body);

    const record = await prisma.counterStat.update({ where: { id }, data: updates });

    await purgeSnapshot(SnapshotModule.HOME).catch(() => null);
    revalidatePath("/");

    await prisma.auditLog.create({
      data: {
        module: AuditModule.SETTINGS,
        action: "STAT_UPDATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchStats();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "PATCH /api/papa/stats");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("settings:delete");
    const body = await request.json();
    const { id } = deleteSchema.parse(body);

    const record = await prisma.counterStat.delete({ where: { id } });

    await purgeSnapshot(SnapshotModule.HOME).catch(() => null);
    revalidatePath("/");

    await prisma.auditLog.create({
      data: {
        module: AuditModule.SETTINGS,
        action: "STAT_DELETE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchStats();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "DELETE /api/papa/stats");
  }
}
