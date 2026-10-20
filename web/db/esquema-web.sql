-- Tablas propias de la web, en un esquema aparte para no tocar el CRM (esquema public),
-- que también usa el agente de prospección. Es idempotente: se puede correr varias veces.
-- Aplicar con:  npm run db:web

CREATE SCHEMA IF NOT EXISTS web;

-- Límites de uso por día (demo con IA y formulario de contacto).
-- "visitante" es un hash de la IP con una sal que cambia cada día: no guarda la IP ni permite
-- seguir a una persona entre días. No se guarda el texto de los mensajes de la demo.
-- Las filas de más de 7 días se borran solas.
CREATE TABLE IF NOT EXISTS web.uso (
    fecha      DATE    NOT NULL,
    tipo       TEXT    NOT NULL,   -- demo, contacto, login
    visitante  TEXT    NOT NULL,
    conteo     INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (fecha, tipo, visitante)
);

-- Precios "desde" que se muestran en la web y se editan desde /admin/precios.
-- desde NULL = "A cotizar". Si una clave no está aquí, la web usa el valor por defecto del código.
CREATE TABLE IF NOT EXISTS web.precios (
    clave        TEXT PRIMARY KEY,
    desde        INTEGER,
    periodo      TEXT NOT NULL,
    actualizado  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Propuestas comerciales generadas desde /admin/propuestas. "datos" guarda todo lo que se imprimió
-- en el PDF (cliente, alcance, montos netos, forma de pago), así se puede volver a descargar igual.
-- prospecto_id apunta a public.prospectos sin llave foránea: esa tabla es de prospecting-bot.
CREATE TABLE IF NOT EXISTS web.propuestas (
    id            SERIAL PRIMARY KEY,
    numero        TEXT NOT NULL UNIQUE,   -- P-2026-001
    prospecto_id  INTEGER,
    plantilla     TEXT NOT NULL,
    cliente       TEXT NOT NULL,
    datos         JSONB NOT NULL,
    neto          INTEGER NOT NULL DEFAULT 0,
    emitida       DATE NOT NULL,
    vence         DATE NOT NULL,
    creado        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS propuestas_prospecto ON web.propuestas (prospecto_id);

-- Ajustes del sitio editables desde /admin/sitio (por ahora, el número de WhatsApp).
-- Si una clave no está, el sitio usa el valor por defecto de content/sitio.ts.
CREATE TABLE IF NOT EXISTS web.ajustes (
    clave        TEXT PRIMARY KEY,
    valor        TEXT NOT NULL,
    actualizado  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Preguntas frecuentes de la portada, editables desde /admin/sitio.
-- Mientras la tabla esté vacía, el sitio muestra las de content/faq.ts.
CREATE TABLE IF NOT EXISTS web.preguntas (
    id           SERIAL PRIMARY KEY,
    pregunta     TEXT NOT NULL,
    respuesta    TEXT NOT NULL,
    orden        INTEGER NOT NULL DEFAULT 0,
    visible      BOOLEAN NOT NULL DEFAULT true,
    actualizado  TIMESTAMPTZ NOT NULL DEFAULT now()
);
