import type { Metadata } from 'next';
import Link from 'next/link';
import { contactosWeb } from '@/lib/crm';
import { exigirAdmin, fecha } from '@/lib/admin';
import { hayBase } from '@/lib/db';
import { Estado, SinBase } from '@/components/admin/Piezas';
import s from '@/components/admin/Admin.module.css';

export const metadata: Metadata = { title: 'Contactos web' };

export default async function Contactos() {
  await exigirAdmin();
  if (!hayBase()) return <SinBase />;
  const lista = await contactosWeb();

  return (
    <>
      <div className={s.cabeza}>
        <h1>Contactos web</h1>
        <span className="mono">{lista.length}</span>
      </div>
      <p className={s.tenue}>Lo que llega desde el formulario de corevenlabs.com, del más reciente al más antiguo.</p>
      {lista.length ? (
        <ul className={s.contactos}>
          {lista.map((c) => {
            const [cabecera, ...resto] = c.detalle.replace(/^Formulario web:\s*/, '').split('\n');
            const mensaje = resto.join('\n').replace(/^«|»$/g, '');
            return (
              <li key={c.actividad_id} className={s.contacto}>
                <div className={s.contactoCabeza}>
                  <Link href={`/admin/prospectos/${c.id}`}><b>{c.nombre}</b></Link>
                  <Estado estado={c.estado} />
                </div>
                <p>{cabecera}</p>
                {mensaje && <p className={s.cuerpo}>{mensaje}</p>}
                <p className={s.contactoPie}>
                  <span className="mono">{fecha(c.recibido)}</span>
                  {c.telefono && <a href={`https://wa.me/${c.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">Responder por WhatsApp</a>}
                  {c.correo && <a href={`mailto:${c.correo}`}>Responder por correo</a>}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={s.vacio}>Todavía no llegan contactos desde la web.</p>
      )}
    </>
  );
}
