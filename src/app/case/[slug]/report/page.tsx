import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import { ReportBuilder } from "@/components/report-builder";
import { getCaseBySlug } from "@/lib/case-data";
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

  if (!caseRecord) {
    notFound();
  }

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline={dictionary.report.tagline}
      locale={locale}
    >
      <ReportBuilder caseSlug={slug} locale={locale} />
    </CaseShell>
  );
}
