import type { EvalResult, EvalRunSummary } from "../types"

/**
 * Helper scorer to calculate evaluation metrics.
 */

export function calculateAccuracy(results: EvalResult[]): number {
  if (results.length === 0) return 0
  const passed = results.filter((r) => r.passed).length
  return Math.round((passed / results.length) * 100)
}

export interface ClassificationCounts {
  tp: number
  fp: number
  fn: number
  tn: number
}

export interface AdvancedMetrics {
  accuracy: number
  precision: number
  recall: number
  f1: number
}

/**
 * Calculate Precision, Recall, and F1 score from binary classification counts.
 */
export function calculateAdvancedMetrics(counts: ClassificationCounts): AdvancedMetrics {
  const { tp, fp, fn, tn } = counts
  const total = tp + fp + fn + tn

  const accuracy = total > 0 ? (tp + tn) / total : 0
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0
  const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0
  const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0

  return {
    accuracy: Math.round(accuracy * 100),
    precision: Math.round(precision * 100),
    recall: Math.round(recall * 100),
    f1: Math.round(f1 * 100),
  }
}

/**
 * Formats a list of EvalResults into an EvalRunSummary.
 */
export function summarizeResults(results: EvalResult[]): EvalRunSummary {
  const total = results.length
  const passed = results.filter((r) => r.passed).length
  const failed = total - passed
  const accuracy = calculateAccuracy(results)

  return {
    total,
    passed,
    failed,
    accuracy,
    results,
  }
}
