import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Pie } from '@/components/Pie';
import s from '@/components/Pagina.module.css';

export default function NoEncontrada() {
  return (
    <>
      <Nav />
      <main id="contenido">
        <div className={`contenedor ${s.cabecera}`} style={{ paddingBottom: 96 }}>
          <p className="etiqueta">Error 404 · 23:47</p>
          <h1 className={s.titulo}>Esta página no existe</h1>
          <p className={s.bajada}>Puede que el enlace esté mal escrito o que la página se haya movido.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            <Link className="btn btn-primario" href="/">Ir al inicio</Link>
            <Link className="btn btn-secundario" href="/demo">Probar la demo</Link>
          </div>
        </div>
      </main>
      <Pie />
    </>
  );
}
