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

export function ChatDemo({ negocios, compacto = false, telefono = false, soloEjemplo = false, inicial, idCampo = 'demo-mensaje' }: {
  negocios: NegocioDemo[]; compacto?: boolean; telefono?: boolean; soloEjemplo?: boolean; inicial?: string; idCampo?: string;
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
    if (soloEjemplo) return;
    lista.current?.scrollTo({ top: lista.current.scrollHeight, behavior: 'smooth' });
  }, [lineas, esperando, soloEjemplo]);

  function cambiarRubro(nuevo: string) {
    if (nuevo === slug || esperando || soloEjemplo) return;
    setSlug(nuevo);
    setLineas([]);
    setUsadas([]);
    setTexto('');
  }

  async function enviar(mensaje: string) {
    const limpio = mensaje.trim().slice(0, MAX_CARACTERES);
    if (!limpio || esperando || soloEjemplo) return;
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
          texto: datos.error || 'No pude responder ahora. Intente de nuevo en un momento.',
        })]);
      } else {
        setLineas((ls) => [...ls, conId({ de: 'agente', texto: datos.respuesta, hora: horaSantiago(), ms })]);
      }
    } catch {
      setLineas((ls) => [...ls, conId({
        de: 'agente', error: true, hora: horaSantiago(), texto: 'Se cortó la conexión. Revise su internet e intente de nuevo.',
      })]);
    } finally {
      setEsperando(false);
    }
  }

  const sugeridas = negocio.sugeridas.filter((p) => !usadas.includes(p));

  return (
    <div className={`${s.envoltura} ${compacto ? s.compacto : ''} ${telefono ? s.telefono : ''}`}>
      <div className={s.chat}>
        <div className={s.pantalla}>
        {telefono && (
          <div className={s.estadoTelefono} aria-hidden="true">
            <span>13:35</span><span className={s.isla} /><span className={s.conexion}>
              <svg viewBox="0 0 32 16" fill="currentColor"><rect x="1" y="10" width="3" height="5" rx="1" /><rect x="6" y="7" width="3" height="8" rx="1" /><rect x="11" y="3" width="3" height="12" rx="1" /><path d="M18 6q6-6 12 0l-2 2q-4-4-8 0zm3 4q3-3 6 0l-3 4z" /></svg>
              <span className={s.bateria} />
            </span>
          </div>
        )}
        <div className={s.cabecera}>
          {telefono && <span className={s.atrasTelefono} aria-hidden="true">‹</span>}
          <span className={s.avatar} aria-hidden="true">{negocio.iniciales}</span>
          <div className={s.quien}>
            <b>{negocio.nombre}</b>
            <small>{soloEjemplo ? 'Conversación de ejemplo' : esperando ? 'escribiendo…' : telefono ? 'Agente IA · en línea' : 'agente de atención · responde al instante'}</small>
          </div>
          {telefono && <svg className={s.iconoLlamada} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m7 3 3 5-2 2c1 3 3 5 6 6l2-2 5 3-1 3c-1 3-8 0-12-4S1 5 4 4z" /></svg>}
          <span className={s.etiqueta}>Ejemplo</span>
        </div>

        {telefono ? (
          <label className={s.selectorNegocio}>
            <span>Negocio de ejemplo</span>
            <select value={slug} onChange={(e) => cambiarRubro(e.target.value)} disabled={esperando || soloEjemplo}>
              {negocios.map((n) => <option key={n.slug} value={n.slug}>{n.corto}</option>)}
            </select>
          </label>
        ) : <div className={s.rubros} role="group" aria-label="Negocio de ejemplo">
          {negocios.map((n) => (
            <button
              key={n.slug}
              disabled={esperando || soloEjemplo}
              type="button"
              aria-pressed={n.slug === slug}
              className={s.rubro}
              onClick={() => cambiarRubro(n.slug)}
            >
              {n.corto}
            </button>
          ))}
        </div>}

        <div className={s.mensajes} ref={lista} aria-live="polite" aria-relevant="additions">
          {negocio.ejemplo.map((m, i) => (
            <Burbuja key={`ej-${slug}-${i}`} de={m.de} texto={m.texto} hora={m.hora} />
          ))}
          <p className={s.separador}><span>{soloEjemplo ? 'Ejemplo ilustrativo' : telefono ? 'Ahora prueba tú' : 'Ahora pruebe usted, como si fuera cliente'}</span></p>
          {lineas.map((l) => (
            <Burbuja key={l.id} {...l} nuevo />
          ))}
          {esperando && <div className={s.escribiendo} aria-label="El agente está escribiendo"><i /><i /><i /></div>}
          {respuestas >= RESPUESTAS_ANTES_DEL_CTA && !esperando && (
            <div className={s.cta}>
              <b>¿Lo quiere para su negocio?</b>
              <span>Lo armamos con sus precios, horarios y su forma de atender.</span>
              <a className="btn btn-primario" href={enlaceWhatsapp('Hola, probé la demo y quiero un agente para mi negocio')} target="_blank" rel="noopener noreferrer">
                Escríbenos por WhatsApp <Flecha />
              </a>
            </div>
          )}
        </div>

        {sugeridas.length > 0 && (
          <div className={s.sugeridas}>
            {sugeridas.map((p) => (
              <button key={p} type="button" className={s.sugerida} disabled={esperando || soloEjemplo}
                onClick={() => { setUsadas((u) => [...u, p]); enviar(p); }}>
                {p}
              </button>
            ))}
          </div>
        )}

        <form className={s.entrada} onSubmit={(e) => { e.preventDefault(); enviar(texto); }}>
          {telefono && <button type="button" disabled={soloEjemplo} className={s.masTelefono} aria-label="Escribir una pregunta" onClick={() => document.getElementById(idCampo)?.focus()}>+</button>}
          <label htmlFor={idCampo} className="sr-only">Mensaje para el agente</label>
          <input
            id={idCampo}
            value={texto}
            disabled={soloEjemplo}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={MAX_CARACTERES}
            placeholder={soloEjemplo ? 'Conversación de ejemplo' : telefono ? 'Escribe un mensaje…' : 'Escriba su pregunta…'}
            autoComplete="off"
            enterKeyHint="send"
          />
          <button type="submit" className={s.enviar} disabled={soloEjemplo || esperando || !texto.trim()} aria-label="Enviar mensaje">
            <Flecha />
          </button>
        </form>
        {telefono && <div className={s.zonaSegura} aria-hidden="true"><span /></div>}
        </div>
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
