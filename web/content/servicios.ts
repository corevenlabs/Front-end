// Servicios de Corevenlabs. Los precios viven en content/precios.ts y se editan en /admin/precios.
import type { NombreIcono } from '@/components/Iconos';

export type Servicio = {
  slug: string;
  nombre: string;
  icono: NombreIcono;
  resumen: string;
  titulo: string;
  tituloSeo?: string; // título para Google cuando «titulo» es muy largo (máx. ~45 caracteres)
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
    tituloSeo: 'Chatbot de WhatsApp con IA para empresas',
    bajada: 'Los clientes escriben a cualquier hora y le compran al que contesta primero. Un chatbot con inteligencia artificial responde lo repetido al instante y deriva al equipo lo importante.',
    incluye: [
      'Agente entrenado con la carta o el catálogo, los precios, horarios y políticas del negocio',
      'Conexión con WhatsApp Business (API oficial de Meta) e Instagram',
      'Toma de pedidos, cotizaciones y agenda',
      'Aviso al celular del equipo cuando una conversación requiere criterio humano',
      'Pruebas con preguntas reales de clientes antes de publicarlo',
    ],
    ideal: 'Negocios que reciben muchas consultas repetidas por mensaje, sobre todo fuera de horario.',
  },
  {
    slug: 'paginas-web',
    nombre: 'Páginas web',
    icono: 'web',
    resumen: 'Sitios rápidos, claros y pensados para recibir consultas',
    titulo: 'Páginas web para pymes',
    bajada: 'Un sitio que carga rápido en el celular, explica con claridad lo que vende el negocio y lleva a los visitantes a escribir o comprar.',
    incluye: [
      'Diseño a medida con la identidad de la marca, sin plantillas genéricas',
      'Adaptada primero al celular',
      'Botón de WhatsApp y formulario de contacto',
      'SEO técnico básico: títulos, descripciones, velocidad y datos para Google',
      'Publicación en el dominio propio del negocio',
    ],
    ideal: 'Negocios sin web o con una web antigua que no trae consultas.',
  },
  {
    slug: 'landing-pages',
    nombre: 'Landing pages',
    icono: 'landing',
    resumen: 'Una página enfocada en una campaña o un producto',
    titulo: 'Landing pages para campañas',
    bajada: 'Una sola página con un solo objetivo: que la persona que llega desde un anuncio deje sus datos o escriba.',
    incluye: [
      'Texto y diseño pensados para un objetivo concreto',
      'Formulario o botón de WhatsApp conectado',
      'Medición lista para Google Ads, Meta y Google Analytics',
      'Contactos que llegan directo al correo o al sistema de la empresa',
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
    bajada: 'Ventas las 24 horas con una tienda propia: catálogo, carrito, pago con Webpay o Mercado Pago y despacho por comuna.',
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
    resumen: 'Aparecer en Google cuando los clientes buscan',
    titulo: 'SEO: posicionamiento en Google',
    bajada: 'Trabajamos el sitio y la ficha de Google para que el negocio aparezca cuando alguien busca lo que vende en su comuna.',
    incluye: [
      'Revisión técnica: velocidad, errores, estructura e indexación',
      'Investigación de las búsquedas reales de los clientes',
      'Textos y páginas optimizadas para esas búsquedas',
      'Ficha de Google Business Profile',
      'Informe mensual con lo que cambió y lo que viene',
    ],
    ideal: 'Negocios con web que no aparecen en Google o dependen solo de publicidad pagada.',
    notaPrecio: 'Los resultados en Google toman meses; antes de partir explicamos qué esperar y en qué plazos.',
  },
  {
    slug: 'integraciones',
    nombre: 'Integraciones y automatización',
    icono: 'conexion',
    resumen: 'Sistemas conectados y trabajo repetido automatizado',
    titulo: 'Integraciones y automatización de procesos',
    bajada: 'Conectamos las herramientas de la empresa (ERP, tienda, facturación, planillas, WhatsApp) para que la información se mueva sola y nadie tenga que copiar y pegar.',
    incluye: [
      'Revisión de cómo se mueve hoy la información en la empresa',
      'Conexiones por API entre los sistemas, incluido Laudus ERP',
      'Automatización de pedidos, cotizaciones, inventario y agenda',
      'Reportes automáticos en vez de planillas hechas a mano',
      'Soporte cuando cambian los sistemas conectados',
    ],
    ideal: 'Equipos que pierden horas pasando datos de un sistema a otro.',
  },
  {
    slug: 'aplicaciones-moviles',
    nombre: 'Aplicaciones móviles',
    icono: 'app',
    resumen: 'Apps para iOS y Android con React Native',
    titulo: 'Aplicaciones móviles para iOS y Android',
    bajada: 'Llevamos años haciendo apps en React Native: una sola base de código para iPhone y Android, conectada a los sistemas de la empresa.',
    incluye: [
      'Diseño de la experiencia pensado en los usuarios',
      'App para iOS y Android con una sola base de código',
      'Conexión con los sistemas de la empresa por API y notificaciones',
      'Publicación en App Store y Google Play a nombre de la empresa',
      'Mantención y mejoras después del lanzamiento',
    ],
    ideal: 'Empresas que necesitan que sus clientes o su equipo hagan algo seguido desde el celular.',
  },
];

export function servicioPorSlug(slug: string) {
  return SERVICIOS.find((s) => s.slug === slug);
}
