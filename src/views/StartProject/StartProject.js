import React, { useContext, useState } from "react";
import { ContactContext } from "../../context/ContactContext";
import Seo from "../../components/Seo/Seo";
import HeroParticles from "../../components/Hero/HeroParticles";
import StepIndicator from "./components/StepIndicator";
import ConfirmationScreen from "./components/ConfirmationScreen";
import Step1Contact from "./steps/Step1Contact";
import Step2Industry from "./steps/Step2Industry";
import Step3ProjectType from "./steps/Step3ProjectType";
import Step4Qualifying from "./steps/Step4Qualifying";
import Step5Review from "./steps/Step5Review";
import { isStepValid } from "./validation";
import "./StartProject.css";

const TOTAL_STEPS = 5;

const STEPS = [
  Step1Contact,
  Step2Industry,
  Step3ProjectType,
  Step4Qualifying,
  Step5Review,
];

const initialFormData = {
  nombre: "",
  email: "",
  telefono: "",
  empresa: "",
  cargo: "",
  industria: "",
  tipoProyecto: "",
  claridad: "",
  timeline: "",
  integraciones: "",
  mensaje: "",
};

export default function StartProject() {
  const { sendEmail } = useContext(ContactContext);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleFieldChange = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (!isStepValid(currentStep, formData)) return;
    setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS - 1));
  };

  const handleBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleSubmit = async () => {
    setIsSending(true);
    setError("");

    try {
      await sendEmail({
        formType: "start-project",
        contacto: {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          empresa: formData.empresa,
          cargo: formData.cargo,
        },
        industria: formData.industria,
        tipoProyecto: formData.tipoProyecto,
        calificacion: {
          claridad: formData.claridad,
          timeline: formData.timeline,
          integraciones: formData.integraciones,
        },
        mensaje: formData.mensaje,
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(
        "No pudimos enviar tu solicitud. Por favor intenta nuevamente en unos minutos.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep];
  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const canAdvance = isStepValid(currentStep, formData);

  return (
    <section className="start-project">
      <Seo
        title="Comienza tu Proyecto"
        description="Cuéntanos sobre tu proyecto y recibe una propuesta de Corevenlabs. Desarrollo web, integraciones y automatización a medida."
        canonical="https://www.corevenlabs.com/comenzar"
      />

      <div className="start-project-particles" aria-hidden="true">
        <HeroParticles mode={2} expanded />
      </div>

      <div className="start-project-container">
        {isSubmitted ? (
          <ConfirmationScreen nombre={formData.nombre} />
        ) : (
          <>
            <StepIndicator currentStep={currentStep} />

            <CurrentStepComponent
              formData={formData}
              onChange={handleFieldChange}
              onEditStep={setCurrentStep}
            />

            {error && <p className="form-error">{error}</p>}

            <div className="step-nav">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleBack}
                disabled={currentStep === 0 || isSending}
              >
                Anterior
              </button>

              {isLastStep ? (
                <button
                  type="button"
                  className={`btn-primary ${isSending ? "btn-loading" : ""}`}
                  onClick={handleSubmit}
                  disabled={isSending}
                >
                  {isSending ? "Enviando..." : "Enviar Solicitud"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={!canAdvance}
                >
                  Siguiente
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
