import Image from 'next/image';
import s from './Secciones.module.css';

export function RobotHero() {
  return (
    <div className={s.robotTransparente} data-visible="true" data-animado="true" aria-hidden="true">
      <Image
        className={s.robotPoster}
        src="/image/agente-robot-transparente-v3.png"
        alt=""
        fill
        sizes="128px"
        loading="eager"
      />
    </div>
  );
}
