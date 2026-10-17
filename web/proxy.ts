import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_SESION, verificarSesion } from '@/lib/sesion';

// Protege /admin: sin sesión válida, todo redirige al login.
// Las páginas y acciones del admin verifican la sesión de nuevo en el servidor.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();

  const sesion = await verificarSesion(req.cookies.get(COOKIE_SESION)?.value);
  if (!sesion) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = pathname === '/admin' ? '' : `?desde=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin', '/admin/:path*'] };
