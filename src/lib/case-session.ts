export const reportStorageKeyPrefix = "harbor-of-echoes-report";
export const reportSubmissionStorageKeyPrefix = "harbor-of-echoes-report-submission";
export const reviewedEvidenceStorageKeyPrefix = "harbor-of-echoes-evidence-reviewed";

export function getReportStorageKey(caseSlug: string) {
  return `${reportStorageKeyPrefix}:${caseSlug}`;
}

export function getReportSubmissionStorageKey(caseSlug: string) {
  return `${reportSubmissionStorageKeyPrefix}:${caseSlug}`;
}

export function getReviewedEvidenceStorageKey(caseSlug: string) {
  return `${reviewedEvidenceStorageKeyPrefix}:${caseSlug}`;
}
