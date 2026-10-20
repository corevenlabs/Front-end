import type { Metadata } from 'next';
import { PREGUNTAS } from '@/content/faq';
import { exigirAdmin } from '@/lib/admin';
import { hayBase } from '@/lib/db';
import { formatearWhatsapp, listarPreguntas, obtenerWhatsapp } from '@/lib/ajustes';
import { Aviso, SinBase } from '@/components/admin/Piezas';
import {
  editarPreguntasActuales, guardarPregunta, guardarWhatsappSitio, nuevaPregunta, ordenarPregunta, quitarPregunta,
} from '../../acciones';
import s from '@/components/admin/Admin.module.css';

export const metadata: Metadata = { title: 'Sitio' };

const AVISOS: Record<string, string> = {
  whatsapp: 'Número guardado. Todos los botones de WhatsApp del sitio ya usan el nuevo.',
  pregunta: 'Pregunta guardada. El sitio se actualiza en segundos.',
  borrada: 'Pregunta eliminada.',
  orden: 'Orden actualizado.',
  copiadas: 'Listo: ya puedes editar las preguntas.',
};

export default async function Sitio(props: PageProps<'/admin/sitio'>) {
  await exigirAdmin();
  if (!hayBase()) return <SinBase />;
  const { ok, error } = await props.searchParams;
  const [whatsapp, preguntas] = await Promise.all([obtenerWhatsapp(), listarPreguntas()]);
  const aviso = typeof ok === 'string' ? AVISOS[ok] : undefined;

  return (
    <div className={s.sitio}>
      <div className={s.cabeza}><h1>Sitio</h1></div>
      {aviso && <Aviso>{aviso}</Aviso>}

      <section className={s.bloque} id="whatsapp">
        <h2>WhatsApp de contacto</h2>
        <p className={s.tenue}>
          El número al que llevan todos los botones de WhatsApp del sitio. Hoy: <b className="mono">{formatearWhatsapp(whatsapp)}</b>
        </p>
        <form action={guardarWhatsappSitio} className={s.formFila}>
          <label className={s.campo}>
            <span>Número nuevo</span>
            <input name="whatsapp" defaultValue={formatearWhatsapp(whatsapp)} inputMode="tel" placeholder="+56 9 1234 5678" required
              aria-invalid={error === 'whatsapp' || undefined} aria-describedby={error === 'whatsapp' ? 'error-whatsapp' : undefined} />
          </label>
          <button className="btn btn-negro">Guardar número</button>
        </form>
        {error === 'whatsapp' && (
          <p className={s.error} id="error-whatsapp" role="alert">
            Ese número no parece válido. Usa un celular chileno (+56 9 y 8 dígitos) o un número con código de país.
          </p>
        )}
        <p className={s.tenue}>
          <a href="/whatsapp" target="_blank" rel="noopener noreferrer">Probar el botón</a>: abre WhatsApp con el número guardado.
        </p>
      </section>

      <section className={s.bloque} id="preguntas">
        <h2>Preguntas frecuentes <span className="mono">{preguntas.length || PREGUNTAS.length}</span></h2>
        <p className={s.tenue}>Aparecen en la portada, en este orden. Las ocultas no se muestran pero no se pierden.</p>

        {preguntas.length === 0 ? (
          <>
            <ol className={s.listaPreguntas}>
              {PREGUNTAS.map((q) => (
                <li key={q.p} className={s.itemPregunta}>
                  <div><b>{q.p}</b><p className={s.tenue}>{q.r}</p></div>
                </li>
              ))}
            </ol>
            <form action={editarPreguntasActuales}>
              <button className="btn btn-negro">Editar estas preguntas</button>
            </form>
          </>
        ) : (
          <ol className={s.listaPreguntas}>
            {preguntas.map((q, i) => (
              <li key={q.id} className={s.itemPregunta}>
                <div className={s.flechas}>
                  <form action={ordenarPregunta}>
                    <input type="hidden" name="id" value={q.id} />
                    <input type="hidden" name="direccion" value="subir" />
                    <button className={s.flecha} disabled={i === 0} aria-label={`Subir «${q.pregunta}»`}>↑</button>
                  </form>
                  <form action={ordenarPregunta}>
                    <input type="hidden" name="id" value={q.id} />
                    <input type="hidden" name="direccion" value="bajar" />
                    <button className={s.flecha} disabled={i === preguntas.length - 1} aria-label={`Bajar «${q.pregunta}»`}>↓</button>
                  </form>
                </div>
                <details className={s.preguntaEditable}>
                  <summary>
                    <b>{q.pregunta}</b>
                    {!q.visible && <span className={`${s.estado} ${s.eCerrado}`}>oculta</span>}
                  </summary>
                  <form action={guardarPregunta} className={s.form}>
                    <input type="hidden" name="id" value={q.id} />
                    <label className={s.campo}><span>Pregunta</span><input name="pregunta" defaultValue={q.pregunta} maxLength={300} required /></label>
                    <label className={s.campo}><span>Respuesta</span><textarea name="respuesta" rows={4} defaultValue={q.respuesta} maxLength={2000} required /></label>
                    <label className={s.opcion}><input type="checkbox" name="visible" defaultChecked={q.visible} /> Mostrar en el sitio</label>
                    <button className="btn btn-negro">Guardar</button>
                  </form>
                  <details className={s.sub2}>
                    <summary>Eliminar</summary>
                    <form action={quitarPregunta}>
                      <input type="hidden" name="id" value={q.id} />
                      <button className={s.botonPeligro}>Sí, eliminar esta pregunta</button>
                    </form>
                  </details>
                </details>
              </li>
            ))}
          </ol>
        )}

        <details className={s.sub2}>
          <summary>+ Nueva pregunta</summary>
          <form action={nuevaPregunta} className={s.form}>
            <label className={s.campo}><span>Pregunta</span><input name="pregunta" maxLength={300} required placeholder="¿…?" /></label>
            <label className={s.campo}><span>Respuesta</span><textarea name="respuesta" rows={4} maxLength={2000} required /></label>
            <button className="btn btn-negro">Agregar pregunta</button>
          </form>
        </details>
      </section>
    </div>
  );
}
