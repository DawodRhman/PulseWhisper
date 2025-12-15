import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";

class AdminAuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.name = "AdminAuthError";
    this.status = status;
  }
}

async function ensureAdminSession(permission) {
  const session = await getAdminSession();
  if (!session) {
    throw new AdminAuthError("Authentication required", 401);
  }
  if (permission && !session.permissions.includes(permission)) {
    throw new AdminAuthError("Forbidden", 403);
  }
  return session;
}

export function handleAdminApiError(error, context = "admin api") {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error(`[${context}]`, error);

  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: {
          message: error?.message || String(error),
          name: error?.name,
          code: error?.code,
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export { ensureAdminSession, AdminAuthError };
