'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Recién generada la propuesta, baja el PDF una vez y limpia el ?nueva=1 para que recargar no lo repita.
export function DescargaAuto({ href, volverA }: { href: string; volverA: string }) {
  const router = useRouter();
  useEffect(() => {
    const a = document.createElement('a');
    a.href = href;
    a.click();
    router.replace(volverA, { scroll: false });
  }, [href, volverA, router]);
  return null;
}
