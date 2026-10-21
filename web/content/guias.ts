// Guías: páginas largas pensadas para búsquedas en Google. Cada guía es solo datos; la plantilla
// está en app/(sitio)/guias/[slug]/page.tsx. Tono formal e impersonal, sin tutear.
// Un bloque «precios» se reemplaza por los precios vigentes de /admin/precios al generar la página.

export type Bloque =
  | { tipo: 'p'; texto: string }
  | { tipo: 'lista'; items: string[] }
  | { tipo: 'pasos'; items: { titulo: string; texto: string }[] }
  | { tipo: 'tabla'; columnas: string[]; filas: string[][] }
  | { tipo: 'precios' };

export type Seccion = { id: string; titulo: string; bloques: Bloque[] };

export type Guia = {
  slug: string;
  titulo: string; // H1
  tituloSeo: string; // <title>, máx. ~45 caracteres (se agrega « | Corevenlabs»)
  descripcion: string; // meta description, máx. ~155
  bajada: string;
  resumen: string[]; // «En resumen», arriba de todo
  publicada: string; // AAAA-MM-DD
  actualizada: string;
  servicio: string; // slug del servicio relacionado
  secciones: Seccion[];
  preguntas: { p: string; r: string }[];
};

export const GUIAS: Guia[] = [
  {
    slug: 'chatbot-whatsapp-empresas',
    titulo: 'Chatbot de WhatsApp para empresas: guía práctica',
    tituloSeo: 'Chatbot de WhatsApp para empresas: guía',
    descripcion: 'Qué es un chatbot de WhatsApp, qué puede hacer y qué no, cuánto cuesta en Chile, la API oficial de Meta y cómo implementarlo paso a paso en una pyme.',
    bajada: 'Todo lo que conviene saber antes de automatizar la atención por WhatsApp: qué resuelve un chatbot con inteligencia artificial, qué necesita, cuánto cuesta y cómo evitar los errores más comunes.',
    resumen: [
      'Un chatbot de WhatsApp responde automáticamente las consultas que se repiten: precios, horarios, stock, despacho y agenda.',
      'Los chatbots con inteligencia artificial entienden lo que el cliente escribe con sus propias palabras; los tradicionales solo siguen menús.',
      'Para una empresa, lo recomendable es la API oficial de WhatsApp Business de Meta, no aplicaciones que imitan WhatsApp Web.',
      'El costo tiene tres partes: la implementación, una mensualidad de servicio y los cargos de Meta por mensajes que inicia la empresa.',
      'Un buen chatbot no reemplaza al equipo: resuelve lo repetido y deriva a una persona lo que requiere criterio.',
    ],
    publicada: '2026-10-21',
    actualizada: '2026-10-21',
    servicio: 'agentes-whatsapp',
    secciones: [
      {
        id: 'que-es',
        titulo: 'Qué es un chatbot de WhatsApp',
        bloques: [
          { tipo: 'p', texto: 'Un chatbot de WhatsApp es un programa conectado al número de WhatsApp de una empresa que responde mensajes de forma automática. Recibe la consulta del cliente, busca la respuesta en la información del negocio y contesta en segundos, a cualquier hora.' },
          { tipo: 'p', texto: 'En Chile, WhatsApp es el canal donde los clientes preguntan antes de comprar. Quien responde primero suele quedarse con la venta, y la mayoría de las consultas llegan fuera del horario de oficina o en momentos de alta carga. Ahí es donde un chatbot hace la diferencia.' },
        ],
      },
      {
        id: 'tipos',
        titulo: 'Chatbot tradicional o agente con inteligencia artificial',
        bloques: [
          { tipo: 'p', texto: 'No todos los chatbots funcionan igual. La diferencia principal está en cómo entienden al cliente:' },
          {
            tipo: 'tabla',
            columnas: ['', 'Chatbot tradicional (de menús)', 'Agente con inteligencia artificial'],
            filas: [
              ['Cómo conversa', '«Marque 1 para precios, 2 para horarios…»', 'Entiende la pregunta escrita con las palabras del cliente'],
              ['Preguntas imprevistas', 'Se pierde o repite el menú', 'Responde si la información está en su ficha; si no, deriva'],
              ['Pedidos y cotizaciones', 'Formularios rígidos paso a paso', 'Arma el pedido o la cotización conversando'],
              ['Mantención', 'Cada cambio exige rediseñar el flujo', 'Basta con actualizar la información del negocio'],
              ['Experiencia del cliente', 'Se siente como un contestador', 'Se siente como una persona atenta'],
            ],
          },
          { tipo: 'p', texto: 'Un agente con IA bien configurado solo responde con la información que la empresa le entrega: carta o catálogo, precios, horarios, zonas de despacho y políticas. No debe inventar datos ni prometer lo que el negocio no puede cumplir.' },
        ],
      },
      {
        id: 'que-puede-hacer',
        titulo: 'Qué puede hacer un chatbot de WhatsApp (y qué no)',
        bloques: [
          { tipo: 'p', texto: 'Las tareas que mejor resuelve son las que se repiten todos los días:' },
          {
            tipo: 'lista',
            items: [
              'Responder precios, horarios, stock, medios de pago y condiciones de despacho.',
              'Tomar pedidos completos y confirmar dirección y comuna.',
              'Cotizar con los precios reales del negocio y enviar el detalle por escrito.',
              'Agendar visitas, reservas, pruebas o reuniones.',
              'Atender de noche, fines de semana y en horas punta sin dejar mensajes sin respuesta.',
              'Avisar al equipo cuando llega un pedido grande, un reclamo o un caso especial.',
            ],
          },
          { tipo: 'p', texto: 'Lo que no debería hacer:' },
          {
            tipo: 'lista',
            items: [
              'Negociar descuentos o condiciones especiales sin autorización.',
              'Resolver reclamos delicados: ahí corresponde una persona.',
              'Pedir datos sensibles innecesarios, como claves o datos bancarios completos.',
              'Responder sobre temas que no están en la información del negocio.',
            ],
          },
        ],
      },
      {
        id: 'api-oficial',
        titulo: 'WhatsApp Business o API oficial: qué necesita una empresa',
        bloques: [
          { tipo: 'p', texto: 'Existen tres formas de usar WhatsApp en un negocio, y no todas permiten automatizar de forma segura:' },
          {
            tipo: 'tabla',
            columnas: ['Opción', 'Para qué sirve', 'Automatización'],
            filas: [
              ['WhatsApp Business (aplicación)', 'Negocios pequeños que responden a mano desde el celular', 'Solo mensajes de bienvenida, ausencia y respuestas rápidas'],
              ['Herramientas que imitan WhatsApp Web', 'Automatizar sin pasar por Meta', 'No autorizadas: el número puede ser bloqueado'],
              ['API oficial de WhatsApp Business (Meta)', 'Empresas que quieren automatizar y escalar', 'Completa, con verificación de Meta y sin riesgo de bloqueo por uso indebido'],
            ],
          },
          { tipo: 'p', texto: 'Para un chatbot profesional lo recomendable es la API oficial. Requiere una cuenta de Meta Business, un número dedicado (puede ser el actual, que se migra) y la aprobación de las plantillas de mensajes que la empresa envíe por iniciativa propia.' },
        ],
      },
      {
        id: 'costos',
        titulo: 'Cuánto cuesta un chatbot de WhatsApp en Chile',
        bloques: [
          { tipo: 'p', texto: 'El costo total se compone de tres partes:' },
          {
            tipo: 'lista',
            items: [
              'Implementación (pago único): levantar la información del negocio, configurar el agente, probarlo con preguntas reales y conectarlo a WhatsApp e Instagram.',
              'Mensualidad: uso de la inteligencia artificial, mantención, cambios de precios o menú y revisión de las conversaciones.',
              'Cargos de Meta: responder a un cliente dentro de las 24 horas siguientes a su mensaje no tiene costo de Meta; los mensajes que inicia la empresa con plantillas (recordatorios, promociones, avisos) se cobran según su categoría.',
            ],
          },
          { tipo: 'precios' },
          { tipo: 'p', texto: 'Como referencia para evaluar la inversión: si el chatbot recupera unas pocas ventas al mes que antes se perdían por responder tarde, la mensualidad suele pagarse sola.' },
        ],
      },
      {
        id: 'como-implementar',
        titulo: 'Cómo implementar un chatbot de WhatsApp paso a paso',
        bloques: [
          {
            tipo: 'pasos',
            items: [
              { titulo: 'Reunir la información del negocio', texto: 'Carta o catálogo, precios, horarios, zonas y costos de despacho, medios de pago, políticas de cambio y lo que no se puede prometer.' },
              { titulo: 'Definir qué resuelve y qué deriva', texto: 'Qué consultas responde solo, cuándo avisa al equipo y a qué celular o correo llegan esos avisos.' },
              { titulo: 'Configurar y probar', texto: 'Se arma el agente con el tono del negocio y se prueba con las preguntas que de verdad hacen los clientes, hasta que responda como lo haría el propio equipo.' },
              { titulo: 'Conectar la API oficial', texto: 'Se verifica la empresa en Meta, se conecta el número de WhatsApp y, si corresponde, la cuenta de Instagram.' },
              { titulo: 'Publicar y ajustar', texto: 'Las primeras semanas se revisan las conversaciones para afinar respuestas y agregar información que faltaba.' },
            ],
          },
          { tipo: 'p', texto: 'En una pyme con la información ordenada, el proceso completo suele tomar entre una y tres semanas, según la cantidad de productos y procesos que se conecten.' },
        ],
      },
      {
        id: 'errores',
        titulo: 'Errores comunes al automatizar WhatsApp',
        bloques: [
          {
            tipo: 'lista',
            items: [
              'Usar herramientas no oficiales y arriesgar el bloqueo del número.',
              'Obligar al cliente a navegar menús largos antes de obtener una respuesta.',
              'No ofrecer una salida clara para hablar con una persona.',
              'Cargar información desactualizada: un precio antiguo genera más problemas que no responder.',
              'Enviar promociones masivas sin consentimiento, lo que deteriora la reputación del número.',
              'Publicar sin probar con preguntas reales de clientes.',
            ],
          },
        ],
      },
      {
        id: 'medir',
        titulo: 'Cómo medir si el chatbot funciona',
        bloques: [
          { tipo: 'p', texto: 'Los indicadores más útiles para una pyme son simples:' },
          {
            tipo: 'lista',
            items: [
              'Tiempo de primera respuesta: debería bajar de horas a segundos.',
              'Porcentaje de consultas resueltas sin intervención del equipo.',
              'Pedidos, reservas o cotizaciones generadas fuera del horario de atención.',
              'Conversaciones derivadas a una persona y su motivo, para mejorar la información del agente.',
            ],
          },
        ],
      },
    ],
    preguntas: [
      { p: '¿Un chatbot de WhatsApp puede usar el número actual de la empresa?', r: 'Sí, en la mayoría de los casos el número actual se puede conectar a la API oficial de WhatsApp Business. Según el caso, puede seguir usándose también en la aplicación del celular o pasar a funcionar solo a través de la API; conviene evaluarlo antes de migrar.' },
      { p: '¿El chatbot responde en Instagram también?', r: 'Un agente con inteligencia artificial puede atender los mensajes directos de Instagram con la misma información y el mismo tono que en WhatsApp.' },
      { p: '¿Qué pasa si el cliente quiere hablar con una persona?', r: 'Un buen chatbot reconoce esa solicitud y deriva la conversación al equipo, con un resumen de lo conversado para no repetir preguntas.' },
      { p: '¿Es legal automatizar la atención por WhatsApp en Chile?', r: 'Sí, siempre que se use la API oficial y que los datos personales de los clientes se traten según la Ley 19.628 y la Ley 21.719 de protección de datos personales.' },
      { p: '¿Cuánto tarda en estar funcionando?', r: 'Con la información del negocio ordenada, entre una y tres semanas, incluida la verificación en Meta y las pruebas con preguntas reales.' },
    ],
  },
];

export function guiaPorSlug(slug: string) {
  return GUIAS.find((g) => g.slug === slug);
}
