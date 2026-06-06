/**
 * Language Scorer — Layer 4: Composite language scoring.
 * Computes sub-scores for KBBI, PUEBI, and Academic Style compliance,
 * then calculates a weighted composite score and grade.
 */

import type { KBBICheckResult, PUEBICheckResult, AcademicStyleResult, LanguageScoreBreakdown } from "../types";
import { LANGUAGE_SCORING_WEIGHTS, SEVERITY_PENALTY_MAP, LANGUAGE_GRADE_THRESHOLDS } from "../constants";

/**
 * Calculates a composite language analysis score and grade classification.
 */
export function calculateLanguageScore(
  kbbiResult: KBBICheckResult,
  puebiResult: PUEBICheckResult,
  styleResult: AcademicStyleResult
): LanguageScoreBreakdown {
  // 1. Calculate KBBI compliance score
  const kbbiPenalty = kbbiResult.issues.reduce(
    (sum, issue) => sum + (SEVERITY_PENALTY_MAP[issue.severity] || 0),
    0
  );
  const kbbiScore = Math.max(0, 100 - kbbiPenalty);

  // 2. Calculate PUEBI compliance score
  const puebiPenalty = puebiResult.issues.reduce(
    (sum, issue) => sum + (SEVERITY_PENALTY_MAP[issue.severity] || 0),
    0
  );
  const puebiScore = Math.max(0, 100 - puebiPenalty);

  // 3. Calculate Academic Style compliance score
  const stylePenalty = styleResult.issues.reduce(
    (sum, issue) => sum + (SEVERITY_PENALTY_MAP[issue.severity] || 0),
    0
  );
  const academicStyleScore = Math.max(0, 100 - stylePenalty);

  // 4. Calculate weighted final score
  const weights = LANGUAGE_SCORING_WEIGHTS;
  const rawFinalScore =
    kbbiScore * weights.kbbi +
    puebiScore * weights.puebi +
    academicStyleScore * weights.academicStyle;
  const finalScore = Math.round(Math.min(100, Math.max(0, rawFinalScore)));

  // 5. Determine grade classification
  const gradeConfig =
    LANGUAGE_GRADE_THRESHOLDS.find((t) => finalScore >= t.min && finalScore <= t.max) ||
    LANGUAGE_GRADE_THRESHOLDS[LANGUAGE_GRADE_THRESHOLDS.length - 1];

  return {
    kbbiScore,
    puebiScore,
    academicStyleScore,
    finalScore,
    grade: gradeConfig.grade,
    gradeLabel: gradeConfig.label,
    weights: {
      kbbi: weights.kbbi,
      puebi: weights.puebi,
      academicStyle: weights.academicStyle,
    },
  };
}
