import { useEffect, useRef, useState } from "react";
import { readRequest, RequestDialogProps, RequestErrors, requestOptions } from "../requests";

export default function WorkshopModal({ workshop, onClose, onSubmit, dialogRef }: RequestDialogProps) {
  const modalTitle: string = `Question à propos de l'atelier ${workshop.title}`;
  const [selectedSubject, setSelectedSubject] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [formErrors, setFormErrors] = useState<RequestErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const errorsSummaryRef = useRef<HTMLDivElement>(null);

  const errorCount = Object.keys(formErrors).length;

  useEffect(() => {
    if (errorCount > 0) errorsSummaryRef.current?.focus();
  }, [formErrors]);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formRef.current) {
      return;
    }
    const { values, errors } = readRequest(formRef.current, "question", workshop.id);
    setFormErrors(errors);
    errorsSummaryRef.current?.focus();
    if (hasNotErrors(errors)) {
      cleanStates();
      onSubmit(values);
    }
  }

  function handleClose() {
    cleanStates();
    onClose();
  }

  function cleanStates() {
    setEmail("");
    setSelectedSubject("");
    setQuestion("");
    setFormErrors({});
  }

  function hasNotErrors(errors: RequestErrors) {
    return !errors.choice && !errors.contact && !errors.message;
  }

  return (
    <dialog ref={dialogRef} aria-labelledby="question-title" onClose={() => handleClose()}>
      <div className="dialog-heading">
        <h2 id="question-title">{modalTitle}</h2>
        <button type="button" className="close-button" onClick={() => dialogRef.current?.close()} aria-label="Fermer">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      {errorCount > 0 && (
        <div ref={errorsSummaryRef} tabIndex={-1} className="error-summary">
          <h3>
            {errorCount} {errorCount > 1 ? "erreurs empêchent" : "erreur empêche"} l'envoi du formulaire
          </h3>
          <ul>
            {Object.entries(formErrors).map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <form ref={formRef} onSubmit={(e) => handleSubmit(e)} noValidate>
        <div className="field">
          <label htmlFor="choice">{"Choisissez un sujet (obligatoire) : "}</label>
          <select
            name="choice"
            id="choice"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            aria-describedby="choice-error"
            aria-invalid={!!formErrors.choice}
          >
            <option value="">--Veuillez choisir une option--</option>
            {requestOptions.question.map((q) => {
              return (
                <option key={q.value} value={q.value}>
                  {q.label}
                </option>
              );
            })}
          </select>
          <p id="choice-error" className="field-error">
            {formErrors.choice}
          </p>
        </div>

        <div className="field">
          <label htmlFor="contact">Adresse électronique (obligatoire)</label>
          <input
            id="contact"
            name="contact"
            autoComplete="email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby="contact-error"
            aria-invalid={!!formErrors.contact}
          />
          <p id="contact-error" className="field-error">
            {formErrors.contact}
          </p>
        </div>

        <div className="field">
          <label htmlFor="message">Votre question (obligatoire) : </label>
          <textarea
            id="message"
            name="message"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            aria-describedby="message-error"
            aria-invalid={!!formErrors.message}
          />
          <p id="message-error" className="field-error">
            {formErrors.message}
          </p>
        </div>

        <div className="dialog-actions">
          <button className="secondary-button" type="button" onClick={() => dialogRef.current?.close()}>
            Annuler
          </button>
          <button className="primary-button" type="submit">
            Soumettre
          </button>
        </div>
      </form>
    </dialog>
  );
}
