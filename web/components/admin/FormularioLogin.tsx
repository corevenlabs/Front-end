'use client';

import { useActionState } from 'react';
import { iniciarSesion } from '@/app/admin/sesion-acciones';
import s from './Admin.module.css';

export function FormularioLogin({ desde }: { desde: string }) {
  const [estado, accion, enviando] = useActionState(iniciarSesion, null);
  return (
    <form action={accion} className={s.form}>
      <input type="hidden" name="desde" value={desde} />
      <label className={s.campo}>
        <span>Usuario</span>
        <input name="usuario" autoComplete="username" required autoFocus />
      </label>
      <label className={s.campo}>
        <span>Contraseña</span>
        <input name="clave" type="password" autoComplete="current-password" required />
      </label>
      {estado?.error && <p className={s.error} role="alert">{estado.error}</p>}
      <button className="btn btn-negro" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
    </form>
  );
}
