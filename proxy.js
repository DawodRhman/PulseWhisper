import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/security/rate-limit';

/**
 * Proxy function for Next.js middleware replacement.
 * Applies rate limiting to API routes and forwards the request.
 */
export async function proxy(request) {
    // Only apply to API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const limit = 60; // 60 requests per minute
        const windowMs = 60 * 1000;

        const result = rateLimit(request, {
            limit,
            windowMs,
            keyPrefix: 'proxy_rate_limit',
        });

        // If rate limited, result is a NextResponse
        if (result instanceof NextResponse || result.status) {
            return result;
        }

        const response = NextResponse.next();
        if (result.headers) {
            Object.entries(result.headers).forEach(([key, value]) => {
                response.headers.set(key, value);
            });
        }
        return response;
    }

    // For non‑API routes just continue
    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};

export default proxy;
