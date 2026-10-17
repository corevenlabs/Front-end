export const SITIO = {
  nombre: 'Corevenlabs',
  url: 'https://www.corevenlabs.com',
  descripcion:
    'Agentes de atención y venta para WhatsApp e Instagram, páginas web, tiendas online, SEO, integraciones y apps móviles para pymes en Chile.',
  whatsapp: '56979242216',
  instagram: 'https://instagram.com/corevenlabs',
  ciudad: 'Santiago',
  pais: 'CL',
  zonaHoraria: 'America/Santiago',
};

export function enlaceWhatsapp(texto = 'Hola, quiero un agente para mi negocio') {
  return `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export const MENU = [
  { href: '/demo', texto: 'Demo' },
  { href: '/servicios', texto: 'Servicios' },
  { href: '/#rubros', texto: 'Rubros' },
  { href: '/precios', texto: 'Precios' },
  { href: '/#preguntas', texto: 'Preguntas' },
];
