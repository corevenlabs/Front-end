import type { MetadataRoute } from 'next';
import { RUBROS } from '@/content/rubros';
import { SERVICIOS } from '@/content/servicios';
import { SITIO } from '@/content/sitio';

export default function sitemap(): MetadataRoute.Sitemap {
  const pagina = (ruta: string, prioridad: number) => ({ url: `${SITIO.url}${ruta}`, priority: prioridad });
  return [
    pagina('/', 1),
    pagina('/demo', 0.9),
    pagina('/precios', 0.8),
    pagina('/servicios', 0.8),
    ...SERVICIOS.map((sv) => pagina(`/servicios/${sv.slug}`, 0.8)),
    ...RUBROS.map((r) => pagina(`/rubros/${r.slug}`, 0.7)),
    pagina('/contacto', 0.6),
    pagina('/privacidad', 0.2),
    pagina('/terminos-demo', 0.2),
  ];
}
