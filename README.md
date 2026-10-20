# corevenlabs.com

Sitio de Corevenlabs: agentes de WhatsApp e Instagram para pymes, demo con IA, servicios, formulario conectado al CRM y panel `/admin`.

La app está en [`web/`](web/) (Next.js 16, App Router, TypeScript). Comparte la base de datos de Neon con el agente de prospección ([prospecting-bot](https://github.com/corevenlabs/prospecting-bot)).

## Qué hay

| Ruta | Qué es |
|---|---|
| `/` | Portada: hero con la demo, sin/con agente, servicios, rubros, precios, preguntas |
| `/demo` | Demo del agente con 3 negocios ficticios (ramen, joyería, remodelación) |
| `/servicios`, `/servicios/[slug]` | Agentes, páginas web, landing pages, tiendas online, SEO, integraciones, apps |
| `/rubros/[slug]` | Una página por rubro con conversación de ejemplo |
| `/precios`, `/contacto`, `/privacidad`, `/terminos-demo` | Lo que dice el nombre |
| `/admin` | CRM (prospectos, ficha, notas, borradores, contactos web), propuestas en PDF y edición de precios. Protegido con contraseña, no indexable |
| `/api/demo`, `/api/contacto` | Rutas del servidor de la demo y del formulario |

## Correr en local

Requiere Node.js 20.9 o superior.

```bash
cd web
npm install
cp .env.example .env.local   # y completar los valores (ver abajo)
npm run db:web               # crea el esquema "web" en la base (una vez)
npm run admin:clave          # define la contraseña del admin (una vez)
npm run dev                  # http://localhost:3000
```

Sin `ANTHROPIC_API_KEY` la demo responde solo las preguntas sugeridas. Sin `DATABASE_URL` el admin muestra un aviso y el formulario solo funciona en modo local.

## Variables de entorno

Todas viven solo en el servidor. Ninguna llega al navegador.

| Variable | Para qué | Ejemplo / nota |
|---|---|---|
| `DATABASE_URL` | Base de Neon compartida con prospecting-bot | `postgresql://…neon.tech/…?sslmode=require` |
| `ANTHROPIC_API_KEY` | Respuestas de la demo | console.anthropic.com |
| `ANTHROPIC_MODEL` | Modelo de la demo | `claude-haiku-5-5` (por defecto) |
| `DEMO_LIMITE_VISITANTE` | Mensajes con IA por visitante al día | `20` |
| `DEMO_LIMITE_DIARIO` | Tope total diario de la demo (freno de gasto) | `400` |
| `DEMO_SAL` | Texto aleatorio para anonimizar IP en los contadores | generar uno largo y propio |
| `RESEND_API_KEY` | Aviso por correo de cada contacto | resend.com |
| `AVISOS_PARA` | A quién llega el aviso | `corevenlabs@gmail.com` |
| `AVISOS_DESDE` | Remitente del aviso | `onboarding@resend.dev` hasta verificar el dominio; luego `avisos@corevenlabs.com` |
| `ADMIN_USUARIO` | Usuario del admin | `orlando` |
| `ADMIN_CLAVE_HASH` | Hash scrypt de la contraseña | lo genera `npm run admin:clave` |
| `ADMIN_SECRETO_SESION` | Firma de la cookie de sesión (mínimo 32 caracteres) | `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |

Cambiar `ADMIN_SECRETO_SESION` cierra todas las sesiones abiertas.

## Base de datos

- **CRM (esquema `public`)**: tablas de prospecting-bot (`prospectos`, `actividades`, `contenidos`, `exclusiones`, …). La web **no cambia ese esquema**; solo lee y escribe filas con las mismas reglas que `prospector/db.py`. Esas reglas están duplicadas en [`web/lib/crm.ts`](web/lib/crm.ts): si cambian en Python, hay que cambiarlas ahí.
- **Esquema `web`** ([`web/db/esquema-web.sql`](web/db/esquema-web.sql)): `web.uso` (límites diarios de demo, formulario y login, con IP anonimizada y borrado a los 7 días), `web.precios` (precios editables) y `web.propuestas` (propuestas generadas). `npm run db:web` es idempotente.

El formulario de contacto crea el prospecto con `fuente = 'formulario web'` y deja una actividad con el mensaje. Si el negocio ya existe solo agrega la nota; si está en exclusiones no lo crea.

## Propuestas

Desde la ficha de un prospecto, desde Contactos web o desde `/admin/propuestas` → **Nueva propuesta**:

1. Elegir template (uno por servicio, o «Proyecto a medida») y contacto del CRM (o ninguno).
2. El editor carga nombre, correo, teléfono, comuna y persona de contacto del prospecto, y los precios vigentes como montos netos. Avisa lo que falta (razón social, RUT, contacto, montos…), pero se puede generar igual: el PDF omite lo vacío.
3. Forma de pago a elección: 100%, 50/50, cuotas, personalizada o sin forma de pago.
4. **Generar PDF** guarda la propuesta con número correlativo (`P-2026-001`), vigencia de 30 días e IVA 19%, descarga el PDF y deja una nota en el historial del prospecto (y opcionalmente lo pasa a «propuesta»). «Nueva versión» parte de una anterior con número nuevo.

Los textos de cada template están en [`content/plantillas-propuesta.ts`](web/content/plantillas-propuesta.ts) y el diseño del PDF en [`lib/pdf/propuesta-pdf.tsx`](web/lib/pdf/propuesta-pdf.tsx). Las fuentes del PDF (Archivo e IBM Plex Mono, licencia OFL) están en `lib/pdf/fuentes`.

## Editar contenido

| Qué | Dónde |
|---|---|
| Precios | `/admin/precios` (los valores por defecto están en [`content/precios.ts`](web/content/precios.ts)) |
| Servicios | [`content/servicios.ts`](web/content/servicios.ts) |
| Rubros y negocios de la demo (lo único que sabe el agente) | [`content/rubros.ts`](web/content/rubros.ts) |
| Preguntas frecuentes | [`content/faq.ts`](web/content/faq.ts) |
| WhatsApp, Instagram, menú | [`content/sitio.ts`](web/content/sitio.ts) |
| Datos de la empresa (legal y propuestas) | [`content/legal.ts`](web/content/legal.ts) |
| Colores y tipografías (web y admin) | variables en [`app/globals.css`](web/app/globals.css) |

## Desplegar en Vercel

1. En el proyecto de Vercel: **Settings → General → Root Directory = `web`**. Framework: Next.js (se detecta solo).
2. **Settings → Environment Variables**: cargar todas las de la tabla para Production y Preview.
3. **Analytics**: activar Web Analytics en el proyecto (no usa cookies, no requiere banner).
4. Cada push a una rama crea una URL de vista previa. Producción (`corevenlabs.com`) sale de `main`: **no hacer merge sin revisar la vista previa**.
5. Antes de producción, verificar `corevenlabs.com` en Resend (registros DNS) y cambiar `AVISOS_DESDE`.

## Seguridad

- Llaves y conexión a la base solo en el servidor.
- Demo y formulario: solo aceptan llamadas desde el mismo sitio, con límites diarios por visitante y totales. El formulario tiene campo trampa y tiempo mínimo de llenado contra bots.
- Admin: contraseña con hash scrypt, cookie firmada `httpOnly` de 12 horas, máximo 10 intentos de login por IP al día, verificación en el proxy y en cada página y acción, `noindex`.
- Cabeceras: CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` (ver [`next.config.ts`](web/next.config.ts)).

## Pendiente antes de publicar

- Revisión de la política de privacidad y los términos por un abogado.
- Verificar el dominio en Resend.
- Probar demo, formulario y admin con las llaves reales.
