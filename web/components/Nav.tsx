import Link from 'next/link';
import { LogoMarca } from './Logo';
import { ProgresoScroll } from './ProgresoScroll';
import { Flecha } from './Iconos';
import { MENU, enlaceWhatsapp } from '@/content/sitio';
import s from './Nav.module.css';

// Menú móvil con <details>: funciona sin JavaScript.
export function Nav() {
  return (
    <header className={s.barra}>
      <div className={`contenedor ${s.fila}`}>
        <Link href="/" className={s.marca} aria-label="Corevenlabs, ir al inicio">
          <LogoMarca className={s.logo} />
          <span>Corevenlabs</span>
        </Link>

        <nav className={s.links} aria-label="Principal">
          {MENU.map((m) => (
            <Link key={m.href} href={m.href}>{m.texto}</Link>
          ))}
        </nav>

        <a className={`btn btn-secundario ${s.cta}`} href={enlaceWhatsapp()} target="_blank" rel="noopener noreferrer">
          Escríbenos <Flecha />
        </a>

        <details className={s.movil}>
          <summary aria-label="Abrir menú">
            <span className={s.hamburguesa} aria-hidden="true"><i /><i /><i /></span>
          </summary>
          <nav className={s.panel} aria-label="Principal móvil">
            {MENU.map((m) => (
              <Link key={m.href} href={m.href}>{m.texto}</Link>
            ))}
            <Link href="/contacto">Contacto</Link>
            <a className="btn btn-primario" href={enlaceWhatsapp()} target="_blank" rel="noopener noreferrer">
              Escríbenos por WhatsApp
            </a>
          </nav>
        </details>
      </div>
      <ProgresoScroll />
    </header>
  );
}
