import type { LanguageTestCase, EvalResult, EvalRunSummary } from "../types"
import { checkKBBI } from "@/features/language-engine/kbbi/kbbi-checker"
import { checkPUEBI } from "@/features/language-engine/puebi/puebi-checker"
import { checkAcademicStyle } from "@/features/language-engine/academic-style/style-checker"
import { buildMockParsedDocument } from "./structure-runner"
import { summarizeResults } from "../scorers/evaluation-scorer"
import rawCases from "../datasets/language-analysis.json"

const cases = rawCases as unknown as LanguageTestCase[]

/**
 * Runs the language engine accuracy evaluation.
 */
export function runLanguageEvaluation(): EvalRunSummary {
  const results: EvalResult[] = []

  for (const tc of cases) {
    // Construct a mock ParsedDocument containing the input text under the specified section heading
    const headings = [{ level: 1, text: tc.input.sectionHeading }]
    const paragraphs = [{ text: tc.input.text }]
    const doc = buildMockParsedDocument(headings, paragraphs)

    let passed = true
    const errors: string[] = []
    let actualIssueCount = 0
    let actualIssueTypes: string[] = []
    let actualMinSeverity: string = "suggestion"

    if (tc.category === "kbbi") {
      const run = checkKBBI(doc)
      actualIssueCount = run.issues.length
      actualIssueTypes = run.issues.map((i) => i.issueType)
      if (run.issues.length > 0) {
        // Map severity rank to compare
        actualMinSeverity = run.issues[0].severity
      }
    } else if (tc.category === "puebi") {
      const run = checkPUEBI(doc)
      actualIssueCount = run.issues.length
      actualIssueTypes = run.issues.map((i) => i.issueType)
      if (run.issues.length > 0) {
        actualMinSeverity = run.issues[0].severity
      }
    } else if (tc.category === "academic-style") {
      const run = checkAcademicStyle(doc)
      actualIssueCount = run.issues.length
      actualIssueTypes = run.issues.map((i) => i.issueType)
      if (run.issues.length > 0) {
        actualMinSeverity = run.issues[0].severity
      }
    }

    // Verify issue count matches
    if (actualIssueCount !== tc.expected.issueCount) {
      passed = false
      errors.push(`Issue count mismatch: expected ${tc.expected.issueCount}, actual ${actualIssueCount}`)
    }

    // Verify issue types (if expected has issueTypes defined, verify that they are found)
    for (const expType of tc.expected.issueTypes) {
      if (!actualIssueTypes.includes(expType)) {
        passed = false
        errors.push(`Expected issue type "${expType}" not found in actual types: [${actualIssueTypes.join(", ")}]`)
      }
    }

    // Verify severity (if issues found, check severity matches or exceeds minSeverity)
    if (actualIssueCount > 0 && tc.expected.minSeverity) {
      const severityWeights: Record<string, number> = {
        suggestion: 1,
        info: 2,
        warning: 3,
        error: 4,
      }
      const expWeight = severityWeights[tc.expected.minSeverity] || 0
      const actWeight = severityWeights[actualMinSeverity] || 0
      if (actWeight < expWeight) {
        passed = false
        errors.push(`Severity lower than expected: expected min "${tc.expected.minSeverity}", actual "${actualMinSeverity}"`)
      }
    }

    results.push({
      id: tc.id,
      name: tc.name,
      passed,
      message: passed ? "Akurasi 100% cocok" : errors.join("; "),
      expected: `issues:${tc.expected.issueCount}, types:${tc.expected.issueTypes.join(",")}, severity:${tc.expected.minSeverity}`,
      actual: `issues:${actualIssueCount}, types:${actualIssueTypes.join(",")}, severity:${actualMinSeverity}`,
    })
  }

  return summarizeResults(results)
}
