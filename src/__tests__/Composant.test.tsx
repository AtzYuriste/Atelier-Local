import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";

afterEach(cleanup);

describe("Question à l’organisateur", () => {
  it("depuis App, conserve le sujet et la question après un envoi sans email, puis confirme le bon atelier et le bon sujet après correction", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Poser une question sur Une tasse en céramique" }));

    const dialog = screen.getByRole("dialog", { name: /Une tasse en céramique/ });
    expect(dialog).toHaveAttribute("open");

    const subject = within(dialog).getByRole("combobox", { name: /sujet/i });
    const message = within(dialog).getByRole("textbox", { name: /votre question/i });
    const email = within(dialog).getByRole("textbox", { name: /adresse électronique/i });

    expect(subject).toHaveValue("");

    await user.selectOptions(subject, "materiel");
    await user.type(message, "Faut-il apporter un tablier ?");

    await user.click(within(dialog).getByRole("button", { name: "Soumettre" }));

    expect(dialog).toHaveAttribute("open");
    expect(email).toHaveAttribute("aria-invalid", "true");

    const errorId = (email.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean)[0];
    expect(document.getElementById(errorId)).toHaveTextContent("Saisissez une adresse électronique");

    expect(screen.queryByText(/a bien été envoyée/)).not.toBeInTheDocument();

    expect(subject).toHaveValue("materiel");
    expect(message).toHaveValue("Faut-il apporter un tablier ?");

    await user.type(email, "alice@exemple.fr");
    await user.click(within(dialog).getByRole("button", { name: "Soumettre" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const confirmation = screen.getByText(/a bien été envoyée/);
    expect(confirmation).toHaveTextContent("Une tasse en céramique");
    expect(confirmation).toHaveTextContent("Le matériel à apporter");
    expect(confirmation).not.toHaveTextContent("alice@exemple.fr");
  });
});
