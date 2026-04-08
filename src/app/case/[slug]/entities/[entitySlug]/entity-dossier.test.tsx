import { render, screen } from "@testing-library/react";
import { EntityDossier } from "@/app/case/[slug]/entities/[entitySlug]/entity-dossier";
import { getCaseLocations, getEntityBySlug, getRelatedEvidence } from "@/lib/case-data";

describe("EntityDossier", () => {
  it("renders localized dossier content and related records", () => {
    const entity = getEntityBySlug("vale-disappearance", "mara-vale", "pt-PT");

    expect(entity).not.toBeNull();

    const relatedEvidence = getRelatedEvidence(
      "vale-disappearance",
      entity!.relatedEvidenceCodes,
      "pt-PT",
    );
    const relatedLocations = getCaseLocations("vale-disappearance", "pt-PT").filter((location) =>
      entity!.relatedLocationSlugs.includes(location.slug),
    );

    render(
      <EntityDossier
        caseSlug="vale-disappearance"
        locale="pt-PT"
        entity={entity!}
        relatedEvidence={relatedEvidence}
        relatedLocations={relatedLocations}
      />,
    );

    expect(screen.getByText("Dossiê de investigação")).toBeInTheDocument();
    expect(screen.getByText("Mara Vale")).toBeInTheDocument();
    expect(screen.getByText("Notas Públicas")).toBeInTheDocument();
    expect(screen.getByText("Notas Ocultas")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Mara Vale dossier portrait" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /EV-001/i })).toHaveAttribute(
      "href",
      "/case/vale-disappearance/evidence/field-notebook-excerpt",
    );
    expect(screen.getByText("Caminho da Falésia")).toBeInTheDocument();
  });

  it("omits the portrait image for non-featured entities", () => {
    const entity = getEntityBySlug("vale-disappearance", "jonah-quill", "en");

    expect(entity).not.toBeNull();

    render(
      <EntityDossier
        caseSlug="vale-disappearance"
        locale="en"
        entity={entity!}
        relatedEvidence={[]}
        relatedLocations={[]}
      />,
    );

    expect(screen.queryByRole("img", { name: /dossier portrait/i })).not.toBeInTheDocument();
    expect(screen.getByText("Investigation dossier")).toBeInTheDocument();
  });
});
