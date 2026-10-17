import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_SESION, verificarSesion } from './sesion';

// Verificación en el servidor (además del proxy). Úsala al inicio de cada página y acción del admin.
export async function exigirAdmin() {
  const sesion = await verificarSesion((await cookies()).get(COOKIE_SESION)?.value);
  if (!sesion) redirect('/admin/login');
  return sesion;
}

export function adminConfigurado() {
  return Boolean(process.env.ADMIN_USUARIO && process.env.ADMIN_CLAVE_HASH && (process.env.ADMIN_SECRETO_SESION?.length ?? 0) >= 32);
}

const FORMATO = new Intl.DateTimeFormat('es-CL', {
  timeZone: 'America/Santiago', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
});

export function fecha(valor: string | Date) {
  return FORMATO.format(new Date(valor)).replace(',', '');
}
