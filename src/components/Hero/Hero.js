import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroParticles from './HeroParticles';
import './Hero.css';

const slides = [
  { badge: 'Desarrollo Web', description: 'Diseñamos experiencias digitales pensadas para vender y escalar.', visual: 'INTERFAZ / CÓDIGO' },
  { badge: 'Integraciones API', description: 'Automatizamos procesos y eliminamos tareas manuales.', visual: 'SISTEMAS / CONECTADOS' },
  { badge: 'Pagos Online', description: 'Implementamos pasarelas de pago listas para escalar tu negocio.', visual: 'PAGOS / SEGUROS' }
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [isScrollBackground, setIsScrollBackground] = useState(false);

  useEffect(() => {
    let frame = null;
    let lastScrollMode = 0;
    let lastScrollTop = window.scrollY;
    let scrollDirection = 'down';

    const updateFromScroll = () => {
      frame = null;
      const scrollTop = window.scrollY;
      const delta = scrollTop - lastScrollTop;
      if (delta > 1) scrollDirection = 'down';
      else if (delta < -1) scrollDirection = 'up';
      lastScrollTop = scrollTop;

      const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
      const backgroundActive = scrollDirection === 'up'
        ? scrollTop >= heroHeight
        : scrollTop > 12;
      setIsScrollBackground(backgroundActive);

      if (backgroundActive) {
        const scrollMode = Math.floor(scrollTop / (window.innerHeight * 0.9)) % slides.length;
        if (scrollMode !== lastScrollMode) {
          lastScrollMode = scrollMode;
          setIndex(scrollMode);
        }
      } else if (lastScrollMode !== 0) {
        lastScrollMode = 0;
        setIndex(0);
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    const interval = setInterval(() => {
      if (window.scrollY <= 12) setIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => {
      clearInterval(interval);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  const current = slides[index];

  return (
    <section className="hero">
      <div className={`hero-visual${isScrollBackground ? ' hero-visual--background' : ''}`}>
        <HeroParticles mode={index} expanded={isScrollBackground} />
        <div key={current.visual} className="hero-visual-label">{current.visual}</div>
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <span key={`${index}-badge`} className="hero-badge">{current.badge}</span>
          <h1>Software a medida que <span>escala tu negocio</span></h1>
          <p key={`${index}-description`} className="hero-description">{current.description}</p>
          <div className="hero-actions"><Link to="/comenzar" className="btn-primary">Comenzar Proyecto</Link><a href="#servicios" className="btn-secondary">Ver Servicios</a></div>
          <div className="hero-pagination" aria-label={`Concepto ${index + 1} de ${slides.length}`}>
            {slides.map((slide, slideIndex) => <button key={slide.badge} type="button" className={slideIndex === index ? 'active' : ''} onClick={() => setIndex(slideIndex)} aria-label={`Mostrar ${slide.badge}`} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
