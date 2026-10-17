import s from './Admin.module.css';

const CLASE_ESTADO: Record<string, string> = {
  nuevo: s.eNuevo,
  'para revisar': s.eRevisar,
  contactado: s.eActivo,
  reunión: s.eActivo,
  propuesta: s.eActivo,
  cliente: s.eCliente,
  'no interesa': s.eCerrado,
  descartado: s.eCerrado,
  excluido: s.eCerrado,
};

export function Estado({ estado }: { estado: string }) {
  return <span className={`${s.estado} ${CLASE_ESTADO[estado] ?? ''}`}>{estado}</span>;
}

export function Puntaje({ valor, grande = false }: { valor: number | null; grande?: boolean }) {
  // Escala 0 a 10 del calificador de prospecting-bot (PUNTAJE_MINIMO = 5).
  const nivel = valor === null ? s.pNada : valor >= 7 ? s.pAlto : valor >= 5 ? s.pMedio : s.pBajo;
  return (
    <span className={`${s.puntaje} ${nivel} ${grande ? s.puntajeGrande : ''}`} title="Puntaje">
      {valor ?? '–'}
    </span>
  );
}

export function SinBase() {
  return (
    <div className={s.aviso}>
      <b>Falta conectar la base de datos.</b> Agrega <code>DATABASE_URL</code> en <code>web/.env.local</code> (la misma de Neon que usa
      prospecting-bot), corre <code>npm run db:web</code> y reinicia el servidor.
    </div>
  );
}

export function Aviso({ children }: { children: React.ReactNode }) {
  return <p className={s.ok} role="status">{children}</p>;
}
