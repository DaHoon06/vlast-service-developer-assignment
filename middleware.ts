import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const hasUserToken = !!request.cookies.get('user_token')?.value;

    if (!hasUserToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/game/:path*'],
};
