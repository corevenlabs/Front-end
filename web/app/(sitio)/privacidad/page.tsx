import type { Metadata } from 'next';
import { metadatos } from '@/lib/seo';
import Link from 'next/link';
import { RESPONSABLE as R } from '@/content/legal';
import s from '@/components/Pagina.module.css';

export const metadata: Metadata = metadatos({
  ruta: '/privacidad',
  titulo: 'Política de privacidad',
  descripcion: 'Qué datos guarda Corevenlabs cuando se usa el formulario de contacto o la demo, para qué los usamos y cómo ejercer sus derechos según la Ley 21.719.',
});

export default function Privacidad() {
  const responsable = [R.razonSocial || R.nombre, R.rut && `RUT ${R.rut}`].filter(Boolean).join(', ');
  return (
    <>
      <div className={`contenedor ${s.cabecera}`}>
        <p className="etiqueta">Legal</p>
        <h1 className={s.titulo}>Política de privacidad</h1>
        <p className={s.actualizado}>Actualizada el {R.actualizado}</p>
      </div>
      <article className={`contenedor ${s.legal}`}>
        <p>
          Esta política explica qué datos personales trata {R.nombre} cuando usted visita este sitio, usa la demo del agente o
          nos escribe por el formulario de contacto. La aplicamos según la Ley 19.628 sobre protección de la vida privada y la
          Ley 21.719, que la modifica y regula la protección y el tratamiento de los datos personales.
        </p>

        <h2>Quién es el responsable</h2>
        <p>{responsable}, con domicilio en {R.ciudad}. Para cualquier consulta sobre sus datos: <a href={`mailto:${R.correo}`}>{R.correo}</a>.</p>

        <h2>Qué datos tratamos y para qué</h2>
        <div className={s.tabla}>
          <table>
            <thead>
              <tr><th>Dónde</th><th>Qué datos</th><th>Para qué</th><th>Cuánto tiempo</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Formulario de contacto</td>
                <td>Su nombre, el nombre de su negocio, su WhatsApp o correo y el mensaje que escriba. Para evitar envíos masivos, un identificador anónimo derivado de su IP (se borra a los 7 días).</td>
                <td>Responderle y hacer seguimiento comercial de su consulta. Se registra en nuestro sistema de clientes y nos llega un aviso por correo.</td>
                <td>Hasta 24 meses desde el último contacto si no llegamos a trabajar juntos; si usted es cliente, mientras dure la relación y lo que exija la ley.</td>
              </tr>
              <tr>
                <td>Demo del agente</td>
                <td>Los mensajes que escribe al agente de ejemplo. Un identificador anónimo derivado de su dirección IP y la cantidad de mensajes enviados en el día.</td>
                <td>Generar la respuesta del agente y evitar abusos con un límite diario de mensajes.</td>
                <td>No guardamos el contenido de las conversaciones. El identificador y el contador se borran a los 7 días.</td>
              </tr>
              <tr>
                <td>Navegación</td>
                <td>Datos agregados de visitas: página vista, sitio de origen, país y tipo de dispositivo.</td>
                <td>Saber qué páginas se usan y mejorar el sitio.</td>
                <td>Según la configuración de Vercel Web Analytics. No identifica a personas.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          La base legal para tratar los datos del formulario es su consentimiento, que entrega al marcar la casilla antes de
          enviarlo. Puede retirarlo cuando quiera escribiéndonos. Para la demo y la navegación, la base es nuestro interés
          legítimo en que el sitio funcione y no sea abusado.
        </p>
        <p>Por favor, no escriba datos personales en la demo: es un ejemplo con negocios inventados.</p>

        <h2>Cookies</h2>
        <p>
          El sitio público no usa cookies de publicidad ni de seguimiento. La analítica de Vercel funciona sin cookies. La única
          cookie que usamos es la de sesión del panel de administración, que solo existe para el personal de {R.nombre} cuando
          inicia sesión.
        </p>

        <h2>Con quién compartimos los datos</h2>
        <p>No vendemos ni arrendamos sus datos. Los tratan, por encargo nuestro, estos proveedores:</p>
        <ul>
          <li><b>Vercel</b>: aloja el sitio y la analítica.</li>
          <li><b>Neon</b>: base de datos donde se guardan los contactos del formulario y los contadores de la demo.</li>
          <li><b>Anthropic</b>: genera las respuestas del agente de la demo a partir de los mensajes que usted escribe. Según sus términos comerciales, no usa los datos enviados por su API para entrenar sus modelos.</li>
          <li><b>Resend</b> y <b>Google (Gmail)</b>: envían y reciben el aviso interno de que llegó un nuevo contacto.</li>
        </ul>
        <p>
          Estos proveedores pueden procesar datos fuera de Chile, principalmente en Estados Unidos. Elegimos proveedores que
          aplican medidas de seguridad y confidencialidad adecuadas.
        </p>

        <h2>Sus derechos</h2>
        <p>Puede solicitarnos en cualquier momento:</p>
        <ul>
          <li><b>Acceso</b>: saber qué datos suyos tenemos.</li>
          <li><b>Rectificación</b>: corregir datos inexactos o incompletos.</li>
          <li><b>Supresión</b>: que borremos sus datos.</li>
          <li><b>Oposición</b>: que dejemos de usarlos para un fin determinado.</li>
          <li><b>Portabilidad</b>: recibir sus datos en un formato de uso común.</li>
          <li><b>Bloqueo</b>: que suspendamos temporalmente su tratamiento.</li>
        </ul>
        <p>
          Escríbenos a <a href={`mailto:${R.correo}`}>{R.correo}</a> indicando qué necesita. Le responderemos en un plazo máximo
          de 30 días corridos. Si no queda conforme con la respuesta, puede reclamar ante la Agencia de Protección de Datos
          Personales.
        </p>

        <h2>Seguridad</h2>
        <p>
          El sitio funciona solo con conexión cifrada (HTTPS). Las llaves de acceso a la base de datos y a la IA están solo en
          nuestros servidores, nunca en su navegador. El panel de administración está protegido con contraseña y no aparece en
          buscadores.
        </p>

        <h2>Cambios</h2>
        <p>
          Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha. Recomendamos revisar también los{' '}
          <Link href="/terminos-demo">términos de uso de la demo</Link>.
        </p>
      </article>
    </>
  );
}
