import type { NextConfig } from 'next';

const esDev = process.env.NODE_ENV !== 'production';

// CSP sin nonce para que las páginas públicas sigan siendo estáticas.
// 'unsafe-inline' en scripts lo exige el arranque de Next sin nonce; no cargamos scripts de terceros.
const csp = [
  "default-src 'self'",
  // En desarrollo, Vercel Analytics carga su script de depuración desde va.vercel-scripts.com.
  `script-src 'self' 'unsafe-inline'${esDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const cabeceras = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: __dirname },
  // Las fuentes del PDF de propuestas se leen del disco en tiempo de ejecución.
  outputFileTracingIncludes: { '/admin/propuestas/*/pdf': ['./lib/pdf/fuentes/**'] },
  async headers() {
    return [
      { source: '/:path*', headers: cabeceras },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
  async redirects() {
    // Rutas de la web anterior, para no perder visitas ni posicionamiento.
    return [
      { source: '/comenzar', destination: '/contacto', permanent: true },
      { source: '/servicios/desarrollo-web', destination: '/servicios/paginas-web', permanent: true },
      { source: '/servicios/integracion', destination: '/servicios/integraciones', permanent: true },
      { source: '/servicios/automatizacion', destination: '/servicios/integraciones', permanent: true },
    ];
  },
};

export default nextConfig;
