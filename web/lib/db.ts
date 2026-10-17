import 'server-only';
import { neon } from '@neondatabase/serverless';

// Conexión HTTP a Neon: no deja conexiones abiertas, ideal para funciones serverless.
// DATABASE_URL vive solo en el servidor.
let cliente: ReturnType<typeof neon> | null = null;

export function hayBase() {
  return Boolean(process.env.DATABASE_URL);
}

export function sql() {
  if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL');
  cliente ??= neon(process.env.DATABASE_URL);
  return cliente;
}
