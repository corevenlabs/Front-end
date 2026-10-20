'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { exigirAdmin } from '@/lib/admin';
import { sql } from '@/lib/db';
import {
  CAMPOS, ESTADOS, TIPOS_CONTENIDO, actualizarProspecto, agregarNota, borrarContenido, editarContenido,
  excluir, guardarContenido, obtenerProspecto, type Campo, type Estado, type TipoContenido,
} from '@/lib/crm';
import { CLAVES_PRECIO } from '@/content/precios';
import { plantillaPorSlug } from '@/content/plantillas-propuesta';
import { crearPropuesta as guardarPropuesta, sanear } from '@/lib/propuestas';
import { pesos, totales } from '@/lib/propuesta';
import {
  borrarPregunta, crearPregunta, editarPregunta, guardarWhatsapp, moverPregunta, normalizarWhatsapp, sembrarPreguntas,
} from '@/lib/ajustes';

// Cada acción verifica la sesión: el proxy no basta por sí solo.

function idDe(form: FormData) {
  const id = Number(form.get('id'));
  if (!Number.isInteger(id) || id <= 0) throw new Error('id inválido');
  return id;
}

function texto(form: FormData, campo: string, max = 5000) {
  return String(form.get(campo) ?? '').slice(0, max);
}

function volver(id: number, aviso: string, ancla = ''): never {
  revalidatePath(`/admin/prospectos/${id}`);
  revalidatePath('/admin');
  redirect(`/admin/prospectos/${id}?ok=${aviso}${ancla}`);
}

export async function cambiarEstado(form: FormData) {
  await exigirAdmin();
  const id = idDe(form);
  const estado = texto(form, 'estado');
  if (ESTADOS.includes(estado as Estado)) await actualizarProspecto(id, { estado });
  volver(id, 'estado');
}

export async function nuevaNota(form: FormData) {
  await exigirAdmin();
  const id = idDe(form);
  const nota = texto(form, 'nota').trim();
  if (nota) await agregarNota(id, nota);
  volver(id, 'nota', '#historial');
}

export async function guardarDatos(form: FormData) {
  await exigirAdmin();
  const id = idDe(form);
  const datos: Partial<Record<Campo, string>> = {};
  for (const c of CAMPOS) {
    if (c === 'estado') continue; // el estado se cambia aparte, para que quede en el historial
    const v = form.get(c);
    if (typeof v === 'string') datos[c] = v.slice(0, 5000);
  }
  await actualizarProspecto(id, datos);
  volver(id, 'datos');
}

export async function noContactar(form: FormData) {
  await exigirAdmin();
  const id = idDe(form);
  await excluir(id, texto(form, 'motivo', 300).trim());
  volver(id, 'excluido');
}

export async function nuevoBorrador(form: FormData) {
  await exigirAdmin();
  const id = idDe(form);
  const tipo = texto(form, 'tipo') as TipoContenido;
  const cuerpo = texto(form, 'cuerpo', 20000).trim();
  if (tipo in TIPOS_CONTENIDO && cuerpo) await guardarContenido(id, tipo, cuerpo, texto(form, 'asunto', 300).trim());
  volver(id, 'borrador', '#borradores');
}

export async function editarBorrador(form: FormData) {
  await exigirAdmin();
  const id = idDe(form);
  const contenidoId = Number(form.get('contenido_id'));
  const cuerpo = texto(form, 'cuerpo', 20000).trim();
  if (Number.isInteger(contenidoId) && cuerpo) await editarContenido(contenidoId, texto(form, 'asunto', 300).trim(), cuerpo);
  volver(id, 'borrador', '#borradores');
}

export async function borrarBorrador(form: FormData) {
  await exigirAdmin();
  const id = idDe(form);
  const contenidoId = Number(form.get('contenido_id'));
  if (Number.isInteger(contenidoId)) await borrarContenido(contenidoId);
  volver(id, 'borrado', '#borradores');
}

export async function guardarPrecios(form: FormData) {
  await exigirAdmin();
  const db = sql();
  const consultas = [];
  for (const clave of CLAVES_PRECIO) {
    const crudo = texto(form, `desde_${clave}`, 20).replace(/[^\d]/g, '');
    const desde = crudo ? Math.min(Number(crudo), 1_000_000_000) : null;
    const periodo = texto(form, `periodo_${clave}`, 40).trim() || 'pago único';
    consultas.push(db`
      INSERT INTO web.precios (clave, desde, periodo) VALUES (${clave}, ${desde}, ${periodo})
      ON CONFLICT (clave) DO UPDATE SET desde = EXCLUDED.desde, periodo = EXCLUDED.periodo, actualizado = now()
    `);
  }
  await db.transaction(consultas);
  revalidatePath('/', 'layout'); // regenera las páginas públicas con los precios nuevos
  redirect('/admin/precios?ok=1');
}

// Estados en los que, al enviar una propuesta, tiene sentido pasar el prospecto a «propuesta».
const ANTES_DE_PROPUESTA = new Set<string>(['nuevo', 'para revisar', 'contactado', 'reunión']);

export async function crearPropuesta(form: FormData) {
  await exigirAdmin();
  let crudo: unknown;
  try {
    crudo = JSON.parse(texto(form, 'datos', 60000));
  } catch {
    throw new Error('Datos de la propuesta inválidos');
  }
  const datos = sanear(crudo);
  if (!datos || !plantillaPorSlug(datos.plantilla)) throw new Error('Datos de la propuesta inválidos');

  const idProspecto = Number(form.get('prospecto_id'));
  const prospecto = Number.isInteger(idProspecto) && idProspecto > 0 ? await obtenerProspecto(idProspecto) : null;
  const propuesta = await guardarPropuesta(datos, prospecto?.id ?? null);

  if (prospecto) {
    const t = totales(datos);
    const montos = [
      t.unico.neto ? `${pesos(t.unico.total)} IVA incluido` : '',
      t.mensual ? `${pesos(t.mensual.neto)} + IVA al mes` : '',
    ].filter(Boolean).join(' y ');
    const nota = `Propuesta ${propuesta.numero}: ${datos.titulo || plantillaPorSlug(datos.plantilla)!.nombre}${montos ? ` · ${montos}` : ''}. Vence el ${propuesta.vence.split('-').reverse().join('-')}.`;
    if (form.get('mover_estado') && ANTES_DE_PROPUESTA.has(prospecto.estado)) {
      await actualizarProspecto(prospecto.id, { estado: 'propuesta' }, ['nota', nota]);
    } else {
      await agregarNota(prospecto.id, nota);
    }
    revalidatePath(`/admin/prospectos/${prospecto.id}`);
    revalidatePath('/admin');
  }
  revalidatePath('/admin/propuestas');
  redirect(`/admin/propuestas/${propuesta.id}?nueva=1`);
}

// --- Sitio: WhatsApp y preguntas frecuentes (/admin/sitio) ---

function volverSitio(aviso: string, ancla = ''): never {
  revalidatePath('/', 'layout'); // regenera las páginas públicas
  redirect(`/admin/sitio?ok=${aviso}${ancla}`);
}

export async function guardarWhatsappSitio(form: FormData) {
  await exigirAdmin();
  const numero = normalizarWhatsapp(texto(form, 'whatsapp', 40));
  if (!numero) redirect('/admin/sitio?error=whatsapp');
  await guardarWhatsapp(numero);
  volverSitio('whatsapp');
}

function datosPregunta(form: FormData) {
  return { pregunta: texto(form, 'pregunta', 300).trim(), respuesta: texto(form, 'respuesta', 2000).trim() };
}

export async function nuevaPregunta(form: FormData) {
  await exigirAdmin();
  const { pregunta, respuesta } = datosPregunta(form);
  if (pregunta && respuesta) await crearPregunta(pregunta, respuesta);
  volverSitio('pregunta', '#preguntas');
}

export async function guardarPregunta(form: FormData) {
  await exigirAdmin();
  const id = idDe(form);
  const { pregunta, respuesta } = datosPregunta(form);
  if (pregunta && respuesta) await editarPregunta(id, pregunta, respuesta, form.get('visible') === 'on');
  volverSitio('pregunta', '#preguntas');
}

export async function quitarPregunta(form: FormData) {
  await exigirAdmin();
  await borrarPregunta(idDe(form));
  volverSitio('borrada', '#preguntas');
}

export async function ordenarPregunta(form: FormData) {
  await exigirAdmin();
  await moverPregunta(idDe(form), form.get('direccion') === 'subir' ? 'subir' : 'bajar');
  volverSitio('orden', '#preguntas');
}

export async function editarPreguntasActuales() {
  await exigirAdmin();
  await sembrarPreguntas();
  volverSitio('copiadas', '#preguntas');
}
