// Rubros que atendemos y los negocios FICTICIOS que usamos de ejemplo.
// La "ficha" de cada negocio es lo único que el agente de la demo sabe (va en el prompt de sistema).

export type IconoRubro = 'ramen' | 'carne' | 'anillo' | 'cloche' | 'banderines' | 'rodillo';
export type Mensaje = { de: 'cliente' | 'agente'; texto: string; hora: string };

export type Negocio = {
  nombre: string;
  iniciales: string;
  ficha: string;
  sugeridas: { pregunta: string; respuesta: string }[];
  conversacion: Mensaje[];
};

export type Rubro = {
  slug: string;
  nombre: string;
  corto: string;
  enNegocio: string; // con artículo: «Qué hace el agente en {enNegocio}»
  icono: IconoRubro;
  resumen: string;
  titulo: string;
  tituloSeo?: string; // título para Google cuando «titulo» es muy largo (máx. ~45 caracteres)
  bajada: string;
  tareas: string[];
  enDemo: boolean;
  negocio: Negocio;
};

export const RUBROS: Rubro[] = [
  {
    slug: 'restaurantes',
    nombre: 'Restaurantes y delivery',
    corto: 'Ramen',
    enNegocio: 'un restaurante',
    tituloSeo: 'Chatbot de WhatsApp para restaurantes y delivery',
    icono: 'ramen',
    resumen: 'Pedidos, carta, horarios, despacho',
    titulo: 'Agente de WhatsApp para restaurantes y delivery',
    bajada: 'Toma pedidos a la hora de la once y a medianoche, responde la carta y confirma la dirección mientras la cocina trabaja.',
    tareas: ['Responde carta, precios y opciones veganas o sin gluten', 'Arma el pedido y confirma comuna y dirección', 'Informa costo y tiempo de despacho', 'Avisa al equipo los pedidos grandes o los reclamos'],
    enDemo: true,
    negocio: {
      nombre: 'Ramen Kintsugi',
      iniciales: 'RK',
      ficha: `Ramen Kintsugi es un restaurante de ramen ficticio en Ñuñoa, Santiago (Av. Irarrázaval 3150, local 2).
Horario: martes a domingo, cocina de 12:30 a 00:00. Lunes cerrado. Despacho hasta las 00:30.
Carta (precios en pesos chilenos, IVA incluido):
- Ramen Shoyu (caldo de soya, chashu de cerdo, huevo marinado, cebollín): $9.900
- Ramen Tonkotsu (caldo de cerdo cremoso, chashu, huevo, champiñón): $11.200
- Ramen Miso Vegano (caldo de shiitake, tofu, choclo, sin huevo): $10.500
- Gyozas de cerdo (6 unidades): $5.400 · Gyozas veganas (6): $5.200
- Extra huevo marinado: $1.200 · Extra chashu: $2.500
- Bebidas: Ramune $3.200, té verde frío $2.500, cerveza japonesa $4.500 (solo mayores de 18).
Despacho: zona 1 (Ñuñoa, Providencia, La Reina, Macul): $2.500, llega en 35 a 45 min. Zona 2 (Las Condes, Peñalolén, Santiago Centro, San Joaquín): $3.900, 45 a 60 min. Fuera de esas comunas no despachamos; se puede retirar en local.
Pedido mínimo para despacho: $15.000.
Pago: transferencia o link de pago con tarjeta. No se paga en efectivo al repartidor.
Sin gluten: no tenemos fideos sin gluten. Alergias graves: derivar al local.
Reservas: no tomamos reservas, se atiende por orden de llegada.
Pedidos de más de 10 ramen, eventos o reclamos: derivar al encargado (Matías).`,
      sugeridas: [
        { pregunta: '¿Despachan a Ñuñoa?', respuesta: 'Sí, Ñuñoa está en zona 1: despacho $2.500 y llega en 35 a 45 min. Pedido mínimo $15.000. ¿Te dejo el pedido listo?' },
        { pregunta: '¿Tienen opción vegana?', respuesta: 'Sí: Ramen Miso Vegano ($10.500), con caldo de shiitake, tofu y choclo, sin huevo. También hay gyozas veganas ($5.200).' },
        { pregunta: '¿Hasta qué hora atienden?', respuesta: 'Cocina abierta de martes a domingo hasta las 00:00 y despacho hasta las 00:30. Los lunes cerramos.' },
      ],
      conversacion: [
        { de: 'cliente', texto: 'Hola!! todavía están despachando? quiero 2 shoyu', hora: '23:47' },
        { de: 'agente', texto: '¡Hola! Sí, despachamos hasta las 00:30. 2 Ramen Shoyu son $19.800. ¿A qué comuna te lo mandamos?', hora: '23:47' },
        { de: 'cliente', texto: 'providencia, cerca de metro los leones', hora: '23:48' },
        { de: 'agente', texto: 'Perfecto, Providencia es zona 1: despacho $2.500, llega en 35 a 45 min. Total $22.300. ¿Me confirmas la dirección exacta y si pagas con transferencia o link de pago?', hora: '23:48' },
      ],
    },
  },
  {
    slug: 'carnicerias',
    nombre: 'Carnicerías con delivery',
    corto: 'Carnicería',
    enNegocio: 'una carnicería',
    tituloSeo: 'Chatbot de WhatsApp para carnicerías',
    icono: 'carne',
    resumen: 'Cortes, precios por kilo, pedidos para el asado',
    titulo: 'Agente de WhatsApp para carnicerías con delivery',
    bajada: 'El viernes en la noche todos preguntan por el asado. El agente responde cortes, precios por kilo y arma el pedido para el sábado temprano.',
    tareas: ['Responde cortes disponibles y precio por kilo', 'Calcula cuánta carne llevar según cuántas personas', 'Toma pedidos y agenda el despacho', 'Avisa al equipo los pedidos grandes o por mayor'],
    enDemo: false,
    negocio: {
      nombre: 'Carnes Don Lalo',
      iniciales: 'DL',
      ficha: 'Carnicería ficticia en Maipú. Lomo vetado $13.990/kg, entraña $16.990/kg, punta paleta $10.490/kg, longaniza $6.990/kg. Despacho sábado y domingo de 9:00 a 13:00, $2.990 en Maipú y Cerrillos. Pedido mínimo $20.000.',
      sugeridas: [],
      conversacion: [
        { de: 'cliente', texto: 'buenas, tienen lomo vetado? somos 10 para el asado de mañana', hora: '22:31' },
        { de: 'agente', texto: '¡Hola! Sí, lomo vetado a $13.990 el kilo. Para 10 personas recomendamos unos 3,5 kg de carne en total. ¿Te armo 2,5 kg de vetado y 1 kg de longaniza?', hora: '22:31' },
        { de: 'cliente', texto: 'dale, y me lo pueden llevar temprano?', hora: '22:33' },
        { de: 'agente', texto: 'Mañana despachamos entre 9:00 y 13:00 en Maipú ($2.990). Total con despacho: $44.955. ¿A qué dirección y en qué rango horario?', hora: '22:33' },
      ],
    },
  },
  {
    slug: 'joyerias',
    nombre: 'Joyerías a medida',
    corto: 'Joyería',
    enNegocio: 'una joyería',
    icono: 'anillo',
    resumen: 'Cotizaciones, plazos, visitas al taller',
    titulo: 'Agente de WhatsApp para joyerías y talleres a medida',
    tituloSeo: 'Chatbot de WhatsApp para joyerías y talleres',
    bajada: 'Las consultas por anillos de compromiso llegan de noche y con nervios. El agente responde materiales, rangos de precio y plazos, y agenda la visita al taller.',
    tareas: ['Responde materiales, rangos de precio y plazos', 'Pide la talla, el diseño y la fecha importante', 'Agenda visitas al taller', 'Deriva las cotizaciones especiales con todo el detalle'],
    enDemo: true,
    negocio: {
      nombre: 'Taller Plata Austral',
      iniciales: 'PA',
      ficha: `Taller Plata Austral es una joyería ficticia de piezas a medida en Providencia, Santiago (atención solo con hora, en Av. Italia 1180).
Horario de atención en taller: martes a sábado de 11:00 a 19:00. Por WhatsApp se responde siempre.
Materiales y precios de referencia (pesos chilenos, IVA incluido):
- Anillos de plata 950: desde $45.000. Argollas de matrimonio en plata, el par: desde $85.000.
- Anillos en oro 18k: desde $390.000 sin piedra. Con diamante de laboratorio 0,3 ct: desde $690.000.
- Aros y colgantes en plata: desde $28.000.
- Grabado interior: hasta 20 caracteres sin costo extra.
Plazos: entre 10 y 15 días hábiles desde que se aprueba el diseño. Urgencias (menos de 10 días): consultar con la orfebre, con recargo de 20%.
Proceso: se conversa la idea, se envía un boceto en 3 días hábiles, se aprueba y se paga 50% de abono; el resto al retirar.
Tallas: se puede medir en el taller o se envía un medidor de tallas gratis por correo dentro de Santiago.
Garantía: 6 meses por defectos de fabricación. Ajuste de talla gratis una vez durante el primer mes.
Pago: transferencia o tarjeta (débito y crédito, hasta 6 cuotas sin interés).
Despacho: envío asegurado a todo Chile por $6.900, o retiro en el taller.
Cotizaciones con piedras especiales, rediseño de joyas heredadas o pedidos corporativos: derivar a Daniela, la orfebre.`,
      sugeridas: [
        { pregunta: '¿Cuánto cuesta un anillo de compromiso?', respuesta: 'En plata 950 desde $45.000 y en oro 18k desde $390.000, según piedra y diseño. Con diamante de laboratorio de 0,3 ct parte en $690.000. ¿Tienes una idea del diseño?' },
        { pregunta: '¿Cuánto se demoran?', respuesta: 'Entre 10 y 15 días hábiles desde que apruebas el diseño. Si es para una fecha especial, cuéntame cuál y lo revisamos con Daniela, la orfebre.' },
        { pregunta: '¿Puedo ir al taller?', respuesta: 'Sí, con hora: martes a sábado de 11:00 a 19:00 en Providencia. ¿Qué día te acomoda?' },
      ],
      conversacion: [
        { de: 'cliente', texto: 'hola, hacen anillos con grabado? es para un aniversario', hora: '22:15' },
        { de: 'agente', texto: '¡Hola! Sí, grabamos por dentro hasta 20 caracteres sin costo extra. Los anillos de plata 950 parten en $45.000. ¿Para cuándo lo necesitas?', hora: '22:15' },
        { de: 'cliente', texto: 'para el 14, como en 3 semanas', hora: '22:17' },
        { de: 'agente', texto: 'Alcanzamos: el plazo es de 10 a 15 días hábiles desde que apruebas el diseño. ¿Te agendo una visita al taller esta semana para ver modelos y medir la talla?', hora: '22:17' },
      ],
    },
  },
  {
    slug: 'banqueterias',
    nombre: 'Banqueterías',
    corto: 'Banquetería',
    enNegocio: 'una banquetería',
    tituloSeo: 'Chatbot de WhatsApp para banqueterías',
    icono: 'cloche',
    resumen: 'Menús, cotizaciones por persona, fechas',
    titulo: 'Agente de WhatsApp para banqueterías',
    bajada: 'Cada cotización empieza con las mismas preguntas: cuántas personas, qué fecha, qué menú. El agente las hace y entrega la cotización armada al equipo.',
    tareas: ['Pregunta fecha, comuna y cantidad de invitados', 'Muestra menús y precio por persona', 'Revisa si la fecha está disponible', 'Entrega la cotización lista para cerrar'],
    enDemo: false,
    negocio: {
      nombre: 'Banquetería Los Aromos',
      iniciales: 'LA',
      ficha: 'Banquetería ficticia. Cóctel desde $14.900 por persona, almuerzo de 3 tiempos desde $24.900 por persona, mínimo 30 personas. Incluye garzones y vajilla.',
      sugeridas: [],
      conversacion: [
        { de: 'cliente', texto: 'Hola, cotización para cóctel de matrimonio, 80 personas, 15 de marzo', hora: '21:52' },
        { de: 'agente', texto: '¡Hola! El cóctel parte en $14.900 por persona e incluye garzones y vajilla: unos $1.192.000 para 80 invitados. ¿En qué comuna es el evento?', hora: '21:52' },
        { de: 'cliente', texto: 'en Pirque', hora: '21:54' },
        { de: 'agente', texto: 'Llegamos a Pirque con un recargo de traslado de $60.000. El 15 de marzo está disponible. ¿Te envío los 3 menús de cóctel para que elijas y te paso con Carolina para cerrar?', hora: '21:54' },
      ],
    },
  },
  {
    slug: 'centros-de-eventos',
    nombre: 'Centros de eventos',
    corto: 'Eventos',
    enNegocio: 'un centro de eventos',
    tituloSeo: 'Chatbot de WhatsApp para centros de eventos',
    icono: 'banderines',
    resumen: 'Disponibilidad, capacidad, visitas',
    titulo: 'Agente de WhatsApp para centros de eventos',
    bajada: 'Responde disponibilidad, capacidad y valores al instante, y agenda la visita al recinto con quien de verdad está interesado.',
    tareas: ['Responde capacidad, valores y qué incluye', 'Revisa fechas disponibles', 'Agenda visitas al recinto', 'Deriva los eventos confirmados o corporativos'],
    enDemo: false,
    negocio: {
      nombre: 'Casona El Quillay',
      iniciales: 'EQ',
      ficha: 'Centro de eventos ficticio en Calera de Tango. Capacidad 40 a 220 personas. Arriendo desde $1.800.000 viernes y sábado; domingo a jueves 30% menos.',
      sugeridas: [],
      conversacion: [
        { de: 'cliente', texto: 'Hola! tienen disponible algún sábado de noviembre? somos 120', hora: '23:05' },
        { de: 'agente', texto: '¡Hola! Para 120 personas tenemos libres los sábados 8 y 22 de noviembre. El arriendo de sábado parte en $1.800.000 e incluye salón, jardín y estacionamiento.', hora: '23:05' },
        { de: 'cliente', texto: 'podemos ir a verlo?', hora: '23:07' },
        { de: 'agente', texto: 'Claro. Hacemos visitas de martes a sábado entre 10:00 y 17:00. ¿Te agendo el jueves a las 11:00?', hora: '23:07' },
      ],
    },
  },
  {
    slug: 'construccion-y-remodelacion',
    nombre: 'Construcción y remodelación',
    corto: 'Remodelación',
    enNegocio: 'una empresa de remodelación',
    icono: 'rodillo',
    resumen: 'Visitas técnicas, presupuestos',
    titulo: 'Agente de WhatsApp para empresas de construcción y remodelación',
    tituloSeo: 'Chatbot de WhatsApp para construcción y obras',
    bajada: 'Filtra las consultas, pide fotos y metros, da rangos de precio y agenda la visita técnica. El equipo llega a la visita sabiendo qué hay que hacer.',
    tareas: ['Pide metros, fotos y comuna', 'Da rangos de precio por tipo de trabajo', 'Agenda visitas técnicas', 'Envía un resumen al equipo antes de cada visita'],
    enDemo: true,
    negocio: {
      nombre: 'Remodela Sur',
      iniciales: 'RS',
      ficha: `Remodela Sur es una empresa ficticia de remodelaciones en la Región Metropolitana, con oficina en San Miguel.
Atención: lunes a viernes de 9:00 a 18:00, sábado de 9:00 a 13:00. Por WhatsApp se responde siempre.
Servicios y precios de referencia de mano de obra (pesos chilenos, IVA incluido, materiales aparte):
- Instalación de piso porcelanato o cerámica: desde $18.000 por m². Piso flotante: desde $9.500 por m².
- Pintura interior: desde $6.500 por m² (dos manos, incluye preparación básica de muros).
- Remodelación de baño completo (4 a 6 m²) con materiales estándar incluidos: desde $2.800.000.
- Remodelación de cocina: desde $3.500.000 con muebles estándar incluidos.
- Cambio de ventanas a termopanel: se cotiza en visita.
No hacemos: ampliaciones estructurales, segundo piso, trabajos de gas (derivamos a instalador certificado SEC).
Visita técnica: sin costo en toda la Región Metropolitana, de lunes a viernes entre 9:00 y 13:00. Después de la visita se envía presupuesto detallado en 48 horas hábiles.
Plazos típicos: baño completo 2 a 3 semanas; piso de 30 m², 3 a 4 días.
Pago: 40% al iniciar, 40% a mitad de obra y 20% al entregar. Transferencia o tarjeta.
Garantía: 12 meses en mano de obra.
Obras de más de $10.000.000, edificios o empresas: derivar a Rodrigo, el jefe de proyectos.`,
      sugeridas: [
        { pregunta: '¿Hacen visita técnica?', respuesta: 'Sí, sin costo en toda la Región Metropolitana, de lunes a viernes entre 9:00 y 13:00. Después te enviamos el presupuesto en 48 horas hábiles. ¿En qué comuna es?' },
        { pregunta: '¿Cuánto cuesta remodelar un baño?', respuesta: 'Un baño completo de 4 a 6 m² parte en $2.800.000 con materiales estándar, y toma 2 a 3 semanas. El presupuesto exacto sale después de la visita técnica.' },
        { pregunta: '¿Trabajan en Maipú?', respuesta: 'Sí, cubrimos toda la Región Metropolitana y Maipú no tiene recargo. ¿Qué trabajo necesitas?' },
      ],
      conversacion: [
        { de: 'cliente', texto: 'Buenas, quiero cambiar el piso de la cocina, como 12 m2. cuanto sale?', hora: '21:08' },
        { de: 'agente', texto: '¡Hola! Para 12 m² de porcelanato, la mano de obra parte en $18.000 el m² (unos $216.000), materiales aparte. ¿En qué comuna es?', hora: '21:08' },
        { de: 'cliente', texto: 'La Florida', hora: '21:10' },
        { de: 'agente', texto: 'Perfecto. La visita técnica es sin costo y tenemos horas este jueves y viernes entre 9:00 y 13:00. ¿Cuál te acomoda? Si puedes, mándame una foto del piso actual.', hora: '21:10' },
      ],
    },
  },
];

export const RUBROS_DEMO = RUBROS.filter((r) => r.enDemo);

export function rubroPorSlug(slug: string) {
  return RUBROS.find((r) => r.slug === slug);
}
