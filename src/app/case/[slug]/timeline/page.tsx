import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import {
  formatCaseDate,
  getCaseBySlug,
  getCaseEvents,
  getLocationBySlug,
} from "@/lib/case-data";

type TimelinePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TimelinePage({ params }: TimelinePageProps) {
  const { slug } = await params;
  const caseRecord = getCaseBySlug(slug);

  if (!caseRecord) {
    notFound();
  }

  const events = getCaseEvents(slug).sort((left, right) =>
    left.eventTime.localeCompare(right.eventTime),
  );

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline="Chronological reconstruction of the investigation and disappearance night."
    >
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
          Timeline
        </p>
        <div className="mt-8 space-y-5">
          {events.map((event) => {
            const location = getLocationBySlug(slug, event.locationSlug);

            return (
              <article
                key={event.slug}
                className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 lg:grid-cols-[11rem_minmax(0,1fr)]"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/60">
                    {formatCaseDate(event.eventTime)}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Certainty: {event.certainty}
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl text-white">{event.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {event.description}
                  </p>
                  {location ? (
                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-400">
                      Location: {location.name}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </CaseShell>
  );
}
