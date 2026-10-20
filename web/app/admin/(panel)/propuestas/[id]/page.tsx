import { Fragment } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigirAdmin, fecha } from '@/lib/admin';
import { hayBase } from '@/lib/db';
import { FORMAS_PAGO, faltantes, formatearRut, partesPago, pesos, totales } from '@/lib/propuesta';
import { fechaLarga, obtenerPropuesta } from '@/lib/propuestas';
import { plantillaPorSlug } from '@/content/plantillas-propuesta';
import { Aviso, SinBase } from '@/components/admin/Piezas';
import { DescargaAuto } from '@/components/admin/DescargaAuto';
import s from '@/components/admin/Admin.module.css';

export const metadata: Metadata = { title: 'Propuesta' };

export default async function VerPropuesta(props: PageProps<'/admin/propuestas/[id]'>) {
  await exigirAdmin();
  if (!hayBase()) return <SinBase />;

  const id = Number((await props.params).id);
  const { nueva } = await props.searchParams;
  const p = Number.isInteger(id) && id > 0 ? await obtenerPropuesta(id) : null;
  if (!p) notFound();

  const d = p.datos;
  const c = d.cliente;
  const t = totales(d);
  const partes = d.pago.tipo === 'ninguna' ? [] : partesPago(d.pago, t.unico.total);
  const avisos = faltantes(d);
  const pdf = `/admin/propuestas/${p.id}/pdf`;

  return (
    <article className={s.ficha}>
      {nueva && <DescargaAuto href={`${pdf}?descargar=1`} volverA={`/admin/propuestas/${p.id}`} />}
      <p className={s.volver}>
        {p.prospecto_id ? <Link href={`/admin/prospectos/${p.prospecto_id}`}>← {p.cliente}</Link> : <Link href="/admin/propuestas">← Propuestas</Link>}
      </p>

      <header className={s.fichaCabeza}>
        <div className={s.fichaTitulo}>
          <h1>{p.numero}</h1>
          <p className={s.sub}>
            {p.cliente} · {plantillaPorSlug(p.plantilla)?.nombre} · emitida el {fechaLarga(p.emitida)}, válida hasta el {fechaLarga(p.vence)}
          </p>
        </div>
        <div className={s.fichaAcciones}>
          <a className="btn btn-primario" href={`${pdf}?descargar=1`}>Descargar PDF</a>
          <a className={s.botonChico} href={pdf} target="_blank" rel="noopener noreferrer">Ver PDF</a>
          <Link className={s.botonChico} href={`/admin/propuestas/nueva?desde=${p.id}`}>Nueva versión</Link>
        </div>
      </header>

      {nueva && <Aviso>Propuesta generada y guardada. La descarga del PDF empieza sola.</Aviso>}
      {avisos.length > 0 && (
        <div className={s.alerta}>
          <b>Se generó sin estos datos</b>
          <ul>{avisos.map((a) => <li key={a}>{a}</li>)}</ul>
          <p>Si los consigues, usa «Nueva versión»: queda con número nuevo y la anterior se conserva.</p>
        </div>
      )}

      <div className={s.columnas}>
        <section className={s.bloque}>
          <h2>{d.titulo || 'Propuesta de servicios'}</h2>
          {d.descripcion && <p className={s.tenue}>{d.descripcion}</p>}
          {d.incluye.length > 0 && <ul className={s.senales}>{d.incluye.map((x, i) => <li key={i}>{x}</li>)}</ul>}
          <h3>Inversión</h3>
          <dl className={s.cifras}>
            {d.cargos.map((x, i) => <Fragment key={i}><dt>{x.descripcion || 'Servicio'}</dt><dd>{x.monto === null ? 'Por definir' : pesos(x.monto)}</dd></Fragment>)}
            <dt>IVA</dt><dd>{pesos(t.unico.iva)}</dd>
            <dt><b>Total</b></dt><dd><b>{pesos(t.unico.total)}</b></dd>
            {d.mensual && <><dt>{d.mensual.descripcion || 'Mensualidad'}</dt><dd>{t.mensual ? `${pesos(t.mensual.neto)} + IVA al mes` : 'Por definir'}</dd></>}
          </dl>
          {partes.length > 0 && (
            <>
              <h3>Forma de pago · {FORMAS_PAGO[d.pago.tipo].toLowerCase()}</h3>
              <ul className={s.partes}>
                {partes.map((x, i) => <li key={i}><span>{x.texto}</span><span className="mono">{x.monto !== null ? pesos(x.monto) : ''}</span></li>)}
              </ul>
            </>
          )}
          {d.plazo && <><h3>Plazo estimado</h3><p>{d.plazo}</p></>}
          {d.notas && <><h3>Notas</h3><p className={s.cuerpo}>{d.notas}</p></>}
        </section>

        <section className={s.bloque}>
          <h2>Cliente</h2>
          <dl className={s.cifras}>
            {c.nombre && <><dt>Nombre</dt><dd>{c.nombre}</dd></>}
            {c.razonSocial && <><dt>Razón social</dt><dd>{c.razonSocial}</dd></>}
            {c.rut && <><dt>RUT</dt><dd>{formatearRut(c.rut)}</dd></>}
            {c.contacto && <><dt>Contacto</dt><dd>{c.contacto}</dd></>}
            {c.correo && <><dt>Correo</dt><dd>{c.correo}</dd></>}
            {c.telefono && <><dt>Teléfono</dt><dd>{c.telefono}</dd></>}
            {c.comuna && <><dt>Comuna</dt><dd>{c.comuna}</dd></>}
          </dl>
          <p className={s.tenue}>Creada el {fecha(p.creado)}.</p>
        </section>
      </div>
    </article>
  );
}
