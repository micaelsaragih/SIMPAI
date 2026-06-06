/**
 * Section Detector V2 — Multi-layer academic section detection.
 * Supports Heading Style, Academic Keyword, BAB Structure, Heuristic, and Fuzzy matching.
 * No AI/LLM dependencies.
 */

import type { ParsedDocument } from "@/types/analysis"
import type {
  AcademicSectionType,
  SectionDetection,
  StructureAnalysis,
  SectionStatus,
} from "../types"
import { SECTION_RULES, TOTAL_REQUIRED_SECTIONS } from "../constants"

/**
 * Case-insensitive similarity mapping.
 * Contains lowercase clean aliases for each academic section.
 */
const SECTION_ALIASES: Record<string, string[]> = {
  abstract: ["abstract", "abstrak", "abstraksi"],
  keywords: ["keywords", "keyword", "kata kunci", "key words", "key word"],
  introduction: ["introduction", "pendahuluan", "latar belakang"],
  methodology: [
    "methodology",
    "method",
    "methods",
    "metode",
    "metodologi",
    "metode penelitian",
    "metodologi penelitian",
    "bahan dan metode",
    "materials and methods",
  ],
  results: ["results", "result", "hasil", "hasil penelitian"],
  discussion: ["discussion", "pembahasan", "diskusi"],
  results_discussion: [
    "hasil dan pembahasan",
    "results and discussion",
    "results and discussions",
    "hasil penelitian dan pembahasan",
  ],
  conclusion: [
    "conclusion",
    "conclusions",
    "kesimpulan",
    "penutup",
    "kesimpulan dan saran",
    "conclusion and recommendations",
  ],
  references: [
    "references",
    "reference",
    "bibliography",
    "daftar pustaka",
    "referensi",
    "kepustakaan",
    "daftar referensi",
  ],
}

/**
 * Clean common section numbering/lettering prefixes.
 * E.g., "1. PENDAHULUAN" -> "PENDAHULUAN", "BAB I PENDAHULUAN" -> "PENDAHULUAN".
 */
function cleanPrefix(text: string): string {
  let cleaned = text.trim()
  // Remove BAB prefix (e.g., "BAB I", "BAB 1", "BAB IV")
  cleaned = cleaned.replace(/^bab\s+(?:[0-9]+|[ivxldcm]+)\b\.?\s*/i, "")
  // Remove numbering/lettering prefixes (e.g., "1.", "A.", "1.1.", "I.")
  cleaned = cleaned.replace(/^(?:(?:[0-9]+|[a-z]|[ivxldcm]+)\b\.?\s*)+/i, "")
  return cleaned.trim()
}

/**
 * Compute Levenshtein distance between two strings.
 */
function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

/**
 * Calculate similarity score (0.0 to 1.0) between two strings.
 */
function getSimilarity(s1: string, s2: string): number {
  const len = Math.max(s1.length, s2.length)
  if (len === 0) return 1.0
  return (len - getLevenshteinDistance(s1.toLowerCase(), s2.toLowerCase())) / len
}

interface CandidateBlock {
  type: "heading" | "paragraph"
  text: string
  cleanText: string
  charIndex: number
  originalIndex: number
  wordCount: number
  isUppercase: boolean
  isShort: boolean
  prevBlockWordCount: number
  nextBlockWordCount: number
}

interface Candidate {
  section: AcademicSectionType
  block: CandidateBlock
  confidence: number
  detectionMethod: "heading" | "keyword" | "bab" | "heuristic" | "fuzzy"
}

/**
 * Scan document and return detected academic sections.
 */
export function detectSections(doc: ParsedDocument): SectionDetection[] {
  // 1. Build a unified sequential list of blocks
  const blocks: CandidateBlock[] = []

  doc.headings.forEach((h) => {
    const clean = cleanPrefix(h.text).toLowerCase()
    blocks.push({
      type: "heading",
      text: h.text,
      cleanText: clean,
      charIndex: h.charIndex ?? 0,
      originalIndex: h.index,
      wordCount: h.text.trim().split(/\s+/).filter(Boolean).length,
      isUppercase: h.text === h.text.toUpperCase() && /[a-z]/i.test(h.text),
      isShort: h.text.trim().split(/\s+/).filter(Boolean).length < 8,
      prevBlockWordCount: 0,
      nextBlockWordCount: 0,
    })
  })

  doc.paragraphs.forEach((p) => {
    // Avoid duplicates if heading is already captured at the same position
    const exists = blocks.some((b) => b.type === "heading" && b.charIndex === p.charIndex)
    if (exists) return

    const clean = cleanPrefix(p.text).toLowerCase()
    blocks.push({
      type: "paragraph",
      text: p.text,
      cleanText: clean,
      charIndex: p.charIndex ?? 0,
      originalIndex: p.index,
      wordCount: p.wordCount,
      isUppercase: p.text === p.text.toUpperCase() && /[a-z]/i.test(p.text),
      isShort: p.text.trim().split(/\s+/).filter(Boolean).length < 8,
      prevBlockWordCount: 0,
      nextBlockWordCount: 0,
    })
  })

  // Sort blocks chronologically
  blocks.sort((a, b) => a.charIndex - b.charIndex)

  // Compute context for heuristics
  for (let i = 0; i < blocks.length; i++) {
    if (i > 0) {
      blocks[i].prevBlockWordCount = blocks[i - 1].wordCount
    }
    if (i < blocks.length - 1) {
      blocks[i].nextBlockWordCount = blocks[i + 1].wordCount
    }
  }

  // 2. Identify candidates for all 9 required sections
  const candidates: Candidate[] = []

  blocks.forEach((B) => {
    const babMatch = B.text.trim().match(/^bab\s+(I|II|III|IV|V|[1-5])\b/i)
    const cleanText = B.cleanText

    const targetSections: AcademicSectionType[] = [
      "abstract",
      "keywords",
      "introduction",
      "methodology",
      "results",
      "discussion",
      "conclusion",
      "references",
    ]

    targetSections.forEach((s) => {
      // Layer 1: Heading Style
      if (B.type === "heading" && SECTION_ALIASES[s]?.includes(cleanText)) {
        candidates.push({
          section: s,
          block: B,
          confidence: 1.0,
          detectionMethod: "heading",
        })
        return
      }

      // Special Layer 1 check for Combined Results & Discussion
      if (
        B.type === "heading" &&
        (s === "results" || s === "discussion") &&
        SECTION_ALIASES.results_discussion.includes(cleanText)
      ) {
        candidates.push({
          section: s,
          block: B,
          confidence: 1.0,
          detectionMethod: "heading",
        })
        return
      }

      // Layer 3: BAB Structure
      if (babMatch && B.text.trim().length < 100) {
        const ch = babMatch[1].toUpperCase()
        let mappedSection: AcademicSectionType | null = null
        if (ch === "I" || ch === "1") mappedSection = "introduction"
        else if (ch === "II" || ch === "2" || ch === "III" || ch === "3") mappedSection = "methodology"
        else if (ch === "IV" || ch === "4") mappedSection = "results"
        else if (ch === "V" || ch === "5") mappedSection = "conclusion"

        if (mappedSection === s) {
          candidates.push({
            section: s,
            block: B,
            confidence: 0.85,
            detectionMethod: "bab",
          })

          // Handle combined Hasil dan Pembahasan in BAB IV
          if ((ch === "IV" || ch === "4") && s === "results" && /pembahasan/i.test(B.text)) {
            candidates.push({
              section: "discussion",
              block: B,
              confidence: 0.85,
              detectionMethod: "bab",
            })
          }
          return
        }
      }

      // Layer 2: Academic Section Keyword Match
      if (B.text.trim().length > 0 && B.text.trim().length < 100 && SECTION_ALIASES[s]?.includes(cleanText)) {
        candidates.push({
          section: s,
          block: B,
          confidence: 0.9,
          detectionMethod: "keyword",
        })
        return
      }

      // Combined Keyword Match
      if (
        B.text.trim().length > 0 &&
        B.text.trim().length < 100 &&
        (s === "results" || s === "discussion") &&
        SECTION_ALIASES.results_discussion.includes(cleanText)
      ) {
        candidates.push({
          section: s,
          block: B,
          confidence: 0.9,
          detectionMethod: "keyword",
        })
        return
      }

      // Layer 4: Formatting Heuristic
      const isHeuristicHeading =
        B.text.trim().length > 0 &&
        B.text.trim().length < 100 &&
        (B.isUppercase || B.isShort) &&
        (B.prevBlockWordCount > 15 || B.nextBlockWordCount > 15)

      if (isHeuristicHeading) {
        if (SECTION_ALIASES[s]?.includes(cleanText)) {
          candidates.push({
            section: s,
            block: B,
            confidence: 0.75,
            detectionMethod: "heuristic",
          })
          return
        }
        if ((s === "results" || s === "discussion") && SECTION_ALIASES.results_discussion.includes(cleanText)) {
          candidates.push({
            section: s,
            block: B,
            confidence: 0.75,
            detectionMethod: "heuristic",
          })
          return
        }
      }

      // Layer 5: Fuzzy Match
      if (B.text.trim().length > 0 && B.text.trim().length < 100) {
        const aliases = SECTION_ALIASES[s] || []
        const hasFuzzyMatch = aliases.some((a) => getSimilarity(cleanText, a) >= 0.75)
        if (hasFuzzyMatch) {
          candidates.push({
            section: s,
            block: B,
            confidence: 0.6,
            detectionMethod: "fuzzy",
          })
          return
        }

        if (s === "results" || s === "discussion") {
          const hasCombFuzzyMatch = SECTION_ALIASES.results_discussion.some(
            (a) => getSimilarity(cleanText, a) >= 0.75
          )
          if (hasCombFuzzyMatch) {
            candidates.push({
              section: s,
              block: B,
              confidence: 0.6,
              detectionMethod: "fuzzy",
            })
            return
          }
        }
      }
    })
  })

  // Special title detection
  if (doc.title && doc.title.trim().length > 0 && doc.title !== "Untitled Document") {
    candidates.push({
      section: "title",
      block: {
        type: "heading",
        text: doc.title,
        cleanText: doc.title.toLowerCase(),
        charIndex: 0,
        originalIndex: -1,
        wordCount: doc.title.split(/\s+/).filter(Boolean).length,
        isUppercase: false,
        isShort: false,
        prevBlockWordCount: 0,
        nextBlockWordCount: 0,
      },
      confidence: 1.0,
      detectionMethod: "heading",
    })
  } else {
    // Check first H1
    const firstH1 = doc.headings.find((h) => h.level === 1)
    if (firstH1) {
      candidates.push({
        section: "title",
        block: {
          type: "heading",
          text: firstH1.text,
          cleanText: firstH1.text.toLowerCase(),
          charIndex: firstH1.charIndex ?? 0,
          originalIndex: firstH1.index,
          wordCount: firstH1.text.split(/\s+/).filter(Boolean).length,
          isUppercase: false,
          isShort: false,
          prevBlockWordCount: 0,
          nextBlockWordCount: 0,
        },
        confidence: 1.0,
        detectionMethod: "heading",
      })
    } else if (blocks.length > 0) {
      // Find first non-empty block that looks like a title (short, not a standard heading)
      const candidateBlock = blocks.slice(0, 3).find((b) => {
        if (b.text.trim().length < 10 || b.text.trim().length > 150) return false
        const isOtherSection = Object.values(SECTION_ALIASES).some((aliases) =>
          aliases.includes(b.cleanText)
        )
        return !isOtherSection
      })

      if (candidateBlock) {
        candidates.push({
          section: "title",
          block: candidateBlock,
          confidence: 0.7,
          detectionMethod: "heuristic",
        })
      }
    }
  }

  // 3. Resolve the best candidate for each section
  const selectedDetections: Record<AcademicSectionType, Candidate | null> = {
    title: null,
    abstract: null,
    keywords: null,
    introduction: null,
    methodology: null,
    results: null,
    discussion: null,
    conclusion: null,
    references: null,
  }

  const keys = Object.keys(selectedDetections) as AcademicSectionType[]
  keys.forEach((s) => {
    const matches = candidates.filter((c) => c.section === s)
    if (matches.length > 0) {
      // Sort by confidence DESC, then by charIndex ASC
      matches.sort((a, b) => {
        if (b.confidence !== a.confidence) {
          return b.confidence - a.confidence
        }
        return a.block.charIndex - b.block.charIndex
      })
      selectedDetections[s] = matches[0]
    }
  })

  // 4. Build output detections with proper word counts
  const detections: SectionDetection[] = []

  for (const rule of SECTION_RULES) {
    const match = selectedDetections[rule.type]

    if (!match) {
      detections.push({
        section: rule.type,
        status: "MISSING",
        label: rule.label,
        headingMatch: null,
        wordCount: 0,
        confidence: 0,
        detectionMethod: null,
      })
      continue
    }

    // Determine word count
    let wordCount = 0

    if (match.section === "title") {
      wordCount = match.block.wordCount
    } else if (match.block.type === "heading") {
      const docSection = doc.sections.find(
        (s) => s.heading.trim().toLowerCase() === match.block.text.trim().toLowerCase()
      )
      if (docSection) {
        wordCount = docSection.wordCount
      } else {
        wordCount = calculateRangeWordCount(doc, match.block.charIndex, selectedDetections)
      }
    } else {
      wordCount = calculateRangeWordCount(doc, match.block.charIndex, selectedDetections)
    }

    // Adjust word count with self word count for paragraph-based sections
    if (match.section !== "title" && match.block.type === "paragraph") {
      const selfWordCount = match.block.wordCount
      if (wordCount === 0) {
        wordCount = selfWordCount
      } else if (selfWordCount > 5) {
        wordCount = wordCount + selfWordCount
      }
    }

    // Determine status
    let status: SectionStatus = "MISSING"
    if (match.confidence < 0.7) {
      status = "UNCERTAIN"
    } else if (wordCount < rule.minWordCount) {
      status = "PARTIAL"
    } else {
      status = "FOUND"
    }

    detections.push({
      section: rule.type,
      status,
      label: rule.label,
      headingMatch: match.block.text,
      wordCount,
      confidence: match.confidence,
      detectionMethod: match.detectionMethod,
      charIndex: match.block.charIndex,
    })
  }

  return detections
}

/**
 * Sum the word counts of all paragraphs between current and next section.
 */
function calculateRangeWordCount(
  doc: ParsedDocument,
  c_start: number,
  selectedDetections: Record<AcademicSectionType, Candidate | null>
): number {
  // Find the smallest charIndex of any OTHER section that starts after c_start
  let c_next: number | undefined

  Object.values(selectedDetections).forEach((c) => {
    if (c && c.block.charIndex > c_start) {
      if (c_next === undefined || c.block.charIndex < c_next) {
        c_next = c.block.charIndex
      }
    }
  })

  let sum = 0
  doc.paragraphs.forEach((p) => {
    const pCharIndex = p.charIndex ?? 0
    if (pCharIndex > c_start && (c_next === undefined || pCharIndex < c_next)) {
      sum += p.wordCount
    }
  })

  return sum
}

/**
 * Run full structure analysis from section detections.
 */
export function analyzeStructure(doc: ParsedDocument): StructureAnalysis {
  const sections = detectSections(doc)

  const found: AcademicSectionType[] = []
  const missing: AcademicSectionType[] = []
  const partial: AcademicSectionType[] = []
  const uncertain: AcademicSectionType[] = []

  for (const detection of sections) {
    switch (detection.status) {
      case "FOUND":
        found.push(detection.section)
        break
      case "MISSING":
        missing.push(detection.section)
        break
      case "PARTIAL":
        partial.push(detection.section)
        break
      case "UNCERTAIN":
        uncertain.push(detection.section)
        break
    }
  }

  // Completeness score: FOUND = 1.0, PARTIAL = 0.5, UNCERTAIN = 0.25, MISSING = 0.0
  const points = found.length + partial.length * 0.5 + uncertain.length * 0.25
  const completeness = Math.round((points / TOTAL_REQUIRED_SECTIONS) * 100)

  return {
    sections,
    found,
    missing,
    partial,
    uncertain,
    completeness,
    totalExpected: TOTAL_REQUIRED_SECTIONS,
    totalFound: found.length,
  }
}
