import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import { CaseEnding } from "@/components/case-ending";
import { getCaseBySlugRuntime, getCaseEvidenceRuntime } from "@/lib/case-data";
import { getDictionary } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

type EndingPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CaseEndingPage({ params }: EndingPageProps) {
  const { slug } = await params;
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const caseRecord = await getCaseBySlugRuntime(slug, locale);

  if (!caseRecord) {
    notFound();
  }

  const evidence = await getCaseEvidenceRuntime(slug, locale);

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline={dictionary.ending.tagline}
      locale={locale}
    >
      <CaseEnding
        caseSlug={slug}
        locale={locale}
        evidenceCatalog={evidence.map((item) => ({
          code: item.code,
          slug: item.slug,
          title: item.title,
        }))}
      />
    </CaseShell>
  );
}
