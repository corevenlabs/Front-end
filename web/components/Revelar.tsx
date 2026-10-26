'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Revelar() {
  const ruta = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute('data-js', '');
    document.querySelectorAll('details[open]').forEach((d) => d.removeAttribute('open'));

    // Conserva las animaciones existentes de iconos y la comparación de tiempos.
    const elementos = document.querySelectorAll<HTMLElement>('[data-revelar]:not(.entra)');
    if (!('IntersectionObserver' in window)) {
      elementos.forEach((el) => el.classList.add('entra'));
      return;
    }
    const observador = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          e.target.classList.add('entra');
          observador.unobserve(e.target);
        }
      }
    }, { threshold: .15 });
    elementos.forEach((el) => observador.observe(el));

    const reduccion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const home = document.querySelector('[data-home-motion]');
    const movimientos = home
      ? document.querySelectorAll<HTMLElement>('[data-home-motion] [data-motion], [data-footer-watermark]')
      : [];
    const mostrar = (el: HTMLElement) => el.classList.add('motion-visible');
    const movimiento = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          mostrar(e.target as HTMLElement);
          movimiento.unobserve(e.target);
        }
      }
    }, { threshold: .1, rootMargin: '0px 0px -20px 0px' });

    movimientos.forEach((el) => {
      const grupo = el.parentElement?.hasAttribute('data-motion-group') ? el.parentElement : null;
      const indice = grupo ? Array.from(grupo.children).indexOf(el) : 0;
      el.style.setProperty('--motion-delay', `${Math.min(indice, 3) * 75}ms`);
      if (el.dataset.motion === 'hero') {
        const orden = Array.from(home!.querySelectorAll('[data-motion="hero"]')).indexOf(el);
        el.style.setProperty('--motion-delay', `${orden * 90}ms`);
      }
      el.dataset.motionReady = 'true';
      // El contenido que ya se ha pasado al restaurar el scroll permanece visible.
      if (reduccion.matches || el.getBoundingClientRect().bottom <= 0) mostrar(el);
      else movimiento.observe(el);
    });

    const mostrarTodos = () => movimientos.forEach(mostrar);
    const foco = (evento: FocusEvent) => {
      const el = (evento.target as HTMLElement).closest<HTMLElement>('[data-motion-ready]');
      if (el) {
        mostrar(el);
        movimiento.unobserve(el);
      }
    };
    reduccion.addEventListener('change', mostrarTodos);
    document.addEventListener('focusin', foco);
    return () => {
      observador.disconnect();
      movimiento.disconnect();
      reduccion.removeEventListener('change', mostrarTodos);
      document.removeEventListener('focusin', foco);
    };
  }, [ruta]);

  return null;
}
