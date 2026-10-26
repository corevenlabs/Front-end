import type { Metadata } from 'next';
import { metadatos, migas } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChatDemo } from '@/components/ChatDemo';
import { Conversacion } from '@/components/Conversacion';
import { DobleCheck, Flecha, Icono } from '@/components/Iconos';
import { Precios, Rubros } from '@/components/Secciones';
import { RUBROS, rubroPorSlug } from '@/content/rubros';
import { enlaceWhatsapp } from '@/content/sitio';
import { negociosParaDemo } from '@/lib/demo';
import s from '@/components/Pagina.module.css';
import telefono from '@/components/Secciones.module.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return RUBROS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata(props: PageProps<'/rubros/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const rubro = rubroPorSlug(slug);
  if (!rubro) return {};
  const extra = ' Incluye una conversación de ejemplo.';
  return metadatos({
    ruta: `/rubros/${rubro.slug}`,
    titulo: rubro.tituloSeo ?? rubro.titulo,
    tituloSocial: rubro.titulo,
    descripcion: rubro.bajada.length + extra.length <= 158 ? rubro.bajada + extra : rubro.bajada,
  });
}

export default async function PaginaRubro(props: PageProps<'/rubros/[slug]'>) {
  const { slug } = await props.params;
  const rubro = rubroPorSlug(slug);
  if (!rubro) notFound();

  return (
    <>
      <JsonLd datos={migas([rubro.nombre, `/rubros/${rubro.slug}`])} />
      <div className={`contenedor ${s.conChat}`}>
        <div className={s.cab}>
          <p className={s.migas}><Link href="/#rubros">Rubros</Link> / {rubro.nombre}</p>
          <Icono nombre={rubro.icono} className={s.icono} />
          <h1 className={s.titulo}>{rubro.titulo}</h1>
          <p className={s.bajada}>{rubro.bajada}</p>
        </div>

        <div className={`${s.chatCol} ${telefono.heroDemo}`}>
          <div className={telefono.escenaTelefono}>
          <div className={telefono.telefonoFrente}>
          {rubro.enDemo ? (
            <ChatDemo negocios={negociosParaDemo()} inicial={rubro.slug} compacto telefono />
          ) : (
            <Conversacion nombre={rubro.negocio.nombre} iniciales={rubro.negocio.iniciales} mensajes={rubro.negocio.conversacion} />
          )}
          </div>
          </div>
        </div>

        <div className={s.detalle}>
          <h2 className={s.subtitulo}>Qué hace el agente en {rubro.enNegocio}</h2>
          <ul className={s.lista}>
            {rubro.tareas.map((t) => (
              <li key={t}><DobleCheck />{t}</li>
            ))}
          </ul>
          <div className={s.botones}>
            <a className="btn btn-primario" href={enlaceWhatsapp(`Hola, vi el agente para ${rubro.nombre.toLowerCase()} y quiero uno para mi negocio`)} target="_blank" rel="noopener noreferrer">
              Lo quiero para mi negocio <Flecha />
            </a>
            {!rubro.enDemo && <Link className="btn btn-secundario" href="/demo">Probar la demo</Link>}
          </div>
        </div>
      </div>

      <Precios />
      <Rubros />
    </>
  );
}
