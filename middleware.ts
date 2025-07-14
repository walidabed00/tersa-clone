import { authMiddleware } from '@clerk/nextjs/server';

export default authMiddleware();

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/webhooks/ (webhook endpoints)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|mp4)$).*)',
  ],
};
