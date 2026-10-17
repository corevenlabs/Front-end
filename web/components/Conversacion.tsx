import { DobleCheck } from './Iconos';
import type { Mensaje } from '@/content/rubros';
import s from './ChatDemo.module.css';

// Conversación de ejemplo fija (sin IA), con el mismo aspecto que el chat de la demo.
export function Conversacion({ nombre, iniciales, mensajes }: { nombre: string; iniciales: string; mensajes: Mensaje[] }) {
  return (
    <figure className={s.envoltura} style={{ margin: 0 }}>
      <div className={s.chat}>
        <div className={s.cabecera}>
          <span className={s.avatar} aria-hidden="true">{iniciales}</span>
          <div className={s.quien}>
            <b>{nombre}</b>
            <small>agente de atención · conversación de ejemplo</small>
          </div>
          <span className={s.etiqueta}>Ejemplo</span>
        </div>
        <div className={s.mensajes} style={{ height: 'auto' }}>
          {mensajes.map((m, i) => (
            <div key={i} className={`${s.burbuja} ${m.de === 'cliente' ? s.cliente : s.agente}`}>
              <span className="sr-only">{m.de === 'cliente' ? 'Cliente:' : 'Agente:'}</span>
              {m.texto}
              <span className={s.meta}>
                {m.hora}
                {m.de === 'cliente' && <DobleCheck className={s.check} titulo="leído" />}
              </span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className={s.aviso}>Negocio ficticio. Precios y datos inventados para el ejemplo.</figcaption>
    </figure>
  );
}
