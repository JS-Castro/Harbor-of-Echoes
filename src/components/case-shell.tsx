import Link from "next/link";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { AppLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";

type CaseShellProps = {
  caseSlug: string;
  title: string;
  tagline: string;
  locale: AppLocale;
  children: ReactNode;
};

export function CaseShell({
  caseSlug,
  title,
  tagline,
  locale,
  children,
}: CaseShellProps) {
  const dictionary = getDictionary(locale);
  const navItems = [
    { href: "", label: dictionary.nav.dashboard },
    { href: "/evidence", label: dictionary.nav.evidence },
    { href: "/timeline", label: dictionary.nav.timeline },
    { href: "/board", label: dictionary.nav.board },
    { href: "/report", label: dictionary.nav.report },
  ];

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

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <LanguageSwitcher
                currentLocale={locale}
                label={dictionary.languageLabel}
                locales={[
                  { value: "en", label: dictionary.languages.en },
                  { value: "pt-PT", label: dictionary.languages["pt-PT"] },
                ]}
              />
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
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
