'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { DobleCheck, Flecha } from './Iconos';
import { enlaceWhatsapp } from '@/content/sitio';
import s from './ChatDemo.module.css';

export type NegocioDemo = {
  slug: string;
  corto: string;
  nombre: string;
  iniciales: string;
  sugeridas: string[];
  ejemplo: { de: 'cliente' | 'agente'; texto: string; hora: string }[];
};

type Linea = { id: number; de: 'cliente' | 'agente'; texto: string; hora: string; ms?: number; error?: boolean };

const MAX_CARACTERES = 300;
const RESPUESTAS_ANTES_DEL_CTA = 3;

export function horaSantiago(fecha = new Date()) {
  return new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(fecha);
}

let siguienteId = 1;
const conId = (l: Omit<Linea, 'id'>): Linea => ({ ...l, id: siguienteId++ });

export function ChatDemo({ negocios, compacto = false, inicial, idCampo = 'demo-mensaje' }: {
  negocios: NegocioDemo[]; compacto?: boolean; inicial?: string; idCampo?: string;
}) {
  const [slug, setSlug] = useState(negocios.some((n) => n.slug === inicial) ? inicial! : negocios[0].slug);
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [usadas, setUsadas] = useState<string[]>([]);
  const [texto, setTexto] = useState('');
  const [esperando, setEsperando] = useState(false);
  const lista = useRef<HTMLDivElement>(null);
  const negocio = negocios.find((n) => n.slug === slug)!;
  const respuestas = lineas.filter((l) => l.de === 'agente' && !l.error).length;

  useEffect(() => {
    lista.current?.scrollTo({ top: lista.current.scrollHeight, behavior: 'smooth' });
  }, [lineas, esperando]);

  function cambiarRubro(nuevo: string) {
    if (nuevo === slug || esperando) return;
    setSlug(nuevo);
    setLineas([]);
    setUsadas([]);
    setTexto('');
  }

  async function enviar(mensaje: string) {
    const limpio = mensaje.trim().slice(0, MAX_CARACTERES);
    if (!limpio || esperando) return;
    const historial = [...lineas.filter((l) => !l.error), conId({ de: 'cliente', texto: limpio, hora: horaSantiago() })];
    setLineas(historial);
    setTexto('');
    setEsperando(true);
    const inicio = performance.now();
    try {
      const r = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rubro: slug,
          mensajes: historial.map((l) => ({ de: l.de, texto: l.texto })),
        }),
      });
      const datos = await r.json().catch(() => ({}));
      const ms = Math.round(performance.now() - inicio);
      if (!r.ok || !datos.respuesta) {
        setLineas((ls) => [...ls, conId({
          de: 'agente', error: true, hora: horaSantiago(),
          texto: datos.error || 'No pude responder ahora. Intenta de nuevo en un momento.',
        })]);
      } else {
        setLineas((ls) => [...ls, conId({ de: 'agente', texto: datos.respuesta, hora: horaSantiago(), ms })]);
      }
    } catch {
      setLineas((ls) => [...ls, conId({
        de: 'agente', error: true, hora: horaSantiago(), texto: 'Se cortó la conexión. Revisa tu internet e intenta de nuevo.',
      })]);
    } finally {
      setEsperando(false);
    }
  }

  const sugeridas = negocio.sugeridas.filter((p) => !usadas.includes(p));

  return (
    <div className={`${s.envoltura} ${compacto ? s.compacto : ''}`}>
      <div className={s.chat}>
        <div className={s.cabecera}>
          <span className={s.avatar} aria-hidden="true">{negocio.iniciales}</span>
          <div className={s.quien}>
            <b>{negocio.nombre}</b>
            <small>{esperando ? 'escribiendo…' : 'agente de atención · responde al instante'}</small>
          </div>
          <span className={s.etiqueta}>Ejemplo</span>
        </div>

        <div className={s.rubros} role="group" aria-label="Elige el negocio de ejemplo">
          {negocios.map((n) => (
            <button
              key={n.slug}
              type="button"
              aria-pressed={n.slug === slug}
              className={s.rubro}
              onClick={() => cambiarRubro(n.slug)}
            >
              {n.corto}
            </button>
          ))}
        </div>

        <div className={s.mensajes} ref={lista} aria-live="polite" aria-relevant="additions">
          {negocio.ejemplo.map((m, i) => (
            <Burbuja key={`ej-${slug}-${i}`} de={m.de} texto={m.texto} hora={m.hora} />
          ))}
          <p className={s.separador}><span>Ahora escríbele tú, como si fueras cliente</span></p>
          {lineas.map((l) => (
            <Burbuja key={l.id} {...l} nuevo />
          ))}
          {esperando && <div className={s.escribiendo} aria-label="El agente está escribiendo"><i /><i /><i /></div>}
          {respuestas >= RESPUESTAS_ANTES_DEL_CTA && !esperando && (
            <div className={s.cta}>
              <b>¿Lo quieres para tu negocio?</b>
              <span>Lo armamos con tus precios, horarios y tu forma de hablar.</span>
              <a className="btn btn-primario" href={enlaceWhatsapp('Hola, probé la demo y quiero un agente para mi negocio')} target="_blank" rel="noopener noreferrer">
                Escríbenos por WhatsApp <Flecha />
              </a>
            </div>
          )}
        </div>

        {sugeridas.length > 0 && (
          <div className={s.sugeridas}>
            {sugeridas.map((p) => (
              <button key={p} type="button" className={s.sugerida} disabled={esperando}
                onClick={() => { setUsadas((u) => [...u, p]); enviar(p); }}>
                {p}
              </button>
            ))}
          </div>
        )}

        <form className={s.entrada} onSubmit={(e) => { e.preventDefault(); enviar(texto); }}>
          <label htmlFor={idCampo} className="sr-only">Tu mensaje para el agente</label>
          <input
            id={idCampo}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={MAX_CARACTERES}
            placeholder="Escribe tu pregunta…"
            autoComplete="off"
            enterKeyHint="send"
          />
          <button type="submit" className={s.enviar} disabled={esperando || !texto.trim()} aria-label="Enviar mensaje">
            <Flecha />
          </button>
        </form>
      </div>
      <p className={s.aviso}>
        Negocio ficticio, solo de ejemplo. No escribas datos personales. <Link href="/terminos-demo">Términos de la demo</Link>
      </p>
    </div>
  );
}

function Burbuja({ de, texto, hora, ms, error, nuevo }: Omit<Linea, 'id'> & { nuevo?: boolean }) {
  return (
    <div className={`${s.burbuja} ${de === 'cliente' ? s.cliente : s.agente} ${error ? s.error : ''} ${nuevo ? s.nuevo : ''}`}>
      <span className="sr-only">{de === 'cliente' ? 'Cliente:' : 'Agente:'}</span>
      {texto}
      <span className={s.meta}>
        {ms !== undefined && <span className={s.tiempo}>respondido en {Math.max(ms / 1000, 0.1).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s ·</span>}
        {hora}
        {de === 'cliente' && <DobleCheck className={s.check} titulo="leído" />}
      </span>
    </div>
  );
}
