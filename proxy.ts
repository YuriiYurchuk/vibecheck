import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const isDashboard = pathname.includes('/dashboard');
	const sessionCookie = getSessionCookie(req);

	if (isDashboard && !sessionCookie) {
		return NextResponse.redirect(new URL('/', req.url));
	}

	return handleI18nRouting(req);
}

export const config = {
	matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
