import 'server-only';
import { cache } from 'react';
import { PREGUNTAS } from '@/content/faq';
import { SITIO } from '@/content/sitio';
import { hayBase, sql } from './db';

// Ajustes y preguntas frecuentes editables desde /admin/sitio (tablas web.ajustes y web.preguntas).
// Si la base no responde o no hay nada guardado, se usan los valores del código.

export type Pregunta = { id: number; pregunta: string; respuesta: string; orden: number; visible: boolean };

export const obtenerWhatsapp = cache(async (): Promise<string> => {
  if (!hayBase()) return SITIO.whatsapp;
  try {
    const [fila] = (await sql()`SELECT valor FROM web.ajustes WHERE clave = 'whatsapp'`) as { valor: string }[];
    return fila?.valor || SITIO.whatsapp;
  } catch (e) {
    console.error('[sitio] No se pudo leer el WhatsApp de la base, uso el del código:', e);
    return SITIO.whatsapp;
  }
});

export async function guardarWhatsapp(numero: string) {
  await sql()`
    INSERT INTO web.ajustes (clave, valor) VALUES ('whatsapp', ${numero})
    ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor, actualizado = now()
  `;
}

// Acepta "+56 9 7924 2216", "979242216", "56979242216"… y devuelve solo dígitos con código de país.
// Un celular chileno de 9 dígitos que empieza con 9 recibe el 56 delante.
export function normalizarWhatsapp(texto: string): string | null {
  let d = texto.replace(/\D/g, '');
  if (/^9\d{8}$/.test(d)) d = `56${d}`;
  if (d.startsWith('56') && !/^569\d{8}$/.test(d) && !/^562\d{8}$/.test(d)) return null;
  return /^\d{8,15}$/.test(d) ? d : null;
}

// 56979242216 → +56 9 7924 2216
export function formatearWhatsapp(d: string) {
  const m = d.match(/^56(9)(\d{4})(\d{4})$/);
  return m ? `+56 ${m[1]} ${m[2]} ${m[3]}` : `+${d}`;
}

// --- Preguntas frecuentes ---

export async function listarPreguntas(): Promise<Pregunta[]> {
  return (await sql()`SELECT id, pregunta, respuesta, orden, visible FROM web.preguntas ORDER BY orden, id`) as Pregunta[];
}

// Lo que ve el público: las visibles de la base, o las del código si la tabla todavía está vacía.
export const obtenerPreguntas = cache(async (): Promise<{ p: string; r: string }[]> => {
  if (!hayBase()) return PREGUNTAS;
  try {
    const filas = await listarPreguntas();
    return filas.length ? filas.filter((f) => f.visible).map((f) => ({ p: f.pregunta, r: f.respuesta })) : PREGUNTAS;
  } catch (e) {
    console.error('[sitio] No se pudieron leer las preguntas de la base, uso las del código:', e);
    return PREGUNTAS;
  }
});

// Copia las preguntas del código a la base la primera vez que se editan, para no perderlas.
export async function sembrarPreguntas() {
  const db = sql();
  const [{ n }] = (await db`SELECT count(*)::int AS n FROM web.preguntas`) as { n: number }[];
  if (n) return;
  await db.transaction(PREGUNTAS.map((q, i) => db`INSERT INTO web.preguntas (pregunta, respuesta, orden) VALUES (${q.p}, ${q.r}, ${(i + 1) * 10})`));
}

export async function crearPregunta(pregunta: string, respuesta: string) {
  await sembrarPreguntas();
  await sql()`
    INSERT INTO web.preguntas (pregunta, respuesta, orden)
    SELECT ${pregunta}, ${respuesta}, COALESCE(MAX(orden), 0) + 10 FROM web.preguntas
  `;
}

export async function editarPregunta(id: number, pregunta: string, respuesta: string, visible: boolean) {
  await sql()`
    UPDATE web.preguntas SET pregunta = ${pregunta}, respuesta = ${respuesta}, visible = ${visible}, actualizado = now()
    WHERE id = ${id}
  `;
}

export async function borrarPregunta(id: number) {
  await sql()`DELETE FROM web.preguntas WHERE id = ${id}`;
}

// Intercambia el orden con la vecina de arriba o de abajo.
export async function moverPregunta(id: number, direccion: 'subir' | 'bajar') {
  const lista = await listarPreguntas();
  const i = lista.findIndex((f) => f.id === id);
  const j = direccion === 'subir' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= lista.length) return;
  const db = sql();
  // Se renumera todo de 10 en 10 con el par intercambiado: así no importa si había órdenes repetidos.
  [lista[i], lista[j]] = [lista[j], lista[i]];
  await db.transaction(lista.map((f, k) => db`UPDATE web.preguntas SET orden = ${(k + 1) * 10} WHERE id = ${f.id}`));
}
