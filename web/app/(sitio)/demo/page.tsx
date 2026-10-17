import type { Metadata } from 'next';
import { ChatDemo } from '@/components/ChatDemo';
import { Reloj } from '@/components/Reloj';
import { Banda, Cierre } from '@/components/Secciones';
import { DobleCheck } from '@/components/Iconos';
import { negociosParaDemo } from '@/lib/demo';
import s from '@/components/Pagina.module.css';

export const metadata: Metadata = {
  title: 'Prueba un agente de WhatsApp',
  description:
    'Escríbele a un agente de ejemplo como si fueras cliente: un restaurante de ramen, una joyería a medida o una empresa de remodelación. Responde en segundos.',
  alternates: { canonical: '/demo' },
  openGraph: { url: '/demo', title: 'Prueba un agente de WhatsApp | Corevenlabs' },
};

const COMO = [
  'Elige un negocio de ejemplo arriba del chat.',
  'Escríbele como si fueras cliente: precios, horarios, despacho, plazos.',
  'Fíjate en el tiempo de respuesta bajo cada mensaje.',
];

export default function Demo() {
  return (
    <>
      <div className={`contenedor ${s.conChat}`}>
        <div className={s.cab}>
          <p className="etiqueta">Demo</p>
          <h1 className={s.titulo}>Escríbele como si fueras cliente</h1>
          <p className={s.bajada}>Tres negocios inventados por nosotros, con su carta, precios, horarios y políticas. El agente solo sabe lo que está en su ficha, igual que el tuyo.</p>
        </div>
        <div className={s.detalle}>
          <h2 className={s.subtitulo}>Cómo probarlo</h2>
          <ul className={s.lista}>
            {COMO.map((c) => <li key={c}><DobleCheck />{c}</li>)}
          </ul>
          <p className="bajada" style={{ marginTop: 20, fontSize: 15 }}>
            La demo tiene un límite de mensajes por día. No escribas datos personales: es solo un ejemplo.
          </p>
        </div>
        <div className={s.chatCol}>
          <Reloj />
          <ChatDemo negocios={negociosParaDemo()} />
        </div>
      </div>
      <Banda />
      <Cierre />
    </>
  );
}
