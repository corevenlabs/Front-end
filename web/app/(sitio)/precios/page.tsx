import type { Metadata } from 'next';
import { metadatos } from '@/lib/seo';
import { Precios, Preguntas, Cierre } from '@/components/Secciones';
import { textoPrecio } from '@/content/precios';
import { obtenerPrecios } from '@/lib/precios';
import s from '@/components/Pagina.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const p = await obtenerPrecios();
  return metadatos({
    ruta: '/precios',
    titulo: 'Precios de agentes de WhatsApp y páginas web',
    descripcion: `Agente de WhatsApp: implementación ${textoPrecio(p['agente-implementacion'])} y mensualidad ${textoPrecio(p['agente-mensualidad'])}. Páginas web, landing pages y tiendas online con precios publicados.`,
  });
}

export default function PaginaPrecios() {
  return (
    <>
      <div className={`contenedor ${s.cabecera}`}>
        <p className="etiqueta">Precios</p>
        <h1 className={s.titulo}>Precios claros, sin letra chica</h1>
        <p className={s.bajada}>Precios «desde» para conocer los valores antes de conversar. El monto final depende de cada proyecto y se entrega por escrito.</p>
      </div>
      <Precios conOtros />
      <Preguntas />
      <Cierre />
    </>
  );
}
