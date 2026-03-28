import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PATHS = ['/admin'];
const PROTECTED_PATHS = ['/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Auth is handled client-side (JWT in localStorage), so middleware
  // only adds headers; actual protection is in ProtectedRoute/AdminRoute components.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon|manifest|robots|sitemap).*)'],
};
