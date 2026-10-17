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
