import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ESTADOS, TIPOS_CONTENIDO, actividades, contenidos, obtenerProspecto, type Prospecto } from '@/lib/crm';
import { exigirAdmin, fecha } from '@/lib/admin';
import { hayBase } from '@/lib/db';
import { Aviso, Puntaje, SinBase } from '@/components/admin/Piezas';
import { Copiar } from '@/components/admin/Copiar';
import { TablaPropuestas } from '@/components/admin/TablaPropuestas';
import { listarPropuestas } from '@/lib/propuestas';
import {
  borrarBorrador, cambiarEstado, editarBorrador, guardarDatos, noContactar, nuevaNota, nuevoBorrador,
} from '../../../acciones';
import s from '@/components/admin/Admin.module.css';

export const metadata: Metadata = { title: 'Ficha' };

const AVISOS: Record<string, string> = {
  estado: 'Estado actualizado y registrado en el historial.',
  nota: 'Nota agregada.',
  datos: 'Datos guardados.',
  excluido: 'Quedó en exclusiones: no se volverá a proponer ni a contactar.',
  borrador: 'Borrador guardado.',
  borrado: 'Borrador eliminado.',
};

const ETIQUETAS_ACTIVIDAD: Record<string, string> = {
  nota: 'Nota', estado: 'Estado', contenido: 'Borrador', calificacion: 'Calificación', creado: 'Creado',
};

const CAMPOS_CORTOS: [keyof Prospecto, string][] = [
  ['nombre', 'Nombre'], ['rubro', 'Rubro'], ['comuna', 'Comuna o dirección'], ['telefono', 'Teléfono'],
  ['correo', 'Correo'], ['web', 'Web'], ['instagram', 'Instagram'], ['google_maps', 'Google Maps'],
  ['puntaje', 'Puntaje (0 a 10)'], ['rating', 'Rating Google'], ['resenas', 'Reseñas'],
  ['canal_sugerido', 'Canal sugerido'], ['fuente', 'Fuente'],
];
const CAMPOS_LARGOS: [keyof Prospecto, string][] = [
  ['senales', 'Señales (separadas por ;)'], ['que_ofrecer', 'Qué ofrecerle'], ['demo_idea', 'Idea de demo'], ['notas', 'Notas'],
];

const soloDigitos = (t: string) => t.replace(/\D/g, '');
const urlInstagram = (ig: string) => (ig.startsWith('http') ? ig : `https://instagram.com/${ig.replace(/^@/, '')}`);

export default async function Ficha(props: PageProps<'/admin/prospectos/[id]'>) {
  await exigirAdmin();
  if (!hayBase()) return <SinBase />;

  const { id: idTexto } = await props.params;
  const { ok } = await props.searchParams;
  const id = Number(idTexto);
  if (!Number.isInteger(id)) notFound();
  const p = await obtenerProspecto(id);
  if (!p) notFound();
  const [historial, borradores, propuestas] = await Promise.all([actividades(id), contenidos(id), listarPropuestas(id)]);
  const senales = p.senales.split(';').map((x) => x.trim()).filter(Boolean);
  const aviso = typeof ok === 'string' ? AVISOS[ok] : undefined;

  return (
    <article className={s.ficha}>
      <p className={s.volver}><Link href="/admin">← Prospectos</Link></p>

      <header className={s.fichaCabeza}>
        <div className={s.fichaTitulo}>
          <h1>{p.nombre}</h1>
          <p className={s.sub}>{[p.rubro, p.comuna].filter(Boolean).join(' · ') || 'Sin rubro'} · <span className="mono">{p.fuente || 'sin fuente'}</span></p>
          <p className={s.enlaces}>
            {p.telefono && <a href={`https://wa.me/${soloDigitos(p.telefono)}`} target="_blank" rel="noopener noreferrer">WhatsApp {p.telefono}</a>}
            {p.correo && <a href={`mailto:${p.correo}`}>{p.correo}</a>}
            {p.web && <a href={p.web} target="_blank" rel="noopener noreferrer">Web</a>}
            {p.instagram && <a href={urlInstagram(p.instagram)} target="_blank" rel="noopener noreferrer">Instagram</a>}
            {p.google_maps && <a href={p.google_maps} target="_blank" rel="noopener noreferrer">Google Maps</a>}
            {p.rating && <span>★ {p.rating} ({p.resenas ?? 0})</span>}
          </p>
        </div>
        <div className={s.fichaAcciones}>
          <Puntaje valor={p.puntaje} grande />
          <form action={cambiarEstado} className={s.formEstado}>
            <input type="hidden" name="id" value={p.id} />
            <label className="sr-only" htmlFor="estado">Estado</label>
            <select id="estado" name="estado" defaultValue={p.estado}>
              {ESTADOS.map((e) => <option key={e}>{e}</option>)}
            </select>
            <button className="btn btn-negro">Cambiar</button>
          </form>
          <Link href={`/admin/propuestas/nueva?prospecto=${p.id}`} className="btn btn-primario">Nueva propuesta</Link>
        </div>
      </header>

      {aviso && <Aviso>{aviso}</Aviso>}

      <div className={s.columnas}>
        <div className={s.columna}>
          <section className={s.bloque}>
            <h2>Por qué es prospecto</h2>
            {senales.length ? <ul className={s.senales}>{senales.map((x) => <li key={x}>{x}</li>)}</ul> : <p className={s.tenue}>Todavía no está calificado. Califícalo desde prospecting-bot.</p>}
            {p.que_ofrecer && <><h3>Qué ofrecerle</h3><p>{p.que_ofrecer}</p></>}
            {p.demo_idea && <><h3>Idea de demo</h3><p>{p.demo_idea}</p></>}
            {p.canal_sugerido && <p className={s.tenue}>Canal sugerido: <b>{p.canal_sugerido}</b></p>}
          </section>

          <section className={s.bloque} id="propuestas">
            <h2>Propuestas <span className="mono">{propuestas.length}</span></h2>
            {propuestas.length
              ? <TablaPropuestas lista={propuestas} conCliente={false} />
              : <p className={s.tenue}>Sin propuestas. Usa «Nueva propuesta» para armar una con los datos de este prospecto.</p>}
          </section>

          <section className={s.bloque} id="borradores">
            <h2>Borradores <span className="mono">{borradores.length}</span></h2>
            {!borradores.length && <p className={s.tenue}>Sin borradores. Puedes generarlos con Claude desde prospecting-bot o escribir uno aquí.</p>}
            {borradores.map((c) => {
              const enviarWa = c.tipo === 'whatsapp' && p.telefono ? `https://wa.me/${soloDigitos(p.telefono)}?text=${encodeURIComponent(c.cuerpo)}` : null;
              return (
                <details key={c.id} className={s.borrador}>
                  <summary>
                    <span><b>{TIPOS_CONTENIDO[c.tipo as keyof typeof TIPOS_CONTENIDO] ?? c.tipo}</b>{c.asunto && ` · ${c.asunto}`}</span>
                    <span className="mono">{c.origen} · {fecha(c.creado)}</span>
                  </summary>
                  <p className={s.cuerpo}>{c.cuerpo}</p>
                  <div className={s.botonesChicos}>
                    <Copiar texto={c.asunto ? `${c.asunto}\n\n${c.cuerpo}` : c.cuerpo} />
                    {enviarWa && <a className={s.botonChico} href={enviarWa} target="_blank" rel="noopener noreferrer">Abrir en WhatsApp</a>}
                  </div>
                  <details className={s.sub2}>
                    <summary>Editar</summary>
                    <form action={editarBorrador} className={s.form}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="contenido_id" value={c.id} />
                      <label className={s.campo}><span>Asunto</span><input name="asunto" defaultValue={c.asunto} /></label>
                      <label className={s.campo}><span>Texto</span><textarea name="cuerpo" rows={8} defaultValue={c.cuerpo} required /></label>
                      <button className="btn btn-negro">Guardar cambios</button>
                    </form>
                  </details>
                  <details className={s.sub2}>
                    <summary>Borrar</summary>
                    <form action={borrarBorrador}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="contenido_id" value={c.id} />
                      <button className={s.botonPeligro}>Sí, borrar este borrador</button>
                    </form>
                  </details>
                </details>
              );
            })}
            <details className={s.sub2}>
              <summary>Escribir un borrador</summary>
              <form action={nuevoBorrador} className={s.form}>
                <input type="hidden" name="id" value={p.id} />
                <label className={s.campo}>
                  <span>Tipo</span>
                  <select name="tipo" defaultValue="whatsapp">
                    {Object.entries(TIPOS_CONTENIDO).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                  </select>
                </label>
                <label className={s.campo}><span>Asunto (opcional)</span><input name="asunto" /></label>
                <label className={s.campo}><span>Texto</span><textarea name="cuerpo" rows={6} required /></label>
                <button className="btn btn-negro">Guardar borrador</button>
              </form>
            </details>
          </section>

          <details className={s.bloque}>
            <summary><h2>Datos del prospecto</h2></summary>
            <form action={guardarDatos} className={`${s.form} ${s.formDatos}`}>
              <input type="hidden" name="id" value={p.id} />
              {CAMPOS_CORTOS.map(([c, t]) => (
                <label key={c} className={s.campo}><span>{t}</span><input name={c} defaultValue={String(p[c] ?? '')} required={c === 'nombre'} /></label>
              ))}
              {CAMPOS_LARGOS.map(([c, t]) => (
                <label key={c} className={`${s.campo} ${s.ancho}`}><span>{t}</span><textarea name={c} rows={3} defaultValue={String(p[c] ?? '')} /></label>
              ))}
              <div className={s.ancho}><button className="btn btn-negro">Guardar datos</button></div>
            </form>
          </details>

          <details className={`${s.bloque} ${s.peligro}`}>
            <summary><h2>No contactar</h2></summary>
            <p className={s.tenue}>Lo agrega a exclusiones (el agente de prospección no lo volverá a proponer) y lo marca como excluido.</p>
            <form action={noContactar} className={s.form}>
              <input type="hidden" name="id" value={p.id} />
              <label className={s.campo}><span>Motivo</span><input name="motivo" placeholder="Cliente, competencia, pidió no recibir mensajes…" /></label>
              <button className={s.botonPeligro}>No contactar nunca a {p.nombre}</button>
            </form>
          </details>
        </div>

        <div className={s.columna}>
          <section className={s.bloque} id="historial">
            <h2>Notas e historial</h2>
            <form action={nuevaNota} className={s.form}>
              <input type="hidden" name="id" value={p.id} />
              <label className="sr-only" htmlFor="nota">Nueva nota</label>
              <textarea id="nota" name="nota" rows={3} placeholder="Ej: Hablé con la dueña, quiere una demo el jueves." required />
              <button className="btn btn-negro">Agregar nota</button>
            </form>
            <ol className={s.historial}>
              {historial.map((a) => (
                <li key={a.id}>
                  <span className={s.histTipo}>{ETIQUETAS_ACTIVIDAD[a.tipo] ?? a.tipo}</span>
                  <span className="mono">{fecha(a.creado)}</span>
                  <p>{a.detalle}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </article>
  );
}
