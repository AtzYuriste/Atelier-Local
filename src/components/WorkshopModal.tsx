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
  const [formErrorNumber, setFormErrorNumber] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    for (const k of Object.keys(formErrors)) {
      if (k) {
        setFormErrorNumber((n) => n + 1);
      }
    }
    return () => {
      setFormErrorNumber(0);
    };
  }, [formErrors]);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formRef.current) {
      return;
    }
    const { values, errors } = readRequest(formRef.current, "question", workshop.id);
    setFormErrors(errors);

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
    <dialog ref={dialogRef} aria-labelledby="question-title">
      <div className="dialog-heading">
        <h2 id="question-title">{modalTitle}</h2>
        <button className="close-button" onClick={() => handleClose()}>
          ×
        </button>
      </div>
      {formErrorNumber > 0 && (
        <div className="error-summary" role="status">
          <h3>{formErrorNumber} erreurs empêchent l'envoi du formulaire</h3>
          <ul>
            {Object.entries(formErrors).map((entry) => (
              <li key={entry[0]}>{entry[1]}</li>
            ))}
          </ul>
        </div>
      )}
      <form ref={formRef} onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="choice">{"Choisissez un sujet : "}</label>
        <select
          name="choice"
          id="choice"
          className="dialog-actions field"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
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

        <label htmlFor="contact">Adresse électronique</label>
        <input
          id="contact"
          className="dialog-actions field"
          name="contact"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="contact-error"
        />

        <label htmlFor="message">Votre question : </label>
        <textarea
          id="message"
          name="message"
          className="dialog-actions field"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button className="secondary-button dialog-actions" type="button" onClick={() => handleClose()}>
          Annuler
        </button>
        <button className="primary-button dialog-actions" type="submit">
          Soumettre
        </button>
      </form>
    </dialog>
  );
}
