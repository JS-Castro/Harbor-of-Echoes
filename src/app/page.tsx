import Link from "next/link";

const caseStats = [
  { label: "Evidence Items", value: "20" },
  { label: "Key Entities", value: "10" },
  { label: "Timeline Events", value: "14" },
  { label: "Primary Theories", value: "3" },
];

const modules = [
  "Evidence vault with layered document views",
  "Interactive case board for links and notes",
  "Chronological reconstruction with contradictions",
  "Final report scoring across cause, motive, and responsibility",
];

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(103,140,166,0.24),transparent_40%),linear-gradient(180deg,#071018_0%,#0b1722_45%,#101c27_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[linear-gradient(135deg,rgba(182,199,214,0.14),transparent_60%)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-6 py-8 text-stone-100 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-cyan-100/70">
              Harbor of Echoes
            </p>
            <p className="mt-2 text-sm text-slate-300/80">
              Narrative investigation webapp
            </p>
          </div>
          <Link
            className="rounded-full border border-cyan-100/20 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-50 transition hover:border-cyan-100/40 hover:bg-white/5"
            href="/case/vale-disappearance"
          >
            Open Case
          </Link>
        </header>

        <div className="grid gap-16 py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.4em] text-amber-100/70">
              Case 01: The Vale Disappearance
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl leading-none font-semibold tracking-[0.02em] text-balance text-white sm:text-6xl lg:text-7xl">
              The sea kept the sound.
              <span className="mt-2 block text-slate-400">
                The town buried the rest.
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
              Mara Vale vanished days before exposing safety fraud tied to
              Blackwake Energy. Players inspect evidence, surface contradictions,
              and decide whether the truth points to a cover-up, a staged
              disappearance, or a death concealed by the town itself.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-stone-100 px-6 py-3 text-sm font-medium tracking-[0.16em] text-slate-950 uppercase transition hover:bg-cyan-100"
                href="/case/vale-disappearance"
              >
                Enter Investigation
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium tracking-[0.16em] text-stone-100 uppercase transition hover:border-white/35 hover:bg-white/5"
                href="/case/vale-disappearance/evidence"
              >
                Review Evidence Vault
              </Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
              Current Build
            </p>
            <div className="mt-6 space-y-4">
              {caseStats.map((stat) => (
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
            {modules.map((module) => (
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
              Case Premise
            </p>
            <p className="mt-4 text-base leading-7 text-stone-200">
              Blackwake&apos;s turbine records do not match the ecological damage
              in the harbor channel. Mara copied something that proved intent.
              She never made it to publication.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
