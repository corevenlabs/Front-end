import type { Metadata } from 'next';
import { FormularioContacto } from '@/components/FormularioContacto';
import { Flecha } from '@/components/Iconos';
import { enlaceWhatsapp, SITIO } from '@/content/sitio';
import s from '@/components/Pagina.module.css';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Cuéntanos qué vendes y cómo te escriben tus clientes. Te respondemos rápido por WhatsApp o correo.',
  alternates: { canonical: '/contacto' },
  openGraph: { url: '/contacto' },
};

export default function Contacto() {
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
            WhatsApp +{SITIO.whatsapp.slice(0, 2)} {SITIO.whatsapp.slice(2, 3)} {SITIO.whatsapp.slice(3, 7)} {SITIO.whatsapp.slice(7)} <Flecha />
          </a>
        </aside>
      </div>
    </>
  );
}
