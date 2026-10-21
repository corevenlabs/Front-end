export const SITIO = {
  nombre: 'Corevenlabs',
  url: 'https://www.corevenlabs.com',
  descripcion:
    'Agentes de atención y venta para WhatsApp e Instagram, páginas web, tiendas online, SEO, integraciones y apps móviles para pymes en Chile.',
  whatsapp: '56979242216', // por defecto; el vigente está en web.ajustes
  instagram: 'https://instagram.com/corevenlabs',
  laudus: 'https://laudus.cl/alianzas/coveren-labs/', // ficha de partner en Laudus
  ciudad: 'Santiago',
  pais: 'CL',
  zonaHoraria: 'America/Santiago',
};

export const MENSAJE_WHATSAPP = 'Hola, quiero un agente para mi negocio';

// Enlace interno que redirige a WhatsApp con el número vigente (editable en /admin/sitio).
// SITIO.whatsapp es solo el valor por defecto.
export function enlaceWhatsapp(texto = MENSAJE_WHATSAPP) {
  return texto === MENSAJE_WHATSAPP ? '/whatsapp' : `/whatsapp?texto=${encodeURIComponent(texto)}`;
}

export const MENU = [
  { href: '/demo', texto: 'Demo' },
  { href: '/servicios', texto: 'Servicios' },
  { href: '/#rubros', texto: 'Rubros' },
  { href: '/precios', texto: 'Precios' },
  { href: '/#preguntas', texto: 'Preguntas' },
];
