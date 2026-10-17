import type { Metadata } from 'next';
import Link from 'next/link';
import { ESTADOS, contarPorEstado, listarProspectos, rubros } from '@/lib/crm';
import { exigirAdmin, fecha } from '@/lib/admin';
import { hayBase } from '@/lib/db';
import { Estado, Puntaje, SinBase } from '@/components/admin/Piezas';
import s from '@/components/admin/Admin.module.css';

export const metadata: Metadata = { title: 'Prospectos' };

const ORDENES = [
  ['puntaje', 'Puntaje'],
  ['reciente', 'Actividad reciente'],
  ['creado', 'Más nuevos'],
  ['nombre', 'Nombre'],
] as const;

export default async function Prospectos(props: PageProps<'/admin'>) {
  await exigirAdmin();
  if (!hayBase()) return <SinBase />;

  const sp = await props.searchParams;
  const uno = (k: string) => (typeof sp[k] === 'string' ? (sp[k] as string) : '');
  const filtros = { estado: uno('estado'), rubro: uno('rubro'), texto: uno('q').trim(), orden: uno('orden') || 'puntaje' };

  const [lista, conteos, listaRubros] = await Promise.all([listarProspectos(filtros), contarPorEstado(), rubros()]);
  const total = Object.values(conteos).reduce((a, n) => a + n, 0);

  const enlace = (estado: string) => {
    const q = new URLSearchParams({ ...(estado && { estado }), ...(filtros.rubro && { rubro: filtros.rubro }), ...(filtros.texto && { q: filtros.texto }), orden: filtros.orden });
    return `/admin?${q}`;
  };

  return (
    <>
      <div className={s.cabeza}>
        <h1>Prospectos</h1>
        <span className="mono">{lista.length} de {total}</span>
      </div>

      <nav className={s.pestanas} aria-label="Filtrar por estado">
        <Link href={enlace('')} aria-current={!filtros.estado ? 'page' : undefined}>Todos <b>{total}</b></Link>
        {ESTADOS.filter((e) => conteos[e]).map((e) => (
          <Link key={e} href={enlace(e)} aria-current={filtros.estado === e ? 'page' : undefined}>{e} <b>{conteos[e]}</b></Link>
        ))}
      </nav>

      <form className={s.filtros} method="get">
        {filtros.estado && <input type="hidden" name="estado" value={filtros.estado} />}
        <label className={s.campo}>
          <span>Buscar</span>
          <input name="q" defaultValue={filtros.texto} placeholder="Nombre, comuna, notas, teléfono…" />
        </label>
        <label className={s.campo}>
          <span>Rubro</span>
          <select name="rubro" defaultValue={filtros.rubro}>
            <option value="">Todos</option>
            {listaRubros.map((r) => <option key={r}>{r}</option>)}
          </select>
        </label>
        <label className={s.campo}>
          <span>Orden</span>
          <select name="orden" defaultValue={filtros.orden}>
            {ORDENES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
        </label>
        <button className="btn btn-negro">Filtrar</button>
      </form>

      {lista.length ? (
        <ul className={s.tabla}>
          {lista.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/prospectos/${p.id}`} className={s.fila}>
                <Puntaje valor={p.puntaje} />
                <span className={s.filaDatos}>
                  <b>{p.nombre}</b>
                  <small>{[p.rubro, p.comuna].filter(Boolean).join(' · ') || p.fuente}</small>
                </span>
                <Estado estado={p.estado} />
                <span className={`${s.filaFecha} mono`}>{fecha(p.actualizado)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={s.vacio}>No hay prospectos con esos filtros.</p>
      )}
    </>
  );
}
