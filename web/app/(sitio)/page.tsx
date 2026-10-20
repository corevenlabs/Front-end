import type { Metadata } from 'next';
import { Hero, Banda, QueHace, Rubros, ComoFunciona, Precios, Servicios, Preguntas, Laudus, Cierre } from '@/components/Secciones';
import { JsonLd } from '@/components/JsonLd';
import { negociosParaDemo } from '@/lib/demo';
import { SITIO } from '@/content/sitio';
import { obtenerPreguntas, obtenerWhatsapp } from '@/lib/ajustes';

export const metadata: Metadata = {
  title: { absolute: 'Agentes de WhatsApp e Instagram para pymes en Chile | Corevenlabs' },
  description:
    'Tus clientes escriben a cualquier hora y le compran al que contesta primero. Armamos agentes que responden al instante, toman pedidos, cotizan y agendan. Pruébalo aquí.',
  alternates: { canonical: '/' },
  openGraph: { url: '/', title: 'Le compran al que contesta primero | Corevenlabs' },
};

const negocio = (whatsapp: string) => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITIO.nombre,
  url: SITIO.url,
  logo: `${SITIO.url}/icon.svg`,
  description: SITIO.descripcion,
  telephone: `+${whatsapp}`,
  areaServed: { '@type': 'Country', name: 'Chile' },
  address: { '@type': 'PostalAddress', addressLocality: SITIO.ciudad, addressCountry: SITIO.pais },
  sameAs: [SITIO.instagram, `https://wa.me/${whatsapp}`],
});

const faq = (preguntas: { p: string; r: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: preguntas.map((q) => ({
    '@type': 'Question',
    name: q.p,
    acceptedAnswer: { '@type': 'Answer', text: q.r },
  })),
});

export default async function Inicio() {
  const [whatsapp, preguntas] = await Promise.all([obtenerWhatsapp(), obtenerPreguntas()]);
  return (
    <>
      <JsonLd datos={preguntas.length ? [negocio(whatsapp), faq(preguntas)] : [negocio(whatsapp)]} />
      <Hero negocios={negociosParaDemo()} />
      <Banda />
      <QueHace />
      <Rubros />
      <ComoFunciona />
      <Precios />
      <Servicios />
      <Preguntas />
      <Laudus />
      <Cierre />
    </>
  );
}
