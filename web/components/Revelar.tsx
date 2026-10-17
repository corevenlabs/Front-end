'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Animaciones de entrada: agrega la clase "entra" a los elementos [data-revelar] cuando aparecen.
// Sin JavaScript (o con movimiento reducido) todo queda visible y quieto.
export function Revelar() {
  const ruta = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute('data-js', '');
    // Cierra el menú móvil al navegar.
    document.querySelectorAll('details[open]').forEach((d) => d.removeAttribute('open'));

    const elementos = document.querySelectorAll<HTMLElement>('[data-revelar]:not(.entra)');
    if (!('IntersectionObserver' in window)) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add('entra');
            observador.unobserve(e.target);
          }
        }
      },
      { threshold: 0.35 },
    );
    elementos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, [ruta]);

  return null;
}
