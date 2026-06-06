import type { ComplianceTestCase, EvalResult, EvalRunSummary } from "../types"
import type { ParsedDocument } from "@/types/analysis"
import { compareWithTemplate } from "@/features/analysis-engine/comparators/template-comparator"
import { buildMockParsedDocument } from "./structure-runner"
import { summarizeResults } from "../scorers/evaluation-scorer"
import rawCases from "../datasets/template-compliance.json"

const cases = rawCases as unknown as ComplianceTestCase[]

/**
 * Helper to build minimal mock ParsedDocument for comparison from simple heading lists.
 */
function buildMockDocForCompliance(headings: string[]): ParsedDocument {
  // Map headings to format { level, text }
  const headingsList = headings.map((heading) => {
    // If it is Judul, let's make level 1.
    // If it is Sub-bagian or similar, level 2.
    return { level: 1, text: heading }
  })

  // Build minimal paragraphs (each having enough words to avoid missing/partial limits if necessary)
  // But wait, template comparison doesn't care about word counts, it only extracts section labels
  // from doc.sections where heading is not empty.
  const paragraphsList = headings.map((heading) => ({
    text: `Teks konten untuk bagian ${heading} yang cukup panjang dan lengkap.`
  }))

  return buildMockParsedDocument(headingsList, paragraphsList)
}

/**
 * Runs the template compliance accuracy evaluation.
 */
export function runComplianceEvaluation(): EvalRunSummary {
  const results: EvalResult[] = []

  for (const tc of cases) {
    const draft = buildMockDocForCompliance(tc.input.draftHeadings)
    const template = buildMockDocForCompliance(tc.input.templateHeadings)

    const analysis = compareWithTemplate(draft, template)

    let passed = true
    const errors: string[] = []

    // Verify compliance score
    if (analysis.compliance !== tc.expected.compliance) {
      // Allow minor rounding difference of +/- 1
      if (Math.abs(analysis.compliance - tc.expected.compliance) > 1) {
        passed = false
        errors.push(`Compliance score mismatch: expected ${tc.expected.compliance}%, actual ${analysis.compliance}%`)
      }
    }

    // Verify missing count
    if (analysis.missing.length !== tc.expected.missingCount) {
      passed = false
      errors.push(`Missing section count mismatch: expected ${tc.expected.missingCount}, actual ${analysis.missing.length} (${analysis.missing.join(", ")})`)
    }

    // Verify extra count
    if (analysis.extra.length !== tc.expected.extraCount) {
      passed = false
      errors.push(`Extra section count mismatch: expected ${tc.expected.extraCount}, actual ${analysis.extra.length} (${analysis.extra.join(", ")})`)
    }

    // Verify order issue count
    if (analysis.orderIssues.length !== tc.expected.orderIssueCount) {
      passed = false
      errors.push(`Order issue count mismatch: expected ${tc.expected.orderIssueCount}, actual ${analysis.orderIssues.length}`)
    }

    results.push({
      id: tc.id,
      name: tc.name,
      passed,
      message: passed ? "Akurasi 100% cocok" : errors.join("; "),
      expected: `compliance:${tc.expected.compliance}, missing:${tc.expected.missingCount}, extra:${tc.expected.extraCount}, orderIssues:${tc.expected.orderIssueCount}`,
      actual: `compliance:${analysis.compliance}, missing:${analysis.missing.length}, extra:${analysis.extra.length}, orderIssues:${analysis.orderIssues.length}`,
    })
  }

  return summarizeResults(results)
}
