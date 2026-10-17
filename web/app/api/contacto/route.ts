import { NextResponse } from 'next/server';
import { normalizarTelefono, tipoContacto, validar, type DatosContacto } from '@/lib/contacto';
import { hayBase } from '@/lib/db';
import { registrarContactoWeb, type ContactoWeb, type ResultadoContacto } from '@/lib/crm';
import { avisarContacto, hayResend } from '@/lib/avisos';
import { ipDe, mismoOrigen, registrarUso } from '@/lib/limites';

const SEGUNDOS_MINIMOS = 3; // una persona no llena el formulario en menos de esto

function json(datos: object, status = 200) {
  return NextResponse.json(datos, { status, headers: { 'Cache-Control': 'no-store' } });
}

const ERROR_GENERAL = 'No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp.';

export async function POST(req: Request) {
  if (!mismoOrigen(req)) return json({ error: 'Origen no permitido.' }, 403);

  const cuerpo = await req.json().catch(() => null);
  if (!cuerpo || typeof cuerpo !== 'object') return json({ error: 'Solicitud no válida.' }, 400);

  // Bots: campo trampa lleno o enviado demasiado rápido. Respondemos "ok" sin guardar nada.
  const trampa = typeof cuerpo.sitio_web === 'string' && cuerpo.sitio_web.trim();
  const segundos = Number(cuerpo.t) / 1000;
  if (trampa || !Number.isFinite(segundos) || segundos < SEGUNDOS_MINIMOS) return json({ ok: true });

  const datos: DatosContacto = {
    nombre: String(cuerpo.nombre ?? '').trim(),
    negocio: String(cuerpo.negocio ?? '').trim(),
    contacto: String(cuerpo.contacto ?? '').trim(),
    mensaje: String(cuerpo.mensaje ?? '').trim(),
    acepta: cuerpo.acepta === true,
  };
  const errores = validar(datos);
  if (Object.keys(errores).length) return json({ error: 'Revisa los campos marcados.', errores }, 422);

  const limite = await registrarUso('contacto', ipDe(req)).catch((e) => {
    console.error('[contacto] No se pudo registrar el uso:', e);
    return 'ok' as const; // un contacto real vale más que un límite caído
  });
  if (limite !== 'ok') {
    return json({ error: 'Recibimos varios mensajes desde tu conexión hoy. Escríbenos por WhatsApp y te respondemos ahí.' }, 429);
  }

  const esCorreo = tipoContacto(datos.contacto) === 'correo';
  const contacto: ContactoWeb = {
    nombre: datos.nombre,
    negocio: datos.negocio,
    telefono: esCorreo ? '' : normalizarTelefono(datos.contacto) ?? '',
    correo: esCorreo ? datos.contacto.toLowerCase() : '',
    mensaje: datos.mensaje,
  };

  if (!hayBase() && !hayResend()) {
    if (process.env.NODE_ENV === 'production') return json({ error: ERROR_GENERAL }, 503);
    console.info('[contacto] Sin DATABASE_URL ni RESEND_API_KEY; en local solo se muestra aquí:', contacto);
    return json({ ok: true });
  }

  // Guardar en el CRM y avisar son independientes: si una falla, la otra igual se intenta.
  let resultado: ResultadoContacto | null = null;
  let guardado = false;
  if (hayBase()) {
    try {
      resultado = await registrarContactoWeb(contacto);
      guardado = true;
    } catch (e) {
      console.error('[contacto] No se pudo guardar en el CRM:', e);
    }
  }

  let avisado = false;
  if (hayResend()) {
    try {
      await avisarContacto(contacto, resultado);
      avisado = true;
    } catch (e) {
      console.error('[contacto] No se pudo enviar el aviso:', e);
    }
  }

  if (!guardado && !avisado) return json({ error: ERROR_GENERAL }, 500);
  return json({ ok: true });
}
