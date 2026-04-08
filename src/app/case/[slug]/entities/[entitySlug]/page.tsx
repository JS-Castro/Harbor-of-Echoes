import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import {
  getCaseBySlug,
  getCaseLocations,
  getEntityBySlug,
  getRelatedEvidence,
} from "@/lib/case-data";
import { getCurrentLocale } from "@/lib/i18n-server";
import { EntityDossier } from "./entity-dossier";

type EntityDetailPageProps = {
  params: Promise<{ slug: string; entitySlug: string }>;
};

export default async function EntityDetailPage({
  params,
}: EntityDetailPageProps) {
  const { slug, entitySlug } = await params;
  const locale = await getCurrentLocale();
  const caseRecord = getCaseBySlug(slug, locale);
  const entity = getEntityBySlug(slug, entitySlug, locale);

  if (!caseRecord || !entity) {
    notFound();
  }

  const relatedEvidence = getRelatedEvidence(slug, entity.relatedEvidenceCodes, locale);
  const relatedLocations = getCaseLocations(slug, locale).filter((location) =>
    entity.relatedLocationSlugs.includes(location.slug),
  );

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline={entity.summary}
      locale={locale}
    >
      <EntityDossier
        caseSlug={slug}
        locale={locale}
        entity={entity}
        relatedEvidence={relatedEvidence}
        relatedLocations={relatedLocations}
      />
    </CaseShell>
  );
}
