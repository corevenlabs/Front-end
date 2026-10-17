// Aplica db/esquema-web.sql en la base de DATABASE_URL (lee .env.local).
// Solo crea el esquema "web" y sus tablas; no toca las tablas del CRM.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import nextEnv from '@next/env';
import { neon } from '@neondatabase/serverless';

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
nextEnv.loadEnvConfig(raiz);

if (!process.env.DATABASE_URL) {
  console.error('Falta DATABASE_URL en .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const sentencias = readFileSync(path.join(raiz, 'db', 'esquema-web.sql'), 'utf8')
  .split(/;\s*$/m)
  .map((s) => s.replace(/^\s*--.*$/gm, '').trim())
  .filter(Boolean);

for (const s of sentencias) {
  await sql.query(s);
  console.log('OK:', s.split('\n')[0]);
}
console.log('Esquema web listo.');
