// Templates de propuestas comerciales, uno por servicio. Son el punto de partida: todo se puede
// editar en cada propuesta antes de generar el PDF. Los montos salen de los precios vigentes
// (/admin/precios); si el precio es «al mes» va como cobro mensual, si no, como pago único.
// El detalle fino del alcance va en el acuerdo de servicios, no aquí: textos cortos.
import type { Prospecto } from '@/lib/crm';
import type { Cargo, DatosPropuesta } from '@/lib/propuesta';
import type { ClavePrecio, MapaPrecios } from './precios';

type CargoBase = { precio?: ClavePrecio; descripcion: string };

export type Plantilla = {
  slug: string;
  nombre: string;
  titulo: string;
  descripcion: string;
  incluye: string[];
  cargos: CargoBase[];
};

export const PLANTILLAS: Plantilla[] = [
  {
    slug: 'agentes-whatsapp',
    nombre: 'Agente de WhatsApp e Instagram',
    titulo: 'Agente de atención y venta para WhatsApp e Instagram',
    descripcion: 'Un agente que responde al instante las consultas de los clientes, toma pedidos, cotiza y agenda, y deriva al equipo lo que necesita criterio humano.',
    incluye: [
      'Levantamiento de la carta o catálogo, precios, horarios y políticas del negocio',
      'Agente entrenado con esa información y probado con preguntas reales de clientes',
      'Conexión con WhatsApp Business (API oficial de Meta) e Instagram',
      'Toma de pedidos, cotizaciones y agenda',
      'Aviso al equipo cuando una conversación necesita atención humana',
      'Capacitación para el equipo',
    ],
    cargos: [
      { precio: 'agente-implementacion', descripcion: 'Implementación del agente' },
      { precio: 'agente-mensualidad', descripcion: 'Mensualidad: uso de la IA y mensajería, cambios de información y ajustes' },
    ],
  },
  {
    slug: 'paginas-web',
    nombre: 'Página web',
    titulo: 'Desarrollo de página web',
    descripcion: 'Un sitio rápido, adaptado al celular y pensado para que los visitantes escriban o compren.',
    incluye: [
      'Diseño a medida con la identidad de la marca',
      'Sitio adaptado primero al celular',
      'Botón de WhatsApp y formulario de contacto',
      'SEO técnico básico: títulos, descripciones, velocidad y datos para Google',
      'Publicación en el dominio del cliente',
      'Capacitación para actualizar contenidos',
    ],
    cargos: [{ precio: 'paginas-web', descripcion: 'Diseño y desarrollo de la página web' }],
  },
  {
    slug: 'landing-pages',
    nombre: 'Landing page',
    titulo: 'Landing page para campaña',
    descripcion: 'Una página con un solo objetivo: que quien llega desde un anuncio deje sus datos o escriba.',
    incluye: [
      'Texto y diseño pensados para el objetivo de la campaña',
      'Formulario o botón de WhatsApp conectado',
      'Medición lista para Google Ads, Meta y Google Analytics',
      'Contactos que llegan al correo o al sistema del cliente',
      'Ajustes después del lanzamiento según los resultados',
    ],
    cargos: [{ precio: 'landing-pages', descripcion: 'Diseño y desarrollo de la landing page' }],
  },
  {
    slug: 'tiendas-online',
    nombre: 'Tienda online',
    titulo: 'Tienda online',
    descripcion: 'Una tienda propia para vender las 24 horas: catálogo, carrito, pago en línea y despacho.',
    incluye: [
      'Catálogo, carrito y pago con Webpay, Mercado Pago o transferencia',
      'Despacho por comuna y retiro en tienda',
      'Panel para manejar productos, precios, stock y pedidos',
      'Fichas de producto preparadas para aparecer en Google',
      'Capacitación para administrarla',
    ],
    cargos: [{ precio: 'tiendas-online', descripcion: 'Diseño y desarrollo de la tienda online' }],
  },
  {
    slug: 'seo',
    nombre: 'SEO',
    titulo: 'Posicionamiento en Google (SEO)',
    descripcion: 'Trabajo sobre el sitio y la ficha de Google para aparecer cuando los clientes buscan lo que el negocio vende.',
    incluye: [
      'Revisión técnica: velocidad, errores, estructura e indexación',
      'Investigación de las búsquedas reales de los clientes',
      'Textos y páginas optimizadas para esas búsquedas',
      'Ficha de Google Business Profile',
      'Informe mensual de avances',
    ],
    cargos: [{ precio: 'seo', descripcion: 'Servicio mensual de SEO' }],
  },
  {
    slug: 'integraciones',
    nombre: 'Integraciones y automatización',
    titulo: 'Integración y automatización de procesos',
    descripcion: 'Conexión entre los sistemas del negocio para que la información se mueva sola y el trabajo repetido se haga sin intervención.',
    incluye: [
      'Revisión de cómo se mueve la información hoy',
      'Conexiones por API entre los sistemas, incluido Laudus ERP',
      'Automatización de los procesos acordados',
      'Reportes automáticos en lugar de planillas manuales',
      'Pruebas y puesta en marcha',
    ],
    cargos: [{ precio: 'integraciones', descripcion: 'Desarrollo de la integración' }],
  },
  {
    slug: 'aplicaciones-moviles',
    nombre: 'Aplicación móvil',
    titulo: 'Aplicación móvil para iOS y Android',
    descripcion: 'Una app con una sola base de código para iPhone y Android, conectada a los sistemas del negocio.',
    incluye: [
      'Diseño de la experiencia pensado en los usuarios',
      'App para iOS y Android con React Native',
      'Conexión con los sistemas del cliente por API y notificaciones',
      'Publicación en App Store y Google Play a nombre de la empresa',
    ],
    cargos: [{ precio: 'aplicaciones-moviles', descripcion: 'Diseño y desarrollo de la aplicación' }],
  },
  {
    slug: 'a-medida',
    nombre: 'Proyecto a medida',
    titulo: '',
    descripcion: '',
    incluye: [],
    cargos: [{ descripcion: '' }],
  },
];

export function plantillaPorSlug(slug: string) {
  return PLANTILLAS.find((p) => p.slug === slug);
}

// prospecting-bot y el formulario web guardan la persona de contacto en las notas («Contacto: Ana»).
function contactoDeNotas(notas: string) {
  return notas.match(/Contacto:\s*([^\n;]+)/i)?.[1].trim() ?? '';
}

export function propuestaInicial(pl: Plantilla, precios: MapaPrecios, p: Prospecto | null): DatosPropuesta {
  const cargos: Cargo[] = [];
  let mensual: Cargo | null = null;
  for (const c of pl.cargos) {
    const precio = c.precio ? precios[c.precio] : null;
    const cargo = { descripcion: c.descripcion, monto: precio?.desde ?? null };
    if (precio?.periodo === 'al mes' && !mensual) mensual = cargo;
    else cargos.push(cargo);
  }
  return {
    plantilla: pl.slug,
    titulo: pl.titulo,
    descripcion: pl.descripcion,
    cliente: {
      nombre: p?.nombre ?? '',
      razonSocial: '',
      rut: '',
      contacto: p ? contactoDeNotas(p.notas) : '',
      correo: p?.correo ?? '',
      telefono: p?.telefono ?? '',
      comuna: p?.comuna ?? '',
    },
    incluye: [...pl.incluye],
    cargos,
    mensual,
    pago: { tipo: 'mitades', cuotas: 3, texto: '' },
    plazo: '',
    notas: '',
  };
}
