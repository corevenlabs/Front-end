import 'server-only';
import { cache } from 'react';
import { CLAVES_PRECIO, PRECIOS_BASE, type ClavePrecio, type MapaPrecios } from '@/content/precios';
import { hayBase, sql } from './db';

function base(): MapaPrecios {
  return Object.fromEntries(
    CLAVES_PRECIO.map((k) => [k, { desde: PRECIOS_BASE[k].desde, periodo: PRECIOS_BASE[k].periodo }]),
  ) as MapaPrecios;
}

// Precios vigentes: los de la base (editados en /admin) sobre los valores por defecto.
// Las páginas públicas son estáticas; al guardar en /admin se regeneran.
export const obtenerPrecios = cache(async (): Promise<MapaPrecios> => {
  const precios = base();
  if (!hayBase()) return precios;
  try {
    const filas = (await sql()`SELECT clave, desde, periodo FROM web.precios`) as { clave: string; desde: number | null; periodo: string }[];
    for (const f of filas) {
      if (f.clave in precios) precios[f.clave as ClavePrecio] = { desde: f.desde, periodo: f.periodo };
    }
  } catch (e) {
    console.error('[precios] No se pudieron leer de la base, uso los valores por defecto:', e);
  }
  return precios;
});

export function clavePrecioDeServicio(slug: string): ClavePrecio {
  return slug === 'agentes-whatsapp' ? 'agente-implementacion' : (slug as ClavePrecio);
}
