import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if the user is authenticated by checking for 'authjs.session-token'
    const isAuthenticated = !!request.cookies.get('__Secure-authjs.session-token');

    console.log('isAuthenticated:', isAuthenticated);

    // If the user is not authenticated and is not on the sign-in page, redirect to /auth/signin
    if (!isAuthenticated && request.nextUrl.pathname !== '/auth/signin') {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    return NextResponse.next(); // Allow the request to proceed
}

export const config = {
    matcher: [
        // Match all routes except sign-in
        '/((?!api|_next/static|_next/image|auth/signin).*)'
    ],
};
