"use client";

import { useTransition } from "react";
import { localeCookieName, type AppLocale } from "@/lib/i18n";

type LanguageSwitcherProps = {
  currentLocale: AppLocale;
  label: string;
  locales: { value: AppLocale; label: string }[];
};

export function LanguageSwitcher({
  currentLocale,
  label,
  locales,
}: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(nextLocale: AppLocale) {
    startTransition(() => {
      document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
      window.location.reload();
    });
  }

  return (
    <label className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-300">
      <span>{label}</span>
      <select
        value={currentLocale}
        disabled={isPending}
        onChange={(event) => handleLocaleChange(event.target.value as AppLocale)}
        className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-[11px] tracking-[0.08em] text-stone-100 outline-none transition disabled:opacity-60"
      >
        {locales.map((locale) => (
          <option key={locale.value} value={locale.value}>
            {locale.label}
          </option>
        ))}
      </select>
    </label>
  );
}
