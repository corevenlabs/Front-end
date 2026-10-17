'use client';

import { useState } from 'react';
import s from './Admin.module.css';

// Copia un borrador al portapapeles para pegarlo en WhatsApp, Instagram o el correo.
export function Copiar({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      className={s.botonChico}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setCopiado(true);
          setTimeout(() => setCopiado(false), 1600);
        } catch {
          setCopiado(false);
        }
      }}
    >
      {copiado ? 'Copiado' : 'Copiar'}
    </button>
  );
}
