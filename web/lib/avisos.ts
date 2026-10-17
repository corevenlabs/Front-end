import 'server-only';
import { Resend } from 'resend';
import { SITIO } from '@/content/sitio';
import type { ContactoWeb, ResultadoContacto } from './crm';

export function hayResend() {
  return Boolean(process.env.RESEND_API_KEY);
}

function esc(t: string) {
  return t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

// Correo interno: "llegó un contacto nuevo". Va a AVISOS_PARA (corevenlabs@gmail.com).
export async function avisarContacto(c: ContactoWeb, r: ResultadoContacto | null) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const para = process.env.AVISOS_PARA || 'corevenlabs@gmail.com';
  const desde = process.env.AVISOS_DESDE || 'onboarding@resend.dev';

  const estado = !r
    ? 'No se pudo guardar en el CRM: revisa la base de datos.'
    : r.excluido
      ? 'Ojo: este negocio está en exclusiones, no se creó como prospecto.'
      : r.nuevo
        ? 'Quedó como prospecto nuevo en el CRM.'
        : 'El negocio ya existía en el CRM; se agregó una nota.';
  const ficha = r?.id ? `${SITIO.url}/admin/prospectos/${r.id}` : null;
  const whatsapp = c.telefono ? `https://wa.me/${c.telefono.replace(/\D/g, '')}` : null;

  const filas: [string, string][] = [
    ['Nombre', c.nombre],
    ['Negocio', c.negocio],
    ['WhatsApp', c.telefono],
    ['Correo', c.correo],
    ['Mensaje', c.mensaje || '(sin mensaje)'],
  ];
  const texto = [
    `Nuevo contacto desde corevenlabs.com`,
    '',
    ...filas.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    '',
    estado,
    ficha ? `Ficha: ${ficha}` : '',
    whatsapp ? `Responder por WhatsApp: ${whatsapp}` : '',
  ].join('\n');

  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0a0a0a;max-width:560px">
  <p style="font-size:18px;font-weight:bold;margin:0 0 16px">Nuevo contacto desde la web</p>
  <table style="border-collapse:collapse;width:100%">
    ${filas.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:8px 12px 8px 0;color:#5b6270;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:8px 0;white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}
  </table>
  <p style="margin:16px 0;color:#5b6270">${esc(estado)}</p>
  ${whatsapp ? `<p><a href="${whatsapp}" style="background:#1f64d1;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold">Responder por WhatsApp</a></p>` : ''}
  ${ficha ? `<p><a href="${ficha}" style="color:#1f64d1">Abrir la ficha en el admin</a></p>` : ''}
</div>`;

  const { error } = await resend.emails.send({
    from: `Corevenlabs <${desde}>`,
    to: para,
    subject: `Nuevo contacto web: ${c.negocio}`,
    text: texto,
    html,
    ...(c.correo ? { replyTo: c.correo } : {}),
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}
