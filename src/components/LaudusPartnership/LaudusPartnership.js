import React from 'react';
import { Link } from 'react-router-dom';
import './LaudusPartnership.css';

const benefits = [
  {
    number: '01',
    title: 'Implementación conectada',
    description: 'Integramos Laudus con tus procesos y herramientas para que la información fluya sin tareas repetitivas.'
  },
  {
    number: '02',
    title: 'Acompañamiento experto',
    description: 'Combinamos tecnología y soporte cercano para convertir el ERP en una solución útil desde el primer día.'
  },
  {
    number: '03',
    title: 'Gestión que escala',
    description: 'Centraliza la operación de tu empresa y construye una base digital preparada para seguir creciendo.'
  }
];

export default function LaudusPartnership() {
  return (
    <section className="laudus-partnership" aria-labelledby="laudus-title">
      <div className="laudus-partnership__glow" aria-hidden="true" />

      <div className="laudus-partnership__container">
        <div className="laudus-partnership__identity">
          <span className="laudus-partnership__eyebrow">Alianza estratégica</span>

          <div className="laudus-partnership__logos" aria-label="Corevenlabs, partner de Laudus">
            <div
              className="laudus-partnership__logo-card laudus-partnership__logo-card--coreven"
              aria-label="Corevenlabs"
            >
              <img src="/image/coreven-logo.svg" alt="" aria-hidden="true" />
              <span>Coreven<span>labs</span></span>
            </div>

            <span className="laudus-partnership__connector" aria-hidden="true">
              <span />
              <strong>+</strong>
              <span />
            </span>

            <div className="laudus-partnership__logo-card laudus-partnership__logo-card--laudus">
              <img src="/image/laudus-logo.png" alt="Laudus" />
            </div>
          </div>

          <div className="laudus-partnership__status">
            <span aria-hidden="true" />
            Partner oficial de Laudus
          </div>
        </div>

        <div className="laudus-partnership__content">
          <h2 id="laudus-title">
            Tecnología y acompañamiento para una gestión <span>más conectada.</span>
          </h2>

          <p>
            Como partners de Laudus, unimos nuestra experiencia en integraciones y
            automatización con una plataforma ERP integral para ayudarte a ordenar,
            conectar y potenciar la operación de tu empresa.
          </p>

          <div className="laudus-partnership__benefits">
            {benefits.map((benefit) => (
              <article className="laudus-partnership__benefit" key={benefit.number}>
                <span>{benefit.number}</span>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="laudus-partnership__actions">
            <Link className="btn-primary laudus-partnership__cta" to="/comenzar">
              Conversemos sobre tu proyecto
              <span aria-hidden="true">→</span>
            </Link>
            <span className="laudus-partnership__microcopy">Sin compromiso · Te orientamos según tu operación</span>
          </div>
        </div>
      </div>
    </section>
  );
}
