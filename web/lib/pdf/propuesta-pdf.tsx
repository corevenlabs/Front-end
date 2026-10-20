import 'server-only';
import path from 'node:path';
import { Document, Font, Page, Path, StyleSheet, Svg, Text, View, renderToBuffer } from '@react-pdf/renderer';
import { C, FLECHA } from '@/components/Logo';
import { RESPONSABLE } from '@/content/legal';
import { SITIO } from '@/content/sitio';
import { FORMAS_PAGO, IVA, formatearRut, partesPago, pesos, totales } from '@/lib/propuesta';
import { fechaLarga, type PropuestaGuardada } from '@/lib/propuestas';

// PDF de una propuesta comercial, generado en el servidor con @react-pdf/renderer.
// Fuentes estáticas (licencia OFL) en lib/pdf/fuentes: Archivo y IBM Plex Mono, las mismas del sitio.

const fuente = (archivo: string) => path.join(process.cwd(), 'lib', 'pdf', 'fuentes', archivo);
Font.register({ family: 'Archivo', fonts: [{ src: fuente('archivo-400.ttf') }, { src: fuente('archivo-600.ttf'), fontWeight: 600 }] });
Font.register({ family: 'ArchivoTitulo', src: fuente('archivo-titulo.ttf') });
Font.register({ family: 'Plex', src: fuente('plex-mono-500.woff') });
Font.registerHyphenationCallback((palabra) => [palabra]); // sin guiones de corte en español

const NEGRO = '#0A0A0A';
const AZUL = '#4A8FE7';
const GRIS = '#5B6270';
const LINEA = '#E4E6EA';
const FONDO = '#F3F5F8';

const e = StyleSheet.create({
  pagina: { fontFamily: 'Archivo', fontSize: 9.5, color: NEGRO, paddingTop: 40, paddingBottom: 60, paddingHorizontal: 48, lineHeight: 1.35 },
  cabeza: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  marca: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  marcaTexto: { fontFamily: 'ArchivoTitulo', fontSize: 15 },
  docDatos: { alignItems: 'flex-end', gap: 2 },
  etiqueta: { fontFamily: 'Plex', fontSize: 7.5, color: GRIS, textTransform: 'uppercase', letterSpacing: 0.6 },
  numero: { fontFamily: 'Plex', fontSize: 11 },
  regla: { height: 2, backgroundColor: NEGRO, marginTop: 14, marginBottom: 14 },
  partes: { flexDirection: 'row', gap: 24, marginBottom: 18 },
  parte: { flex: 1, gap: 1 },
  parteNombre: { fontWeight: 600, fontSize: 11, marginTop: 4, marginBottom: 1 },
  tenue: { color: GRIS },
  titulo: { fontFamily: 'ArchivoTitulo', fontSize: 17, lineHeight: 1.15, marginBottom: 5 },
  descripcion: { color: GRIS, fontSize: 10, marginBottom: 14, maxWidth: 440 },
  seccion: { marginBottom: 14 },
  seccionTitulo: { fontWeight: 600, fontSize: 10.5, marginBottom: 6 },
  item: { flexDirection: 'row', gap: 8, marginBottom: 2.5, alignItems: 'flex-start' },
  tabla: { borderTopWidth: 1, borderTopColor: NEGRO },
  fila: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: LINEA },
  monto: { fontFamily: 'Plex', fontSize: 10 },
  filaTotal: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, paddingHorizontal: 10, backgroundColor: NEGRO, color: '#FFFFFF', marginTop: 5 },
  totalTexto: { fontWeight: 600, fontSize: 11 },
  totalMonto: { fontFamily: 'Plex', fontSize: 12 },
  caja: { backgroundColor: FONDO, padding: 10, borderRadius: 4, gap: 2 },
  cierre: { marginTop: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: LINEA, fontSize: 8.5, color: GRIS },
  pieLinea: { position: 'absolute', bottom: 40, left: 48, right: 48, height: 1, backgroundColor: LINEA },
  pie: { position: 'absolute', bottom: 26, left: 48, fontSize: 7.5, color: GRIS },
  pieDerecha: { position: 'absolute', bottom: 26, left: 48, right: 48, textAlign: 'right', fontSize: 7.5, color: GRIS, fontFamily: 'Plex' },
});

function Logo({ alto }: { alto: number }) {
  return (
    <Svg viewBox="0 0 1877 1998" style={{ width: (alto * 1877) / 1998, height: alto }}>
      <Path d={C} fill={NEGRO} />
      <Path d={FLECHA} fill={AZUL} />
    </Svg>
  );
}

function Check() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 10, height: 10, marginTop: 2.5 }}>
      <Path d="M3.5 12.5 9.5 18.5 20.5 6" stroke={AZUL} strokeWidth={3} fill="none" />
    </Svg>
  );
}

function Fila({ texto, monto, tenue = false }: { texto: string; monto: string; tenue?: boolean }) {
  return (
    <View style={e.fila} wrap={false}>
      <Text style={[{ flex: 1 }, tenue ? e.tenue : {}]}>{texto}</Text>
      <Text style={[e.monto, tenue ? e.tenue : {}]}>{monto}</Text>
    </View>
  );
}

function Documento({ p }: { p: PropuestaGuardada }) {
  const d = p.datos;
  const c = d.cliente;
  const t = totales(d);
  const conMonto = d.cargos.filter((x) => x.monto !== null);
  const partes = d.pago.tipo === 'ninguna' ? [] : partesPago(d.pago, t.unico.total);
  const iva = `IVA ${Math.round(IVA * 100)}%`;
  const titulo = d.titulo || 'Propuesta de servicios';

  return (
    <Document title={`Propuesta ${p.numero} · ${p.cliente}`} author={`${RESPONSABLE.razonSocial} (${RESPONSABLE.nombre})`} subject={titulo} language="es-CL">
      <Page size="A4" style={e.pagina}>
        <View style={e.cabeza}>
          <View style={e.marca}>
            <Logo alto={30} />
            <Text style={e.marcaTexto}>Corevenlabs</Text>
          </View>
          <View style={e.docDatos}>
            <Text style={e.etiqueta}>Propuesta comercial</Text>
            <Text style={e.numero}>{p.numero}</Text>
            <Text style={e.tenue}>Emitida el {fechaLarga(p.emitida)}</Text>
            <Text>Válida hasta el {fechaLarga(p.vence)}</Text>
          </View>
        </View>
        <View style={e.regla} />

        <View style={e.partes}>
          <View style={e.parte}>
            <Text style={e.etiqueta}>Para</Text>
            {(c.nombre || c.razonSocial) && <Text style={e.parteNombre}>{c.nombre || c.razonSocial}</Text>}
            {c.razonSocial && c.nombre && c.razonSocial !== c.nombre && <Text>{c.razonSocial}</Text>}
            {c.rut && <Text>RUT {formatearRut(c.rut)}</Text>}
            {c.contacto && <Text>Atención: {c.contacto}</Text>}
            {c.correo && <Text style={e.tenue}>{c.correo}</Text>}
            {c.telefono && <Text style={e.tenue}>{c.telefono}</Text>}
            {c.comuna && <Text style={e.tenue}>{c.comuna}</Text>}
          </View>
          <View style={e.parte}>
            <Text style={e.etiqueta}>De</Text>
            <Text style={e.parteNombre}>{RESPONSABLE.razonSocial}</Text>
            <Text>RUT {RESPONSABLE.rut}</Text>
            <Text>{RESPONSABLE.nombre}</Text>
            <Text style={e.tenue}>{RESPONSABLE.correo}</Text>
            <Text style={e.tenue}>{SITIO.url.replace('https://', '')}</Text>
          </View>
        </View>

        <Text style={e.titulo}>{titulo}</Text>
        {d.descripcion ? <Text style={e.descripcion}>{d.descripcion}</Text> : <View style={{ marginBottom: 12 }} />}

        {d.incluye.length > 0 && (
          <View style={e.seccion}>
            <Text style={e.seccionTitulo}>Qué incluye</Text>
            {d.incluye.map((x, i) => (
              <View key={i} style={e.item} wrap={false}>
                <Check />
                <Text style={{ flex: 1 }}>{x}</Text>
              </View>
            ))}
          </View>
        )}

        {(d.cargos.length > 0 || d.mensual) && (
          <View style={e.seccion} wrap={false}>
            <Text style={e.seccionTitulo}>Inversión</Text>
            {d.cargos.length > 0 && (
              <View style={e.tabla}>
                {d.cargos.map((x, i) => (
                  <Fila key={i} texto={x.descripcion || 'Servicio'} monto={x.monto === null ? 'Por definir' : pesos(x.monto)} tenue={x.monto === null} />
                ))}
                {conMonto.length > 0 && (
                  <>
                    <Fila texto="Subtotal neto" monto={pesos(t.unico.neto)} tenue />
                    <Fila texto={iva} monto={pesos(t.unico.iva)} tenue />
                    <View style={e.filaTotal}>
                      <Text style={e.totalTexto}>Total, IVA incluido</Text>
                      <Text style={e.totalMonto}>{pesos(t.unico.total)}</Text>
                    </View>
                  </>
                )}
              </View>
            )}
            {d.mensual && (
              <View style={[e.caja, { marginTop: d.cargos.length ? 10 : 0 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
                  <Text style={{ flex: 1, fontWeight: 600 }}>{d.mensual.descripcion || 'Mensualidad'}</Text>
                  <Text style={e.monto}>{t.mensual ? `${pesos(t.mensual.neto)} + IVA al mes` : 'Por definir'}</Text>
                </View>
                {t.mensual && <Text style={e.tenue}>{pesos(t.mensual.total)} al mes con IVA incluido ({iva}: {pesos(t.mensual.iva)}).</Text>}
              </View>
            )}
          </View>
        )}

        {partes.length > 0 && (
          <View style={e.seccion} wrap={false}>
            <Text style={e.seccionTitulo}>Forma de pago{d.pago.tipo === 'otra' ? '' : ` · ${FORMAS_PAGO[d.pago.tipo].toLowerCase()}`}</Text>
            <View style={e.tabla}>
              {partes.map((x, i) => <Fila key={i} texto={x.texto} monto={x.monto === null ? '' : pesos(x.monto)} />)}
            </View>
            {partes.some((x) => x.monto !== null) && <Text style={[e.tenue, { marginTop: 5, fontSize: 8.5 }]}>Montos con IVA incluido.</Text>}
          </View>
        )}

        {(d.plazo || d.notas) && (
          <View style={e.seccion} wrap={false}>
            {d.plazo && (
              <Text style={{ marginBottom: d.notas ? 10 : 0 }}>
                <Text style={{ fontWeight: 600 }}>Plazo estimado: </Text>{d.plazo}
              </Text>
            )}
            {d.notas && (
              <>
                <Text style={e.seccionTitulo}>Notas</Text>
                <Text>{d.notas}</Text>
              </>
            )}
          </View>
        )}

        <Text style={e.cierre} wrap={false}>
          Valores en pesos chilenos. Esta propuesta resume el alcance y la inversión, y es válida por 30 días desde su emisión.
          Al aceptarla, enviamos el acuerdo de servicios con las especificaciones y condiciones del proyecto para su firma.
        </Text>

        <View style={e.pieLinea} fixed />
        <Text style={e.pie} fixed>{RESPONSABLE.razonSocial} · RUT {RESPONSABLE.rut} · {SITIO.url.replace('https://', '')}</Text>
        <Text style={e.pieDerecha} fixed>{p.numero}</Text>
      </Page>
    </Document>
  );
}

export function generarPdf(p: PropuestaGuardada) {
  return renderToBuffer(<Documento p={p} />);
}

// Nombre de archivo sin tildes ni símbolos: Propuesta_P-2026-001_Ramen_Kintsugi.pdf
export function nombreArchivo(p: PropuestaGuardada) {
  const cliente = p.cliente.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 50);
  return `Propuesta_${p.numero}${cliente ? `_${cliente}` : ''}.pdf`;
}
