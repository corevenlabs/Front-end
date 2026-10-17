// Validación del formulario de contacto. Se usa igual en el navegador y en el servidor.
export type DatosContacto = { nombre: string; negocio: string; contacto: string; mensaje: string; acepta: boolean };
export type Errores = Partial<Record<keyof DatosContacto, string>>;

export const LIMITES = { nombre: 80, negocio: 120, contacto: 120, mensaje: 1500 };

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Acepta +56 9 1234 5678, 912345678, 56912345678, etc.
export function normalizarTelefono(valor: string) {
  const digitos = valor.replace(/[^\d]/g, '');
  if (/^569\d{8}$/.test(digitos)) return `+${digitos}`;
  if (/^9\d{8}$/.test(digitos)) return `+56${digitos}`;
  return null;
}

export function tipoContacto(valor: string): 'correo' | 'telefono' | null {
  const v = valor.trim();
  if (CORREO.test(v)) return 'correo';
  if (normalizarTelefono(v)) return 'telefono';
  return null;
}

export function validar(d: DatosContacto): Errores {
  const e: Errores = {};
  if (!d.nombre.trim()) e.nombre = 'Escribe tu nombre.';
  else if (d.nombre.length > LIMITES.nombre) e.nombre = `Máximo ${LIMITES.nombre} caracteres.`;
  if (!d.negocio.trim()) e.negocio = 'Cuéntanos el nombre de tu negocio.';
  else if (d.negocio.length > LIMITES.negocio) e.negocio = `Máximo ${LIMITES.negocio} caracteres.`;
  if (!tipoContacto(d.contacto)) e.contacto = 'Escribe un WhatsApp chileno (+56 9…) o un correo válido.';
  if (d.mensaje.length > LIMITES.mensaje) e.mensaje = `Máximo ${LIMITES.mensaje} caracteres.`;
  if (!d.acepta) e.acepta = 'Necesitamos tu autorización para responderte.';
  return e;
}
