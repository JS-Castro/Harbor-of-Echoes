import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import {
  formatCaseDate,
  getCaseBySlug,
  getCaseEvents,
  getLocationBySlug,
} from "@/lib/case-data";
import { getCertaintyLabel, getDictionary } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

type TimelinePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TimelinePage({ params }: TimelinePageProps) {
  const { slug } = await params;
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const caseRecord = getCaseBySlug(slug, locale);

  if (!caseRecord) {
    notFound();
  }

  const events = getCaseEvents(slug, locale).sort((left, right) =>
    left.eventTime.localeCompare(right.eventTime),
  );

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline={dictionary.timeline.tagline}
      locale={locale}
    >
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
          {dictionary.timeline.heading}
        </p>
        <div className="mt-8 space-y-5">
          {events.map((event) => {
            const location = getLocationBySlug(slug, event.locationSlug, locale);

            return (
              <article
                key={event.slug}
                className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 lg:grid-cols-[11rem_minmax(0,1fr)]"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/60">
                    {formatCaseDate(event.eventTime, locale)}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    {dictionary.timeline.certainty}: {getCertaintyLabel(locale, event.certainty)}
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl text-white">{event.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {event.description}
                  </p>
                  {location ? (
                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-400">
                      {dictionary.shared.location}: {location.name}
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
