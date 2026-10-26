'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import s from './ProgresoScroll.module.css';

export function ProgresoScroll() {
  const linea = useRef<HTMLSpanElement>(null);
  const ruta = usePathname();

  useEffect(() => {
    let pendiente: number | null = null;
    const actualizar = () => {
      pendiente = null;
      const pagina = document.scrollingElement ?? document.documentElement;
      const alto = Math.max(pagina.scrollHeight, document.body.scrollHeight);
      const recorrido = Math.max(0, alto - document.documentElement.clientHeight);
      const desplazamiento = Math.max(pagina.scrollTop, window.scrollY);
      const progreso = recorrido > 0 ? Math.min(1, Math.max(0, desplazamiento / recorrido)) : 0;
      if (linea.current) linea.current.style.transform = `scaleX(${progreso})`;
    };
    const programar = () => {
      if (pendiente === null) pendiente = requestAnimationFrame(actualizar);
    };
    document.addEventListener('scroll', programar, { passive: true, capture: true });
    window.addEventListener('resize', programar);
    window.addEventListener('pageshow', programar);
    const tamano = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(programar) : null;
    tamano?.observe(document.body);
    tamano?.observe(document.documentElement);
    programar();
    return () => {
      if (pendiente !== null) cancelAnimationFrame(pendiente);
      tamano?.disconnect();
      document.removeEventListener('scroll', programar, true);
      window.removeEventListener('resize', programar);
      window.removeEventListener('pageshow', programar);
    };
  }, [ruta]);

  return <div className={s.pista} aria-hidden="true"><span ref={linea} className={s.linea} /></div>;
}
