// Sesión del admin: cookie firmada con HMAC-SHA256 (ADMIN_SECRETO_SESION).
// Usa Web Crypto para funcionar igual en el proxy y en el servidor.
export const COOKIE_SESION = 'cv_admin';
export const DURACION_SESION_S = 12 * 60 * 60; // 12 horas

type Carga = { u: string; exp: number };

const codificador = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array) {
  let bin = '';
  for (const b of new Uint8Array(bytes)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function desdeB64url(texto: string) {
  const bin = atob(texto.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function llave() {
  const secreto = process.env.ADMIN_SECRETO_SESION;
  if (!secreto || secreto.length < 32) throw new Error('ADMIN_SECRETO_SESION falta o es muy corto');
  return crypto.subtle.importKey('raw', codificador.encode(secreto), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function crearSesion(usuario: string) {
  const carga: Carga = { u: usuario, exp: Math.floor(Date.now() / 1000) + DURACION_SESION_S };
  const datos = b64url(codificador.encode(JSON.stringify(carga)));
  const firma = await crypto.subtle.sign('HMAC', await llave(), codificador.encode(datos));
  return `${datos}.${b64url(firma)}`;
}

export async function verificarSesion(token: string | undefined): Promise<Carga | null> {
  if (!token) return null;
  const [datos, firma] = token.split('.');
  if (!datos || !firma) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await llave(), desdeB64url(firma), codificador.encode(datos));
    if (!ok) return null;
    const carga = JSON.parse(new TextDecoder().decode(desdeB64url(datos))) as Carga;
    if (carga.u !== process.env.ADMIN_USUARIO || carga.exp < Date.now() / 1000) return null;
    return carga;
  } catch {
    return null;
  }
}
