import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth/hash";
import { createAdminSession } from "@/lib/auth/session";
import { AuditModule } from "@prisma/client";

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.toLowerCase()?.trim();
    const password = body?.password;
    const rememberDevice = Boolean(body?.rememberDevice);

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    let passwordValid = await verifyPassword(user.hashedPassword, password);
    if (!passwordValid && /^[a-f0-9]{64}$/i.test(user.hashedPassword)) {
      const legacyHash = crypto.createHash("sha256").update(password).digest("hex");
      if (legacyHash === user.hashedPassword) {
        passwordValid = true;
        const upgradedHash = await hashPassword(password);
        await prisma.user.update({ where: { id: user.id }, data: { hashedPassword: upgradedHash } });
      }
    }

    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || undefined;

    await createAdminSession({
      userId: user.id,
      rememberDevice,
      ipAddress,
      userAgent,
    });

    await prisma.auditLog.create({
      data: {
        module: AuditModule.AUTH,
        action: "ADMIN_LOGIN_SUCCESS",
        actorId: user.id,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/admin/auth/login", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
