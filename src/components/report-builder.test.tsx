import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReportBuilder } from "@/components/report-builder";

describe("ReportBuilder", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores and clears report selections for a case", async () => {
    const user = userEvent.setup();

    render(<ReportBuilder caseSlug="vale-disappearance" locale="en" />);

    await user.click(screen.getByRole("button", { name: "Staged disappearance" }));
    await user.click(screen.getByRole("button", { name: "Shared cover-up" }));

    expect(screen.getAllByText("Staged disappearance")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Staged disappearance" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      JSON.parse(window.localStorage.getItem("harbor-of-echoes-report:vale-disappearance") ?? "{}"),
    ).toMatchObject({
      cause: "Staged disappearance",
      responsibility: "Shared cover-up",
    });

    await user.click(screen.getByRole("button", { name: "Reset Theory" }));

    expect(
      window.localStorage.getItem("harbor-of-echoes-report:vale-disappearance"),
    ).toBe("{}");
  });
});
