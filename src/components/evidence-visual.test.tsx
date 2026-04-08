import { render, screen } from "@testing-library/react";
import { EvidenceVisual } from "@/components/evidence-visual";
import { getEvidenceBySlug } from "@/lib/case-data";

describe("EvidenceVisual", () => {
  it("renders the industrial placeholder for industrial evidence", () => {
    const evidence = getEvidenceBySlug("vale-disappearance", "duplicate-inspection-report-a", "en");

    expect(evidence).not.toBeNull();

    render(<EvidenceVisual evidence={evidence!} />);

    expect(screen.getByRole("img")).toHaveAttribute("alt", "Duplicate Inspection Report A");
  });

  it("returns no visual for unrelated evidence", () => {
    const evidence = getEvidenceBySlug("vale-disappearance", "official-missing-person-report", "en");

    expect(evidence).not.toBeNull();

    const { container } = render(<EvidenceVisual evidence={evidence!} />);

    expect(container).toBeEmptyDOMElement();
  });
});
