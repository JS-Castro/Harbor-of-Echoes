import Image from "next/image";
import type { EvidenceRecord } from "@/lib/case-data";

type EvidenceVisualProps = {
  evidence: EvidenceRecord;
};

function shouldUseIndustrialPlaceholder(evidence: EvidenceRecord) {
  const relatedIndustrialSignals = new Set([
    "blackwake-energy",
    "turbine-3",
  ]);

  return (
    evidence.relatedEntitySlugs.some((slug) => relatedIndustrialSignals.has(slug)) &&
    ["photo", "report", "note"].includes(evidence.type)
  );
}

export function EvidenceVisual({ evidence }: EvidenceVisualProps) {
  if (!shouldUseIndustrialPlaceholder(evidence)) {
    return null;
  }

  return (
    <figure className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/40">
      <Image
        src="/images/evidence-turbine-interior.jpg"
        alt={evidence.title}
        width={1800}
        height={2400}
        className="h-72 w-full object-cover object-center"
      />
    </figure>
  );
}
