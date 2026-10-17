'use client';

import { Analytics } from '@vercel/analytics/next';

// Vercel Analytics no usa cookies, así que no requiere banner. El admin no se mide.
export function Analitica() {
  return <Analytics beforeSend={(e) => (new URL(e.url).pathname.startsWith('/admin') ? null : e)} />;
}
