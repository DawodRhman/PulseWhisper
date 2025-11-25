import { NextResponse } from "next/server";
import { AuditModule, SnapshotModule } from "@prisma/client";
import { z, ZodError } from "zod";
import prisma from "@/lib/prisma";
import { purgeSnapshot } from "@/lib/cache";
import { ensureAdminSession, handleAdminApiError } from "@/lib/auth/guard";

const createSchema = z.object({
  title: z.string().min(1),
  summary: z.string().optional(),
  status: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
});

const updateSchema = createSchema.partial().extend({
  id: z.string().min(1),
});

const deleteSchema = z.object({
  id: z.string().min(1),
});

async function fetchWaterToday() {
  return await prisma.waterTodayUpdate.findMany({ orderBy: { publishedAt: "desc" } });
}

export async function GET() {
  try {
    await ensureAdminSession("watertoday:write");
    const data = await fetchWaterToday();
    return NextResponse.json({ data });
  } catch (error) {
    return handleAdminApiError(error, "GET /api/papa/watertoday");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("watertoday:write");
    const body = await request.json();
    const data = createSchema.parse(body);

    const record = await prisma.waterTodayUpdate.create({ data });
    
    await purgeSnapshot(SnapshotModule.WATER_TODAY).catch(() => null);
    
    await prisma.auditLog.create({
      data: {
        module: AuditModule.WATER_TODAY,
        action: "WATERTODAY_CREATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchWaterToday();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "POST /api/papa/watertoday");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("watertoday:write");
    const body = await request.json();
    const { id, ...updates } = updateSchema.parse(body);

    const record = await prisma.waterTodayUpdate.update({ where: { id }, data: updates });

    await purgeSnapshot(SnapshotModule.WATER_TODAY).catch(() => null);

    await prisma.auditLog.create({
      data: {
        module: AuditModule.WATER_TODAY,
        action: "WATERTODAY_UPDATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchWaterToday();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "PATCH /api/papa/watertoday");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("watertoday:write");
    const body = await request.json();
    const { id } = deleteSchema.parse(body);

    const record = await prisma.waterTodayUpdate.delete({ where: { id } });

    await purgeSnapshot(SnapshotModule.WATER_TODAY).catch(() => null);

    await prisma.auditLog.create({
      data: {
        module: AuditModule.WATER_TODAY,
        action: "WATERTODAY_DELETE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchWaterToday();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "DELETE /api/papa/watertoday");
  }
}
