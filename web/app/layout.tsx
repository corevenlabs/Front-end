import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import { SITIO } from '@/content/sitio';
import './globals.css';

// next/font descarga las fuentes en el build y las sirve desde nuestro dominio (font-display: swap).
const archivo = Archivo({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
  preload: false, // solo horas y datos: no compite con el título por la descarga inicial
});

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: {
    default: 'Chatbot de WhatsApp con IA para pymes | Corevenlabs',
    template: '%s | Corevenlabs',
  },
  description: SITIO.descripcion,
  openGraph: { type: 'website', locale: 'es_CL', siteName: SITIO.nombre },
  twitter: { card: 'summary_large_image' },
  // Código de verificación de Google Search Console (opción «Etiqueta HTML»), si se configura.
  ...(process.env.GOOGLE_SITE_VERIFICATION && { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }),
};

export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 };

// Layout raíz compartido por el sitio público y el admin: solo fuentes y estilos base.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
