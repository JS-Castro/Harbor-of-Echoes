import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "", label: "Dashboard" },
  { href: "/evidence", label: "Evidence" },
  { href: "/timeline", label: "Timeline" },
  { href: "/board", label: "Board" },
  { href: "/report", label: "Report" },
];

type CaseShellProps = {
  caseSlug: string;
  title: string;
  tagline: string;
  children: ReactNode;
};

export function CaseShell({
  caseSlug,
  title,
  tagline,
  children,
}: CaseShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#09111a_0%,#0f1d2a_55%,#132330_100%)] text-stone-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-10 lg:px-12">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/"
                className="text-xs uppercase tracking-[0.35em] text-cyan-100/70"
              >
                Harbor of Echoes
              </Link>
              <h1 className="mt-4 text-4xl text-white sm:text-5xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                {tagline}
              </p>
            </div>

            <nav className="flex flex-wrap gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={`/case/${caseSlug}${item.href}`}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:bg-white/5"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
