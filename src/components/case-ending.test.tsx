import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import * as caseSessionActions from "@/app/actions/case-session";
import { CaseEnding } from "@/components/case-ending";

vi.mock("@/app/actions/case-session", () => ({
  loadCaseProgress: vi.fn(),
}));

const evidenceCatalog = [
  { code: "EV-011", slug: "call-log-snapshot", title: "Call Log Snapshot" },
  { code: "EV-013", slug: "redacted-witness-statement", title: "Redacted Witness Statement" },
  { code: "EV-014", slug: "plant-access-log-export", title: "Plant Access Log Export" },
  { code: "EV-020", slug: "prior-complaint-archive-gap", title: "Prior Complaint Archive Gap" },
];

describe("CaseEnding", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the unavailable state when no report has been submitted", async () => {
    vi.mocked(caseSessionActions.loadCaseProgress).mockResolvedValue({
      reviewedEvidenceCodes: [],
      reportSelections: {},
      reportSubmission: null,
    });

    render(
      <CaseEnding
        caseSlug="vale-disappearance"
        locale="en"
        evidenceCatalog={evidenceCatalog}
      />,
    );

    expect(await screen.findByText("The ending is not available yet.")).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "Return to report" })).toBeInTheDocument();
  });

  it("renders the dedicated ending view from the stored report submission", async () => {
    vi.mocked(caseSessionActions.loadCaseProgress).mockResolvedValue({
      reviewedEvidenceCodes: [],
      reportSelections: {
        cause: "Accidental fall",
        responsibility: "Shared cover-up",
        motive: "Safety scandal",
      },
      reportSubmission: {
        score: 3,
        submittedAt: "2026-04-09T12:00:00.000Z",
        selections: {
          cause: "Accidental fall",
          responsibility: "Shared cover-up",
          motive: "Safety scandal",
        },
      },
    });

    render(
      <CaseEnding
        caseSlug="vale-disappearance"
        locale="en"
        evidenceCatalog={evidenceCatalog}
      />,
    );

    expect(
      await screen.findByText("The archive is sealed. The case now rests on your final reading."),
    ).toBeInTheDocument();
    expect(await screen.findByText("Final Theory")).toBeInTheDocument();
    expect(await screen.findByText("Evidence Trail")).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "Return to dashboard" })).toBeInTheDocument();
  });
});
