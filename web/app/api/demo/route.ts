import { NextResponse } from 'next/server';
import { rubroPorSlug } from '@/content/rubros';
import { respuestaSinIA } from '@/lib/demo';
import { hayLlave, responder, type Turno } from '@/lib/agente';
import { ipDe, mismoOrigen, registrarUso } from '@/lib/limites';

const MAX_CARACTERES = 300;
const MAX_TURNOS_ENVIADOS = 12; // contexto que mandamos al modelo
const MAX_TURNOS_CONVERSACION = 30; // largo máximo de una conversación de prueba

function json(datos: object, status = 200) {
  return NextResponse.json(datos, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: Request) {
  if (!mismoOrigen(req)) return json({ error: 'Origen no permitido.' }, 403);

  const cuerpo = await req.json().catch(() => null);
  const rubro = typeof cuerpo?.rubro === 'string' ? rubroPorSlug(cuerpo.rubro) : undefined;
  const crudos: unknown[] = Array.isArray(cuerpo?.mensajes) ? cuerpo.mensajes : [];
  const historial: Turno[] = crudos
    .filter((m): m is Turno => !!m && typeof m === 'object' && ((m as Turno).de === 'cliente' || (m as Turno).de === 'agente') && typeof (m as Turno).texto === 'string')
    .map((m) => ({ de: m.de, texto: m.texto.trim().slice(0, MAX_CARACTERES) }))
    .filter((m) => m.texto);

  const ultimo = historial.at(-1);
  if (!rubro?.enDemo || ultimo?.de !== 'cliente') return json({ error: 'Solicitud no válida.' }, 400);

  if (historial.length > MAX_TURNOS_CONVERSACION) {
    return json({ respuesta: 'Esta conversación de prueba llegó a su largo máximo. Cambie de negocio o recargue la página para empezar otra.' });
  }

  // Sin llave de Anthropic (por ejemplo en local): solo preguntas sugeridas.
  if (!hayLlave()) {
    return json({ respuesta: respuestaSinIA(rubro.slug, ultimo.texto) ?? 'La demo con IA no está activa en este momento. Pruebe con las preguntas sugeridas.' });
  }

  const limite = await registrarUso('demo', ipDe(req)).catch((e) => {
    console.error('[demo] No se pudo registrar el uso:', e);
    return 'global' as const; // si la base falla, no gastamos IA a ciegas
  });
  if (limite === 'visitante') {
    return json({ error: 'Alcanzó el límite de mensajes de la demo por hoy. Si quiere seguir conversando, escríbanos por WhatsApp.' }, 429);
  }
  if (limite === 'global') {
    const sugerida = respuestaSinIA(rubro.slug, ultimo.texto);
    return json({ respuesta: sugerida ?? 'La demo llegó a su límite de mensajes por hoy. Puede probar las preguntas sugeridas o volver mañana.' });
  }

  // El modelo debe recibir una conversación que empiece por el cliente.
  let contexto = historial.slice(-MAX_TURNOS_ENVIADOS);
  while (contexto[0]?.de === 'agente') contexto = contexto.slice(1);

  const hora = new Intl.DateTimeFormat('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  const r = await responder(rubro, contexto, hora);

  if (r.ok) return json({ respuesta: r.texto });
  if (r.motivo === 'rechazo') return json({ respuesta: 'Eso no lo puedo responder. ¿Te ayudo con algo del negocio?' });
  const sugerida = respuestaSinIA(rubro.slug, ultimo.texto);
  if (sugerida) return json({ respuesta: sugerida });
  return json(
    { error: r.motivo === 'saturado' ? 'El agente está con mucha demanda. Intente de nuevo en unos segundos.' : 'No pude responder ahora. Intente de nuevo en un momento.' },
    503,
  );
}
