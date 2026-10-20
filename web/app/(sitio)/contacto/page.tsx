import type { Metadata } from 'next';
import { FormularioContacto } from '@/components/FormularioContacto';
import { Flecha } from '@/components/Iconos';
import { enlaceWhatsapp } from '@/content/sitio';
import { formatearWhatsapp, obtenerWhatsapp } from '@/lib/ajustes';
import s from '@/components/Pagina.module.css';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Cuéntanos qué vendes y cómo te escriben tus clientes. Te respondemos rápido por WhatsApp o correo.',
  alternates: { canonical: '/contacto' },
  openGraph: { url: '/contacto' },
};

export default async function Contacto() {
  const whatsapp = await obtenerWhatsapp();
  return (
    <>
      <div className={`contenedor ${s.cabecera}`}>
        <p className="etiqueta">Contacto</p>
        <h1 className={s.titulo}>Cuéntanos de tu negocio</h1>
        <p className={s.bajada}>Déjanos tus datos y te escribimos. Si prefieres, háblanos directo por WhatsApp.</p>
      </div>
      <div className={`contenedor ${s.dos}`}>
        <FormularioContacto />
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 className={s.subtitulo} style={{ marginBottom: 0 }}>¿Más rápido?</h2>
          <p className="bajada" style={{ fontSize: 16 }}>Escríbenos por WhatsApp y conversamos ahí mismo.</p>
          <a className="btn btn-secundario" style={{ alignSelf: 'flex-start' }} href={enlaceWhatsapp()} target="_blank" rel="noopener noreferrer">
            WhatsApp {formatearWhatsapp(whatsapp)} <Flecha />
          </a>
        </aside>
      </div>
    </>
  );
}
