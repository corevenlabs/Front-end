import Link from 'next/link';
import Image from 'next/image';
import { ChatDemo, type NegocioDemo } from './ChatDemo';
import { Reloj } from './Reloj';
import { LogoMarca } from './Logo';
import { DobleCheck, Flecha, Icono, type NombreIcono } from './Iconos';
import { RUBROS } from '@/content/rubros';
import { SERVICIOS } from '@/content/servicios';
import { DETALLE_AGENTE, NOTA_PRECIOS, pesos, textoPrecio } from '@/content/precios';
import { clavePrecioDeServicio, obtenerPrecios } from '@/lib/precios';
import { PREGUNTAS } from '@/content/faq';
import { enlaceWhatsapp } from '@/content/sitio';
import s from './Secciones.module.css';

export function Hero({ negocios }: { negocios: NegocioDemo[] }) {
  return (
    <section className={s.hero} aria-labelledby="hero-titulo">
      <div className={`contenedor ${s.heroGrilla}`}>
        <p className={`etiqueta ${s.heroEtiqueta}`}>Agentes para WhatsApp e Instagram · Chile</p>
        <h1 id="hero-titulo" className={s.heroTitulo}>
          Tus clientes escriben a cualquier hora. Le compran al que contesta primero{' '}
          <span className={s.sello}><DobleCheck className={s.selloCheck} titulo="leído" />23:47</span>
        </h1>
        <div className={s.heroTexto}>
          <p className={s.heroBajada}>
            Armamos un agente que responde al instante, toma pedidos, cotiza y agenda. Lo importante te lo pasa a ti.
          </p>
          <div className={s.heroBotones}>
            <a className="btn btn-primario" href={enlaceWhatsapp()} target="_blank" rel="noopener noreferrer">
              Escríbenos por WhatsApp <Flecha />
            </a>
            <Link className="btn btn-secundario" href="/#como-funciona">Cómo funciona</Link>
          </div>
          <p className={`etiqueta ${s.heroRubros}`}>Restaurantes · Carnicerías · Joyerías · Banqueterías · Eventos · Construcción</p>
        </div>
        <div className={s.heroDemo} id="demo">
          <Reloj />
          <ChatDemo negocios={negocios} compacto />
        </div>
      </div>
    </section>
  );
}

// La misma consulta de las 23:47, con y sin agente, en una línea de tiempo a escala (22:00 a 10:00).
const DESDE = 22, HASTA = 34;
const pos = (h: number) => `${((h - DESDE) / (HASTA - DESDE)) * 100}%`;
const CONSULTA = 23 + 47 / 60, VISTO = 33.5;

export function Banda() {
  return (
    <section className={s.banda} aria-labelledby="banda-titulo">
      <LogoMarca className={s.bandaC} />
      <div className={`contenedor ${s.bandaGrilla}`}>
        <div>
          <h2 id="banda-titulo" className="titulo-seccion">La misma consulta, a la misma hora.</h2>
          <p className={s.bandaTexto}>Un martes, 23:47: «¿Todavía despachan?». Así se ve la noche con y sin agente.</p>
        </div>
        <div className={s.linea} data-revelar>
          <div className={s.fila}>
            <span className={s.filaNombre}>Sin agente</span>
            <div className={s.pista}>
              <span className={s.espera} style={{ left: pos(CONSULTA), width: `calc(${pos(VISTO)} - ${pos(CONSULTA)})` }} />
              <span className={`${s.marca} ${s.marcaFin}`} style={{ left: pos(VISTO) }}>Visto 09:30</span>
            </div>
            <span className={s.filaDato}>9 h 43 min</span>
          </div>
          <div className={s.fila}>
            <span className={`${s.filaNombre} ${s.azul}`}>Con agente</span>
            <div className={s.pista}>
              <span className={s.punto} style={{ left: pos(CONSULTA) }} />
              <span className={`${s.marca} ${s.azul}`} style={{ left: pos(CONSULTA) }}>✓✓ 23:47</span>
            </div>
            <span className={`${s.filaDato} ${s.azul}`}>8 seg</span>
          </div>
          <div className={s.eje} aria-hidden="true">
            {[22, 24, 26, 28, 30, 32, 34].map((h) => (
              <span key={h} style={{ left: pos(h) }}>{String(h % 24).padStart(2, '0')}:00</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const FUNCIONES: { icono: NombreIcono; titulo: string; texto: string }[] = [
  { icono: 'chat', titulo: 'Responde al instante', texto: 'Precios, horarios, stock y despacho, en segundos y con el tono de tu negocio.' },
  { icono: 'luna', titulo: 'Atiende de noche', texto: 'Las 23:47 también son horario de venta. No se cansa ni se olvida de nadie.' },
  { icono: 'bolsa', titulo: 'Toma pedidos', texto: 'Arma el pedido, confirma la dirección y te lo deja listo para despachar.' },
  { icono: 'boleta', titulo: 'Cotiza', texto: 'Calcula con tus precios reales y manda el detalle por escrito.' },
  { icono: 'agenda', titulo: 'Agenda', texto: 'Ofrece horas disponibles para visitas, reservas o pruebas.' },
  { icono: 'derivar', titulo: 'Te pasa lo importante', texto: 'Reclamos, pedidos grandes y casos delicados te llegan al celular.' },
];

export function QueHace() {
  return (
    <section className="seccion" id="que-hace" aria-labelledby="que-hace-titulo">
      <div className="contenedor">
        <h2 id="que-hace-titulo" className="titulo-seccion">Qué hace el agente</h2>
        <ul className={s.funciones}>
          {FUNCIONES.map((f) => (
            <li key={f.titulo} className={s.funcion} data-revelar>
              <Icono nombre={f.icono} className={s.funcionIcono} />
              <h3>{f.titulo}</h3>
              <p>{f.texto}</p>
            </li>
          ))}
        </ul>
        <div className={s.extra}>
          <Icono nombre="caja" className={s.extraIcono} />
          <p><b>¿Y lo de adentro?</b> También automatizamos procesos internos: pedidos, cotizaciones, inventario y agenda. Y si tu negocio no tiene web, te la hacemos.</p>
        </div>
      </div>
    </section>
  );
}

export async function Servicios({ titulo = 'Todo lo digital de tu pyme', excluir }: { titulo?: string; excluir?: string }) {
  const precios = await obtenerPrecios();
  const lista = SERVICIOS.filter((sv) => sv.slug !== excluir);
  // Con el agente en la lista, va destacado a doble ancho: 7 servicios llenan 2 filas de 4.
  const destacado = lista[0]?.slug === 'agentes-whatsapp';
  return (
    <section className="seccion" id="servicios" aria-labelledby="servicios-titulo">
      <div className="contenedor">
        <h2 id="servicios-titulo" className="titulo-seccion">{titulo}</h2>
        <p className="bajada" style={{ marginTop: 12 }}>Además del agente, hacemos lo que tu negocio necesita para vender en línea. Un solo equipo, años de experiencia en web, apps y ecommerce.</p>
        <ul className={`${s.servicios} ${destacado ? s.conDestacado : ''}`}>
          {lista.map((sv) => (
            <li key={sv.slug} data-revelar className={s.servicioItem}>
              <Link href={`/servicios/${sv.slug}`} className={`${s.servicio} flecha-mueve`}>
                <Icono nombre={sv.icono} className={s.servicioIcono} />
                <h3>{sv.nombre}</h3>
                <p>{sv.resumen}</p>
                <span className={s.servicioPrecio}>
                  {textoPrecio(precios[clavePrecioDeServicio(sv.slug)])}
                  <Flecha className={s.rubroFlecha} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Rubros() {
  return (
    <section className="seccion" id="rubros" aria-labelledby="rubros-titulo">
      <div className="contenedor">
        <h2 id="rubros-titulo" className="titulo-seccion">Rubros que atendemos</h2>
        <p className="bajada" style={{ marginTop: 12 }}>Cada rubro tiene sus preguntas de siempre. Mira cómo responde el agente en el tuyo.</p>
        <ul className={s.rubros}>
          {RUBROS.map((r) => (
            <li key={r.slug}>
              <Link href={`/rubros/${r.slug}`} className={`${s.rubro} flecha-mueve`}>
                <Icono nombre={r.icono} className={s.rubroIcono} />
                <span className={s.rubroTexto}>
                  {r.nombre}
                  <small>{r.resumen}</small>
                </span>
                <Flecha className={s.rubroFlecha} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const PASOS = [
  { titulo: 'Nos cuentas tu negocio', texto: 'Carta o catálogo, precios, horarios, zonas de despacho y lo que no se puede prometer.' },
  { titulo: 'Armamos y probamos el agente', texto: 'Lo probamos con las preguntas que de verdad te hacen tus clientes, hasta que digas «así lo diría yo».' },
  { titulo: 'Lo conectamos y te avisa', texto: 'Queda en tu WhatsApp e Instagram. Lo repetido lo responde; los pedidos y lo delicado te llegan al celular.' },
];

export function ComoFunciona() {
  return (
    <section className="seccion" id="como-funciona" aria-labelledby="como-titulo">
      <div className="contenedor">
        <h2 id="como-titulo" className="titulo-seccion">Cómo funciona</h2>
        <ol className={s.pasos}>
          {PASOS.map((p, i) => (
            <li key={p.titulo} className={s.paso}>
              <span className={s.pasoN}>Paso {i + 1}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export async function Precios({ conTitulo = true, conOtros = false }: { conTitulo?: boolean; conOtros?: boolean }) {
  const precios = await obtenerPrecios();
  const tarjetas = [
    { titulo: 'Implementación', precio: precios['agente-implementacion'], detalle: DETALLE_AGENTE.implementacion },
    { titulo: 'Mensualidad', precio: precios['agente-mensualidad'], detalle: DETALLE_AGENTE.mensualidad },
  ];
  return (
    <section className="seccion" id="precios" aria-labelledby={conTitulo ? 'precios-titulo' : undefined}>
      <div className="contenedor">
        {conTitulo && <h2 id="precios-titulo" className="titulo-seccion">Precios del agente</h2>}
        <div className={s.precios}>
          {tarjetas.map((t, i) => (
            <article key={t.titulo} className={`${s.precio} ${i === 1 ? s.precioNegro : ''}`}>
              <h3>{t.titulo}</h3>
              {t.precio.desde === null ? (
                <p className={s.monto}>A cotizar</p>
              ) : (
                <p className={s.monto}><span className={s.desde}>desde</span> {pesos(t.precio.desde)} <span className={s.periodo}>+ IVA · {t.precio.periodo}</span></p>
              )}
              <ul>
                {t.detalle.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <p className={s.notaPrecios}>{NOTA_PRECIOS}</p>
        {conOtros ? (
          <>
            <h2 className={s.otrosTitulo}>Otros servicios</h2>
            <div className={s.tablaPrecios}>
              <table>
                <thead><tr><th>Servicio</th><th>Precio</th><th>Tipo</th></tr></thead>
                <tbody>
                  {SERVICIOS.filter((sv) => sv.slug !== 'agentes-whatsapp').map((sv) => {
                    const p = precios[clavePrecioDeServicio(sv.slug)];
                    return (
                      <tr key={sv.slug}>
                        <td><Link href={`/servicios/${sv.slug}`}>{sv.nombre}</Link></td>
                        <td className="mono">{textoPrecio(p)}</td>
                        <td>{p.desde === null ? 'Cotización gratis' : p.periodo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className={s.notaPrecios}><Link href="/precios">Ver precios de webs, tiendas y más servicios</Link></p>
        )}
      </div>
    </section>
  );
}

export function Preguntas() {
  return (
    <section className="seccion" id="preguntas" aria-labelledby="preguntas-titulo">
      <div className={`contenedor ${s.preguntasGrilla}`}>
        <h2 id="preguntas-titulo" className="titulo-seccion">Preguntas frecuentes</h2>
        <div className={s.preguntas}>
          {PREGUNTAS.map((q) => (
            <details key={q.p} className={s.pregunta}>
              <summary>{q.p}<span className={s.mas} aria-hidden="true" /></summary>
              <p>{q.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Laudus() {
  return (
    <section className={s.laudus} aria-labelledby="laudus-titulo">
      <div className={`contenedor ${s.laudusFila}`}>
        <Image src="/image/laudus-logo.png" alt="Laudus ERP" width={120} height={31} className={s.laudusLogo} />
        <div>
          <h2 id="laudus-titulo" className={s.laudusTitulo}>Partners de Laudus ERP</h2>
          <p>Integramos Laudus con tus procesos y herramientas para que la información fluya sin tareas repetitivas.</p>
        </div>
      </div>
    </section>
  );
}

export function Cierre() {
  return (
    <section className={`seccion ${s.cierre}`} aria-labelledby="cierre-titulo">
      <div className={`contenedor ${s.cierreFila}`}>
        <div>
          <h2 id="cierre-titulo" className="titulo-seccion">¿Conversamos?</h2>
          <p className="bajada" style={{ marginTop: 12 }}>Cuéntanos qué vendes y cómo te escriben tus clientes. Te respondemos rápido, como corresponde.</p>
        </div>
        <div className={s.cierreBotones}>
          <a className="btn btn-primario" href={enlaceWhatsapp()} target="_blank" rel="noopener noreferrer">Escríbenos por WhatsApp <Flecha /></a>
          <Link className="btn btn-secundario" href="/contacto">Dejar mis datos</Link>
        </div>
      </div>
    </section>
  );
}
