import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ReportBuilder } from "@/components/report-builder";
import * as caseSessionActions from "@/app/actions/case-session";

vi.mock("@/app/actions/case-session", () => ({
  loadCaseProgress: vi.fn(),
  saveReportSelections: vi.fn(),
  resetReportState: vi.fn(),
  submitReport: vi.fn(),
}));

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
    vi.restoreAllMocks();
    vi.mocked(caseSessionActions.loadCaseProgress).mockResolvedValue({
      reviewedEvidenceCodes: [],
      reportSelections: {},
      reportSubmission: null,
    });
    vi.mocked(caseSessionActions.saveReportSelections).mockResolvedValue({});
    vi.mocked(caseSessionActions.resetReportState).mockResolvedValue({
      selections: {},
      submission: null,
    });
  });

  it("stores selections, submits the case, and clears report state", async () => {
    const user = userEvent.setup();
    vi.mocked(caseSessionActions.loadCaseProgress).mockResolvedValue({
      reviewedEvidenceCodes: ["EV-001", "EV-009", "EV-011", "EV-013", "EV-014", "EV-015", "EV-016", "EV-017", "EV-020"],
      reportSelections: {},
      reportSubmission: null,
    });
    vi.mocked(caseSessionActions.submitReport).mockResolvedValue({
      score: 2,
      submittedAt: "2026-04-09T12:00:00.000Z",
      selections: {
        cause: "Staged disappearance",
        responsibility: "Shared cover-up",
        motive: "Safety scandal",
      },
    });

    render(
      <ReportBuilder
        caseSlug="vale-disappearance"
        locale="en"
        evidenceCatalog={evidenceCatalog}
        requiredEvidenceCodes={["EV-001", "EV-009", "EV-011", "EV-013", "EV-014", "EV-015", "EV-016", "EV-017", "EV-020"]}
      />,
    );

    await screen.findByText("9/9 required files reviewed");

    await user.click(screen.getByRole("button", { name: "Staged disappearance" }));
    await user.click(screen.getByRole("button", { name: "Shared cover-up" }));
    await user.click(screen.getByRole("button", { name: "Safety scandal" }));

    expect(screen.getAllByText("Staged disappearance")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Staged disappearance" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      vi.mocked(caseSessionActions.saveReportSelections).mock.calls.some(
        ([, selections]) =>
          selections.cause === "Staged disappearance" &&
          selections.responsibility === "Shared cover-up" &&
          selections.motive === "Safety scandal",
      ),
    ).toBe(true);

    await user.click(screen.getByRole("button", { name: "Submit Report" }));

    expect(screen.getAllByText("Case Closed")).toHaveLength(2);
    expect(screen.getByText("Evidence Review")).toBeInTheDocument();
    expect(
      screen.getByText("The archive is sealed. The case now rests on your final reading."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Ending" })).toBeInTheDocument();
    expect(
      vi.mocked(caseSessionActions.submitReport).mock.calls.some(
        ([submittedCaseSlug, submittedLocale]) =>
          submittedCaseSlug === "vale-disappearance" && submittedLocale === "en",
      ),
    ).toBe(true);

    await user.click(screen.getByRole("button", { name: "Reset Theory" }));

    expect(
      vi.mocked(caseSessionActions.resetReportState).mock.calls.some(
        ([resetCaseSlug]) => resetCaseSlug === "vale-disappearance",
      ),
    ).toBe(true);
  });

  it("blocks submission until the required evidence has been reviewed", async () => {
    const user = userEvent.setup();
    vi.mocked(caseSessionActions.loadCaseProgress).mockResolvedValue({
      reviewedEvidenceCodes: [],
      reportSelections: {},
      reportSubmission: null,
    });

    render(
      <ReportBuilder
        caseSlug="vale-disappearance"
        locale="en"
        evidenceCatalog={evidenceCatalog}
        requiredEvidenceCodes={["EV-001", "EV-009"]}
      />,
    );

    await screen.findByText("0/2 required files reviewed");

    await user.click(screen.getByRole("button", { name: "Accidental fall" }));
    await user.click(screen.getByRole("button", { name: "Shared cover-up" }));
    await user.click(screen.getByRole("button", { name: "Safety scandal" }));

    expect(screen.getByRole("button", { name: "Submit Report" })).toBeDisabled();
    expect(screen.getByText("Still Missing")).toBeInTheDocument();
  });

  it("restores saved draft selections from persisted progress", async () => {
    vi.mocked(caseSessionActions.loadCaseProgress).mockResolvedValue({
      reviewedEvidenceCodes: [],
      reportSelections: {
        cause: "Accidental fall",
      },
      reportSubmission: null,
    });

    render(
      <ReportBuilder
        caseSlug="vale-disappearance"
        locale="en"
        evidenceCatalog={evidenceCatalog}
        requiredEvidenceCodes={["EV-001", "EV-009"]}
      />,
    );

    await screen.findByText("0/2 required files reviewed");
    expect(screen.getByRole("button", { name: "Accidental fall" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getAllByText("Accidental fall")).toHaveLength(2);
  });
});
