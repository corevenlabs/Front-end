// Genera el hash de la contraseña del admin y lo guarda en .env.local (ADMIN_CLAVE_HASH).
// Uso:  npm run admin:clave
// La contraseña no se muestra mientras la escribes y nunca se guarda en texto plano.
import { randomBytes, scryptSync } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const archivoEnv = path.join(raiz, '.env.local');

function preguntarOculto(texto) {
  return new Promise((ok) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(texto)) rl.output.write(s); };
    rl.question(texto, (r) => { rl.close(); process.stdout.write('\n'); ok(r); });
  });
}

const clave = await preguntarOculto('Contraseña nueva del admin (mínimo 14 caracteres): ');
if (clave.length < 14) {
  console.error('Muy corta. Usa al menos 14 caracteres; una frase de varias palabras sirve.');
  process.exit(1);
}
if (clave !== (await preguntarOculto('Repítela: '))) {
  console.error('No coinciden.');
  process.exit(1);
}

const N = 2 ** 15, r = 8, p = 1;
const sal = randomBytes(16);
const hash = scryptSync(clave, sal, 64, { N, r, p, maxmem: 256 * N * r });
const valor = `scrypt:${N}:${r}:${p}:${sal.toString('base64url')}:${hash.toString('base64url')}`;

let env = existsSync(archivoEnv) ? readFileSync(archivoEnv, 'utf8') : '';
env = /^ADMIN_CLAVE_HASH=.*$/m.test(env)
  ? env.replace(/^ADMIN_CLAVE_HASH=.*$/m, `ADMIN_CLAVE_HASH=${valor}`)
  : `${env.trimEnd()}\nADMIN_CLAVE_HASH=${valor}\n`;
writeFileSync(archivoEnv, env);
console.log('Listo: ADMIN_CLAVE_HASH quedó en .env.local. Para Vercel, copia esa misma línea en sus variables de entorno.');
