import { RUBROS_DEMO, rubroPorSlug } from '@/content/rubros';
import type { NegocioDemo } from '@/components/ChatDemo';

// Lo que viaja al navegador: sin la ficha completa (esa queda en el servidor).
export function negociosParaDemo(): NegocioDemo[] {
  return RUBROS_DEMO.map((r) => ({
    slug: r.slug,
    corto: r.corto,
    nombre: r.negocio.nombre,
    iniciales: r.negocio.iniciales,
    sugeridas: r.negocio.sugeridas.map((s) => s.pregunta),
    ejemplo: r.negocio.conversacion.slice(0, 2),
  }));
}

// Respuesta sin IA: solo para las preguntas sugeridas. Se usa si no hay llave de Anthropic
// o si se alcanzó el tope diario de gasto.
export function respuestaSinIA(slug: string, pregunta: string) {
  const rubro = rubroPorSlug(slug);
  return rubro?.negocio.sugeridas.find((s) => s.pregunta === pregunta.trim())?.respuesta ?? null;
}
