import { NextResponse } from "next/server";

function getClientIp(request) {
  if (!request || !request.headers) return "unknown";

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",").shift()?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function getStore() {
  const key = "__KWSC_RATE_LIMIT_STORE__";
  if (!globalThis[key]) {
    globalThis[key] = new Map();
  }
  return globalThis[key];
}

/**
 * Best-effort in-memory rate limiter.
 * Note: In serverless/edge environments this may not be globally consistent.
 */
export function rateLimit(request, {
  keyPrefix,
  limit,
  windowMs,
  keyId,
} = {}) {
  const resolvedLimit = Number.isFinite(limit) ? limit : 60;
  const resolvedWindowMs = Number.isFinite(windowMs) ? windowMs : 60_000;
  const ip = getClientIp(request);
  const subject = keyId || ip;
  const storeKey = `${keyPrefix || "api"}:${subject}`;

  const store = getStore();
  const now = Date.now();

  let entry = store.get(storeKey);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + resolvedWindowMs };
  }

  entry.count += 1;
  store.set(storeKey, entry);

  const remaining = Math.max(0, resolvedLimit - entry.count);

  if (entry.count > resolvedLimit) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    const response = NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
    response.headers.set("Retry-After", String(retryAfterSeconds));
    response.headers.set("X-RateLimit-Limit", String(resolvedLimit));
    response.headers.set("X-RateLimit-Remaining", "0");
    response.headers.set("X-RateLimit-Reset", String(entry.resetAt));
    return response;
  }

  const responseHeaders = {
    "X-RateLimit-Limit": String(resolvedLimit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(entry.resetAt),
  };

  return { ok: true, headers: responseHeaders };
}

export function applyRateLimitHeaders(response, headers) {
  if (!response || !headers) return response;
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}
