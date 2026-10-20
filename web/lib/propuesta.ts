// Modelo de una propuesta comercial. Lo usan el editor (navegador), la acción que la guarda y el PDF,
// así los montos, el IVA y los avisos se calculan igual en todos lados. Montos en pesos, netos.

import { pesos } from '@/content/precios';

export { pesos };

export const IVA = 0.19;
export const VIGENCIA_DIAS = 30;

export type Cargo = { descripcion: string; monto: number | null };

export const FORMAS_PAGO = {
  unico: '100% al aprobar',
  mitades: '50% al aprobar y 50% contra entrega',
  cuotas: 'En cuotas',
  otra: 'Personalizada',
  ninguna: 'No incluir forma de pago',
} as const;
export type TipoPago = keyof typeof FORMAS_PAGO;
export type Pago = { tipo: TipoPago; cuotas: number; texto: string };

export type Cliente = {
  nombre: string; razonSocial: string; rut: string; contacto: string; correo: string; telefono: string; comuna: string;
};

export type DatosPropuesta = {
  plantilla: string;
  titulo: string;
  descripcion: string;
  cliente: Cliente;
  incluye: string[];
  cargos: Cargo[]; // pago único
  mensual: Cargo | null; // cobro recurrente, aparte del total
  pago: Pago;
  plazo: string;
  notas: string;
};

export function conIva(neto: number) {
  const iva = Math.round(neto * IVA);
  return { neto, iva, total: neto + iva };
}

export function totales(d: Pick<DatosPropuesta, 'cargos' | 'mensual'>) {
  const neto = d.cargos.reduce((suma, c) => suma + (c.monto ?? 0), 0);
  return {
    unico: conIva(neto),
    mensual: d.mensual?.monto != null ? conIva(d.mensual.monto) : null,
  };
}

// Reparte el total con IVA según la forma de pago. El redondeo se carga en la última parte.
export function partesPago(pago: Pago, total: number): { texto: string; monto: number | null }[] {
  if (pago.tipo === 'unico') return [{ texto: '100% al aprobar la propuesta', monto: total || null }];
  if (pago.tipo === 'mitades') {
    const primera = Math.round(total / 2);
    return [
      { texto: '50% al aprobar la propuesta', monto: total ? primera : null },
      { texto: '50% contra entrega', monto: total ? total - primera : null },
    ];
  }
  if (pago.tipo === 'cuotas') {
    // Resumido para que 12 cuotas no ocupen 12 filas: la diferencia del redondeo va en la última.
    const n = Math.min(Math.max(Math.trunc(pago.cuotas) || 2, 2), 24);
    const base = Math.floor(total / n);
    const ultima = total - base * (n - 1);
    const cada = 'la primera al aprobar la propuesta y las siguientes cada 30 días';
    if (!total) return [{ texto: `${n} cuotas mensuales, ${cada}`, monto: null }];
    if (ultima === base) return [{ texto: `${n} cuotas mensuales de ${pesos(base)}, ${cada}`, monto: total }];
    return [
      { texto: `${n - 1} cuotas mensuales de ${pesos(base)}, ${cada}`, monto: base * (n - 1) },
      { texto: `Cuota ${n}, a ${(n - 1) * 30} días`, monto: ultima },
    ];
  }
  if (pago.tipo === 'otra' && pago.texto.trim()) return [{ texto: pago.texto.trim(), monto: null }];
  return [];
}

// RUT chileno: dígito verificador con módulo 11.
export function rutValido(rut: string) {
  const limpio = rut.replace(/[.\s-]/g, '').toUpperCase();
  if (!/^\d{7,8}[\dK]$/.test(limpio)) return false;
  const cuerpo = limpio.slice(0, -1);
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  const dv = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dv === limpio.slice(-1);
}

export function formatearRut(rut: string) {
  const limpio = rut.replace(/[.\s-]/g, '').toUpperCase();
  if (!/^\d{7,8}[\dK]$/.test(limpio)) return rut.trim();
  return `${Number(limpio.slice(0, -1)).toLocaleString('es-CL')}-${limpio.slice(-1)}`;
}

// Campos importantes que faltan. Son avisos: la propuesta se puede generar igual y el PDF omite lo vacío.
export function faltantes(d: DatosPropuesta): string[] {
  const c = d.cliente;
  const lista: string[] = [];
  if (!c.nombre.trim()) lista.push('Nombre del cliente');
  if (!c.razonSocial.trim()) lista.push('Razón social');
  if (!c.rut.trim()) lista.push('RUT del cliente');
  else if (!rutValido(c.rut)) lista.push('RUT del cliente (no parece válido)');
  if (!c.contacto.trim()) lista.push('Persona de contacto');
  if (!c.correo.trim() && !c.telefono.trim()) lista.push('Correo o teléfono');
  if (!d.titulo.trim()) lista.push('Título de la propuesta');
  if (!d.cargos.length && !d.mensual) lista.push('Al menos un ítem en la inversión');
  for (const cargo of d.cargos) if (cargo.monto == null) lista.push(`Monto de «${cargo.descripcion || 'ítem sin nombre'}»`);
  if (d.mensual && d.mensual.monto == null) lista.push(`Monto de «${d.mensual.descripcion || 'mensualidad'}»`);
  if (d.pago.tipo === 'otra' && !d.pago.texto.trim()) lista.push('Detalle de la forma de pago');
  return lista;
}


// Lee un monto escrito a mano ("390.000", "$ 390000") como número; vacío = sin monto.
export function leerMonto(texto: string): number | null {
  const digitos = texto.replace(/[^\d]/g, '');
  return digitos ? Math.min(Number(digitos), 2_000_000_000) : null;
}
