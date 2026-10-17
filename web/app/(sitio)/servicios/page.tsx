import type { Metadata } from 'next';
import { Cierre, Servicios } from '@/components/Secciones';
import s from '@/components/Pagina.module.css';

export const metadata: Metadata = {
  title: 'Servicios: agentes de WhatsApp, páginas web, tiendas online, SEO y apps',
  description:
    'Agentes de WhatsApp e Instagram, páginas web, landing pages, tiendas online, SEO, integraciones y aplicaciones móviles para pymes en Chile. Precios desde.',
  alternates: { canonical: '/servicios' },
  openGraph: { url: '/servicios' },
};

export default function PaginaServicios() {
  return (
    <>
      <div className={`contenedor ${s.cabecera}`}>
        <p className="etiqueta">Servicios</p>
        <h1 className={s.titulo}>Lo que hacemos por tu negocio</h1>
        <p className={s.bajada}>Desde el agente que contesta tu WhatsApp hasta la web, la tienda y la app. Precios claros desde el primer mensaje.</p>
      </div>
      <Servicios titulo="Elige lo que necesitas" />
      <Cierre />
    </>
  );
}
