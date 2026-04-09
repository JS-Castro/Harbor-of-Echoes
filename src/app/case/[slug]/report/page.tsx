import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import { ReportBuilder } from "@/components/report-builder";
import { getCaseBySlug, getCaseEvidence, getCaseUnlocks } from "@/lib/case-data";
import { getDictionary } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

type ReportPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { slug } = await params;
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const caseRecord = getCaseBySlug(slug, locale);
  const evidence = getCaseEvidence(slug, locale);

  if (!caseRecord) {
    notFound();
  }

  const reportUnlock = getCaseUnlocks(slug).find(
    (unlock) => unlock.targetType === "report" && unlock.targetCode === "final-report",
  );
  const requiredEvidenceCodes = Array.isArray(reportUnlock?.ruleConfig?.requiredEvidenceCodes)
    ? reportUnlock.ruleConfig.requiredEvidenceCodes
    : [];

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline={dictionary.report.tagline}
      locale={locale}
    >
      <ReportBuilder
        caseSlug={slug}
        locale={locale}
        evidenceCatalog={evidence.map((item) => ({
          code: item.code,
          slug: item.slug,
          title: item.title,
        }))}
        requiredEvidenceCodes={requiredEvidenceCodes}
      />
    </CaseShell>
  );
}
