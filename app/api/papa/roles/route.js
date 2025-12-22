import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { AuditModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ensureAdminSession, handleAdminApiError } from "@/lib/auth/guard";

// Schema for Creating/Updating Roles
const roleSchema = z.object({
    label: z.string().min(1),
    permissions: z.array(z.string()),
});

// GET: List all roles
export async function GET() {
    try {
        // Only those who can manage users or settings (or explicit roles:read permission) can list roles
        await ensureAdminSession("users:write"); // assuming roles related to users
        const roles = await prisma.role.findMany({
            orderBy: { label: "asc" },
        });
        return NextResponse.json({ data: roles });
    } catch (error) {
        return handleAdminApiError(error, "GET /api/papa/roles");
    }
}

// POST: Create custom role
export async function POST(request) {
    try {
        const session = await ensureAdminSession("users:write");
        // Only Super Admin can create roles? Or unrestricted?
        // "other admins cant add or diable each other they can however delete create below roles"
        // So generic admins CAN create roles.

        const body = await request.json();
        const { label, permissions } = roleSchema.parse(body);

        const role = await prisma.role.create({
            data: {
                type: "CUSTOM",
                label,
                permissions: permissions, // Storing as JSON array
            },
        });

        await prisma.auditLog.create({
            data: {
                module: AuditModule.AUTH,
                action: "ROLE_CREATE",
                recordId: role.id,
                actorId: session.user.id,
                diff: { label, permissions },
            },
        });

        return NextResponse.json({ record: role });
    } catch (error) {
        if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
        return handleAdminApiError(error, "POST /api/papa/roles");
    }
}

// DELETE: Delete custom role
export async function DELETE(request) {
    try {
        const session = await ensureAdminSession("users:write");
        const body = await request.json();
        const { id } = z.object({ id: z.string().min(1) }).parse(body);

        const role = await prisma.role.findUnique({ where: { id } });
        if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });

        if (role.type !== "CUSTOM") {
            // Prevent deleting system roles including SUPER_ADMIN
            return NextResponse.json({ error: "Cannot delete system roles" }, { status: 403 });
        }

        await prisma.role.delete({ where: { id } });

        await prisma.auditLog.create({
            data: {
                module: AuditModule.AUTH,
                action: "ROLE_DELETE",
                recordId: id,
                actorId: session.user.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
        return handleAdminApiError(error, "DELETE /api/papa/roles");
    }
}
