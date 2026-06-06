import type { ParsedDocument, Heading, Paragraph, Section } from "@/types/analysis"
import type { StructureTestCase, EvalResult, EvalRunSummary } from "../types"
import { analyzeStructure } from "@/features/analysis-engine/detectors/section-detector"
import { summarizeResults } from "../scorers/evaluation-scorer"
import rawCases from "../datasets/structure-detection.json"

// Type assertion for import
const cases = rawCases as unknown as StructureTestCase[]

/**
 * Helper to build a mock ParsedDocument from headings and paragraphs.
 */
export function buildMockParsedDocument(
  headingsList: { level: number; text: string }[],
  paragraphsList: { text: string }[]
): ParsedDocument {
  const headings: Heading[] = headingsList.map((h, index) => ({
    level: h.level,
    text: h.text,
    index,
    charIndex: index * 200,
  }))

  const paragraphs: Paragraph[] = paragraphsList.map((p, index) => {
    const wordCount = p.text.trim().split(/\s+/).filter(Boolean).length
    const charIndex = headingsList.length > 0 ? index * 200 + 100 : index * 200
    return {
      text: p.text,
      index,
      wordCount,
      charIndex,
    }
  })

  // Map each heading to a corresponding paragraph as its section content
  // If there are no headings, all paragraphs go under no heading (or we skip section headers)
  const sections: Section[] = headings.map((h, i) => {
    const para = paragraphs[i]
    const content = para ? para.text : ""
    const wordCount = para ? para.wordCount : 0
    return {
      heading: h.text,
      level: h.level,
      content,
      wordCount,
      paragraphCount: 1,
    }
  })

  // If there are paragraphs but no headings, create a dummy section with empty heading
  if (headings.length === 0 && paragraphs.length > 0) {
    sections.push({
      heading: "",
      level: 1,
      content: paragraphs.map((p) => p.text).join("\n"),
      wordCount: paragraphs.reduce((acc, p) => acc + p.wordCount, 0),
      paragraphCount: paragraphs.length,
    })
  }

  const rawText = paragraphs.map((p) => p.text).join("\n")
  const wordCount = paragraphs.reduce((acc, p) => acc + p.wordCount, 0)
  const characterCount = rawText.length

  const statistics = {
    wordCount,
    paragraphCount: paragraphs.length,
    sectionCount: sections.length,
    headingCount: headings.length,
    characterCount,
  }

  // Derive title: check if first heading is Title, or document.title
  // By default, if the first heading rules match title, or we can just set it.
  const titleHeading = headings.find((h) => h.text.toLowerCase().includes("judul") || h.text.toLowerCase().includes("title"))
  const title = titleHeading ? titleHeading.text : ""

  return {
    title,
    headings,
    paragraphs,
    sections,
    rawText,
    statistics,
  }
}

/**
 * Runs the structure detection accuracy evaluation.
 */
export function runStructureEvaluation(): EvalRunSummary {
  const results: EvalResult[] = []

  for (const tc of cases) {
    const doc = buildMockParsedDocument(tc.input.headings, tc.input.paragraphs)
    const analysis = analyzeStructure(doc)

    let passed = true
    const errors: string[] = []

    // Verify completeness score
    if (analysis.completeness !== tc.expected.completeness) {
      // Allow minor rounding difference of +/- 1
      if (Math.abs(analysis.completeness - tc.expected.completeness) > 1) {
        passed = false
        errors.push(`Completeness mismatch: expected ${tc.expected.completeness}%, actual ${analysis.completeness}%`)
      }
    }

    // Verify expected sections statuses
    for (const expectedSec of tc.expected.sections) {
      const actualDetection = analysis.sections.find((s) => s.section === expectedSec.section)
      if (!actualDetection) {
        passed = false
        errors.push(`Section "${expectedSec.section}" not detected at all`)
      } else if (actualDetection.status !== expectedSec.status) {
        // If the expected status matches, great. If not, record error.
        passed = false
        errors.push(`Section "${expectedSec.section}" status mismatch: expected "${expectedSec.status}", actual "${actualDetection.status}"`)
      }
    }

    results.push({
      id: tc.id,
      name: tc.name,
      passed,
      message: passed ? "Akurasi 100% cocok" : errors.join("; "),
      expected: JSON.stringify(tc.expected.sections.map((s) => `${s.section}:${s.status}`)),
      actual: JSON.stringify(analysis.sections.filter((s) => tc.expected.sections.some((es) => es.section === s.section)).map((s) => `${s.section}:${s.status}`)),
    })
  }

  return summarizeResults(results)
}
