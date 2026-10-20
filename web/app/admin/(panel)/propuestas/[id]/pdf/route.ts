import type { NextRequest } from 'next/server';
import { COOKIE_SESION, verificarSesion } from '@/lib/sesion';
import { hayBase } from '@/lib/db';
import { obtenerPropuesta } from '@/lib/propuestas';
import { generarPdf, nombreArchivo } from '@/lib/pdf/propuesta-pdf';

// PDF de una propuesta guardada. ?descargar=1 lo baja como archivo; sin eso se abre en el navegador.
// El proxy ya protege /admin, pero igual se verifica la sesión aquí.
export async function GET(req: NextRequest, ctx: RouteContext<'/admin/propuestas/[id]/pdf'>) {
  if (!(await verificarSesion(req.cookies.get(COOKIE_SESION)?.value))) return new Response('No autorizado', { status: 401 });
  if (!hayBase()) return new Response('Falta DATABASE_URL', { status: 503 });

  const id = Number((await ctx.params).id);
  const propuesta = Number.isInteger(id) && id > 0 ? await obtenerPropuesta(id) : null;
  if (!propuesta) return new Response('No existe', { status: 404 });

  const pdf = await generarPdf(propuesta);
  const modo = req.nextUrl.searchParams.has('descargar') ? 'attachment' : 'inline';
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${modo}; filename="${nombreArchivo(propuesta)}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
