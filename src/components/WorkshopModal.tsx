import { useState } from "react";
import { RequestDialogProps, requestOptions } from "../requests";

const modalTitles: Record<string, string> = {
  ["ceramique"]: "Question à propos de l'atelier céramique",
  ["serigraphie"]: "Question à propos de l'atelier sérigraphie",
  ["broderie"]: "Question à propos de l'atelier broderie",
};

export default function WorkshopModal({ workshop, onClose, onSubmit, dialogRef, formRef }: RequestDialogProps) {
  const modalTitle: string = modalTitles[workshop.id];
  const [selectedSubject, setSelectedSubject] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    onSubmit({ kind: "question", workshopId: workshop.id, choice: selectedSubject, contact: email, message: question });
  };

  return (
    <dialog ref={dialogRef} aria-labelledby="question-title">
      <div className="dialog-heading">
        <h2 id="question-title">{modalTitle}</h2>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
      <form ref={formRef} onSubmit={handleSubmit}>
        <label htmlFor="choice">{"Choisissez un sujet : "}</label>
        <select
          name="choice"
          id="choice"
          className="dialog-actions field"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          defaultValue=""
        >
          <option value="">--Veuillez choisir une option--</option>
          {requestOptions.question.map((q) => {
            return <option value={q.value}>{q.label}</option>;
          })}
        </select>

        <label htmlFor="contact">Adresse électronique</label>
        <input
          id="contact"
          className="dialog-actions field"
          name="contact"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="message">Votre question : </label>
        <textarea
          id="message"
          name="message"
          className="dialog-actions field"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <button className="secondary-button dialog-actions" type="button" onClick={onClose}>
          Annuler
        </button>
        <button className="primary-button dialog-actions" type="submit">
          Soumettre
        </button>
      </form>
    </dialog>
  );
}
