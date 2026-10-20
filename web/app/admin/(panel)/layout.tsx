import Link from 'next/link';
import { LogoMarca } from '@/components/Logo';
import { exigirAdmin } from '@/lib/admin';
import { cerrarSesion } from '../sesion-acciones';
import s from '@/components/admin/Admin.module.css';

export default async function Panel({ children }: { children: React.ReactNode }) {
  const sesion = await exigirAdmin();
  return (
    <div className={s.panel}>
      <header className={s.barra}>
        <Link href="/admin" className={s.marca}><LogoMarca className={s.marcaLogo} /> Corevenlabs <span>Admin</span></Link>
        <nav className={s.menu} aria-label="Admin">
          <Link href="/admin">Prospectos</Link>
          <Link href="/admin/contactos">Contactos web</Link>
          <Link href="/admin/propuestas">Propuestas</Link>
          <Link href="/admin/precios">Precios</Link>
          <a href="/" target="_blank" rel="noopener noreferrer">Ver sitio</a>
        </nav>
        <form action={cerrarSesion} className={s.salir}>
          <span className="mono">{sesion.u}</span>
          <button className={s.botonChico}>Salir</button>
        </form>
      </header>
      <main className={s.contenido}>{children}</main>
    </div>
  );
}
