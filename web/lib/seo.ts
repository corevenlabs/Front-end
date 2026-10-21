import type { Metadata } from 'next';
import { SITIO } from '@/content/sitio';

// Metadatos de cada página pública: canonical, Open Graph y X/Twitter con la misma imagen.
// El openGraph de una página reemplaza al del layout completo, por eso la imagen va siempre aquí.

const IMAGEN = { url: '/opengraph-image', width: 1200, height: 630, alt: 'Corevenlabs: le compran al que contesta primero' };

// Google muestra ~155-160 caracteres: se corta en el último espacio y se cierra con «…».
export function recortar(texto: string, max = 158) {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max - 1);
  return corte.slice(0, corte.lastIndexOf(' ')).replace(/[\s,.;:]+$/, '') + '…';
}

export function metadatos({ ruta, titulo, descripcion, tituloSocial, absoluto = false }: {
  ruta: string;
  titulo: string; // sin « | Corevenlabs»: lo agrega la plantilla del layout
  descripcion: string;
  tituloSocial?: string; // para WhatsApp, LinkedIn, X: puede ser más vendedor que el de Google
  absoluto?: boolean; // true = el título va tal cual, sin la plantilla
}): Metadata {
  const social = `${tituloSocial ?? titulo} | ${SITIO.nombre}`;
  const desc = recortar(descripcion);
  return {
    title: absoluto ? { absolute: titulo } : titulo,
    description: desc,
    alternates: { canonical: ruta },
    openGraph: { type: 'website', locale: 'es_CL', siteName: SITIO.nombre, url: ruta, title: social, description: desc, images: [IMAGEN] },
    twitter: { card: 'summary_large_image', title: social, description: desc, images: [IMAGEN.url] },
  };
}

// Migas de pan para Google (BreadcrumbList). La primera es siempre la portada.
export function migas(...pasos: [nombre: string, ruta: string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [['Inicio', '/'] as const, ...pasos].map(([name, ruta], i) => ({
      '@type': 'ListItem', position: i + 1, name, item: `${SITIO.url}${ruta === '/' ? '' : ruta}`,
    })),
  };
}
