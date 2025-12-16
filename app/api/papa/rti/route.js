import { NextResponse } from "next/server";
import { AuditModule, SnapshotModule } from "@prisma/client";
import { z, ZodError } from "zod";
import prisma from "@/lib/prisma";
import { purgeSnapshot } from "@/lib/cache";
import { ensureAdminSession, handleAdminApiError } from "@/lib/auth/guard";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  title: z.string().min(1),
  summary: z.string().optional(),
  docType: z.string().optional(),
  externalUrl: z.string().url().optional(),
  order: z.coerce.number().int().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

const updateSchema = createSchema.partial().extend({
  id: z.string().min(1),
});

const deleteSchema = z.object({
  id: z.string().min(1),
});

async function fetchRti() {
  return await prisma.rtiDocument.findMany({
    orderBy: { order: "asc" },
    include: { seo: true },
  });
}

export async function GET() {
  try {
    await ensureAdminSession("settings:write");
    const data = await fetchRti();
    return NextResponse.json({ data });
  } catch (error) {
    return handleAdminApiError(error, "GET /api/papa/rti");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("settings:write");
    const body = await request.json();
    const { seoTitle, seoDescription, seoKeywords, ...data } = createSchema.parse(body);

    const record = await prisma.rtiDocument.create({
      data: {
        ...data,
        seo: {
          create: {
            title: seoTitle || data.title,
            description: seoDescription || data.summary,
            keywords: seoKeywords,
          },
        },
      },
    });

    await purgeSnapshot(SnapshotModule.RIGHT_TO_INFORMATION).catch(() => null);
    revalidatePath("/right-to-information");

    await prisma.auditLog.create({
      data: {
        module: AuditModule.SETTINGS,
        action: "RTI_CREATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchRti();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "POST /api/papa/rti");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("settings:write");
    const body = await request.json();
    const { id, seoTitle, seoDescription, seoKeywords, ...updates } = updateSchema.parse(body);

    const record = await prisma.rtiDocument.update({
      where: { id },
      data: {
        ...updates,
        seo: {
          upsert: {
            create: {
              title: seoTitle || updates.title || "Untitled",
              description: seoDescription,
              keywords: seoKeywords,
            },
            update: {
              title: seoTitle,
              description: seoDescription,
              keywords: seoKeywords,
            },
          },
        },
      },
    });

    await purgeSnapshot(SnapshotModule.RIGHT_TO_INFORMATION).catch(() => null);
    revalidatePath("/right-to-information");

    await prisma.auditLog.create({
      data: {
        module: AuditModule.SETTINGS,
        action: "RTI_UPDATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchRti();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "PATCH /api/papa/rti");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("settings:delete");
    const body = await request.json();
    const { id } = deleteSchema.parse(body);

    const record = await prisma.rtiDocument.delete({ where: { id } });

    await purgeSnapshot(SnapshotModule.RIGHT_TO_INFORMATION).catch(() => null);
    revalidatePath("/right-to-information");

    await prisma.auditLog.create({
      data: {
        module: AuditModule.SETTINGS,
        action: "RTI_DELETE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchRti();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "DELETE /api/papa/rti");
  }
}
