import type { NextRequest } from 'next/server';
import { obtenerWhatsapp } from '@/lib/ajustes';
import { MENSAJE_WHATSAPP } from '@/content/sitio';

// Todos los botones de WhatsApp del sitio pasan por aquí: el número se edita en /admin/sitio
// y el cambio vale de inmediato, sin regenerar páginas.
export async function GET(req: NextRequest) {
  const texto = (req.nextUrl.searchParams.get('texto') || MENSAJE_WHATSAPP).slice(0, 300);
  const numero = await obtenerWhatsapp();
  return new Response(null, {
    status: 307,
    headers: {
      Location: `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
