import type { Metadata } from 'next';
import Link from 'next/link';
import { RESPONSABLE as R } from '@/content/legal';
import s from '@/components/Pagina.module.css';

export const metadata: Metadata = {
  title: 'Términos de uso de la demo',
  description: 'La demo del agente es un ejemplo con negocios inventados. Qué puedes esperar de ella y qué no.',
  alternates: { canonical: '/terminos-demo' },
};

export default function TerminosDemo() {
  return (
    <>
      <div className={`contenedor ${s.cabecera}`}>
        <p className="etiqueta">Legal</p>
        <h1 className={s.titulo}>Términos de uso de la demo</h1>
        <p className={s.actualizado}>Actualizados el {R.actualizado}</p>
      </div>
      <article className={`contenedor ${s.legal}`}>
        <h2>Es un ejemplo</h2>
        <p>
          Los negocios de la demo (Ramen Kintsugi, Taller Plata Austral, Remodela Sur y los demás que aparecen en el sitio) son
          inventados por {R.nombre}. Sus cartas, precios, horarios, direcciones y personas no existen. No puedes comprar, reservar
          ni agendar nada real a través de la demo.
        </p>

        <h2>No escribas datos personales</h2>
        <p>
          No escribas tu RUT, dirección, teléfono, datos de salud, datos bancarios ni información de otras personas. Los mensajes
          se envían a un proveedor de inteligencia artificial para generar la respuesta. No guardamos el contenido de las
          conversaciones; más detalles en la <Link href="/privacidad">política de privacidad</Link>.
        </p>

        <h2>Las respuestas las genera una IA</h2>
        <p>
          El agente responde en base a la ficha del negocio de ejemplo. Puede equivocarse o responder algo que no corresponde.
          Sus respuestas no son asesoría de ningún tipo ni una oferta de {R.nombre}. Los precios de nuestros servicios están en
          la página de <Link href="/precios">precios</Link>.
        </p>

        <h2>Límites de uso</h2>
        <p>
          La demo tiene un límite de mensajes por persona y por día, y un límite total diario. Si se alcanza, la demo responderá
          solo las preguntas sugeridas hasta el día siguiente.
        </p>
        <p>
          No uses la demo para intentar que el agente diga contenido ofensivo, ilegal o ajeno al negocio de ejemplo, ni para
          automatizar consultas. Podemos bloquear el acceso a quien lo haga.
        </p>

        <h2>Sin garantías</h2>
        <p>
          La demo se entrega tal como está, puede cambiar o dejar de estar disponible en cualquier momento. Estos términos se
          rigen por la ley chilena.
        </p>
        <p>¿Dudas? Escríbenos a <a href={`mailto:${R.correo}`}>{R.correo}</a>.</p>
      </article>
    </>
  );
}
