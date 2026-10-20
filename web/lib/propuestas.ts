import 'server-only';
import { sql } from './db';
import { FORMAS_PAGO, VIGENCIA_DIAS, totales, type Cargo, type DatosPropuesta, type TipoPago } from './propuesta';
import { fechaSantiago } from './limites';

// Propuestas guardadas en web.propuestas (esquema propio de la web; ver db/esquema-web.sql).

export type PropuestaGuardada = {
  id: number;
  numero: string;
  prospecto_id: number | null;
  plantilla: string;
  cliente: string;
  datos: DatosPropuesta;
  neto: number;
  emitida: string; // AAAA-MM-DD
  vence: string;
  creado: string;
};

const COLUMNAS = `id, numero, prospecto_id, plantilla, cliente, datos, neto,
  to_char(emitida, 'YYYY-MM-DD') AS emitida, to_char(vence, 'YYYY-MM-DD') AS vence, creado`;

const texto = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');

function cargo(v: unknown): Cargo | null {
  if (!v || typeof v !== 'object') return null;
  const c = v as Record<string, unknown>;
  const monto = typeof c.monto === 'number' && Number.isFinite(c.monto) ? Math.min(Math.max(Math.round(c.monto), 0), 2_000_000_000) : null;
  return { descripcion: texto(c.descripcion, 300).trim(), monto };
}

// Lo que llega del navegador se reconstruye campo por campo: nada se guarda tal cual.
export function sanear(v: unknown): DatosPropuesta | null {
  if (!v || typeof v !== 'object') return null;
  const d = v as Record<string, unknown>;
  const c = (d.cliente && typeof d.cliente === 'object' ? d.cliente : {}) as Record<string, unknown>;
  const p = (d.pago && typeof d.pago === 'object' ? d.pago : {}) as Record<string, unknown>;
  const tipo = (typeof p.tipo === 'string' && p.tipo in FORMAS_PAGO ? p.tipo : 'ninguna') as TipoPago;
  const cargos = (Array.isArray(d.cargos) ? d.cargos : []).slice(0, 20).map(cargo)
    .filter((x): x is Cargo => !!x && (!!x.descripcion || x.monto !== null));
  const mensual = cargo(d.mensual);
  return {
    plantilla: texto(d.plantilla, 60),
    titulo: texto(d.titulo, 200).trim(),
    descripcion: texto(d.descripcion, 1200).trim(),
    cliente: {
      nombre: texto(c.nombre, 200).trim(),
      razonSocial: texto(c.razonSocial, 200).trim(),
      rut: texto(c.rut, 20).trim(),
      contacto: texto(c.contacto, 200).trim(),
      correo: texto(c.correo, 200).trim(),
      telefono: texto(c.telefono, 40).trim(),
      comuna: texto(c.comuna, 200).trim(),
    },
    incluye: (Array.isArray(d.incluye) ? d.incluye : []).slice(0, 30).map((x) => texto(x, 300).trim()).filter(Boolean),
    cargos,
    mensual: mensual && (mensual.descripcion || mensual.monto !== null) ? mensual : null,
    pago: { tipo, cuotas: Math.min(Math.max(Math.trunc(Number(p.cuotas)) || 2, 2), 24), texto: texto(p.texto, 500).trim() },
    plazo: texto(d.plazo, 200).trim(),
    notas: texto(d.notas, 2000).trim(),
  };
}

function sumarDias(fecha: string, dias: number) {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

// Numeración correlativa por año: P-2026-001. Si dos se generan a la vez, el UNIQUE choca y se reintenta.
export async function crearPropuesta(datos: DatosPropuesta, prospectoId: number | null): Promise<PropuestaGuardada> {
  const emitida = fechaSantiago();
  const vence = sumarDias(emitida, VIGENCIA_DIAS);
  const prefijo = `P-${emitida.slice(0, 4)}-`;
  const neto = totales(datos).unico.neto;
  const cliente = datos.cliente.nombre || datos.cliente.razonSocial || 'Sin nombre';
  for (let intento = 0; ; intento++) {
    try {
      const [fila] = (await sql().query(
        `INSERT INTO web.propuestas (numero, prospecto_id, plantilla, cliente, datos, neto, emitida, vence)
         SELECT $1 || lpad((COALESCE(MAX(split_part(numero, '-', 3)::int), 0) + 1)::text, 3, '0'), $2, $3, $4, $5, $6, $7, $8
         FROM web.propuestas WHERE numero LIKE $1 || '%'
         RETURNING ${COLUMNAS}`,
        [prefijo, prospectoId, datos.plantilla, cliente, JSON.stringify(datos), neto, emitida, vence],
      )) as PropuestaGuardada[];
      return fila;
    } catch (e) {
      if (intento < 2 && (e as { code?: string }).code === '23505') continue;
      throw e;
    }
  }
}

export async function obtenerPropuesta(id: number): Promise<PropuestaGuardada | null> {
  const [fila] = (await sql().query(`SELECT ${COLUMNAS} FROM web.propuestas WHERE id = $1`, [id])) as PropuestaGuardada[];
  return fila ?? null;
}

export async function listarPropuestas(prospectoId?: number, limite = 300): Promise<PropuestaGuardada[]> {
  return (await (prospectoId
    ? sql().query(`SELECT ${COLUMNAS} FROM web.propuestas WHERE prospecto_id = $1 ORDER BY id DESC LIMIT $2`, [prospectoId, limite])
    : sql().query(`SELECT ${COLUMNAS} FROM web.propuestas ORDER BY id DESC LIMIT $1`, [limite]))) as PropuestaGuardada[];
}

const FECHA_LARGA = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// "2026-11-19" → "19 de noviembre de 2026"
export function fechaLarga(iso: string) {
  return FECHA_LARGA.format(new Date(`${iso}T12:00:00Z`));
}
