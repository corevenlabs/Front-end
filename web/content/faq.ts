// Preguntas frecuentes por defecto. Las vigentes se editan en /admin/sitio (tabla web.preguntas);
// estas solo se muestran mientras esa tabla esté vacía.
export const PREGUNTAS = [
  {
    p: '¿El agente reemplaza al equipo de atención?',
    r: 'No. Responde lo que se repite todo el día (precios, horarios, despacho, stock) y deriva al equipo lo que necesita criterio humano: reclamos, pedidos grandes, descuentos o casos especiales.',
  },
  {
    p: '¿Qué diferencia hay entre un chatbot tradicional y un agente con IA?',
    r: 'Un chatbot tradicional funciona con menús de opciones fijas («marque 1 para…»). El agente con inteligencia artificial entiende lo que el cliente escribe con sus propias palabras y responde con la información real del negocio, sin obligarlo a navegar un menú.',
  },
  {
    p: '¿Qué pasa si un cliente pregunta algo que el agente no sabe?',
    r: 'No inventa. Le indica al cliente que su consulta pasará a una persona del equipo y envía un aviso al celular con el resumen de la conversación.',
  },
  {
    p: '¿Funciona con el número de WhatsApp actual del negocio?',
    r: 'Trabajamos con la API oficial de WhatsApp Business de Meta. En la primera conversación revisamos si conviene usar el número actual o uno nuevo, según cómo se atiende hoy.',
  },
  {
    p: '¿También responde en Instagram?',
    r: 'Sí, responde los mensajes directos de Instagram con la misma información y el mismo tono.',
  },
  {
    p: '¿Se pueden cambiar precios, menú o promociones?',
    r: 'Sí. Basta con avisarnos y lo actualizamos; está incluido en la mensualidad.',
  },
  {
    p: '¿Qué pasa con los datos de los clientes?',
    r: 'Se usan solo para atenderlos. No se venden ni se usan para entrenar modelos de IA, y se tratan según la Ley 21.719 de protección de datos personales.',
  },
  {
    p: '¿Y si el negocio no tiene página web?',
    r: 'También desarrollamos páginas web y landing pages, pensadas para que los clientes encuentren el negocio y escriban.',
  },
];
