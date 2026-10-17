'use client';

import { useEffect, useState } from 'react';
import { horaSantiago } from './ChatDemo';

// Hora real de Santiago. En el servidor se muestra vacío para no generar un desfase al hidratar.
export function Reloj() {
  const [hora, setHora] = useState<string | null>(null);

  useEffect(() => {
    const tic = () => setHora(horaSantiago());
    tic();
    const id = setInterval(tic, 15000);
    return () => clearInterval(id);
  }, []);

  const h = hora ? Number(hora.slice(0, 2)) : 12;
  const fueraDeHorario = h >= 21 || h < 8;

  return (
    <p className="reloj" aria-live="off">
      <span className="reloj-punto" aria-hidden="true" />
      <span>
        Son las <b className="mono">{hora ?? '--:--'}</b> en Santiago.{' '}
        {fueraDeHorario ? 'A esta hora casi nadie contesta. El agente sí.' : 'Escríbele como si fueras cliente.'}
      </span>
    </p>
  );
}
