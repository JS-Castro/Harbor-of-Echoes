"use client";

import { useEffect } from "react";
import { getReviewedEvidenceStorageKey } from "@/lib/case-session";

type EvidenceViewTrackerProps = {
  caseSlug: string;
  evidenceCode: string;
};

export function EvidenceViewTracker({ caseSlug, evidenceCode }: EvidenceViewTrackerProps) {
  useEffect(() => {
    const storageKey = getReviewedEvidenceStorageKey(caseSlug);

    try {
      const currentValue = window.localStorage.getItem(storageKey);
      const reviewedEvidence = currentValue ? (JSON.parse(currentValue) as string[]) : [];

      if (reviewedEvidence.includes(evidenceCode)) {
        return;
      }

      window.localStorage.setItem(
        storageKey,
        JSON.stringify([...reviewedEvidence, evidenceCode].sort()),
      );
    } catch {
      window.localStorage.removeItem(storageKey);
      window.localStorage.setItem(storageKey, JSON.stringify([evidenceCode]));
    }
  }, [caseSlug, evidenceCode]);

  return null;
}
