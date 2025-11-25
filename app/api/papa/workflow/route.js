import { NextResponse } from "next/server";
import { AuditModule, SnapshotModule } from "@prisma/client";
import { z, ZodError } from "zod";
import prisma from "@/lib/prisma";
import { purgeSnapshot } from "@/lib/cache";
import { ensureAdminSession, handleAdminApiError } from "@/lib/auth/guard";

const createSchema = z.object({
  title: z.string().min(1),
  summary: z.string().optional(),
  order: z.coerce.number().int().default(0),
});

const updateSchema = createSchema.partial().extend({
  id: z.string().min(1),
});

const deleteSchema = z.object({
  id: z.string().min(1),
});

async function fetchWorkflow() {
  return await prisma.workflowStep.findMany({ orderBy: { order: "asc" } });
}

export async function GET() {
  try {
    await ensureAdminSession("settings:write");
    const data = await fetchWorkflow();
    return NextResponse.json({ data });
  } catch (error) {
    return handleAdminApiError(error, "GET /api/papa/workflow");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("settings:write");
    const body = await request.json();
    const data = createSchema.parse(body);

    const record = await prisma.workflowStep.create({ data });
    
    await purgeSnapshot(SnapshotModule.HOME).catch(() => null);
    
    await prisma.auditLog.create({
      data: {
        module: AuditModule.SETTINGS,
        action: "WORKFLOW_CREATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchWorkflow();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "POST /api/papa/workflow");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("settings:write");
    const body = await request.json();
    const { id, ...updates } = updateSchema.parse(body);

    const record = await prisma.workflowStep.update({ where: { id }, data: updates });

    await purgeSnapshot(SnapshotModule.HOME).catch(() => null);

    await prisma.auditLog.create({
      data: {
        module: AuditModule.SETTINGS,
        action: "WORKFLOW_UPDATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchWorkflow();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "PATCH /api/papa/workflow");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("settings:write");
    const body = await request.json();
    const { id } = deleteSchema.parse(body);

    const record = await prisma.workflowStep.delete({ where: { id } });

    await purgeSnapshot(SnapshotModule.HOME).catch(() => null);

    await prisma.auditLog.create({
      data: {
        module: AuditModule.SETTINGS,
        action: "WORKFLOW_DELETE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchWorkflow();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "DELETE /api/papa/workflow");
  }
}
