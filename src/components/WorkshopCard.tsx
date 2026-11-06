import { useRef, useState, type ReactNode } from "react";
import type { Workshop } from "../workshops";
import WorkshopModal from "./WorkshopModal";
import { readRequest, RequestValues } from "../requests";

type Props = {
  workshop: Workshop;
  onReserve: (workshop: Workshop) => void;
  extraAction?: ReactNode;
};

export default function WorkshopCard({ workshop, onReserve, extraAction }: Props) {
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const handleModalClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleModalFormSubmit = (requestValues: RequestValues) => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <article className="workshop-card">
      <div className="card-art">
        <img src={workshop.image} alt={`Image de ${workshop.id}`} />
        <span className="category">{workshop.category}</span>
      </div>

      <div className="card-body">
        <p className="workshop-date">{workshop.date}</p>
        <h3 className="workshop-title">{workshop.title}</h3>
        <p className="location">{workshop.location}</p>

        <div className="card-meta">
          <span>{workshop.duration}</span>
          <span>{workshop.price}</span>
        </div>

        <p className="availability">
          <span
            className={"availability-dot " + (workshop.available ? "is-available" : "is-full")}
            aria-hidden="true"
          />
          {workshop.available ? "Places disponibles" : "Complet"}
        </p>

        <button
          type="button"
          className="details-trigger"
          aria-expanded={expanded}
          aria-controls={`details-${workshop.id}`}
          aria-label={`Détails de l’atelier ${workshop.title}`}
          onClick={() => setExpanded((value) => !value)}
        >
          Détails de l’atelier <span aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>

        <div
          id={`details-${workshop.id}`}
          className={"details-panel " + (expanded ? "is-open" : "")}
          hidden={!expanded}
          aria-hidden={!expanded}
        >
          <div className="details-inner">
            <p>{workshop.description}</p>
            <a href="#infos-pratiques">Consulter les informations pratiques</a>
          </div>
        </div>

        <div className="card-actions">
          {workshop.available ? (
            <button type="button" className="reserve-button" onClick={() => onReserve(workshop)}>
              M’inscrire à {workshop.title}
            </button>
          ) : (
            <p className="closed-message">Inscriptions closes</p>
          )}
          {extraAction}
          <button className="secondary-button" onClick={openModal}>
            Poser une question
          </button>
        </div>
        <WorkshopModal
          dialogRef={dialogRef}
          workshop={workshop}
          onClose={handleModalClose}
          onSubmit={handleModalFormSubmit}
        ></WorkshopModal>
      </div>
    </article>
  );
}
