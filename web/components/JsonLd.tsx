// Datos estructurados. Se escapa "<" para que ningún texto pueda cerrar la etiqueta <script>.
export function JsonLd({ datos }: { datos: object | object[] }) {
  const json = JSON.stringify(datos).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
