// Servicios de Corevenlabs. Los precios viven en content/precios.ts y se editan en /admin/precios.
import type { NombreIcono } from '@/components/Iconos';

export type Servicio = {
  slug: string;
  nombre: string;
  icono: NombreIcono;
  resumen: string;
  titulo: string;
  bajada: string;
  incluye: string[];
  ideal: string;
  notaPrecio?: string;
};

export const SERVICIOS: Servicio[] = [
  {
    slug: 'agentes-whatsapp',
    nombre: 'Agentes de WhatsApp e Instagram',
    icono: 'chat',
    resumen: 'Responden al instante, toman pedidos, cotizan y agendan',
    titulo: 'Agentes de atención y venta para WhatsApp e Instagram',
    bajada: 'Tus clientes escriben a cualquier hora y le compran al que contesta primero. El agente responde lo repetido al instante y te pasa lo importante.',
    incluye: [
      'Agente entrenado con tu carta o catálogo, precios, horarios y políticas',
      'Conexión con WhatsApp Business (API oficial de Meta) e Instagram',
      'Toma de pedidos, cotizaciones y agenda',
      'Aviso a tu celular cuando algo necesita tu criterio',
      'Pruebas con las preguntas reales de tus clientes antes de publicarlo',
    ],
    ideal: 'Negocios que reciben muchas consultas repetidas por mensaje, sobre todo fuera de horario.',
  },
  {
    slug: 'paginas-web',
    nombre: 'Páginas web',
    icono: 'web',
    resumen: 'Sitios rápidos, claros y pensados para que te escriban',
    titulo: 'Páginas web para pymes',
    bajada: 'Una web que carga rápido en el celular, explica bien lo que vendes y lleva a la gente a escribirte o comprarte.',
    incluye: [
      'Diseño a medida con tu marca, sin plantillas genéricas',
      'Adaptada primero al celular',
      'Botón de WhatsApp y formulario de contacto',
      'SEO técnico básico: títulos, descripciones, velocidad y datos para Google',
      'Publicación en tu dominio',
    ],
    ideal: 'Negocios sin web o con una web antigua que no trae consultas.',
  },
  {
    slug: 'landing-pages',
    nombre: 'Landing pages',
    icono: 'landing',
    resumen: 'Una página enfocada en una campaña o un producto',
    titulo: 'Landing pages para campañas',
    bajada: 'Una sola página con un solo objetivo: que la persona que llega desde un anuncio te deje sus datos o te escriba.',
    incluye: [
      'Texto y diseño pensados para un objetivo concreto',
      'Formulario o botón de WhatsApp conectado',
      'Medición lista para Google Ads, Meta y Google Analytics',
      'Contactos que llegan a tu correo o a tu sistema',
      'Ajustes después del lanzamiento según los resultados',
    ],
    ideal: 'Campañas de publicidad, lanzamientos y promociones con fecha.',
  },
  {
    slug: 'tiendas-online',
    nombre: 'Tiendas online',
    icono: 'carro',
    resumen: 'Ecommerce con Webpay, despacho y stock',
    titulo: 'Tiendas online y ecommerce',
    bajada: 'Vende las 24 horas con una tienda propia: catálogo, carrito, pago con Webpay o Mercado Pago y despacho por comuna.',
    incluye: [
      'Catálogo, carrito y pago con Webpay, Mercado Pago o transferencia',
      'Despacho por comuna y retiro en tienda',
      'Panel para manejar productos, precios, stock y pedidos',
      'Fichas de producto preparadas para aparecer en Google',
      'Capacitación para administrarla',
    ],
    ideal: 'Negocios que ya venden por mensaje o en local y quieren vender en línea sin depender de un marketplace.',
  },
  {
    slug: 'seo',
    nombre: 'SEO',
    icono: 'lupa',
    resumen: 'Que te encuentren en Google cuando te buscan',
    titulo: 'SEO: posicionamiento en Google',
    bajada: 'Trabajamos tu web y tu ficha de Google para que aparezcas cuando alguien busca lo que vendes en tu comuna.',
    incluye: [
      'Revisión técnica: velocidad, errores, estructura e indexación',
      'Investigación de búsquedas reales de tus clientes',
      'Textos y páginas optimizadas para esas búsquedas',
      'Ficha de Google Business Profile',
      'Informe mensual con lo que cambió y lo que viene',
    ],
    ideal: 'Negocios con web que no aparecen en Google o dependen solo de publicidad pagada.',
    notaPrecio: 'Los resultados en Google toman meses; te explicamos qué esperar antes de partir.',
  },
  {
    slug: 'integraciones',
    nombre: 'Integraciones y automatización',
    icono: 'conexion',
    resumen: 'Que tus sistemas se hablen y el trabajo repetido se haga solo',
    titulo: 'Integraciones y automatización de procesos',
    bajada: 'Conectamos tus herramientas (ERP, tienda, facturación, planillas, WhatsApp) para que la información se mueva sola y dejes de copiar y pegar.',
    incluye: [
      'Revisión de cómo se mueve la información hoy en tu negocio',
      'Conexiones por API entre tus sistemas, incluido Laudus ERP',
      'Automatización de pedidos, cotizaciones, inventario y agenda',
      'Reportes automáticos en vez de planillas hechas a mano',
      'Soporte si algo cambia en tus sistemas',
    ],
    ideal: 'Equipos que pierden horas pasando datos de un sistema a otro.',
  },
  {
    slug: 'aplicaciones-moviles',
    nombre: 'Aplicaciones móviles',
    icono: 'app',
    resumen: 'Apps para iOS y Android con React Native',
    titulo: 'Aplicaciones móviles para iOS y Android',
    bajada: 'Llevamos años haciendo apps en React Native: una sola base de código para iPhone y Android, conectada a tus sistemas.',
    incluye: [
      'Diseño de la experiencia pensado en tus usuarios',
      'App para iOS y Android con una sola base de código',
      'Conexión con tus sistemas por API y notificaciones',
      'Publicación en App Store y Google Play a nombre de tu empresa',
      'Mantención y mejoras después del lanzamiento',
    ],
    ideal: 'Empresas que necesitan que sus clientes o su equipo hagan algo seguido desde el celular.',
  },
];

export function servicioPorSlug(slug: string) {
  return SERVICIOS.find((s) => s.slug === slug);
}
