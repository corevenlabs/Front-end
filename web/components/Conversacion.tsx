import { ChatDemo } from './ChatDemo';
import type { Mensaje } from '@/content/rubros';

// Misma pantalla y marco que la demo; conserva el ejemplo fijo de este rubro.
export function Conversacion({ nombre, iniciales, mensajes }: { nombre: string; iniciales: string; mensajes: Mensaje[] }) {
  return (
    <ChatDemo
      negocios={[{ slug: 'ejemplo', corto: 'Ejemplo', nombre, iniciales, sugeridas: [], ejemplo: mensajes }]}
      compacto
      telefono
      soloEjemplo
      idCampo="rubro-ejemplo-mensaje"
    />
  );
}
