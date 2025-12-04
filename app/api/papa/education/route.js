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
  content: z.any().optional(), // JSON content
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

async function fetchEducation() {
  return await prisma.educationResource.findMany({
    orderBy: { createdAt: "desc" },
    include: { seo: true },
  });
}

export async function GET() {
  try {
    await ensureAdminSession("education:write");
    const data = await fetchEducation();
    return NextResponse.json({ data });
  } catch (error) {
    return handleAdminApiError(error, "GET /api/papa/education");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("education:write");
    const body = await request.json();
    const { seoTitle, seoDescription, seoKeywords, ...data } = createSchema.parse(body);

    const record = await prisma.educationResource.create({
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
    
    await purgeSnapshot(SnapshotModule.EDUCATION).catch(() => null);
    revalidatePath("/education");
    
    await prisma.auditLog.create({
      data: {
        module: AuditModule.EDUCATION,
        action: "EDUCATION_CREATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchEducation();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "POST /api/papa/education");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("education:write");
    const body = await request.json();
    const { id, seoTitle, seoDescription, seoKeywords, ...updates } = updateSchema.parse(body);

    const record = await prisma.educationResource.update({
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

    await purgeSnapshot(SnapshotModule.EDUCATION).catch(() => null);
    revalidatePath("/education");

    await prisma.auditLog.create({
      data: {
        module: AuditModule.EDUCATION,
        action: "EDUCATION_UPDATE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchEducation();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "PATCH /api/papa/education");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("education:write");
    const body = await request.json();
    const { id } = deleteSchema.parse(body);

    const record = await prisma.educationResource.delete({ where: { id } });

    await purgeSnapshot(SnapshotModule.EDUCATION).catch(() => null);
    revalidatePath("/education");

    await prisma.auditLog.create({
      data: {
        module: AuditModule.EDUCATION,
        action: "EDUCATION_DELETE",
        recordId: record.id,
        actorId: session.user.id,
      },
    });

    const payload = await fetchEducation();
    return NextResponse.json({ data: payload, record });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return handleAdminApiError(error, "DELETE /api/papa/education");
  }
}
