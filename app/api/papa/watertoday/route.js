import { NextResponse } from "next/server";
import { AuditModule, SnapshotModule } from "@prisma/client";
import { z, ZodError } from "zod";
import prisma from "@/lib/prisma";
import { purgeSnapshot } from "@/lib/cache";
import { ensureAdminSession, handleAdminApiError } from "@/lib/auth/guard";
import { revalidatePath } from "next/cache";

const createSchema = z.object({
  title: z.string().min(1),
  summary: z.string().optional(),
  status: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
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

async function fetchWaterToday() {
  return await prisma.waterTodayUpdate.findMany({
    orderBy: { publishedAt: "desc" },
    include: { seo: true },
  });
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
    const { seoTitle, seoDescription, seoKeywords, ...data } = createSchema.parse(body);

    const record = await prisma.waterTodayUpdate.create({
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

    await purgeSnapshot(SnapshotModule.WATER_TODAY).catch(() => null);
    revalidatePath("/");
    revalidatePath("/watertodaysection");

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
    const { id, seoTitle, seoDescription, seoKeywords, ...updates } = updateSchema.parse(body);

    const record = await prisma.waterTodayUpdate.update({
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

    await purgeSnapshot(SnapshotModule.WATER_TODAY).catch(() => null);
    revalidatePath("/");
    revalidatePath("/watertodaysection");

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
    const session = await ensureAdminSession("watertoday:delete");
    const body = await request.json();
    const { id } = deleteSchema.parse(body);

    const record = await prisma.waterTodayUpdate.delete({ where: { id } });

    await purgeSnapshot(SnapshotModule.WATER_TODAY).catch(() => null);
    revalidatePath("/");
    revalidatePath("/watertodaysection");

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
