import { Fragment } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Cierre } from '@/components/Secciones';
import { DobleCheck, Flecha } from '@/components/Iconos';
import { JsonLd } from '@/components/JsonLd';
import { GUIAS, guiaPorSlug, type Bloque } from '@/content/guias';
import { servicioPorSlug } from '@/content/servicios';
import { pesos } from '@/content/precios';
import { SITIO } from '@/content/sitio';
import { RESPONSABLE } from '@/content/legal';
import { obtenerPrecios } from '@/lib/precios';
import { metadatos, migas } from '@/lib/seo';
import s from '@/components/Pagina.module.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIAS.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: PageProps<'/guias/[slug]'>): Promise<Metadata> {
  const g = guiaPorSlug((await props.params).slug);
  if (!g) return {};
  return metadatos({ ruta: `/guias/${g.slug}`, titulo: g.tituloSeo, tituloSocial: g.titulo, descripcion: g.descripcion });
}

const FECHA = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const fecha = (iso: string) => FECHA.format(new Date(`${iso}T12:00:00Z`));

export default async function PaginaGuia(props: PageProps<'/guias/[slug]'>) {
  const g = guiaPorSlug((await props.params).slug);
  if (!g) notFound();
  const precios = await obtenerPrecios();
  const servicio = servicioPorSlug(g.servicio);
  const url = `${SITIO.url}/guias/${g.slug}`;

  const datos = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: g.titulo,
      description: g.descripcion,
      inLanguage: 'es-CL',
      datePublished: g.publicada,
      dateModified: g.actualizada,
      mainEntityOfPage: url,
      image: `${SITIO.url}/opengraph-image`,
      author: { '@type': 'Organization', name: SITIO.nombre, url: SITIO.url },
      publisher: { '@type': 'Organization', name: SITIO.nombre, legalName: RESPONSABLE.razonSocial, logo: { '@type': 'ImageObject', url: `${SITIO.url}/icon.svg` } },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: g.preguntas.map((q) => ({ '@type': 'Question', name: q.p, acceptedAnswer: { '@type': 'Answer', text: q.r } })),
    },
    migas(['Guías', '/guias'], [g.titulo, `/guias/${g.slug}`]),
  ];

  const bloque = (b: Bloque, i: number) => {
    switch (b.tipo) {
      case 'p':
        return <p key={i}>{b.texto}</p>;
      case 'lista':
        return <ul key={i}>{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
      case 'pasos':
        return (
          <ol key={i} className={s.guiaPasos}>
            {b.items.map((x) => <li key={x.titulo}><b>{x.titulo}.</b> {x.texto}</li>)}
          </ol>
        );
      case 'tabla':
        return (
          <div key={i} className={s.tabla}>
            <table>
              <thead><tr>{b.columnas.map((c, j) => <th key={j} scope="col">{c}</th>)}</tr></thead>
              <tbody>
                {b.filas.map((f) => (
                  <tr key={f[0]}>{f.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'precios': {
        const impl = precios['agente-implementacion'];
        const mes = precios['agente-mensualidad'];
        if (impl.desde === null && mes.desde === null) return null;
        return (
          <div key={i} className={s.guiaPrecio}>
            <p><b>Referencia en Corevenlabs:</b></p>
            <ul>
              {impl.desde !== null && <li>Implementación desde {pesos(impl.desde)} + IVA, pago único.</li>}
              {mes.desde !== null && <li>Mensualidad desde {pesos(mes.desde)} + IVA.</li>}
            </ul>
            <p>El monto final depende de cuántos canales, productos y procesos se conecten. <Link href="/precios">Ver todos los precios</Link>.</p>
          </div>
        );
      }
    }
  };

  return (
    <>
      <JsonLd datos={datos} />
      <div className={`contenedor ${s.cabecera}`}>
        <p className={s.migas}><Link href="/guias">Guías</Link> / {servicio?.nombre ?? 'Guía'}</p>
        <h1 className={s.titulo}>{g.titulo}</h1>
        <p className={s.bajada}>{g.bajada}</p>
        <p className={s.actualizado}>Actualizada el {fecha(g.actualizada)} · Corevenlabs</p>
      </div>

      <div className={`contenedor ${s.guia}`}>
        <article className={s.legal}>
          <aside className={s.guiaResumen} aria-labelledby="resumen-titulo">
            <h2 id="resumen-titulo">En resumen</h2>
            <ul>{g.resumen.map((x) => <li key={x}><DobleCheck />{x}</li>)}</ul>
          </aside>

          <nav className={s.guiaIndice} aria-labelledby="indice-titulo">
            <h2 id="indice-titulo">Contenido</h2>
            <ol>
              {g.secciones.map((x) => <li key={x.id}><a href={`#${x.id}`}>{x.titulo}</a></li>)}
              <li><a href="#preguntas-guia">Preguntas frecuentes</a></li>
            </ol>
          </nav>

          {g.secciones.map((sec) => (
            <Fragment key={sec.id}>
              <h2 id={sec.id}>{sec.titulo}</h2>
              {sec.bloques.map(bloque)}
            </Fragment>
          ))}

          <div className={s.guiaDemo}>
            <p><b>¿Cómo se ve en la práctica?</b> La demo permite conversar con un agente de ejemplo como si fuera cliente de un restaurante, una joyería o una empresa de remodelación.</p>
            <Link className="btn btn-primario" href="/demo">Probar la demo <Flecha /></Link>
          </div>

          <h2 id="preguntas-guia">Preguntas frecuentes</h2>
          {g.preguntas.map((q) => (
            <Fragment key={q.p}>
              <h3 className={s.guiaPregunta}>{q.p}</h3>
              <p>{q.r}</p>
            </Fragment>
          ))}

          {servicio && (
            <p className={s.guiaServicio}>
              Más información sobre el servicio: <Link href={`/servicios/${servicio.slug}`}>{servicio.nombre}</Link>.
            </p>
          )}
        </article>
      </div>
      <Cierre />
    </>
  );
}
