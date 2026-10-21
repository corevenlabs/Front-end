import type { Metadata } from 'next';
import Link from 'next/link';
import { Cierre } from '@/components/Secciones';
import { Flecha } from '@/components/Iconos';
import { JsonLd } from '@/components/JsonLd';
import { GUIAS } from '@/content/guias';
import { metadatos, migas } from '@/lib/seo';
import s from '@/components/Pagina.module.css';

export const metadata: Metadata = metadatos({
  ruta: '/guias',
  titulo: 'Guías de WhatsApp y ventas digitales para pymes',
  descripcion: 'Guías prácticas sobre chatbots de WhatsApp, atención automatizada y ventas digitales para pymes en Chile, escritas por el equipo de Corevenlabs.',
});

export default function Guias() {
  return (
    <>
      <JsonLd datos={migas(['Guías', '/guias'])} />
      <div className={`contenedor ${s.cabecera}`}>
        <p className="etiqueta">Guías</p>
        <h1 className={s.titulo}>Guías para vender mejor por WhatsApp</h1>
        <p className={s.bajada}>Explicaciones claras, sin tecnicismos, para decidir con información antes de automatizar o invertir en canales digitales.</p>
      </div>
      <div className={`contenedor ${s.guiasLista}`}>
        {GUIAS.map((g) => (
          <Link key={g.slug} href={`/guias/${g.slug}`} className={`${s.guiaTarjeta} flecha-mueve`}>
            <h2>{g.titulo}</h2>
            <p>{g.descripcion}</p>
            <span>Leer la guía <Flecha /></span>
          </Link>
        ))}
      </div>
      <Cierre />
    </>
  );
}
