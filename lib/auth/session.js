import crypto from "crypto";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { derivePermissionsFromRoles } from "@/lib/auth/permissions";

const COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE || "admin_session";
const SESSION_TTL_MS = Number(process.env.ADMIN_SESSION_TTL_MS || 1000 * 60 * 60); // 1 hour
const REMEMBER_TTL_MS = Number(process.env.ADMIN_SESSION_REMEMBER_TTL_MS || 1000 * 60 * 60 * 12); // 12 hours

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function buildCookieOptions(expiresAt) {
  return {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    expires: expiresAt,
  };
}

export async function createAdminSession({ userId, rememberDevice = false, ipAddress, userAgent }) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const now = Date.now();
  const expiresAt = new Date(now + SESSION_TTL_MS);
  const rememberUntil = rememberDevice ? new Date(now + REMEMBER_TTL_MS) : null;

  await prisma.adminSession.create({
    data: {
      userId,
      tokenHash,
      ipAddress,
      userAgent,
      expiresAt,
      rememberUntil,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, buildCookieOptions(rememberUntil || expiresAt));
}

// Cookie mutations are only safe inside route handlers or server actions.
async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  const now = new Date();
  const expired = session.expiresAt < now || (session.revokedAt && session.revokedAt < now);
  if (expired) {
    await prisma.adminSession.delete({ where: { tokenHash } }).catch(() => null);
    return null;
  }

  const roles = session.user.roles.map((entry) => entry.role.type);
  const permissions = derivePermissionsFromRoles(roles);

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
    roles,
    permissions,
    issuedAt: session.createdAt,
    rememberUntil: session.rememberUntil,
  };
}

export async function revokeCurrentAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return;
  const tokenHash = hashToken(token);
  await prisma.adminSession.delete({ where: { tokenHash } }).catch(() => null);
  await clearSessionCookie();
}
