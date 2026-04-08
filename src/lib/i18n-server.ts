import { cookies } from "next/headers";
import { normalizeLocale, type AppLocale } from "@/lib/i18n";

export async function getCurrentLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get("hoe-locale")?.value);
}
