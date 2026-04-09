import { notFound } from "next/navigation";
import { BoardCanvas } from "@/components/board-canvas";
import { CaseShell } from "@/components/case-shell";
import { getBoardSeedRuntime, getCaseBySlugRuntime } from "@/lib/case-data";
import { getDictionary } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

type BoardPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { slug } = await params;
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const caseRecord = await getCaseBySlugRuntime(slug, locale);

  if (!caseRecord) {
    notFound();
  }

  const board = await getBoardSeedRuntime(slug, locale);

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline={dictionary.board.tagline}
      locale={locale}
    >
      <section className="grid gap-6">
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
                {dictionary.board.label}
              </p>
              <h2 className="mt-3 text-3xl text-white">{dictionary.board.heading}</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-300">
              {dictionary.board.description}
            </p>
          </div>
          <div className="mt-6">
            <BoardCanvas caseSlug={slug} seed={board} locale={locale} />
          </div>
        </article>
      </section>
    </CaseShell>
  );
}
