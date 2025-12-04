import { NextResponse } from "next/server";
import { AuditModule } from "@prisma/client";
import { z, ZodError } from "zod";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/string";
import { ensureAdminSession, handleAdminApiError, AdminAuthError } from "@/lib/auth/guard";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
};

function jsonResponse(body, init = {}) {
  const response = NextResponse.json(body, init);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// --- Validation Schemas ---

const sectionSchema = z.object({
  id: z.string().optional(), // Optional for new sections
  type: z.string().min(1),
  order: z.coerce.number().int().default(0),
  content: z.record(z.unknown()), // Flexible JSON content
});

const createPageSchema = z.object({
  title: z.string().trim().min(3),
  slug: z.string().trim().min(1).optional(), // Generated if missing
  isPublished: z.boolean().optional().default(false),
  showInNavbar: z.boolean().optional().default(false),
  sections: z.array(sectionSchema).optional().default([]),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

const updatePageSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(3).optional(),
  slug: z.string().trim().min(1).optional(),
  isPublished: z.boolean().optional(),
  showInNavbar: z.boolean().optional(),
  sections: z.array(sectionSchema).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

const deletePageSchema = z.object({
  id: z.string().min(1),
});

// --- Helpers ---

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",").shift()?.trim() || null;
  }
  return request.headers.get("x-real-ip") || null;
}

function getUserAgent(request) {
  return request.headers.get("user-agent") || null;
}

async function logAudit({ session, action, recordId, diff, request }) {
  await prisma.auditLog.create({
    data: {
      module: AuditModule.ADMIN_DASHBOARD, // Using generic admin module for pages
      action,
      recordId: recordId || null,
      diff,
      actorId: session?.user?.id || null,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    },
  });
}

function handleKnownErrors(error, context) {
  if (error instanceof ZodError) {
    return jsonResponse(
      { error: "Invalid payload", details: error.flatten() },
      { status: 400 }
    );
  }
  if (error instanceof AdminAuthError) {
    return handleAdminApiError(error, context);
  }
  if (error?.code === "P2002") {
    return jsonResponse({ error: "Duplicate value (e.g., slug) violates unique constraint" }, { status: 409 });
  }
  return handleAdminApiError(error, context);
}

// --- Handlers ---

export async function GET() {
  try {
    await ensureAdminSession("pages:read"); // Assuming a permission exists or generic admin
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        sections: { orderBy: { order: "asc" } },
        seo: true,
      },
    });
    return jsonResponse({ data: pages });
  } catch (error) {
    return handleKnownErrors(error, "GET /api/admin/pages");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("pages:write");
    const body = await request.json();
    const data = createPageSchema.parse(body);

    const slug = slugify(data.slug || data.title);

    // Transaction to create page, sections, and SEO
    const page = await prisma.$transaction(async (tx) => {
      const newPage = await tx.page.create({
        data: {
          title: data.title,
          slug,
          isPublished: data.isPublished,
          showInNavbar: data.showInNavbar,
          seo: data.seo ? {
            create: {
              title: data.seo.title || data.title,
              description: data.seo.description,
            }
          } : undefined,
          sections: {
            create: data.sections.map(s => ({
              type: s.type,
              order: s.order,
              content: s.content,
            })),
          },
        },
        include: { sections: true, seo: true },
      });
      return newPage;
    });

    await logAudit({ session, action: "PAGE_CREATE", recordId: page.id, diff: { after: page }, request });
    revalidatePath("/"); // Revalidate everything for now, or specific paths
    
    return jsonResponse({ data: page }, { status: 201 });
  } catch (error) {
    return handleKnownErrors(error, "POST /api/admin/pages");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("pages:write");
    const body = await request.json();
    const data = updatePageSchema.parse(body);

    const existing = await prisma.page.findUnique({ 
      where: { id: data.id },
      include: { sections: true, seo: true }
    });

    if (!existing) {
      return jsonResponse({ error: "Page not found" }, { status: 404 });
    }

    const slug = data.slug ? slugify(data.slug) : (data.title ? slugify(data.title) : undefined);

    const page = await prisma.$transaction(async (tx) => {
      // Update Page fields
      const updatedPage = await tx.page.update({
        where: { id: data.id },
        data: {
          title: data.title,
          slug,
          isPublished: data.isPublished,
          showInNavbar: data.showInNavbar,
          seo: data.seo ? {
            upsert: {
              create: { title: data.seo.title || data.title, description: data.seo.description },
              update: { title: data.seo.title, description: data.seo.description },
            }
          } : undefined,
        },
      });

      // Handle Sections: Delete all and recreate (simplest for now) or smart update
      // For simplicity in this iteration: Delete existing sections and create new ones if provided
      if (data.sections) {
        await tx.pageSection.deleteMany({ where: { pageId: data.id } });
        await tx.pageSection.createMany({
          data: data.sections.map(s => ({
            pageId: data.id,
            type: s.type,
            order: s.order,
            content: s.content,
          })),
        });
      }

      return tx.page.findUnique({
        where: { id: data.id },
        include: { sections: { orderBy: { order: "asc" } }, seo: true },
      });
    });

    await logAudit({ session, action: "PAGE_UPDATE", recordId: page.id, diff: { before: existing, after: page }, request });
    revalidatePath(`/${page.slug}`);
    
    return jsonResponse({ data: page });
  } catch (error) {
    return handleKnownErrors(error, "PATCH /api/admin/pages");
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminSession("pages:write");
    const body = await request.json();
    const { id } = deletePageSchema.parse(body);

    const existing = await prisma.page.findUnique({ where: { id } });
    if (!existing) {
      return jsonResponse({ error: "Page not found" }, { status: 404 });
    }

    await prisma.page.delete({ where: { id } });

    await logAudit({ session, action: "PAGE_DELETE", recordId: id, diff: { before: existing }, request });
    revalidatePath(`/${existing.slug}`);

    return jsonResponse({ success: true });
  } catch (error) {
    return handleKnownErrors(error, "DELETE /api/admin/pages");
  }
}
