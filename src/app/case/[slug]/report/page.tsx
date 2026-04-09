import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import { ReportBuilder } from "@/components/report-builder";
import {
  getCaseBySlugRuntime,
  getCaseEvidenceRuntime,
  getCaseUnlocksRuntime,
} from "@/lib/case-data";
import { getDictionary } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

type ReportPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { slug } = await params;
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const caseRecord = await getCaseBySlugRuntime(slug, locale);
  const evidence = await getCaseEvidenceRuntime(slug, locale);

  if (!caseRecord) {
    notFound();
  }

  const reportUnlock = (await getCaseUnlocksRuntime(slug)).find(
    (unlock) => unlock.targetType === "report" && unlock.targetCode === "final-report",
  );
  const reportUnlockConfig =
    typeof reportUnlock?.ruleConfig === "object" && reportUnlock.ruleConfig
      ? (reportUnlock.ruleConfig as { requiredEvidenceCodes?: unknown })
      : {};
  const requiredEvidenceCodes = Array.isArray(reportUnlockConfig.requiredEvidenceCodes)
    ? reportUnlockConfig.requiredEvidenceCodes.filter(
        (code): code is string => typeof code === "string",
      )
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
