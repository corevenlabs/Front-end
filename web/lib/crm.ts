import 'server-only';
import { sql } from './db';

// Reglas del CRM duplicadas de prospecting-bot/prospector/db.py (rama claude/project-thread-gbo83p).
// Si cambian allá, hay que cambiarlas aquí. No modificamos el esquema del CRM.
export const ESTADOS = [
  'nuevo', 'para revisar', 'contactado', 'reunión', 'propuesta', 'cliente',
  'no interesa', 'descartado', 'excluido',
] as const;
export type Estado = (typeof ESTADOS)[number];

export const FUENTE_WEB = 'formulario web';

// Igual que db.clave(): minúsculas y espacios normalizados. Evita duplicados.
export function clave(nombre: string) {
  return nombre.toLowerCase().split(/\s+/).filter(Boolean).join(' ');
}

export type ContactoWeb = {
  nombre: string;
  negocio: string;
  telefono: string;
  correo: string;
  mensaje: string;
};

export type ResultadoContacto = { id: number | null; nuevo: boolean; excluido: boolean };

// Guarda un contacto del formulario como prospecto. Si el negocio ya existe, solo agrega la actividad.
// Si el negocio está en exclusiones, no lo crea (se avisa igual por correo).
export async function registrarContactoWeb(c: ContactoWeb): Promise<ResultadoContacto> {
  const db = sql();
  const k = clave(c.negocio);

  const excluido = (await db`SELECT 1 FROM exclusiones WHERE clave = ${k}`) as unknown[];
  if (excluido.length) return { id: null, nuevo: false, excluido: true };

  const detalle =
    `Formulario web: ${c.nombre} (${c.telefono || c.correo})` + (c.mensaje ? `\n«${c.mensaje}»` : '');

  const creados = (await db`
    INSERT INTO prospectos (clave, nombre, telefono, correo, fuente, estado, notas)
    VALUES (${k}, ${c.negocio}, ${c.telefono}, ${c.correo}, ${FUENTE_WEB}, 'nuevo', ${`Contacto: ${c.nombre}`})
    ON CONFLICT (clave) DO NOTHING
    RETURNING id
  `) as { id: number }[];

  if (creados.length) {
    const id = creados[0].id;
    await db.transaction([
      db`INSERT INTO actividades (prospecto_id, tipo, detalle) VALUES (${id}, 'creado', 'Llegó desde el formulario de la web')`,
      db`INSERT INTO actividades (prospecto_id, tipo, detalle) VALUES (${id}, 'nota', ${detalle})`,
    ]);
    return { id, nuevo: true, excluido: false };
  }

  // Ya existía: completamos teléfono o correo si estaban vacíos y dejamos la nota.
  const [existente] = (await db`
    UPDATE prospectos SET
      telefono = CASE WHEN telefono = '' THEN ${c.telefono} ELSE telefono END,
      correo = CASE WHEN correo = '' THEN ${c.correo} ELSE correo END,
      actualizado = now()
    WHERE clave = ${k}
    RETURNING id
  `) as { id: number }[];
  if (existente) {
    await db`INSERT INTO actividades (prospecto_id, tipo, detalle) VALUES (${existente.id}, 'nota', ${detalle})`;
  }
  return { id: existente?.id ?? null, nuevo: false, excluido: false };
}

// ---------------------------------------------------------------------------
// Admin: lecturas y escrituras del CRM (mismas reglas que db.py)
// ---------------------------------------------------------------------------

export const TIPOS_CONTENIDO = {
  correo: 'Correo',
  instagram: 'Mensaje de Instagram',
  whatsapp: 'Mensaje de WhatsApp',
  propuesta: 'Propuesta de una página',
  demo: 'Guion de demo',
  seguimiento: 'Seguimiento',
} as const;
export type TipoContenido = keyof typeof TIPOS_CONTENIDO;

export const CAMPOS = [
  'nombre', 'rubro', 'comuna', 'instagram', 'web', 'telefono', 'correo',
  'google_maps', 'rating', 'resenas', 'fuente', 'puntaje', 'senales',
  'que_ofrecer', 'canal_sugerido', 'demo_idea', 'estado', 'notas',
] as const;
export type Campo = (typeof CAMPOS)[number];
const NUMERICOS = new Set<Campo>(['rating', 'resenas', 'puntaje']);

export type Prospecto = {
  id: number; clave: string; nombre: string; rubro: string; comuna: string; instagram: string; web: string;
  telefono: string; correo: string; google_maps: string; rating: string | null; resenas: number | null;
  fuente: string; puntaje: number | null; senales: string; que_ofrecer: string; canal_sugerido: string;
  demo_idea: string; estado: string; notas: string; creado: string; actualizado: string;
};
export type Actividad = { id: number; prospecto_id: number; tipo: string; detalle: string; creado: string };
export type Contenido = { id: number; prospecto_id: number; tipo: string; asunto: string; cuerpo: string; instrucciones: string; origen: string; creado: string };

export type Filtros = { estado?: string; rubro?: string; texto?: string; orden?: string; fuente?: string };

const ORDENES: Record<string, string> = {
  puntaje: 'puntaje DESC NULLS LAST, nombre',
  nombre: 'nombre',
  reciente: 'actualizado DESC',
  creado: 'creado DESC',
};

export async function listarProspectos(f: Filtros, limite = 500): Promise<Prospecto[]> {
  const condiciones: string[] = [];
  const params: unknown[] = [];
  const agregar = (texto: string, ...valores: unknown[]) => {
    let t = texto;
    for (const v of valores) {
      params.push(v);
      t = t.replace('?', `$${params.length}`);
    }
    condiciones.push(t);
  };
  if (f.estado) agregar('estado = ?', f.estado);
  if (f.rubro) agregar('rubro = ?', f.rubro);
  if (f.fuente) agregar('fuente = ?', f.fuente);
  if (f.texto) {
    const t = `%${f.texto}%`;
    agregar('(nombre ILIKE ? OR comuna ILIKE ? OR notas ILIKE ? OR telefono ILIKE ? OR correo ILIKE ?)', t, t, t, t, t);
  }
  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const orden = ORDENES[f.orden ?? ''] ?? ORDENES.puntaje;
  params.push(limite);
  return (await sql().query(`SELECT * FROM prospectos ${where} ORDER BY ${orden} LIMIT $${params.length}`, params)) as Prospecto[];
}

export async function contarPorEstado(fuente?: string): Promise<Record<string, number>> {
  const filas = (fuente
    ? await sql()`SELECT estado, count(*)::int AS n FROM prospectos WHERE fuente = ${fuente} GROUP BY estado`
    : await sql()`SELECT estado, count(*)::int AS n FROM prospectos GROUP BY estado`) as { estado: string; n: number }[];
  return Object.fromEntries(filas.map((f) => [f.estado, f.n]));
}

export async function rubros(): Promise<string[]> {
  const filas = (await sql()`SELECT DISTINCT rubro FROM prospectos WHERE rubro <> '' ORDER BY rubro`) as { rubro: string }[];
  return filas.map((f) => f.rubro);
}

export async function obtenerProspecto(id: number): Promise<Prospecto | null> {
  const [p] = (await sql()`SELECT * FROM prospectos WHERE id = ${id}`) as Prospecto[];
  return p ?? null;
}

export async function actividades(id: number): Promise<Actividad[]> {
  return (await sql()`SELECT * FROM actividades WHERE prospecto_id = ${id} ORDER BY creado DESC, id DESC`) as Actividad[];
}

export async function contenidos(id: number): Promise<Contenido[]> {
  return (await sql()`SELECT * FROM contenidos WHERE prospecto_id = ${id} ORDER BY creado DESC, id DESC`) as Contenido[];
}

// Igual que db._limpiar(): solo columnas conocidas, vacíos numéricos a NULL.
function limpiar(datos: Partial<Record<Campo, string>>) {
  const fila: Partial<Record<Campo, string | number | null>> = {};
  for (const c of CAMPOS) {
    const v = datos[c];
    if (v === undefined) continue;
    if (NUMERICOS.has(c)) {
      const t = v.trim().replace(',', '.');
      const n = Number(t);
      fila[c] = !t || !Number.isFinite(n) ? null : c === 'rating' ? n : Math.trunc(n);
    } else {
      fila[c] = v;
    }
  }
  return fila;
}

// Igual que db.actualizar_prospecto(): nunca deja el nombre vacío, actualiza la clave si cambia
// el nombre y registra en actividades cada cambio de estado.
export async function actualizarProspecto(id: number, datos: Partial<Record<Campo, string>>, actividad?: [string, string]) {
  const fila = limpiar(datos);
  if (typeof fila.nombre === 'string' && !fila.nombre.trim()) delete fila.nombre;
  if (fila.estado !== undefined && !ESTADOS.includes(fila.estado as Estado)) delete fila.estado;
  const columnas = Object.keys(fila) as Campo[];
  if (!columnas.length && !actividad) return;

  const db = sql();
  const [anterior] = (await db`SELECT estado FROM prospectos WHERE id = ${id}`) as { estado: string }[];
  if (!anterior) return;

  const consultas = [];
  if (columnas.length) {
    const params: unknown[] = columnas.map((c) => fila[c]);
    const asignaciones = columnas.map((c, i) => `${c} = $${i + 1}`);
    if (typeof fila.nombre === 'string') {
      params.push(clave(fila.nombre));
      asignaciones.push(`clave = $${params.length}`);
    }
    params.push(id);
    consultas.push(db.query(`UPDATE prospectos SET ${asignaciones.join(', ')}, actualizado = now() WHERE id = $${params.length}`, params));
  }
  if (fila.estado !== undefined && fila.estado !== anterior.estado) {
    consultas.push(db`INSERT INTO actividades (prospecto_id, tipo, detalle) VALUES (${id}, 'estado', ${`${anterior.estado} → ${fila.estado}`})`);
  }
  if (actividad) {
    consultas.push(db`INSERT INTO actividades (prospecto_id, tipo, detalle) VALUES (${id}, ${actividad[0]}, ${actividad[1]})`);
  }
  await db.transaction(consultas);
}

export async function agregarNota(id: number, nota: string) {
  const db = sql();
  await db.transaction([
    db`INSERT INTO actividades (prospecto_id, tipo, detalle) VALUES (${id}, 'nota', ${nota})`,
    db`UPDATE prospectos SET actualizado = now() WHERE id = ${id}`,
  ]);
}

// Igual que db.excluir(): agrega a exclusiones y marca el prospecto como excluido.
export async function excluir(id: number, motivo: string) {
  const p = await obtenerProspecto(id);
  if (!p) return;
  await sql()`
    INSERT INTO exclusiones (clave, nombre, motivo) VALUES (${clave(p.nombre)}, ${p.nombre.trim()}, ${motivo})
    ON CONFLICT (clave) DO UPDATE SET motivo = EXCLUDED.motivo
  `;
  await actualizarProspecto(id, { estado: 'excluido' }, ['nota', motivo ? `Excluido: ${motivo}` : 'Excluido']);
}

export async function guardarContenido(id: number, tipo: TipoContenido, cuerpo: string, asunto: string) {
  const db = sql();
  await db.transaction([
    db`INSERT INTO contenidos (prospecto_id, tipo, asunto, cuerpo, instrucciones, origen) VALUES (${id}, ${tipo}, ${asunto}, ${cuerpo}, '', 'manual')`,
    db`INSERT INTO actividades (prospecto_id, tipo, detalle) VALUES (${id}, 'contenido', ${`Borrador: ${TIPOS_CONTENIDO[tipo]}`})`,
  ]);
}

export async function editarContenido(contenidoId: number, asunto: string, cuerpo: string) {
  await sql()`UPDATE contenidos SET asunto = ${asunto}, cuerpo = ${cuerpo} WHERE id = ${contenidoId}`;
}

// Cada envío del formulario deja una actividad "Formulario web: …" (ver registrarContactoWeb),
// también cuando el negocio ya existía. Esto lista esos envíos, del más reciente al más antiguo.
export type ContactoRecibido = { actividad_id: number; recibido: string; detalle: string; id: number; nombre: string; estado: string; telefono: string; correo: string; fuente: string };

export async function contactosWeb(limite = 200): Promise<ContactoRecibido[]> {
  return (await sql()`
    SELECT a.id AS actividad_id, a.creado AS recibido, a.detalle,
           p.id, p.nombre, p.estado, p.telefono, p.correo, p.fuente
    FROM actividades a JOIN prospectos p ON p.id = a.prospecto_id
    WHERE a.tipo = 'nota' AND a.detalle LIKE 'Formulario web:%'
    ORDER BY a.creado DESC
    LIMIT ${limite}
  `) as ContactoRecibido[];
}

export async function borrarContenido(contenidoId: number) {
  await sql()`DELETE FROM contenidos WHERE id = ${contenidoId}`;
}
