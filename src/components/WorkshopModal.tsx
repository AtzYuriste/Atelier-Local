import { useEffect, useRef, useState } from "react";
import { readRequest, RequestDialogProps, RequestErrors, requestOptions } from "../requests";

const modalTitles: Record<string, string> = {
  ["ceramique"]: "Question à propos de l'atelier céramique",
  ["serigraphie"]: "Question à propos de l'atelier sérigraphie",
  ["broderie"]: "Question à propos de l'atelier broderie",
};

export default function WorkshopModal({ workshop, onClose, onSubmit, dialogRef }: RequestDialogProps) {
  const modalTitle: string = modalTitles[workshop.id];
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
        <button className="close-button" onClick={() => dialogRef.current?.close()}>
          ×
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
        <label htmlFor="choice">{"Choisissez un sujet : "}</label>
        <select
          name="choice"
          id="choice"
          className="dialog-actions field"
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

        <label htmlFor="contact">Adresse électronique</label>
        <input
          id="contact"
          className="dialog-actions field"
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

        <label htmlFor="message">Votre question : </label>
        <textarea
          id="message"
          name="message"
          className="dialog-actions field"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          aria-describedby="message-error"
          aria-invalid={!!formErrors.message}
        />
        <p id="message-error" className="field-error">
          {formErrors.message}
        </p>

        <button className="secondary-button dialog-actions" type="button" onClick={() => dialogRef.current?.close()}>
          Annuler
        </button>
        <button className="primary-button dialog-actions" type="submit">
          Soumettre
        </button>
      </form>
    </dialog>
  );
}
