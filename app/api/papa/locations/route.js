import { NextResponse } from "next/server";
import { AuditModule, SnapshotModule } from "@prisma/client";
import { z, ZodError } from "zod";
import prisma from "@/lib/prisma";
import { purgeSnapshot } from "@/lib/cache";
import { ensureAdminSession, handleAdminApiError } from "@/lib/auth/guard";

const createSchema = z.object({
  label: z.string().min(1),
  address: z.string().min(1),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  hours: z.string().optional(),
});

const updateSchema = createSchema.partial().extend({
  id: z.string().min(1),
});

const deleteSchema = z.object({
  id: z.string().min(1),
});

async function fetchLocations() {
  return await prisma.officeLocation.findMany({ orderBy: { label: "asc" } });
}

export async function GET() {
  try {
    await ensureAdminSession("settings:write");
    const data = await fetchLocations();
    return NextResponse.json({ data });
  } catch (error) {
    return handleAdminApiError(error, "GET /api/papa/locations");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("settings:write");
    const body = await request.json();
    const data = createSchema.parse(body);

    const record = await prisma.officeLocation.create({ data });
    
    await purgeSnapshot(SnapshotModule.CONTACT).catch(() => null);
    
    await prisma.auditLog.create({
      data: {
        module: AuditModule.SETTINGS,
        action: "LOCATION_CREATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchLocations();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "POST /api/papa/locations");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("settings:write");
    const body = await request.json();
    const { id, ...updates } = updateSchema.parse(body);

    const record = await prisma.officeLocation.update({ where: { id }, data: updates });

    await purgeSnapshot(SnapshotModule.CONTACT).catch(() => null);

    await prisma.auditLog.create({
      data: {
        module: AuditModule.SETTINGS,
        action: "LOCATION_UPDATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchLocations();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "PATCH /api/papa/locations");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("settings:write");
    const body = await request.json();
    const { id } = deleteSchema.parse(body);

    const record = await prisma.officeLocation.delete({ where: { id } });

    await purgeSnapshot(SnapshotModule.CONTACT).catch(() => null);

    await prisma.auditLog.create({
      data: {
        module: AuditModule.SETTINGS,
        action: "LOCATION_DELETE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchLocations();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "DELETE /api/papa/locations");
  }
}
