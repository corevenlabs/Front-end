import Link from 'next/link';
import { plantillaPorSlug } from '@/content/plantillas-propuesta';
import { fechaSantiago } from '@/lib/limites';
import { pesos, totales } from '@/lib/propuesta';
import type { PropuestaGuardada } from '@/lib/propuestas';
import s from './Admin.module.css';

const corta = (iso: string) => iso.split('-').reverse().join('-');

// Lista de propuestas: en /admin/propuestas y en la ficha de cada prospecto.
export function TablaPropuestas({ lista, conCliente = true }: { lista: PropuestaGuardada[]; conCliente?: boolean }) {
  const hoy = fechaSantiago();
  return (
    <ul className={s.tabla}>
      {lista.map((p) => {
        const t = totales(p.datos);
        const vencida = p.vence < hoy;
        return (
          <li key={p.id} className={s.filaPropuesta}>
            <Link href={`/admin/propuestas/${p.id}`} className={s.filaDatos}>
              <b><span className="mono">{p.numero}</span>{conCliente && ` · ${p.cliente}`}</b>
              <small>
                {p.datos.titulo || plantillaPorSlug(p.plantilla)?.nombre}
                {t.unico.neto ? ` · ${pesos(t.unico.total)} IVA incl.` : ''}
                {t.mensual ? ` · ${pesos(t.mensual.neto)} + IVA al mes` : ''}
              </small>
            </Link>
            <span className={`${s.estado} ${vencida ? s.eCerrado : s.eNuevo}`}>{vencida ? 'vencida' : `vigente al ${corta(p.vence)}`}</span>
            <a className={s.botonChico} href={`/admin/propuestas/${p.id}/pdf?descargar=1`}>PDF</a>
          </li>
        );
      })}
    </ul>
  );
}
