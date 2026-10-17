import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChatDemo } from '@/components/ChatDemo';
import { DobleCheck, Flecha, Icono } from '@/components/Iconos';
import { Cierre, Servicios } from '@/components/Secciones';
import { pesos, textoPrecio } from '@/content/precios';
import { clavePrecioDeServicio, obtenerPrecios } from '@/lib/precios';
import { JsonLd } from '@/components/JsonLd';
import { SERVICIOS, servicioPorSlug } from '@/content/servicios';
import { SITIO, enlaceWhatsapp } from '@/content/sitio';
import { negociosParaDemo } from '@/lib/demo';
import s from '@/components/Pagina.module.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICIOS.map((sv) => ({ slug: sv.slug }));
}

export async function generateMetadata(props: PageProps<'/servicios/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const sv = servicioPorSlug(slug);
  if (!sv) return {};
  const p = (await obtenerPrecios())[clavePrecioDeServicio(sv.slug)];
  const precio = p.desde === null ? '' : ` ${textoPrecio(p)}.`;
  return {
    title: sv.titulo,
    description: `${sv.bajada}${precio}`.slice(0, 160),
    alternates: { canonical: `/servicios/${sv.slug}` },
    openGraph: { url: `/servicios/${sv.slug}`, title: `${sv.titulo} | Corevenlabs` },
  };
}

export default async function PaginaServicio(props: PageProps<'/servicios/[slug]'>) {
  const { slug } = await props.params;
  const sv = servicioPorSlug(slug);
  if (!sv) notFound();
  const esAgente = sv.slug === 'agentes-whatsapp';
  const precios = await obtenerPrecios();
  const p = precios[clavePrecioDeServicio(sv.slug)];
  const mensualidad = precios['agente-mensualidad'];
  const nota = esAgente && mensualidad.desde !== null ? `Más mensualidad desde ${pesos(mensualidad.desde)} + IVA.` : sv.notaPrecio;

  const datos = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: sv.titulo,
    description: sv.bajada,
    areaServed: { '@type': 'Country', name: 'Chile' },
    provider: { '@type': 'Organization', name: SITIO.nombre, url: SITIO.url },
    ...(p.desde !== null && {
      offers: { '@type': 'Offer', priceCurrency: 'CLP', price: p.desde, description: `Desde, + IVA, ${p.periodo}` },
    }),
  };

  return (
    <>
      <JsonLd datos={datos} />
      <div className={`contenedor ${s.conChat}`}>
        <div className={s.cab}>
          <p className={s.migas}><Link href="/servicios">Servicios</Link> / {sv.nombre}</p>
          <Icono nombre={sv.icono} className={s.icono} />
          <h1 className={s.titulo}>{sv.titulo}</h1>
          <p className={s.bajada}>{sv.bajada}</p>
        </div>

        <div className={s.chatCol}>
          {esAgente ? (
            <ChatDemo negocios={negociosParaDemo()} />
          ) : (
            <aside className={s.cajaPrecio}>
              <span className={s.cajaEtiqueta}>{p.desde === null ? 'Precio' : p.periodo}</span>
              <p className={s.cajaMonto}>{textoPrecio(p)}</p>
              {nota && <p className={s.cajaNota}>{nota}</p>}
              <p className={s.cajaNota}>Te enviamos la cotización por escrito, sin costo.</p>
              <a className="btn btn-primario" href={enlaceWhatsapp(`Hola, quiero cotizar: ${sv.nombre.toLowerCase()}`)} target="_blank" rel="noopener noreferrer">
                Cotizar por WhatsApp <Flecha />
              </a>
              <Link className="btn btn-secundario" href="/contacto">Dejar mis datos</Link>
            </aside>
          )}
        </div>

        <div className={s.detalle}>
          <h2 className={s.subtitulo}>Qué incluye</h2>
          <ul className={s.lista}>
            {sv.incluye.map((t) => (
              <li key={t}><DobleCheck />{t}</li>
            ))}
          </ul>
          <p className={s.ideal}><b>Ideal para:</b> {sv.ideal}</p>
          {esAgente && (
            <div className={s.botones}>
              <a className="btn btn-primario" href={enlaceWhatsapp()} target="_blank" rel="noopener noreferrer">Lo quiero para mi negocio <Flecha /></a>
              <Link className="btn btn-secundario" href="/precios">Ver precios</Link>
            </div>
          )}
        </div>
      </div>

      <Servicios titulo="Otros servicios" excluir={sv.slug} />
      <Cierre />
    </>
  );
}
