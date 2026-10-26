'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import s from './Secciones.module.css';

export function RobotHero() {
  const video = useRef<HTMLVideoElement>(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const clip = video.current;
    if (!clip) return;
    const reduccion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activo = true;
    let temporizador: ReturnType<typeof setTimeout> | undefined;

    const reproducir = () => {
      if (!activo || reduccion.matches) return;
      if (document.hidden) {
        temporizador = setTimeout(reproducir, 20000);
        return;
      }
      clip.currentTime = 0;
      clip.muted = true;
      clip.play().catch(() => {
        if (activo) { setReproduciendo(false); setVisible(true); }
      });
    };
    const terminado = () => {
      setReproduciendo(false);
      clearTimeout(temporizador);
      if (!reduccion.matches) temporizador = setTimeout(reproducir, 20000);
    };
    const cambiarPreferencia = () => {
      clearTimeout(temporizador);
      if (reduccion.matches) {
        clip.pause();
        setReproduciendo(false);
        setVisible(true);
      } else temporizador = setTimeout(reproducir, 1900);
    };
    clip.addEventListener('ended', terminado);
    reduccion.addEventListener('change', cambiarPreferencia);
    if (reduccion.matches) setVisible(true);
    else temporizador = setTimeout(reproducir, 1900);
    return () => {
      activo = false;
      clearTimeout(temporizador);
      clip.removeEventListener('ended', terminado);
      reduccion.removeEventListener('change', cambiarPreferencia);
      clip.pause();
    };
  }, []);

  return (
    <div className={s.robotTransparente} data-animado={reproduciendo} data-visible={visible} aria-hidden="true">
      <Image
        className={s.robotPoster}
        src="/video/agente-robot-reposo-v2.png"
        alt=""
        fill
        sizes="128px"
        loading="eager"
      />
      <video
        ref={video}
        muted
        playsInline
        preload="auto"
        width={720}
        height={1280}
        onPlaying={() => { setVisible(true); setReproduciendo(true); }}
        onError={() => setReproduciendo(false)}
      >
        <source src="/video/agente-robot-transparente-v2.webm" type="video/webm" />
      </video>
    </div>
  );
}
