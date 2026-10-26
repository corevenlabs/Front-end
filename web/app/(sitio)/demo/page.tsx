import type { Metadata } from 'next';
import { metadatos } from '@/lib/seo';
import { ChatDemo } from '@/components/ChatDemo';
import { Reloj } from '@/components/Reloj';
import { Banda, Cierre } from '@/components/Secciones';
import { DobleCheck } from '@/components/Iconos';
import { negociosParaDemo } from '@/lib/demo';
import s from '@/components/Pagina.module.css';
import telefono from '@/components/Secciones.module.css';

export const metadata: Metadata = metadatos({
  ruta: '/demo',
  titulo: 'Demo gratis de chatbot de WhatsApp con IA',
  descripcion: 'Pruebe un chatbot de WhatsApp con IA como si fuera cliente de tres negocios de ejemplo: un restaurante, una joyería y una empresa de remodelación.',
});

const COMO = [
  'Elegir un negocio de ejemplo sobre el chat.',
  'Escribir como lo haría un cliente: precios, horarios, despacho, plazos.',
  'Observar el tiempo de respuesta bajo cada mensaje.',
];

export default function Demo() {
  return (
    <div data-home-motion>
      <div className={`contenedor ${s.conChat}`}>
        <div className={s.cab}>
          <p className="etiqueta">Demo</p>
          <h1 data-motion="hero" className={s.titulo}>Pruebe el agente como si fuera cliente</h1>
          <p data-motion="hero" className={s.bajada}>Tres negocios inventados por nosotros, con su carta, precios, horarios y políticas. El agente solo sabe lo que está en su ficha, igual que el de un negocio real.</p>
        </div>
        <div className={s.detalle}>
          <h2 data-motion="entrada" className={s.subtitulo}>Cómo probarlo</h2>
          <ul className={s.lista} data-motion-group>
            {COMO.map((c) => <li key={c} data-motion="entrada"><DobleCheck />{c}</li>)}
          </ul>
          <p data-motion="entrada" className="bajada" style={{ marginTop: 20, fontSize: 15 }}>
            La demo tiene un límite de mensajes por día. Por favor, no escriba datos personales: es solo un ejemplo.
          </p>
        </div>
        <div data-motion="entrada" className={`${s.chatCol} ${telefono.heroDemo}`}>
          <Reloj />
          <div className={telefono.escenaTelefono}>
            <div className={telefono.telefonoFrente}>
              <ChatDemo negocios={negociosParaDemo()} compacto telefono />
            </div>
          </div>
        </div>
      </div>
      <Banda />
      <Cierre />
    </div>
  );
}
