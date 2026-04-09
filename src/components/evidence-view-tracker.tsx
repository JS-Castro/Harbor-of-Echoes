"use client";

import { useEffect } from "react";
import { markEvidenceViewed } from "@/app/actions/case-session";

type EvidenceViewTrackerProps = {
  caseSlug: string;
  evidenceCode: string;
};

export function EvidenceViewTracker({ caseSlug, evidenceCode }: EvidenceViewTrackerProps) {
  useEffect(() => {
    void markEvidenceViewed(caseSlug, evidenceCode);
  }, [caseSlug, evidenceCode]);

  return null;
}
