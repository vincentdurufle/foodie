import { auth } from './auth';

export default auth((req) => {
  if (req.nextUrl.pathname.includes('/api') && !req.auth) {
    return Response.json(
      { statusCode: 401, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (req.nextUrl.pathname === '/login' && req.auth) {
    const url = req.url.replace(req.nextUrl.pathname, '/');
    return Response.redirect(url);
  }

  if (req.nextUrl.pathname !== '/login' && !req.auth) {
    const url = req.url.replace(req.nextUrl.pathname, '/login');
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ['/admin/:path*', '/login', '/api/:path*'],
};
