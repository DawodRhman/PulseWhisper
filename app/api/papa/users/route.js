import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z, ZodError } from "zod";
import { AuditModule, RoleType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ensureAdminSession, AdminAuthError, handleAdminApiError } from "@/lib/auth/guard";
import { hashPassword } from "@/lib/auth/hash";

const ENTITY_TYPE = z.enum(["user", "roles", "password", "status"]);
const actionEnvelopeSchema = z.object({
  type: ENTITY_TYPE,
  payload: z.unknown(),
});

import {
  createUserSchema,
  updateUserRolesSchema,
  updateUserStatusSchema,
  resetPasswordSchema
} from "@/lib/validators/admin";

const createSchemas = {
  user: createUserSchema,
};

const updateSchemas = {
  roles: updateUserRolesSchema,
  status: updateUserStatusSchema,
};

const passwordSchemas = {
  password: resetPasswordSchema,
};

function createHttpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function parseActionPayload(request, schemaMap) {
  const body = await request.json();
  const envelope = actionEnvelopeSchema.parse(body);
  const schema = schemaMap[envelope.type];
  if (!schema) {
    throw createHttpError("Unsupported entity type", 400);
  }
  const data = schema.parse(envelope.payload);
  return { type: envelope.type, data };
}

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt,
    roles: user.roles.map((entry) => entry.role.type),
  };
}

async function fetchUsersPayload(session) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      roles: {
        include: { role: true },
      },
    },
  });

  // Filter Logic:
  // If I am NOT Super Admin, I cannot see Super Admin users.
  // Actually, I cannot see anyone with SUPER_ADMIN role.
  const filtered = users.filter((u) => {
    const isTargetSuper = u.roles.some((r) => r.role.type === "SUPER_ADMIN");
    if (isTargetSuper && !session.user.isSuperAdmin) return false;
    return true;
  });

  return { users: filtered.map(serializeUser) };
}

async function getRoleRecords(roleTypes = []) {
  if (!roleTypes.length) return [];
  const roles = await prisma.role.findMany({ where: { type: { in: roleTypes } } });
  if (roles.length !== roleTypes.length) {
    throw createHttpError("One or more roles are invalid", 400);
  }
  return roles;
}

function generateTempPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#";
  return Array.from({ length: 14 }, () => alphabet[crypto.randomInt(0, alphabet.length)]).join("");
}

async function syncUserRoles(userId, roleTypes) {
  const roles = await getRoleRecords(roleTypes);
  await prisma.userRole.deleteMany({ where: { userId } });
  await prisma.userRole.createMany({
    data: roles.map((role) => ({ userId, roleId: role.id })),
    skipDuplicates: true,
  });
  return roles.map((role) => role.type);
}

async function logAudit({ session, action, recordId, diff }) {
  await prisma.auditLog.create({
    data: {
      module: AuditModule.AUTH,
      action,
      recordId: recordId || null,
      actorId: session?.user?.id || null,
      diff: diff || null,
    },
  });
}

function handleKnownErrors(error, context) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Invalid payload", details: error.flatten() }, { status: 400 });
  }
  if (error instanceof AdminAuthError) {
    return handleAdminApiError(error, context);
  }
  if (typeof error?.status === "number") {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error?.code === "P2002") {
    return NextResponse.json({ error: "Duplicate email" }, { status: 409 });
  }
  if (error?.code === "P2025") {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }
  return handleAdminApiError(error, context);
}

// Security Check Helpers
async function validateTargetUserAccess(session, targetUserId) {
  // If Super Admin, allow everything (except maybe editing other Super Admins if we wanted that restriction, but requirement says "Super Admin can do all")
  // Requirement: "other admins cant add or diable each other they can however delete create below roles"

  if (session.user.isSuperAdmin) return true;

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: { roles: { include: { role: true } } },
  });

  if (!target) return false;

  const isTargetSuper = target.roles.some(r => r.role.type === "SUPER_ADMIN");
  if (isTargetSuper) return false; // Non-super cannot touch super

  const isTargetAdmin = target.roles.some(r => r.role.type === "ADMIN");

  // "other admins cant add or diable each other"
  // So if I am ADMIN, and target is ADMIN, I cannot touch them.
  // Note: session.roles is an array of strings (RoleType)
  const isActorAdmin = session.user.roles.includes("ADMIN");

  if (isActorAdmin && isTargetAdmin && target.id !== session.user.id) {
    // Can't touch other admins. (Self-edit is handled separately in PATCH status usually, preventing disabling self)
    // Actually "can't add or disable each other". 
    // Usually this implies modifying ROLES or STATUS or PASSWORD or DELETING.
    return false;
  }

  return true;
}

export async function GET() {
  try {
    const session = await ensureAdminSession("users:write");
    const data = await fetchUsersPayload(session);
    return NextResponse.json({ data });
  } catch (error) {
    return handleKnownErrors(error, "GET /api/papa/users");
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminSession("users:write");
    const { type, data } = await parseActionPayload(request, createSchemas);
    if (type !== "user") {
      throw createHttpError("Unsupported entity type", 400);
    }

    // Role Security Check
    // "create below roles" -> Admins can create normal users, but not Supervisors/Admins?
    // Usually Admins create other Admins. 
    // Requirement: "they can however delete create below roles then admin and super admin"
    // -> "create below roles THAN admin and super admin" ??
    // Interpret: Admins can ONLY create users with roles "below" Admin (e.g. Editor, etc).

    if (!session.user.isSuperAdmin) {
      if (data.roles.includes("SUPER_ADMIN") || data.roles.includes("ADMIN")) {
        throw createHttpError("You cannot assign ADMIN or SUPER_ADMIN roles.", 403);
      }
    }

    const temporaryPassword = generateTempPassword();
    const hashedPassword = await hashPassword(temporaryPassword);
    const user = await prisma.user.create({
      data: {
        name: data.name?.trim() || null,
        email: data.email.toLowerCase(),
        phone: data.phone?.trim() || null,
        hashedPassword,
        status: "ACTIVE",
      },
    });
    await prisma.passwordHistory.create({ data: { userId: user.id, hash: hashedPassword } });
    await syncUserRoles(user.id, data.roles);
    await logAudit({ session, action: "USER_CREATE", recordId: user.id });
    const payload = await fetchUsersPayload(session);
    const created = payload.users.find((entry) => entry.id === user.id) || null;
    return NextResponse.json({
      data: payload,
      record: created,
      temporaryPassword,
    });
  } catch (error) {
    return handleKnownErrors(error, "POST /api/papa/users");
  }
}

export async function PATCH(request) {
  try {
    const session = await ensureAdminSession("users:write");
    const { type, data } = await parseActionPayload(request, { ...updateSchemas, ...passwordSchemas });

    // Check permission on target
    const canAccess = await validateTargetUserAccess(session, data.userId);
    if (!canAccess) {
      throw createHttpError("Access denied to this user.", 403);
    }

    let result;
    switch (type) {
      case "roles": {
        // Can only assign roles below me? 
        if (!session.user.isSuperAdmin) {
          if (data.roles.includes("SUPER_ADMIN") || data.roles.includes("ADMIN")) {
            throw createHttpError("You cannot assign ADMIN or SUPER_ADMIN roles.", 403);
          }
        }
        await syncUserRoles(data.userId, data.roles);
        await logAudit({ session, action: "USER_ROLES_UPDATE", recordId: data.userId });
        break;
      }
      case "status": {
        if (data.userId === session.user.id) {
          throw createHttpError("You cannot change your own status", 403);
        }
        const user = await prisma.user.update({ where: { id: data.userId }, data: { status: data.status } });
        await logAudit({ session, action: "USER_STATUS_UPDATE", recordId: data.userId, diff: { status: data.status } });
        result = user;
        break;
      }
      case "password": {
        const temporaryPassword = data.temporaryPassword || generateTempPassword();
        const hashedPassword = await hashPassword(temporaryPassword);
        await prisma.$transaction([
          prisma.user.update({ where: { id: data.userId }, data: { hashedPassword } }),
          prisma.passwordHistory.create({ data: { userId: data.userId, hash: hashedPassword } }),
          prisma.adminSession.deleteMany({ where: { userId: data.userId } }),
        ]);
        await logAudit({ session, action: "USER_PASSWORD_RESET", recordId: data.userId });
        result = { temporaryPassword };
        const payload = await fetchUsersPayload(session);
        return NextResponse.json({ data: payload, record: { id: data.userId }, temporaryPassword });
      }
      default:
        throw createHttpError("Unsupported entity type", 400);
    }
    const payload = await fetchUsersPayload(session);
    return NextResponse.json({ data: payload, record: result || null });
  } catch (error) {
    return handleKnownErrors(error, "PATCH /api/papa/users");
  }
}
