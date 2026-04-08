import {
  defaultLocale,
  getDictionary,
  getEvidenceTypeLabel,
  normalizeLocale,
} from "@/lib/i18n";

describe("i18n", () => {
  it("falls back to the default locale for unsupported values", () => {
    expect(normalizeLocale("fr")).toBe(defaultLocale);
    expect(normalizeLocale(null)).toBe(defaultLocale);
  });

  it("returns pt-PT dictionary copy", () => {
    const dictionary = getDictionary("pt-PT");

    expect(dictionary.nav.evidence).toBe("Provas");
    expect(dictionary.home.enterInvestigation).toBe("Entrar na Investigação");
  });

  it("translates evidence type labels", () => {
    expect(getEvidenceTypeLabel("pt-PT", "report")).toBe("relatório");
    expect(getEvidenceTypeLabel("en", "report")).toBe("report");
  });
});
