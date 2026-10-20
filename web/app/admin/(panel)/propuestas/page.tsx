import type { Metadata } from 'next';
import Link from 'next/link';
import { exigirAdmin } from '@/lib/admin';
import { hayBase } from '@/lib/db';
import { listarPropuestas } from '@/lib/propuestas';
import { SinBase } from '@/components/admin/Piezas';
import { TablaPropuestas } from '@/components/admin/TablaPropuestas';
import s from '@/components/admin/Admin.module.css';

export const metadata: Metadata = { title: 'Propuestas' };

export default async function Propuestas() {
  await exigirAdmin();
  if (!hayBase()) return <SinBase />;
  const lista = await listarPropuestas();

  return (
    <>
      <div className={s.cabeza}>
        <h1>Propuestas</h1>
        <span className="mono">{lista.length}</span>
        <Link href="/admin/propuestas/nueva" className={`btn btn-negro ${s.cabezaBoton}`}>Nueva propuesta</Link>
      </div>
      <p className={s.tenue}>Propuestas cortas con precio, IVA y 30 días de vigencia. El detalle del proyecto va en el acuerdo de servicios.</p>
      {lista.length ? <TablaPropuestas lista={lista} /> : <p className={s.vacio}>Todavía no hay propuestas.</p>}
    </>
  );
}
