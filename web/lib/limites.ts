import 'server-only';
import { createHash } from 'node:crypto';
import { hayBase, sql } from './db';

// Límites por día, configurables por variables de entorno.
const LIMITES = {
  demo: { porVisitante: Number(process.env.DEMO_LIMITE_VISITANTE ?? 20), total: Number(process.env.DEMO_LIMITE_DIARIO ?? 400) },
  contacto: { porVisitante: 5, total: 200 },
  login: { porVisitante: 10, total: 100 }, // intentos de inicio de sesión del admin
};
export type TipoUso = keyof typeof LIMITES;
export type ResultadoLimite = 'ok' | 'visitante' | 'global';

export function fechaSantiago(d = new Date()) {
  // en-CA da el formato AAAA-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' }).format(d);
}

export function ipDe(req: Request) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'desconocida'
  );
}

// Solo aceptamos envíos desde nuestro propio sitio.
export function mismoOrigen(req: Request) {
  const origen = req.headers.get('origin');
  if (!origen) return false;
  try {
    return new URL(origen).host === req.headers.get('host');
  } catch {
    return false;
  }
}

// Hash con sal diaria: el mismo visitante es reconocible solo dentro del día.
function visitante(ip: string, fecha: string) {
  const sal = process.env.DEMO_SAL ?? 'cambiar-en-produccion';
  return createHash('sha256').update(`${sal}:${fecha}:${ip}`).digest('hex').slice(0, 32);
}

// Respaldo en memoria para desarrollo local sin base de datos.
const memoria = new Map<string, number>();

// Cuenta un uso y dice si está dentro del límite.
export async function registrarUso(tipo: TipoUso, ip: string): Promise<ResultadoLimite> {
  const { porVisitante, total: tope } = LIMITES[tipo];
  const fecha = fechaSantiago();
  const id = visitante(ip, fecha);

  if (!hayBase()) {
    if (process.env.NODE_ENV === 'production') return 'global'; // sin base no aceptamos uso en producción
    const prefijo = `${fecha}:${tipo}:`;
    const total = [...memoria.entries()].filter(([k]) => k.startsWith(prefijo)).reduce((a, [, n]) => a + n, 0);
    if (total >= tope) return 'global';
    const n = (memoria.get(prefijo + id) ?? 0) + 1;
    memoria.set(prefijo + id, n);
    return n > porVisitante ? 'visitante' : 'ok';
  }

  const db = sql();
  const [{ total }] = (await db`
    SELECT COALESCE(SUM(conteo), 0)::int AS total FROM web.uso WHERE fecha = ${fecha} AND tipo = ${tipo}
  `) as { total: number }[];
  if (total >= tope) return 'global';

  const [{ conteo }] = (await db`
    INSERT INTO web.uso (fecha, tipo, visitante, conteo) VALUES (${fecha}, ${tipo}, ${id}, 1)
    ON CONFLICT (fecha, tipo, visitante) DO UPDATE SET conteo = web.uso.conteo + 1
    RETURNING conteo
  `) as { conteo: number }[];

  // Limpieza ocasional: se borra lo que tenga más de 7 días.
  if (Math.random() < 0.02) {
    await db`DELETE FROM web.uso WHERE fecha < (${fecha}::date - 7)`;
  }

  return conteo > porVisitante ? 'visitante' : 'ok';
}
