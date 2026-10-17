import type { Metadata } from 'next';
import { Precios, Preguntas, Cierre } from '@/components/Secciones';
import { textoPrecio } from '@/content/precios';
import { obtenerPrecios } from '@/lib/precios';
import s from '@/components/Pagina.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const p = await obtenerPrecios();
  return {
    title: 'Precios: agentes de WhatsApp, páginas web y tiendas online',
    description: `Agente de WhatsApp: implementación ${textoPrecio(p['agente-implementacion'])} y mensualidad ${textoPrecio(p['agente-mensualidad'])}. Páginas web, landing pages y tiendas online con precios desde.`,
    alternates: { canonical: '/precios' },
    openGraph: { url: '/precios' },
  };
}

export default function PaginaPrecios() {
  return (
    <>
      <div className={`contenedor ${s.cabecera}`}>
        <p className="etiqueta">Precios</p>
        <h1 className={s.titulo}>Precios claros, sin letra chica</h1>
        <p className={s.bajada}>Precios «desde» para que sepas de qué estamos hablando antes de conversar. El valor final depende de tu proyecto y te lo damos por escrito.</p>
      </div>
      <Precios conOtros />
      <Preguntas />
      <Cierre />
    </>
  );
}
