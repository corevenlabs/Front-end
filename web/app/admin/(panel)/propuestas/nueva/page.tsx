import type { Metadata } from 'next';
import Link from 'next/link';
import { listarProspectos, obtenerProspecto } from '@/lib/crm';
import { exigirAdmin } from '@/lib/admin';
import { hayBase } from '@/lib/db';
import { obtenerPrecios } from '@/lib/precios';
import { obtenerPropuesta } from '@/lib/propuestas';
import { PLANTILLAS, plantillaPorSlug, propuestaInicial } from '@/content/plantillas-propuesta';
import { textoPrecio } from '@/content/precios';
import { SinBase } from '@/components/admin/Piezas';
import { EditorPropuesta } from '@/components/admin/EditorPropuesta';
import s from '@/components/admin/Admin.module.css';

export const metadata: Metadata = { title: 'Nueva propuesta' };

const SIN_CONTACTO = 'ninguno';
const ANTES_DE_PROPUESTA = ['nuevo', 'para revisar', 'contactado', 'reunión'];

// Paso 1: elegir template y contacto (formulario GET). Paso 2: editor con los datos ya cargados.
// ?desde=ID parte de una propuesta anterior (nueva versión, con número nuevo).
export default async function NuevaPropuesta(props: PageProps<'/admin/propuestas/nueva'>) {
  await exigirAdmin();
  if (!hayBase()) return <SinBase />;

  const sp = await props.searchParams;
  const uno = (k: string) => (typeof sp[k] === 'string' ? (sp[k] as string) : '');
  const idDesde = Number(uno('desde'));
  const anterior = Number.isInteger(idDesde) && idDesde > 0 ? await obtenerPropuesta(idDesde) : null;

  const plantilla = plantillaPorSlug(anterior?.plantilla ?? uno('plantilla'));
  const valorContacto = anterior ? String(anterior.prospecto_id ?? SIN_CONTACTO) : uno('prospecto');
  const idProspecto = Number(valorContacto);
  const prospecto = Number.isInteger(idProspecto) && idProspecto > 0 ? await obtenerProspecto(idProspecto) : null;
  const contactoElegido = !!anterior || valorContacto === SIN_CONTACTO || !!prospecto;

  if (plantilla && contactoElegido) {
    const inicial = anterior?.datos ?? propuestaInicial(plantilla, await obtenerPrecios(), prospecto);
    const volver = anterior ? `/admin/propuestas/${anterior.id}` : `/admin/propuestas/nueva?prospecto=${valorContacto}`;
    return (
      <>
        <p className={s.volver}><Link href={volver}>← {anterior ? anterior.numero : 'Cambiar template o contacto'}</Link></p>
        <div className={s.cabeza}>
          <h1>{anterior ? 'Nueva versión' : 'Nueva propuesta'}</h1>
          <span className="mono">{plantilla.nombre}{prospecto ? ` · ${prospecto.nombre}` : ''}</span>
        </div>
        <EditorPropuesta
          inicial={inicial}
          prospecto={prospecto && { id: prospecto.id, nombre: prospecto.nombre, estado: prospecto.estado }}
          puedeMoverEstado={!!prospecto && ANTES_DE_PROPUESTA.includes(prospecto.estado)}
        />
      </>
    );
  }

  const [lista, precios] = await Promise.all([listarProspectos({ orden: 'reciente' }), obtenerPrecios()]);
  const elegida = uno('plantilla');

  return (
    <>
      <p className={s.volver}><Link href="/admin/propuestas">← Propuestas</Link></p>
      <div className={s.cabeza}><h1>Nueva propuesta</h1></div>
      <form method="get" className={s.form}>
        <fieldset className={s.bloque}>
          <legend><h2>1. Template</h2></legend>
          <div className={s.plantillas}>
            {PLANTILLAS.map((p, i) => {
              const precio = p.cargos[0]?.precio;
              return (
                <label key={p.slug} className={s.plantilla}>
                  <input type="radio" name="plantilla" value={p.slug} required defaultChecked={elegida ? elegida === p.slug : i === 0} />
                  <b>{p.nombre}</b>
                  <small>{precio ? textoPrecio(precios[precio]) : 'En blanco, para proyectos especiales'}</small>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className={s.bloque}>
          <legend><h2>2. Contacto</h2></legend>
          <label className={s.campo}>
            <span>Prospecto o cliente del CRM</span>
            <select name="prospecto" defaultValue={valorContacto || SIN_CONTACTO} required>
              <option value={SIN_CONTACTO}>Sin contacto del CRM (completar a mano)</option>
              {lista.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} · {p.estado}{p.fuente ? ` · ${p.fuente}` : ''}
                </option>
              ))}
            </select>
          </label>
          <p className={s.tenue}>Ordenados por actividad reciente. Los datos del contacto se cargan en la propuesta y puedes completarlos ahí.</p>
        </fieldset>

        <div><button className="btn btn-negro">Continuar</button></div>
      </form>
    </>
  );
}
