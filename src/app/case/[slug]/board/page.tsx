import { notFound } from "next/navigation";
import { BoardCanvas } from "@/components/board-canvas";
import { CaseShell } from "@/components/case-shell";
import { getBoardSeed, getCaseBySlug } from "@/lib/case-data";

type BoardPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { slug } = await params;
  const caseRecord = getCaseBySlug(slug);

  if (!caseRecord) {
    notFound();
  }

  const board = getBoardSeed(slug);

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline="Interactive investigation board seeded from the case graph."
    >
      <section className="grid gap-6">
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
                Investigation Board
              </p>
              <h2 className="mt-3 text-3xl text-white">Relationship surface</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-300">
              This first pass maps the authored case graph into a navigable board.
              The next layer is persisted notes, manual links, and drag state per
              investigation session.
            </p>
          </div>
          <div className="mt-6">
            <BoardCanvas caseSlug={slug} seed={board} />
          </div>
        </article>
      </section>
    </CaseShell>
  );
}
