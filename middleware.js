import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/security/rate-limit';

export async function middleware(request) {
    // Only apply to API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const limit = 60; // 60 requests
        const windowMs = 60 * 1000; // per 1 minute

        const result = rateLimit(request, {
            limit,
            windowMs,
            keyPrefix: 'middleware_rate_limit'
        });

        // logic: rateLimit returns a NextResponse if blocked, or an object { ok: true, headers: ... } if allowed
        if (result instanceof NextResponse || result.status) {
            return result;
        }

        // Proceed
        const response = NextResponse.next();

        // Attach headers
        if (result.headers) {
            Object.entries(result.headers).forEach(([key, value]) => {
                response.headers.set(key, value);
            });
        }

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};
