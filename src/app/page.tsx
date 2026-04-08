import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDictionary } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

export default async function Home() {
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);

  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-30">
        <Image
          src="/images/hero-harbor-night.jpg"
          alt={dictionary.home.heroAlt}
          fill
          priority
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(103,140,166,0.16),transparent_35%),linear-gradient(180deg,rgba(4,10,15,0.72)_0%,rgba(7,16,24,0.78)_30%,rgba(7,16,24,0.94)_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[linear-gradient(135deg,rgba(182,199,214,0.12),transparent_60%)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-6 py-8 text-stone-100 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-cyan-100/70">
              Harbor of Echoes
            </p>
            <p className="mt-2 text-sm text-slate-300/80">
              {dictionary.shared.appTagline}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher
              currentLocale={locale}
              label={dictionary.languageLabel}
              locales={[
                { value: "en", label: dictionary.languages.en },
                { value: "pt-PT", label: dictionary.languages["pt-PT"] },
              ]}
            />
            <Link
              className="rounded-full border border-cyan-100/20 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-50 transition hover:border-cyan-100/40 hover:bg-white/5"
              href="/case/vale-disappearance"
            >
              {dictionary.shared.openCase}
            </Link>
          </div>
        </header>

        <div className="grid gap-16 py-16 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.4em] text-amber-100/70">
              {dictionary.home.caseLabel}
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl leading-none font-semibold tracking-[0.02em] text-balance text-white sm:text-6xl lg:text-7xl">
              {dictionary.home.titleLineOne}
              <span className="mt-2 block text-slate-400">
                {dictionary.home.titleLineTwo}
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
              {dictionary.home.summary}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-stone-100 px-6 py-3 text-sm font-medium tracking-[0.16em] text-slate-950 uppercase transition hover:bg-cyan-100"
                href="/case/vale-disappearance"
              >
                {dictionary.home.enterInvestigation}
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium tracking-[0.16em] text-stone-100 uppercase transition hover:border-white/35 hover:bg-white/5"
                href="/case/vale-disappearance/evidence"
              >
                {dictionary.home.reviewEvidenceVault}
              </Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-md">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10">
              <Image
                src="/images/mara-dossier-portrait.jpg"
                alt="Mara Vale dossier portrait placeholder"
                width={1200}
                height={1800}
                className="h-72 w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(7,16,24,0.82)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/70">
                  {dictionary.home.subjectFile}
                </p>
                <p className="mt-2 text-xl text-white">Mara Vale</p>
                <p className="mt-1 text-sm text-slate-300">
                  {dictionary.home.subjectNote}
                </p>
              </div>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-slate-300">
              {dictionary.home.currentBuild}
            </p>
            <div className="mt-4 space-y-4">
              {dictionary.home.caseStats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                >
                  <p className="text-3xl text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="grid gap-8 border-t border-white/10 py-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="grid gap-4 sm:grid-cols-2">
            {dictionary.home.modules.map((module) => (
              <article
                key={module}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5"
              >
                <p className="text-sm leading-7 text-slate-300">{module}</p>
              </article>
            ))}
          </div>

          <div className="rounded-[1.75rem] border border-amber-100/15 bg-amber-50/5 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-100/70">
              {dictionary.home.casePremise}
            </p>
            <p className="mt-4 text-base leading-7 text-stone-200">
              {dictionary.home.premiseText}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
