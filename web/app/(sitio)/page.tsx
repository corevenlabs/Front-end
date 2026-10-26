import type { Metadata } from 'next';
import { metadatos } from '@/lib/seo';
import { Hero, Banda, QueHace, Rubros, ComoFunciona, Precios, Servicios, Preguntas, Laudus, Cierre } from '@/components/Secciones';
import { JsonLd } from '@/components/JsonLd';
import { negociosParaDemo } from '@/lib/demo';
import { SITIO } from '@/content/sitio';
import { RESPONSABLE } from '@/content/legal';
import { obtenerPreguntas, obtenerWhatsapp } from '@/lib/ajustes';

export const metadata: Metadata = metadatos({
  ruta: '/',
  titulo: 'Chatbot de WhatsApp con IA para pymes en Chile | Corevenlabs',
  absoluto: true,
  tituloSocial: 'Le compran al que contesta primero',
  descripcion: 'Chatbots con IA para WhatsApp e Instagram que responden al instante, toman pedidos, cotizan y agendan. Pruebe la demo con negocios de ejemplo.',
});

const sitio = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITIO.nombre,
  url: SITIO.url,
  inLanguage: 'es-CL',
};

const negocio = (whatsapp: string) => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITIO.url}/#negocio`,
  name: SITIO.nombre,
  legalName: RESPONSABLE.razonSocial,
  email: RESPONSABLE.correo,
  image: `${SITIO.url}/opengraph-image`,
  url: SITIO.url,
  logo: `${SITIO.url}/icon.svg`,
  description: SITIO.descripcion,
  telephone: `+${whatsapp}`,
  areaServed: { '@type': 'Country', name: 'Chile' },
  address: { '@type': 'PostalAddress', addressLocality: SITIO.ciudad, addressCountry: SITIO.pais },
  sameAs: [SITIO.instagram, SITIO.laudus, `https://wa.me/${whatsapp}`],
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
      <JsonLd datos={preguntas.length ? [sitio, negocio(whatsapp), faq(preguntas)] : [sitio, negocio(whatsapp)]} />
      <div data-home-motion>
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
      </div>
    </>
  );
}
