import type { Metadata } from 'next';
import { metadatos } from '@/lib/seo';
import { Cierre, Servicios } from '@/components/Secciones';
import s from '@/components/Pagina.module.css';

export const metadata: Metadata = metadatos({
  ruta: '/servicios',
  titulo: 'Servicios digitales para pymes en Chile',
  descripcion: 'Agentes de WhatsApp e Instagram, páginas web, landing pages, tiendas online, SEO, integraciones y aplicaciones móviles para pymes en Chile, con precios claros.',
});

export default function PaginaServicios() {
  return (
    <>
      <div className={`contenedor ${s.cabecera}`}>
        <p className="etiqueta">Servicios</p>
        <h1 className={s.titulo}>Lo que hacemos por las pymes</h1>
        <p className={s.bajada}>Desde el chatbot que contesta el WhatsApp hasta la web, la tienda y la app. Precios claros desde el primer mensaje.</p>
      </div>
      <Servicios titulo="Servicios" />
      <Cierre />
    </>
  );
}
