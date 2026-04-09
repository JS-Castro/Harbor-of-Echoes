import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import {
  getCaseBySlugRuntime,
  getCaseLocationsRuntime,
  getEntityBySlugRuntime,
  getRelatedEvidenceRuntime,
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
  const caseRecord = await getCaseBySlugRuntime(slug, locale);
  const entity = await getEntityBySlugRuntime(slug, entitySlug, locale);

  if (!caseRecord || !entity) {
    notFound();
  }

  const relatedEvidence = await getRelatedEvidenceRuntime(
    slug,
    entity.relatedEvidenceCodes,
    locale,
  );
  const relatedLocations = (await getCaseLocationsRuntime(slug, locale)).filter((location) =>
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
