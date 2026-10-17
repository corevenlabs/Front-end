'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { DobleCheck } from './Iconos';
import { LIMITES, validar, type DatosContacto, type Errores } from '@/lib/contacto';
import s from './FormularioContacto.module.css';

const VACIO: DatosContacto = { nombre: '', negocio: '', contacto: '', mensaje: '', acepta: false };

export function FormularioContacto() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<'listo' | 'enviando' | 'enviado' | 'error'>('listo');
  const [errorGeneral, setErrorGeneral] = useState('');
  const inicio = useRef(0);
  useEffect(() => { inicio.current = Date.now(); }, []); // tiempo de llenado: los bots envían al instante

  const campo = (k: keyof DatosContacto) => ({
    id: `contacto-${k}`,
    name: k,
    'aria-invalid': errores[k] ? true : undefined,
    'aria-describedby': errores[k] ? `contacto-${k}-error` : undefined,
  });

  async function enviar(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const e = validar(datos);
    setErrores(e);
    if (Object.keys(e).length) {
      document.getElementById(`contacto-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setEstado('enviando');
    const trampa = new FormData(ev.currentTarget).get('sitio_web');
    try {
      const r = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...datos, sitio_web: trampa, t: Date.now() - inicio.current }),
      });
      const res = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (res.errores) setErrores(res.errores);
        setErrorGeneral(res.error || 'No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp.');
        setEstado('error');
        return;
      }
      setEstado('enviado');
    } catch {
      setErrorGeneral('Se cortó la conexión. Revisa tu internet e intenta de nuevo.');
      setEstado('error');
    }
  }

  if (estado === 'enviado') {
    return (
      <div className={s.enviado} role="status">
        <DobleCheck className={s.check} />
        <h2>Recibido, {datos.nombre.split(' ')[0]}.</h2>
        <p>Te escribimos a {datos.contacto.trim()} lo antes posible.</p>
      </div>
    );
  }

  const Error = ({ k }: { k: keyof DatosContacto }) =>
    errores[k] ? <p className={s.error} id={`contacto-${k}-error`}>{errores[k]}</p> : null;

  return (
    <form className={s.form} onSubmit={enviar} noValidate>
      <div className={s.campo}>
        <label htmlFor="contacto-nombre">Tu nombre</label>
        <input {...campo('nombre')} autoComplete="name" maxLength={LIMITES.nombre}
          value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} />
        <Error k="nombre" />
      </div>
      <div className={s.campo}>
        <label htmlFor="contacto-negocio">Tu negocio</label>
        <input {...campo('negocio')} autoComplete="organization" maxLength={LIMITES.negocio} placeholder="Ej: Carnicería Don Lalo, Maipú"
          value={datos.negocio} onChange={(e) => setDatos({ ...datos, negocio: e.target.value })} />
        <Error k="negocio" />
      </div>
      <div className={s.campo}>
        <label htmlFor="contacto-contacto">WhatsApp o correo</label>
        <input {...campo('contacto')} autoComplete="on" maxLength={LIMITES.contacto} placeholder="+56 9 1234 5678 o nombre@correo.cl" inputMode="email"
          value={datos.contacto} onChange={(e) => setDatos({ ...datos, contacto: e.target.value })} />
        <Error k="contacto" />
      </div>
      <div className={s.campo}>
        <label htmlFor="contacto-mensaje">¿Qué te gustaría resolver? <span className={s.opcional}>(opcional)</span></label>
        <textarea {...campo('mensaje')} rows={4} maxLength={LIMITES.mensaje} placeholder="Ej: Nos escriben mucho de noche por pedidos y no alcanzamos a contestar."
          value={datos.mensaje} onChange={(e) => setDatos({ ...datos, mensaje: e.target.value })} />
        <Error k="mensaje" />
      </div>

      {/* Campo trampa: invisible para personas, los bots lo llenan. */}
      <div className={s.trampa} aria-hidden="true">
        <label htmlFor="contacto-sitio">No llenar</label>
        <input id="contacto-sitio" name="sitio_web" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={s.acepta}>
        <input type="checkbox" {...campo('acepta')} checked={datos.acepta}
          onChange={(e) => setDatos({ ...datos, acepta: e.target.checked })} />
        <label htmlFor="contacto-acepta">
          Autorizo a Corevenlabs a usar estos datos para responderme, según la <Link href="/privacidad">política de privacidad</Link>.
        </label>
      </div>
      <Error k="acepta" />

      {estado === 'error' && <p className={s.errorGeneral} role="alert">{errorGeneral}</p>}

      <button type="submit" className="btn btn-primario" disabled={estado === 'enviando'}>
        {estado === 'enviando' ? 'Enviando…' : 'Enviar'}
      </button>
    </form>
  );
}
