import { NextResponse } from "next/server";
import { AuditModule } from "@prisma/client";
import { z, ZodError } from "zod";
import prisma from "@/lib/prisma";
import { ensureAdminSession, AdminAuthError, handleAdminApiError } from "@/lib/auth/guard";

const querySchema = z.object({
  module: z.nativeEnum(AuditModule).optional(),
  actor: z.string().trim().min(1).optional(),
  cursor: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(5).max(100).default(25),
});

function serializeLog(entry) {
  return {
    id: entry.id,
    module: entry.module,
    action: entry.action,
    recordId: entry.recordId,
    diff: entry.diff,
    actor: entry.actor
      ? {
          id: entry.actor.id,
          name: entry.actor.name,
          email: entry.actor.email,
        }
      : null,
    ipAddress: entry.ipAddress,
    userAgent: entry.userAgent,
    createdAt: entry.createdAt.toISOString(),
  };
}

function handleKnownErrors(error, context) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Invalid query", details: error.flatten() }, { status: 400 });
  }
  if (error instanceof AdminAuthError) {
    return handleAdminApiError(error, context);
  }
  return handleAdminApiError(error, context);
}

export async function GET(request) {
  try {
    await ensureAdminSession("audit:read");
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.parse({
      module: searchParams.get("module") || undefined,
      actor: searchParams.get("actor") || undefined,
      cursor: searchParams.get("cursor") || undefined,
      limit: searchParams.get("limit") || undefined,
    });

    const where = {};
    if (parsed.module) where.module = parsed.module;
    if (parsed.actor) {
      let actorId = parsed.actor;
      if (parsed.actor.includes("@")) {
        const actorRecord = await prisma.user.findUnique({ where: { email: parsed.actor.toLowerCase() } });
        if (!actorRecord) {
          return NextResponse.json({ data: { logs: [], nextCursor: null, modules: Object.values(AuditModule) } });
        }
        actorId = actorRecord.id;
      }
      where.actorId = actorId;
    }
    if (parsed.cursor) {
      where.createdAt = { lt: parsed.cursor };
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: parsed.limit,
      include: { actor: true },
    });

    const nextCursor = logs.length === parsed.limit ? logs[logs.length - 1].createdAt.toISOString() : null;

    return NextResponse.json({
      data: {
        logs: logs.map(serializeLog),
        nextCursor,
        modules: Object.values(AuditModule),
      },
    });
  } catch (error) {
    return handleKnownErrors(error, "GET /api/admin/audit");
  }
}
