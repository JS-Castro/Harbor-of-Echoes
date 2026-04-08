import Image from "next/image";
import Link from "next/link";
import type { EvidenceRecord, EntityRecord, LocationRecord } from "@/lib/case-data";
import type { AppLocale } from "@/lib/i18n";
import { getDictionary, getEntityTypeLabel } from "@/lib/i18n";

type EntityDossierProps = {
  caseSlug: string;
  locale: AppLocale;
  entity: EntityRecord;
  relatedEvidence: EvidenceRecord[];
  relatedLocations: LocationRecord[];
};

export function EntityDossier({
  caseSlug,
  locale,
  entity,
  relatedEvidence,
  relatedLocations,
}: EntityDossierProps) {
  const dictionary = getDictionary(locale);
  const hasPortrait = entity.slug === "mara-vale";

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/35">
        <div className="grid gap-0 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <div className="relative min-h-[22rem] border-b border-white/10 lg:min-h-full lg:border-b-0 lg:border-r">
            {hasPortrait ? (
              <Image
                src="/images/mara-dossier-portrait.jpg"
                alt="Mara Vale dossier portrait"
                fill
                priority
                className="object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(173,202,219,0.22),transparent_38%),linear-gradient(180deg,rgba(15,29,42,0.95),rgba(7,16,24,0.98))]" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(7,16,24,0.92)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/70">
                  {dictionary.entity.subjectFile}
                </p>
              <p className="mt-2 text-3xl text-white">{entity.name}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{entity.role}</p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-slate-300">
              <span className="rounded-full border border-white/10 px-3 py-1">
                {getEntityTypeLabel(locale, entity.type)}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                {dictionary.entity.evidenceLinks(relatedEvidence.length)}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                {dictionary.entity.locationLinks(relatedLocations.length)}
              </span>
            </div>

            <h2 className="mt-6 text-4xl text-white">{dictionary.entity.dossier}</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-200">
              {entity.description}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">
                  {dictionary.entity.publicNotes}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {entity.publicNotes}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-amber-100/15 bg-amber-50/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-100/70">
                  {dictionary.entity.hiddenNotes}
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-200">
                  {entity.hiddenNotes}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">
            {dictionary.shared.relatedEvidence}
          </p>
          <div className="mt-4 space-y-3">
            {relatedEvidence.map((item) => (
              <Link
                key={item.code}
                href={`/case/${caseSlug}/evidence/${item.slug}`}
                className="block rounded-[1.25rem] border border-white/10 px-4 py-4 transition hover:border-white/25 hover:bg-white/5"
              >
                <p className="text-sm uppercase tracking-[0.18em] text-cyan-100/60">
                  {item.code}
                </p>
                <p className="mt-2 text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {item.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">
            {dictionary.shared.relatedLocations}
          </p>
          <div className="mt-4 space-y-3">
            {relatedLocations.map((location) => (
              <div
                key={location.slug}
                className="rounded-[1.25rem] border border-white/10 px-4 py-4"
              >
                <p className="text-white">{location.name}</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {location.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}
