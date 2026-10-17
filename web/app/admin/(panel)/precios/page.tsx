import type { Metadata } from 'next';
import { CLAVES_PRECIO, PRECIOS_BASE } from '@/content/precios';
import { obtenerPrecios } from '@/lib/precios';
import { exigirAdmin } from '@/lib/admin';
import { hayBase } from '@/lib/db';
import { Aviso, SinBase } from '@/components/admin/Piezas';
import { guardarPrecios } from '../../acciones';
import s from '@/components/admin/Admin.module.css';

export const metadata: Metadata = { title: 'Precios' };

const PERIODOS = ['pago único', 'al mes', 'al año'];

export default async function Precios(props: PageProps<'/admin/precios'>) {
  await exigirAdmin();
  if (!hayBase()) return <SinBase />;
  const { ok } = await props.searchParams;
  const precios = await obtenerPrecios();

  return (
    <>
      <div className={s.cabeza}><h1>Precios</h1></div>
      <p className={s.tenue}>Montos «desde», en pesos y sin IVA. Deja el monto vacío para mostrar «A cotizar». Al guardar, el sitio se actualiza en segundos.</p>
      {ok && <Aviso>Precios guardados. El sitio ya muestra los nuevos valores.</Aviso>}
      <form action={guardarPrecios} className={s.form}>
        <div className={s.tablaPrecios}>
          <table>
            <thead><tr><th>Servicio</th><th>Desde ($)</th><th>Tipo</th></tr></thead>
            <tbody>
              {CLAVES_PRECIO.map((k) => (
                <tr key={k}>
                  <td><label htmlFor={`desde_${k}`}>{PRECIOS_BASE[k].nombre}</label></td>
                  <td>
                    <input id={`desde_${k}`} name={`desde_${k}`} inputMode="numeric" pattern="[0-9.]*" placeholder="A cotizar"
                      defaultValue={precios[k].desde === null ? '' : precios[k].desde.toLocaleString('es-CL')} />
                  </td>
                  <td>
                    <select name={`periodo_${k}`} defaultValue={precios[k].periodo} aria-label={`Tipo de pago de ${PRECIOS_BASE[k].nombre}`}>
                      {[...new Set([...PERIODOS, precios[k].periodo])].map((pp) => <option key={pp}>{pp}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div><button className="btn btn-negro">Guardar precios</button></div>
      </form>
    </>
  );
}
