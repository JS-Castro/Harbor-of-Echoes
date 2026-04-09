import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReportBuilder } from "@/components/report-builder";

const evidenceCatalog = [
  { code: "EV-001", slug: "field-notebook-excerpt", title: "Field Notebook Excerpt" },
  { code: "EV-009", slug: "duplicate-inspection-report-b", title: "Duplicate Inspection Report B" },
  { code: "EV-011", slug: "call-log-snapshot", title: "Call Log Snapshot" },
  { code: "EV-013", slug: "redacted-witness-statement", title: "Redacted Witness Statement" },
  { code: "EV-014", slug: "plant-access-log-export", title: "Plant Access Log Export" },
  { code: "EV-015", slug: "voicemail-draft", title: "Voicemail Draft" },
  { code: "EV-016", slug: "recorder-fragment", title: "Recorder Fragment" },
  { code: "EV-017", slug: "cliff-path-forensic-photos", title: "Cliff Path Forensic Photos" },
  { code: "EV-020", slug: "prior-complaint-archive-gap", title: "Prior Complaint Archive Gap" },
];

describe("ReportBuilder", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores selections, submits the case, and clears report state", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      "harbor-of-echoes-evidence-reviewed:vale-disappearance",
      JSON.stringify(["EV-001", "EV-009", "EV-011", "EV-013", "EV-014", "EV-015", "EV-016", "EV-017", "EV-020"]),
    );

    render(
      <ReportBuilder
        caseSlug="vale-disappearance"
        locale="en"
        evidenceCatalog={evidenceCatalog}
        requiredEvidenceCodes={["EV-001", "EV-009", "EV-011", "EV-013", "EV-014", "EV-015", "EV-016", "EV-017", "EV-020"]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Staged disappearance" }));
    await user.click(screen.getByRole("button", { name: "Shared cover-up" }));
    await user.click(screen.getByRole("button", { name: "Safety scandal" }));

    expect(screen.getAllByText("Staged disappearance")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Staged disappearance" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      JSON.parse(window.localStorage.getItem("harbor-of-echoes-report:vale-disappearance") ?? "{}"),
    ).toMatchObject({
      cause: "Staged disappearance",
      responsibility: "Shared cover-up",
      motive: "Safety scandal",
    });

    await user.click(screen.getByRole("button", { name: "Submit Report" }));

    expect(screen.getByText("Case Closed")).toBeInTheDocument();
    expect(screen.getByText("Evidence Review")).toBeInTheDocument();
    expect(
      JSON.parse(
        window.localStorage.getItem("harbor-of-echoes-report-submission:vale-disappearance") ??
          "{}",
      ),
    ).toMatchObject({
      score: 2,
      selections: {
        cause: "Staged disappearance",
        responsibility: "Shared cover-up",
        motive: "Safety scandal",
      },
    });

    await user.click(screen.getByRole("button", { name: "Reset Theory" }));

    expect(
      window.localStorage.getItem("harbor-of-echoes-report:vale-disappearance"),
    ).toBe("{}");
    expect(
      window.localStorage.getItem("harbor-of-echoes-report-submission:vale-disappearance"),
    ).toBeNull();
  });

  it("blocks submission until the required evidence has been reviewed", async () => {
    const user = userEvent.setup();

    render(
      <ReportBuilder
        caseSlug="vale-disappearance"
        locale="en"
        evidenceCatalog={evidenceCatalog}
        requiredEvidenceCodes={["EV-001", "EV-009"]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Accidental fall" }));
    await user.click(screen.getByRole("button", { name: "Shared cover-up" }));
    await user.click(screen.getByRole("button", { name: "Safety scandal" }));

    expect(screen.getByRole("button", { name: "Submit Report" })).toBeDisabled();
    expect(screen.getByText("Still Missing")).toBeInTheDocument();
  });
});
