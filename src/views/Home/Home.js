import React, { useEffect } from 'react';
import Lenis from 'lenis';
import './Home.css';
import Seo from '../../components/Seo/Seo';
import Hero from '../../components/Hero/Hero';
import Services from '../../components/Services/Services';
import DesignShowcase from '../../components/DesignShowcase/DesignShowcase';
import TechStack from '../../components/TechStack/TechStack';
import LaudusPartnership from '../../components/LaudusPartnership/LaudusPartnership';
import TrustedBrands from '../../components/TrustedBrands/TrustedBrands';
import FinalTouch from '../../components/FinalTouch/FinalTouch';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Corevenlabs',
  url: 'https://www.corevenlabs.com/',
  logo: 'https://www.corevenlabs.com/image/coreven.png',
  description: 'Corevenlabs desarrolla sitios web, integraciones de APIs y automatizaciones a medida para escalar negocios.',
  areaServed: 'CL',
  sameAs: [
    'https://instagram.com/corevenlabs'
  ]
};

export default function Home() {

  useEffect(() => {
    // 1. Inicializamos Lenis
    const lenis = new Lenis({
      duration: 1.5, // Tiempo que tarda en llegar (más alto = más lento/elegante)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Si llegamos desde otra ruta con un hash (ej. /comenzar -> /#servicios),
    // hacemos scroll a la sección una vez que Lenis esté listo.
    if (window.location.hash) {
      requestAnimationFrame(() => {
        lenis.scrollTo(window.location.hash, { offset: -80, immediate: true });
      });
    }

    // 2. Lógica para interceptar clics del Navbar
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      // Verificamos si es un link interno (que empieza con #)
      if (target && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href');
        
        // Lenis realiza el scroll suave hacia el ID
        lenis.scrollTo(id, {
          offset: -80, // Para que no tape el título el Navbar fijo
          immediate: false,
          duration: 1.5,
        });
      }
    };

    // Escuchamos los clics en todo el documento (delegación de eventos)
    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="home-wrapper">
      <Seo
        title="Desarrollo Web, Integraciones y Automatización a Medida"
        description="Corevenlabs desarrolla sitios web, integraciones de APIs y automatizaciones a medida para escalar tu negocio. Cuéntanos tu proyecto y comencemos hoy."
        canonical="https://www.corevenlabs.com/"
        ogImage="https://www.corevenlabs.com/image/coreven.png"
        jsonLd={organizationJsonLd}
      />
      <main className="home-content">
        <div id="inicio"><Hero /></div>
        
        <section id="servicios" className="reveal-section">
          <Services />
        </section>

        <section id="diseño" className="reveal-section">
          <DesignShowcase />
        </section>

        <section id="equipo" className="reveal-section">
          <TechStack />
        </section>

        <section id="alianza-laudus" className="reveal-section">
          <LaudusPartnership />
        </section>

        <section id="marcas" className="reveal-section">
          <TrustedBrands/>
        </section>

        <div id="contacto"><FinalTouch /></div>

      </main>
    </div>
  );
}
