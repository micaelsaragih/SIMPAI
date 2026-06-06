/**
 * DOCX parser service.
 * Uses mammoth.js to convert DOCX files to HTML, then extracts structured data.
 * Reusable for both journal templates and draft articles.
 */

import mammoth from "mammoth"
import type { ParsedDocument, RejectedHeading } from "@/types/analysis"
import {
  extractHeadings,
  extractParagraphs,
  buildSections,
  extractTitle,
  computeStatistics,
  stripHtml,
} from "./html-extractor"

/**
 * Parse a DOCX file buffer into a structured ParsedDocument.
 *
 * @param buffer - The raw file buffer from the uploaded DOCX
 * @returns ParsedDocument with title, headings, paragraphs, sections, rawText, and statistics
 * @throws Error if parsing fails
 */
export async function parseDocx(buffer: Buffer): Promise<ParsedDocument> {
  // Convert DOCX to HTML using mammoth
  const result = await mammoth.convertToHtml({ buffer })

  if (!result.value) {
    throw new Error("Dokumen tidak dapat diproses. File DOCX mungkin kosong atau rusak.")
  }

  const html = result.value

  // ─── Debug Logging (development only) ─────────────────────────────────────
  if (process.env.NODE_ENV === "development") {
    const nativeH1Count = (html.match(/<h1[^>]*>/gi) || []).length
    const nativeH2Count = (html.match(/<h2[^>]*>/gi) || []).length
    const nativeH3Count = (html.match(/<h3[^>]*>/gi) || []).length
    const pTagCount = (html.match(/<p[^>]*>/gi) || []).length
    const strongTagCount = (html.match(/<strong[^>]*>/gi) || []).length

    console.log("\n══════════════════════════════════════════════════")
    console.log("  [DOCX PARSER DEBUG] Raw Mammoth HTML Analysis")
    console.log("══════════════════════════════════════════════════")
    console.log(`  HTML length: ${html.length} chars`)
    console.log(`  Native <h1> tags: ${nativeH1Count}`)
    console.log(`  Native <h2> tags: ${nativeH2Count}`)
    console.log(`  Native <h3> tags: ${nativeH3Count}`)
    console.log(`  <p> tags: ${pTagCount}`)
    console.log(`  <strong> tags: ${strongTagCount}`)
    console.log(`  First 2000 chars of HTML:`)
    console.log(`  ${html.slice(0, 2000)}`)
    console.log("──────────────────────────────────────────────────\n")
  }

  // Extract structured data from HTML using multi-layer detection
  const rejectedHeadings: RejectedHeading[] = []
  const headings = extractHeadings(html, rejectedHeadings)
  const paragraphs = extractParagraphs(html, headings)
  const sections = buildSections(html, headings)
  const title = extractTitle(headings, paragraphs, html)
  const rawText = stripHtml(html)
  const statistics = computeStatistics(rawText, paragraphs, sections, headings)

  // ─── Debug: Extraction Results ────────────────────────────────────────────
  if (process.env.NODE_ENV === "development") {
    const methodCounts: Record<string, number> = {}
    for (const h of headings) {
      const method = h.detectionMethod ?? "unknown"
      methodCounts[method] = (methodCounts[method] || 0) + 1
    }

    console.log("══════════════════════════════════════════════════")
    console.log("  [DOCX PARSER DEBUG] Extraction Results")
    console.log("══════════════════════════════════════════════════")
    console.log(`  Title: "${title}"`)
    console.log(`  Headings detected: ${headings.length}`)
    console.log(`  Detection methods: ${JSON.stringify(methodCounts)}`)
    console.log(`  Paragraphs: ${paragraphs.length}`)
    console.log(`  Sections: ${sections.length}`)
    console.log(`  Word count: ${statistics.wordCount}`)
    console.log(`  Rejected headings: ${rejectedHeadings.length}`)
    console.log("")
    console.log("  First 20 headings:")
    headings.slice(0, 20).forEach((h, i) => {
      console.log(`    [${i}] L${h.level} (${h.detectionMethod}, ${(h.confidence ?? 0).toFixed(2)}) "${h.text}"`)
    })
    console.log("")
    console.log("  First 10 sections:")
    sections.slice(0, 10).forEach((s, i) => {
      console.log(`    [${i}] L${s.level} "${s.heading}" (${s.wordCount} words, ${s.paragraphCount} paragraphs)`)
    })
    console.log("══════════════════════════════════════════════════\n")
  }

  return {
    title,
    headings,
    paragraphs,
    sections,
    rawText,
    statistics,
    rejectedHeadings,
  }
}
