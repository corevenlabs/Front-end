// Precios "desde" por defecto. Los valores vigentes se editan en /admin/precios (tabla web.precios)
// y sobrescriben estos. desde null = "A cotizar".
export type Precio = { desde: number | null; periodo: string };
export type ClavePrecio = keyof typeof PRECIOS_BASE;
export type MapaPrecios = Record<ClavePrecio, Precio>;

export const PRECIOS_BASE = {
  'agente-implementacion': { nombre: 'Agente: implementación', desde: 390000, periodo: 'pago único' },
  'agente-mensualidad': { nombre: 'Agente: mensualidad', desde: 79000, periodo: 'al mes' },
  'paginas-web': { nombre: 'Páginas web', desde: 120000, periodo: 'pago único' },
  'landing-pages': { nombre: 'Landing pages', desde: 120000, periodo: 'pago único' },
  'tiendas-online': { nombre: 'Tiendas online', desde: 350000, periodo: 'pago único' },
  seo: { nombre: 'SEO', desde: null, periodo: 'al mes' },
  integraciones: { nombre: 'Integraciones y automatización', desde: null, periodo: 'pago único' },
  'aplicaciones-moviles': { nombre: 'Aplicaciones móviles', desde: null, periodo: 'pago único' },
} satisfies Record<string, Precio & { nombre: string }>;

export const CLAVES_PRECIO = Object.keys(PRECIOS_BASE) as ClavePrecio[];

export const DETALLE_AGENTE = {
  implementacion: [
    'Levantamos la carta o el catálogo, los precios, horarios y políticas',
    'Armamos el agente y lo probamos con preguntas reales de clientes',
    'Lo conectamos al WhatsApp e Instagram del negocio',
  ],
  mensualidad: [
    'Uso de la IA y del servicio de mensajería',
    'Cambios cuando cambian los precios, el menú o las promociones',
    'Revisión de conversaciones y ajustes',
  ],
};

export const NOTA_PRECIOS = 'Valores + IVA. El monto final depende de cuántos canales, productos y procesos conectemos.';

export function pesos(n: number) {
  return '$' + n.toLocaleString('es-CL');
}

export function textoPrecio(p: Precio) {
  return p.desde === null ? 'A cotizar' : `desde ${pesos(p.desde)} + IVA`;
}
