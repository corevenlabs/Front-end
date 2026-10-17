import 'server-only';
import { scrypt, timingSafeEqual } from 'node:crypto';

// Verifica la contraseña contra ADMIN_CLAVE_HASH, con formato
// scrypt:N:r:p:sal:hash (sal y hash en base64url). Se genera con: npm run admin:clave
function scryptAsync(clave: string, sal: Buffer, largo: number, N: number, r: number, p: number) {
  return new Promise<Buffer>((ok, mal) =>
    scrypt(clave, sal, largo, { N, r, p, maxmem: 256 * N * r }, (e, k) => (e ? mal(e) : ok(k))),
  );
}

export async function verificarClave(clave: string, guardado = process.env.ADMIN_CLAVE_HASH ?? '') {
  const [algo, n, r, p, sal, hash] = guardado.split(':');
  if (algo !== 'scrypt' || !sal || !hash) return false;
  const esperado = Buffer.from(hash, 'base64url');
  const calculado = await scryptAsync(clave, Buffer.from(sal, 'base64url'), esperado.length, Number(n), Number(r), Number(p));
  return calculado.length === esperado.length && timingSafeEqual(calculado, esperado);
}

// Compara textos sin filtrar por tiempo cuánto coinciden.
export function igualesSeguro(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
