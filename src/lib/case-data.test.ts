import {
  formatCaseDate,
  getBoardSeed,
  getCaseBySlug,
  getEvidenceBySlug,
} from "@/lib/case-data";

describe("case data", () => {
  it("composes localized case content for pt-PT", () => {
    const caseRecord = getCaseBySlug("vale-disappearance", "pt-PT");

    expect(caseRecord?.title).toBe("Caso 01: O Desaparecimento de Vale");
    expect(caseRecord?.statusLabel).toBe("rascunho");
  });

  it("formats unknown dates per locale", () => {
    expect(formatCaseDate(undefined, "en")).toBe("Unknown");
    expect(formatCaseDate(undefined, "pt-PT")).toBe("Desconhecido");
  });

  it("formats UTC timestamps using the requested locale", () => {
    expect(formatCaseDate("2025-10-28T21:11:00.000Z", "en")).toContain("Oct");
    expect(formatCaseDate("2025-10-28T21:11:00.000Z", "pt-PT")).toContain("21:11");
  });

  it("builds a localized board seed", () => {
    const seed = getBoardSeed("vale-disappearance", "pt-PT");

    expect(seed.nodes).toHaveLength(12);
    expect(seed.nodes.some((node) => node.label === "Mara Vale")).toBe(false);
    expect(seed.nodes.some((node) => node.data.label === "Mara Vale")).toBe(true);
    expect(seed.edges.length).toBeGreaterThan(0);
  });

  it("returns localized evidence detail records", () => {
    const evidence = getEvidenceBySlug(
      "vale-disappearance",
      "official-missing-person-report",
      "pt-PT",
    );

    expect(evidence?.title).toBe("Relatório Oficial de Pessoa Desaparecida");
    expect(evidence?.sourceLabel).toBe("Subagente Pike");
  });
});
