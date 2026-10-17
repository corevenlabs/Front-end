'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_SESION, DURACION_SESION_S, crearSesion } from '@/lib/sesion';
import { igualesSeguro, verificarClave } from '@/lib/clave';
import { adminConfigurado } from '@/lib/admin';
import { registrarUso } from '@/lib/limites';

export type EstadoLogin = { error: string } | null;

export async function iniciarSesion(_prev: EstadoLogin, form: FormData): Promise<EstadoLogin> {
  if (!adminConfigurado()) {
    return { error: 'El admin no está configurado: faltan ADMIN_USUARIO, ADMIN_CLAVE_HASH o ADMIN_SECRETO_SESION.' };
  }

  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'desconocida';
  const limite = await registrarUso('login', ip).catch(() => 'ok' as const);
  if (limite !== 'ok') return { error: 'Demasiados intentos. Espera hasta mañana o revisa tus credenciales.' };

  const usuario = String(form.get('usuario') ?? '').trim();
  const clave = String(form.get('clave') ?? '');
  const usuarioOk = igualesSeguro(usuario, process.env.ADMIN_USUARIO!);
  const claveOk = await verificarClave(clave); // se calcula siempre, para no revelar si el usuario existe
  if (!usuarioOk || !claveOk) return { error: 'Usuario o contraseña incorrectos.' };

  (await cookies()).set(COOKIE_SESION, await crearSesion(usuario), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // lax: permite abrir la ficha desde el enlace del correo de aviso
    path: '/admin',
    maxAge: DURACION_SESION_S,
  });

  const desde = String(form.get('desde') ?? '');
  redirect(desde.startsWith('/admin/') && !desde.startsWith('//') ? desde : '/admin');
}

export async function cerrarSesion() {
  (await cookies()).delete({ name: COOKIE_SESION, path: '/admin' });
  redirect('/admin/login');
}
