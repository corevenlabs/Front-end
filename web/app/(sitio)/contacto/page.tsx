import type { Metadata } from 'next';
import { metadatos } from '@/lib/seo';
import { FormularioContacto } from '@/components/FormularioContacto';
import { Flecha } from '@/components/Iconos';
import { enlaceWhatsapp } from '@/content/sitio';
import { formatearWhatsapp, obtenerWhatsapp } from '@/lib/ajustes';
import s from '@/components/Pagina.module.css';

export const metadata: Metadata = metadatos({
  ruta: '/contacto',
  titulo: 'Contacto: cotice su chatbot o su página web',
  descripcion: 'Cuéntenos qué vende y cómo le escriben sus clientes. Respondemos rápido por WhatsApp o correo, sin compromiso y con una recomendación clara.',
});

export default async function Contacto() {
  const whatsapp = await obtenerWhatsapp();
  return (
    <>
      <div className={`contenedor ${s.cabecera}`}>
        <p className="etiqueta">Contacto</p>
        <h1 className={s.titulo}>Hablemos de su negocio</h1>
        <p className={s.bajada}>Con unos pocos datos le respondemos a la brevedad. Si lo prefiere, puede escribirnos directo por WhatsApp.</p>
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
