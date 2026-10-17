import { ImageResponse } from 'next/og';
import { C, FLECHA } from '@/components/Logo';

export const alt = 'Corevenlabs: le compran al que contesta primero';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TITULO = 'Le compran al que contesta primero';
const LINEA = '23:47 · Agentes para WhatsApp e Instagram';

// Descarga Archivo (ancho expandido, 800) solo con los caracteres que usamos. Si falla, usa la fuente por defecto.
async function archivo(texto: string) {
  try {
    const css = await (await fetch(
      `https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@118,800&text=${encodeURIComponent(texto)}`,
    )).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

// Imagen para compartir en WhatsApp, redes, etc. Se genera en el build.
export default async function ImagenOG() {
  const fuente = await archivo(`Corevenlabs${TITULO}${LINEA}`);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ffffff', padding: '72px 72px 0', fontFamily: 'Archivo' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 38, fontWeight: 800, color: '#0a0a0a' }}>
          <svg width="52" height="55" viewBox="0 0 1877 1998">
            <path d={C} fill="#0a0a0a" />
            <path d={FLECHA} fill="#4a8fe7" />
          </svg>
          Corevenlabs
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3, color: '#0a0a0a', maxWidth: 1050 }}>{TITULO}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 32, color: '#1f64d1' }}>
            <svg width="44" height="28" viewBox="0 0 17 11" fill="none" stroke="#4a8fe7" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 6l3 3L10.5 2M6.5 9L7.5 10 15.5 2" />
            </svg>
            {LINEA}
          </div>
        </div>
        <div style={{ display: 'flex', height: 22, background: '#0a0a0a', marginLeft: -72, marginRight: -72 }} />
      </div>
    ),
    { ...size, fonts: fuente ? [{ name: 'Archivo', data: fuente, weight: 800, style: 'normal' }] : undefined },
  );
}
