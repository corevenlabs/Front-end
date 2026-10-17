// Íconos propios: grilla 32, trazo 2.25, esquinas rectas.
// Rubros: solo color del texto. Funciones del agente: una pieza azul (check o flecha del logo).
import type { ReactNode, SVGProps } from 'react';

type Props = { className?: string; titulo?: string };

const ACENTO = { stroke: 'var(--acc, var(--azul))' };

function Base({ className, titulo, children }: Props & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="square"
      strokeLinejoin="miter"
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
    >
      {children}
    </svg>
  );
}

function Acento(props: SVGProps<SVGPathElement>) {
  return <path className="icono-acento" pathLength={1} style={ACENTO} {...props} />;
}

const DIBUJOS = {
  ramen: (
    <>
      <path d="M4 15h24a12 10 0 0 1-24 0z" />
      <path d="M12 28h8M14 15L25 4M18 15L28 7M8.5 11c0-1.8 1.8-2.2 1.8-4" />
    </>
  ),
  carne: (
    <>
      <path d="M3.5 8h17.5v14H3.5z" />
      <circle cx="8" cy="12.5" r="1.6" />
      <path d="M21 13h7.5v4H21" />
    </>
  ),
  anillo: (
    <>
      <circle cx="16" cy="20.5" r="7.5" />
      <path d="M12 8.5l4-4.5 4 4.5-4 4.5z" />
    </>
  ),
  cloche: <path d="M6 22a10 10 0 0 1 20 0zM3 25.5h26M16 12V9.5M13.5 9h5" />,
  banderines: <path d="M3 8c8 5 18 5 26 0M5 9.5L8.5 22 12 11.3M12.5 11.6L16 24l3.5-12.4M20 11.3L23.5 22 27 9.5" />,
  rodillo: <path d="M5 5h17v7H5zM22 8.5h4v7.5H13.5v3.5M11.5 19.5h4v9h-4z" />,
  chat: (
    <>
      <path d="M4 6h24v16H13l-6 5v-5H4z" />
      <Acento d="M9 15l3 3 6.5-7M15 18.5l.5.5 7.5-8" />
    </>
  ),
  luna: (
    <>
      <path d="M19 4.5A11 11 0 1 0 27.5 20 9 9 0 0 1 19 4.5z" />
      <Acento d="M22.5 11.5l2 2 4-4.5" />
    </>
  ),
  bolsa: (
    <>
      <path d="M6.5 11h19L24 27.5H8zM12 11V9a4 4 0 0 1 8 0v2" />
      <Acento d="M11.5 19l3 3 6-6.5" />
    </>
  ),
  boleta: (
    <>
      <path d="M7 3.5h18v25l-3-2-3 2-3-2-3 2-3-2-3 2zM11 9.5h10M11 14h10" />
      <Acento d="M11 20.5h10" />
    </>
  ),
  agenda: (
    <>
      <path d="M4.5 7.5h23v20h-23zM4.5 13h23M10.5 4v6M21.5 4v6" />
      <Acento d="M11.5 20l3 3 6-6.5" />
    </>
  ),
  derivar: (
    <>
      <path d="M5 4h12v24H5zM9.5 24h3" />
      <Acento d="M12 18L26 4M19.5 4H26v6.5" />
    </>
  ),
  caja: (
    <>
      <path d="M4.5 10L16 4l11.5 6v12.5L16 28.5 4.5 22.5zM4.5 10L16 16l11.5-6M16 16v12.5" />
      <Acento d="M7.5 19.5l2 2 3.5-4" />
    </>
  ),
  web: (
    <>
      <path d="M3.5 6h25v20h-25zM3.5 11h25M7 8.5h3" />
      <Acento d="M12 22l8-8M14.5 14H20v5.5" />
    </>
  ),
  landing: (
    <>
      <path d="M6 3.5h20v25H6zM10 9h12M10 13.5h8" />
      <Acento d="M10 19.5h9v4h-9z" />
    </>
  ),
  carro: (
    <>
      <path d="M3 5h4l3 14h15l3-10H8.5" />
      <circle cx="12" cy="25" r="2" />
      <circle cx="23" cy="25" r="2" />
      <Acento d="M13.5 13.5l2.5 2.5 5-5" />
    </>
  ),
  lupa: (
    <>
      <circle cx="14" cy="14" r="9.5" />
      <path d="M21 21l7.5 7.5" />
      <Acento d="M9 17l3-3 2.5 2.5L19 12" />
    </>
  ),
  conexion: (
    <>
      <path d="M3.5 5.5h10v10h-10zM18.5 16.5h10v10h-10z" />
      <Acento d="M13.5 10.5h4.5v11h0.5" />
    </>
  ),
  app: (
    <>
      <path d="M8.5 3.5h15v25h-15zM14 24.5h4" />
      <Acento d="M12.5 9h7v7h-7z" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type NombreIcono = keyof typeof DIBUJOS;

export function Icono({ nombre, ...props }: Props & { nombre: NombreIcono }) {
  return <Base {...props}>{DIBUJOS[nombre]}</Base>;
}

// Flecha diagonal (la dirección de la flecha del logo) para botones y filas.
export function Flecha({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path d="M3 11L11 3M5 3h6v6" />
    </svg>
  );
}

// Doble check de "leído".
export function DobleCheck({ className, titulo }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 17 11"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
    >
      <path d="M1 6l3 3L10.5 2M6.5 9L7.5 10 15.5 2" />
    </svg>
  );
}
