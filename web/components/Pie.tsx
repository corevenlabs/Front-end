import Link from 'next/link';
import { LogoMarca } from './Logo';
import { RUBROS } from '@/content/rubros';
import { SERVICIOS } from '@/content/servicios';
import { SITIO, enlaceWhatsapp } from '@/content/sitio';
import s from './Pie.module.css';

export function Pie() {
  return (
    <footer className={s.pie}>
      <div className={`contenedor ${s.grilla}`}>
        <div className={s.marca}>
          <Link href="/" className={s.logo} aria-label="Corevenlabs, ir al inicio">
            <LogoMarca className={s.c} />
            <span>Corevenlabs</span>
          </Link>
          <p>Agentes de atención y venta para WhatsApp e Instagram. Software hecho en {SITIO.ciudad}, Chile.</p>
        </div>

        <nav aria-label="Servicios">
          <h2 className={s.titulo}>Servicios</h2>
          <ul>
            {SERVICIOS.map((sv) => (
              <li key={sv.slug}><Link href={`/servicios/${sv.slug}`}>{sv.nombre}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Rubros">
          <h2 className={s.titulo}>Rubros</h2>
          <ul>
            {RUBROS.map((r) => (
              <li key={r.slug}><Link href={`/rubros/${r.slug}`}>{r.nombre}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Corevenlabs">
          <h2 className={s.titulo}>Corevenlabs</h2>
          <ul>
            <li><Link href="/demo">Probar la demo</Link></li>
            <li><Link href="/#como-funciona">Cómo funciona</Link></li>
            <li><Link href="/precios">Precios</Link></li>
            <li><Link href="/guias">Guías</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
            <li><a href={enlaceWhatsapp()} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a href={SITIO.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href={SITIO.laudus} target="_blank" rel="noopener">Partner de Laudus ERP</a></li>
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h2 className={s.titulo}>Legal</h2>
          <ul>
            <li><Link href="/privacidad">Política de privacidad</Link></li>
            <li><Link href="/terminos-demo">Términos de la demo</Link></li>
          </ul>
        </nav>
      </div>
      <div className={`contenedor ${s.base}`}>
        <span>© {new Date().getFullYear()} Corevenlabs</span>
        <span className="mono">{SITIO.ciudad}, Chile</span>
      </div>
    </footer>
  );
}
