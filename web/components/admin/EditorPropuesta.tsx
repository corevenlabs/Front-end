'use client';

import { useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { crearPropuesta } from '@/app/admin/acciones';
import {
  FORMAS_PAGO, IVA, faltantes, leerMonto, partesPago, pesos, totales,
  type Cargo, type Cliente, type DatosPropuesta, type TipoPago,
} from '@/lib/propuesta';
import s from './Admin.module.css';

type ProspectoResumen = { id: number; nombre: string; estado: string } | null;

const CAMPOS_CLIENTE: [keyof Cliente, string, string][] = [
  ['nombre', 'Nombre o nombre de fantasía', 'Nombre del cliente'],
  ['razonSocial', 'Razón social', 'Razón social'],
  ['rut', 'RUT', 'RUT del cliente'],
  ['contacto', 'Persona de contacto', 'Persona de contacto'],
  ['correo', 'Correo', 'Correo o teléfono'],
  ['telefono', 'Teléfono', 'Correo o teléfono'],
  ['comuna', 'Comuna o dirección', ''],
];

const montoTexto = (n: number | null) => (n === null ? '' : n.toLocaleString('es-CL'));

function Generar() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primario" disabled={pending}>
      {pending ? 'Generando…' : 'Generar PDF'}
    </button>
  );
}

function FilaCargo({ cargo, onCambio, onQuitar, etiqueta }: {
  cargo: Cargo; onCambio: (c: Cargo) => void; onQuitar: () => void; etiqueta: string;
}) {
  return (
    <div className={s.cargo}>
      <label className={s.campo}>
        <span>{etiqueta}</span>
        <input value={cargo.descripcion} onChange={(e) => onCambio({ ...cargo, descripcion: e.target.value })} placeholder="Qué se cobra" />
      </label>
      <label className={s.campo}>
        <span>Monto neto ($)</span>
        <input
          value={montoTexto(cargo.monto)} inputMode="numeric" placeholder="Por definir"
          aria-invalid={cargo.monto === null || undefined}
          onChange={(e) => onCambio({ ...cargo, monto: leerMonto(e.target.value) })}
        />
      </label>
      <button type="button" className={s.quitar} onClick={onQuitar} aria-label={`Quitar ${cargo.descripcion || 'ítem'}`}>×</button>
    </div>
  );
}

export function EditorPropuesta({ inicial, prospecto, puedeMoverEstado }: {
  inicial: DatosPropuesta; prospecto: ProspectoResumen; puedeMoverEstado: boolean;
}) {
  const [d, setD] = useState(inicial);
  const [incluyeTexto, setIncluyeTexto] = useState(inicial.incluye.join('\n'));

  const datos = useMemo(
    () => ({ ...d, incluye: incluyeTexto.split('\n').map((x) => x.replace(/^[-•·]\s*/, '').trim()).filter(Boolean) }),
    [d, incluyeTexto],
  );
  const avisos = faltantes(datos);
  const t = totales(datos);
  const partes = datos.pago.tipo === 'ninguna' ? [] : partesPago(datos.pago, t.unico.total);
  const falta = (etiqueta: string) => !!etiqueta && avisos.some((a) => a.startsWith(etiqueta));

  const cliente = (k: keyof Cliente, v: string) => setD({ ...d, cliente: { ...d.cliente, [k]: v } });
  const cargo = (i: number, c: Cargo) => setD({ ...d, cargos: d.cargos.map((x, j) => (j === i ? c : x)) });
  const pago = (cambios: Partial<DatosPropuesta['pago']>) => setD({ ...d, pago: { ...d.pago, ...cambios } });

  return (
    <form action={crearPropuesta} className={s.editor}>
      <input type="hidden" name="datos" value={JSON.stringify(datos)} />
      {prospecto && <input type="hidden" name="prospecto_id" value={prospecto.id} />}

      <div className={s.columna}>
        <fieldset className={s.bloque}>
          <legend><h2>Cliente</h2></legend>
          {!prospecto && <p className={s.tenue}>Sin contacto del CRM: esta propuesta no quedará en el historial de ningún prospecto.</p>}
          <div className={s.formDatos}>
            {CAMPOS_CLIENTE.map(([k, etiqueta, aviso]) => (
              <label key={k} className={s.campo}>
                <span>{etiqueta}{falta(aviso) && <em className={s.falta}>falta</em>}</span>
                <input value={d.cliente[k]} onChange={(e) => cliente(k, e.target.value)} aria-invalid={falta(aviso) || undefined}
                  {...(k === 'correo' && { type: 'email' })} {...(k === 'rut' && { placeholder: '12.345.678-9' })} />
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={s.bloque}>
          <legend><h2>Servicio</h2></legend>
          <div className={s.form}>
            <label className={s.campo}>
              <span>Título{falta('Título') && <em className={s.falta}>falta</em>}</span>
              <input value={d.titulo} onChange={(e) => setD({ ...d, titulo: e.target.value })} />
            </label>
            <label className={s.campo}>
              <span>Descripción corta</span>
              <textarea rows={3} value={d.descripcion} onChange={(e) => setD({ ...d, descripcion: e.target.value })} />
            </label>
            <label className={s.campo}>
              <span>Qué incluye (uno por línea)</span>
              <textarea rows={Math.max(4, datos.incluye.length + 1)} value={incluyeTexto} onChange={(e) => setIncluyeTexto(e.target.value)} />
            </label>
          </div>
        </fieldset>

        <fieldset className={s.bloque}>
          <legend><h2>Inversión <span className="mono">montos netos, el IVA se suma solo</span></h2></legend>
          <div className={s.form}>
            {d.cargos.map((c, i) => (
              <FilaCargo key={i} cargo={c} etiqueta={i === 0 ? 'Ítem (pago único)' : `Ítem ${i + 1}`}
                onCambio={(x) => cargo(i, x)} onQuitar={() => setD({ ...d, cargos: d.cargos.filter((_, j) => j !== i) })} />
            ))}
            <div className={s.botonesChicos}>
              <button type="button" className={s.botonChico} onClick={() => setD({ ...d, cargos: [...d.cargos, { descripcion: '', monto: null }] })}>
                + Agregar ítem
              </button>
              {!d.mensual && (
                <button type="button" className={s.botonChico} onClick={() => setD({ ...d, mensual: { descripcion: 'Mensualidad', monto: null } })}>
                  + Agregar cobro mensual
                </button>
              )}
            </div>
            {d.mensual && (
              <FilaCargo cargo={d.mensual} etiqueta="Cobro mensual (aparte del total)"
                onCambio={(x) => setD({ ...d, mensual: x })} onQuitar={() => setD({ ...d, mensual: null })} />
            )}
          </div>
        </fieldset>

        <fieldset className={s.bloque}>
          <legend><h2>Forma de pago</h2></legend>
          <div className={s.opcionesPago}>
            {(Object.keys(FORMAS_PAGO) as TipoPago[]).map((tipo) => (
              <label key={tipo} className={s.opcion}>
                <input type="radio" name="tipo_pago" checked={d.pago.tipo === tipo} onChange={() => pago({ tipo })} />
                {FORMAS_PAGO[tipo]}
              </label>
            ))}
          </div>
          {d.pago.tipo === 'cuotas' && (
            <label className={`${s.campo} ${s.angosto}`}>
              <span>Número de cuotas</span>
              <input type="number" min={2} max={24} value={d.pago.cuotas} onChange={(e) => pago({ cuotas: Number(e.target.value) })} />
            </label>
          )}
          {d.pago.tipo === 'otra' && (
            <label className={s.campo}>
              <span>Detalle{falta('Detalle de la forma de pago') && <em className={s.falta}>falta</em>}</span>
              <textarea rows={3} value={d.pago.texto} onChange={(e) => pago({ texto: e.target.value })}
                placeholder="Ej: 40% al aprobar, 40% al entregar el diseño y 20% al publicar" />
            </label>
          )}
        </fieldset>

        <fieldset className={s.bloque}>
          <legend><h2>Opcional</h2></legend>
          <div className={s.form}>
            <label className={s.campo}>
              <span>Plazo estimado</span>
              <input value={d.plazo} onChange={(e) => setD({ ...d, plazo: e.target.value })} placeholder="Ej: 3 a 4 semanas desde el pago inicial" />
            </label>
            <label className={s.campo}>
              <span>Notas</span>
              <textarea rows={3} value={d.notas} onChange={(e) => setD({ ...d, notas: e.target.value })} />
            </label>
          </div>
        </fieldset>
      </div>

      <aside className={s.resumen}>
        <div className={s.bloque}>
          <h2>Resumen</h2>
          <dl className={s.cifras}>
            <dt>Neto</dt><dd>{pesos(t.unico.neto)}</dd>
            <dt>IVA {Math.round(IVA * 100)}%</dt><dd>{pesos(t.unico.iva)}</dd>
            <dt><b>Total</b></dt><dd><b>{pesos(t.unico.total)}</b></dd>
            {t.mensual && <><dt>Mensual</dt><dd>{pesos(t.mensual.total)} <small>IVA incl.</small></dd></>}
          </dl>
          {partes.length > 0 && partes[0].monto !== null && (
            <ul className={s.partes}>
              {partes.map((x, i) => <li key={i}><span>{x.texto}</span><span className="mono">{x.monto !== null ? pesos(x.monto) : ''}</span></li>)}
            </ul>
          )}
          <p className={s.tenue}>Vigencia: 30 días desde hoy.</p>
        </div>

        {avisos.length > 0 && (
          <div className={s.alerta} role="status">
            <b>Faltan {avisos.length === 1 ? 'un dato' : `${avisos.length} datos`}</b>
            <ul>{avisos.map((a) => <li key={a}>{a}</li>)}</ul>
            <p>Puedes completarlos o generar igual: lo que falte no aparecerá en el PDF.</p>
          </div>
        )}

        {prospecto && puedeMoverEstado && (
          <label className={s.opcion}>
            <input type="checkbox" name="mover_estado" defaultChecked />
            Pasar a {prospecto.nombre} al estado «propuesta»
          </label>
        )}
        <Generar />
      </aside>
    </form>
  );
}
