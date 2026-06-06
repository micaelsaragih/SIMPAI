/**
 * HTML-to-structured-data extraction utilities.
 * Parses HTML output from mammoth into headings, paragraphs, and sections.
 *
 * Multi-layer heading detection for Indonesian academic documents:
 *   Layer 1 — Native h1-h6 tags (Word built-in Heading styles)
 *   Layer 2 — Bold-only short paragraphs (<strong>/<b> wrapping entire text)
 *   Layer 3 — Uppercase short paragraphs (all-caps with alphabetic chars)
 *   Layer 4 — Indonesian academic keyword matching
 *   Layer 5 — Title detection heuristic
 */

import type {
  Heading,
  HeadingDetectionMethod,
  Paragraph,
  Section,
  DocumentStatistics,
  RejectedHeading,
} from "@/types/analysis"

// ─── Indonesian Academic Keywords ───────────────────────────────────────────

/**
 * Known Indonesian and English academic section keywords.
 * These words, when found as standalone short paragraphs, are almost certainly
 * section headings in a journal article or thesis.
 */
const ACADEMIC_KEYWORDS: string[] = [
  "abstrak",
  "abstract",
  "kata kunci",
  "keywords",
  "key words",
  "pendahuluan",
  "introduction",
  "tinjauan pustaka",
  "landasan teori",
  "kajian pustaka",
  "studi literatur",
  "literature review",
  "metodologi",
  "metodologi penelitian",
  "metode",
  "metode penelitian",
  "method",
  "methods",
  "materials and methods",
  "bahan dan metode",
  "hasil",
  "results",
  "hasil penelitian",
  "pembahasan",
  "discussion",
  "diskusi",
  "hasil dan pembahasan",
  "results and discussion",
  "results and discussions",
  "hasil penelitian dan pembahasan",
  "kesimpulan",
  "conclusion",
  "conclusions",
  "kesimpulan dan saran",
  "conclusion and recommendations",
  "saran",
  "penutup",
  "acknowledgement",
  "acknowledgements",
  "ucapan terima kasih",
  "daftar pustaka",
  "references",
  "referensi",
  "kepustakaan",
  "daftar referensi",
  "bibliography",
]

// Blacklist of common FSM states, diagram labels, and flowchart nodes to exclude
const DIAGRAM_BLACKLIST = new Set([
  "idle", "waiting", "called", "enqueue", "cancel", "no_show", "transferred", "start", "end",
  "yes", "no", "state", "transition", "event", "action", "ok", "fail", "error", "success",
  "fsm", "uml", "flowchart", "node", "label", "process", "condition", "input", "output",
  "null", "undefined", "true", "false", "db", "init", "run", "stop", "pause", "play", "reset",
  "exit", "enter", "quit", "active", "inactive", "completed", "pending", "running",
  "transisi", "kondisi", "mulai", "selesai", "ya", "tidak", "status", "data", "sistem"
])

// ─── Utility Functions ──────────────────────────────────────────────────────

/**
 * Count words in a text string.
 */
export function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

/**
 * Strip HTML tags from a string, returning plain text.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

/**
 * Check if the inner HTML of a paragraph is entirely wrapped in bold tags.
 * Handles: <strong>text</strong>, <b>text</b>, and nested inline elements.
 */
function isEntirelyBold(innerHtml: string): boolean {
  const trimmed = innerHtml.trim()
  if (!trimmed) return false

  // Check for <strong>...</strong> or <b>...</b> wrapping the entire content
  const strongMatch = trimmed.match(/^<strong[^>]*>([\s\S]*)<\/strong>$/i)
  const bMatch = trimmed.match(/^<b[^>]*>([\s\S]*)<\/b>$/i)

  if (strongMatch || bMatch) {
    return true
  }

  // Check if ALL text content is within <strong> or <b> tags
  // Remove all <strong>...</strong> and <b>...</b> content
  const withoutBold = trimmed
    .replace(/<strong[^>]*>[\s\S]*?<\/strong>/gi, "")
    .replace(/<b[^>]*>[\s\S]*?<\/b>/gi, "")

  // If only whitespace or empty remains, all text was bold
  const remainingText = stripHtml(withoutBold)
  return remainingText.length === 0
}

/**
 * Check if text is entirely uppercase (with at least 3 alphabetic characters).
 */
function isUppercaseText(text: string): boolean {
  if (!text || text.length < 3) return false
  const alphaChars = text.replace(/[^a-zA-Z]/g, "")
  if (alphaChars.length < 3) return false
  return text === text.toUpperCase()
}

/**
 * Check if cleaned text matches an academic keyword.
 */
function matchesAcademicKeyword(text: string): boolean {
  const cleaned = cleanForKeywordMatch(text)
  return ACADEMIC_KEYWORDS.includes(cleaned)
}

/**
 * Clean text for academic keyword matching:
 * - Lowercase
 * - Remove numbering prefixes (1., A., I., etc.)
 * - Remove BAB prefixes
 * - Trim whitespace
 */
function cleanForKeywordMatch(text: string): string {
  let cleaned = text.trim().toLowerCase()
  // Remove BAB prefix (e.g., "BAB I", "BAB 1", "BAB IV")
  cleaned = cleaned.replace(/^bab\s+(?:[0-9]+|[ivxldcm]+)\b\.?\s*/i, "")
  // Remove numbering/lettering prefixes (e.g., "1.", "A.", "1.1.", "I.")
  cleaned = cleaned.replace(/^(?:(?:[0-9]+|[a-z]|[ivxldcm]+)\b\.?\s*)+/i, "")
  return cleaned.trim()
}

/**
 * Check if text matches figure or table caption formats.
 */
function isCaption(text: string): boolean {
  const cleaned = text.trim().toLowerCase()
  return /^(?:gambar|tabel|figure|table|fig\.|tab\.)\s+[0-9]+/i.test(cleaned)
}

/**
 * Check if text starts with hierarchical section numbering (e.g., "1. ", "3.1 ", "BAB I").
 */
function hasSectionNumbering(text: string): boolean {
  const cleaned = text.trim()
  return /^(?:bab\s+(?:[0-9]+|[ivxldcm]+)\b|^(?:[0-9]+\.)+[0-9]*\b|^(?:[0-9]|[a-z]|[ivxldcm]+)\b\.)/i.test(cleaned)
}

/**
 * Assigns hierarchical level based on standard numbering conventions.
 */
function resolveHeadingLevel(text: string, matchedLevel: number): number {
  const cleaned = text.trim()
  
  // If it starts with subsection numbering like "1.1", "1.1.1", "3.2.1"
  const dotsMatch = cleaned.match(/^([0-9]+(?:\.[0-9]+)+)\b/)
  if (dotsMatch) {
    const dotsCount = (dotsMatch[1].match(/\./g) || []).length
    return Math.min(6, dotsCount + 1)
  }
  
  // If it starts with main section numbering like "1. ", "I. " or "BAB I"
  if (/^(?:bab\s+(?:[0-9]+|[ivxldcm]+)\b|^[0-9]+\.\s|^[ivxldcm]+\.\s)/i.test(cleaned)) {
    return 1
  }
  
  return matchedLevel
}

// ─── Layer 1: Native Heading Tags ───────────────────────────────────────────

/**
 * Extract headings from native h1-h6 HTML tags.
 */
function extractNativeHeadings(html: string, rejectedHeadings?: RejectedHeading[]): Heading[] {
  const headings: Heading[] = []
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi
  let match: RegExpExecArray | null
  let index = 0

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10)
    const text = stripHtml(match[2]).trim()
    if (text) {
      if (isCaption(text)) {
        rejectedHeadings?.push({ text, reason: "Native heading terdeteksi sebagai caption gambar/tabel." })
        continue
      }
      
      const levelResolved = resolveHeadingLevel(text, level)
      
      headings.push({
        level: levelResolved,
        text,
        index,
        charIndex: match.index,
        detectionMethod: "native",
        confidence: 1.0,
      })
      index++
    }
  }

  return headings
}

// ─── Layer 2-4: Paragraph-based Heading Detection ───────────────────────────

interface ParagraphBlock {
  fullMatch: string
  innerHtml: string
  text: string
  charIndex: number
  wordCount: number
}

/**
 * Parse all <p> blocks from HTML into structured ParagraphBlock objects.
 */
function parseParagraphBlocks(html: string): ParagraphBlock[] {
  const blocks: ParagraphBlock[] = []
  const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gi
  let match: RegExpExecArray | null

  while ((match = paragraphRegex.exec(html)) !== null) {
    const innerHtml = match[1]
    const text = stripHtml(innerHtml)
    if (text) {
      blocks.push({
        fullMatch: match[0],
        innerHtml,
        text,
        charIndex: match.index,
        wordCount: countWords(text),
      })
    }
  }

  return blocks
}

/**
 * Detect headings from paragraph blocks using Layers 2-4.
 * Returns headings that are NOT at positions already claimed by native headings.
 */
function detectParagraphHeadings(
  blocks: ParagraphBlock[],
  nativeHeadingPositions: Set<number>,
  rejectedHeadings?: RejectedHeading[]
): Heading[] {
  const headings: Heading[] = []
  const maxHeadingLength = 80
  const maxHeadingWords = 10

  for (const block of blocks) {
    const text = block.text.trim()

    // Skip if this position overlaps with a native heading
    if (nativeHeadingPositions.has(block.charIndex)) continue

    // Filter 1: Skip long paragraphs — these are body text, not headings
    if (text.length > maxHeadingLength || block.wordCount > maxHeadingWords) {
      continue
    }

    // Filter 2: Skip figure/table captions
    if (isCaption(text)) {
      rejectedHeadings?.push({ text, reason: "Terditeksi sebagai caption gambar/tabel (dimulai dengan kata kunci caption seperti Gambar/Table)." })
      continue
    }

    const isKeyword = matchesAcademicKeyword(text)
    const isNumbered = hasSectionNumbering(text)
    const isCaps = isUppercaseText(text)
    const isBold = isEntirelyBold(block.innerHtml)

    // Filter 3: Reject single-word all-caps or blacklisted FSM state labels
    const words = text.split(/\s+/)
    const isSingleWord = words.length === 1
    const cleanedWord = cleanForKeywordMatch(text)

    if (isSingleWord && !isKeyword) {
      if (isCaps) {
        rejectedHeadings?.push({ text, reason: "Satu kata ditulis kapital penuh (diidentifikasi sebagai label diagram/state FSM seperti IDLE/WAITING)." })
        continue
      }
      if (DIAGRAM_BLACKLIST.has(cleanedWord)) {
        rejectedHeadings?.push({ text, reason: "Satu kata terdaftar dalam blacklist label diagram/FSM." })
        continue
      }
    }

    // Filter 4: Blacklist match for multi-word labels
    if (!isKeyword && !isNumbered && DIAGRAM_BLACKLIST.has(cleanedWord)) {
      rejectedHeadings?.push({ text, reason: "Label diagram/FSM terdaftar dalam blacklist." })
      continue
    }

    // Confidence scoring
    let confidence = 0.5
    let detectionMethod: HeadingDetectionMethod | null = null

    if (isKeyword) {
      confidence += 0.45
      detectionMethod = "keyword"
    }

    if (isNumbered) {
      confidence += 0.45
      if (!detectionMethod) detectionMethod = "heuristic"
    }

    if (isBold) {
      confidence += 0.15
      if (!detectionMethod) detectionMethod = "bold"
    }

    if (isCaps) {
      confidence += 0.10
      if (!detectionMethod) detectionMethod = "uppercase"
    }

    // Reject low confidence candidates
    if (confidence < 0.70 && !isKeyword && !isNumbered) {
      rejectedHeadings?.push({ text, reason: `Skor keyakinan heading terlalu rendah (${confidence.toFixed(2)}/0.70).` })
      continue
    }

    // Resolve heading level
    let level = 2
    if (isKeyword) {
      const cleaned = cleanForKeywordMatch(text)
      if (
        cleaned === "abstrak" ||
        cleaned === "abstract" ||
        cleaned === "pendahuluan" ||
        cleaned === "introduction" ||
        cleaned === "kesimpulan" ||
        cleaned === "conclusion" ||
        cleaned === "conclusions" ||
        cleaned === "daftar pustaka" ||
        cleaned === "references" ||
        cleaned === "bibliography"
      ) {
        level = 1
      }
    }
    level = resolveHeadingLevel(text, level)

    headings.push({
      level,
      text,
      index: 0, // Will be re-indexed after merging
      charIndex: block.charIndex,
      detectionMethod: detectionMethod || "heuristic",
      confidence: Math.min(1.0, confidence),
    })
  }

  return headings
}

// ─── Main Extraction Functions ──────────────────────────────────────────────

/**
 * Extract all headings from HTML content using multi-layer detection.
 *
 * Layer 1: Native h1-h6 tags
 * Layer 2: Bold-only short paragraphs
 * Layer 3: Uppercase short paragraphs
 * Layer 4: Academic keyword matching
 */
export function extractHeadings(html: string, rejectedHeadings?: RejectedHeading[]): Heading[] {
  // Layer 1: Native heading tags
  const nativeHeadings = extractNativeHeadings(html, rejectedHeadings)

  // Build position set to avoid duplicates
  const nativePositions = new Set(nativeHeadings.map((h) => h.charIndex ?? 0))

  // Parse all paragraph blocks
  const paragraphBlocks = parseParagraphBlocks(html)

  // Layers 2-4: Paragraph-based heading detection
  const paragraphHeadings = detectParagraphHeadings(paragraphBlocks, nativePositions, rejectedHeadings)

  // Merge and sort chronologically by character position
  const allHeadings = [...nativeHeadings, ...paragraphHeadings]
  allHeadings.sort((a, b) => (a.charIndex ?? 0) - (b.charIndex ?? 0))

  // Re-index sequentially
  allHeadings.forEach((h, i) => {
    h.index = i
  })

  return allHeadings
}

/**
 * Extract all paragraphs from HTML content.
 * Filters out empty paragraphs and paragraphs that were detected as headings.
 */
export function extractParagraphs(html: string, headings?: Heading[]): Paragraph[] {
  const paragraphs: Paragraph[] = []
  const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gi
  let match: RegExpExecArray | null
  let index = 0

  // Build set of heading charIndex positions to exclude
  const headingPositions = new Set(
    (headings ?? []).map((h) => h.charIndex ?? -1)
  )

  while ((match = paragraphRegex.exec(html)) !== null) {
    // Skip if this paragraph was detected as a heading
    if (headingPositions.has(match.index)) continue

    const text = stripHtml(match[1])
    if (text) {
      paragraphs.push({
        text,
        index,
        wordCount: countWords(text),
        charIndex: match.index,
      })
      index++
    }
  }

  return paragraphs
}

/**
 * Build sections from HTML by splitting content at detected heading positions.
 * Each section contains the heading text and all content until the next heading.
 */
export function buildSections(html: string, headings?: Heading[]): Section[] {
  const detectedHeadings = headings ?? extractHeadings(html)

  if (detectedHeadings.length === 0) {
    return []
  }

  const sections: Section[] = []

  for (let i = 0; i < detectedHeadings.length; i++) {
    const currentHeading = detectedHeadings[i]
    const nextHeading = detectedHeadings[i + 1]

    const startPos = currentHeading.charIndex ?? 0
    const endPos = nextHeading ? (nextHeading.charIndex ?? html.length) : html.length

    // Extract the HTML slice between this heading and the next
    const sectionHtml = html.slice(startPos, endPos)

    // Remove the heading element itself from the content
    let contentHtml: string
    if (currentHeading.detectionMethod === "native") {
      // Remove native heading tag
      contentHtml = sectionHtml.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/i, "")
    } else {
      // Remove the first <p> tag (which is the heading paragraph)
      contentHtml = sectionHtml.replace(/<p[^>]*>.*?<\/p>/i, "")
    }

    const content = stripHtml(contentHtml)

    // Count paragraphs in this section's content
    const paragraphMatches = contentHtml.match(/<p[^>]*>.*?<\/p>/gi)
    const paragraphCount = paragraphMatches
      ? paragraphMatches.filter((p) => stripHtml(p).length > 0).length
      : 0

    sections.push({
      heading: currentHeading.text,
      level: currentHeading.level,
      content,
      wordCount: countWords(content),
      paragraphCount,
    })
  }

  return sections
}

/**
 * Extract the document title from parsed content.
 *
 * Implements a weighted title scoring system based on position, styling, and numbering exclusions.
 */
export function extractTitle(headings: Heading[], paragraphs?: Paragraph[], html?: string): string {
  if (html) {
    const candidates: { text: string; score: number }[] = []
    
    // Find the position of the Abstract/Abstrak block to use as boundary
    const abstractMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>|<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)
    let abstractIndex = Infinity
    if (abstractMatch) {
      for (let i = 0; i < abstractMatch.length; i++) {
        const text = stripHtml(abstractMatch[i]).trim().toLowerCase()
        if (text === "abstrak" || text === "abstract") {
          abstractIndex = i
          break
        }
      }
    }

    // Parse all blocks in the document (limit to first 25 blocks)
    const blockRegex = /<(p|h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi
    let match: RegExpExecArray | null
    let blockIndex = 0

    while ((match = blockRegex.exec(html)) !== null && blockIndex < 25) {
      const tag = match[1]
      const innerHtml = match[2]
      const text = stripHtml(innerHtml).trim()
      
      if (text) {
        let score = 0
        const wordCount = countWords(text)
        const charCount = text.length

        // Word count criteria
        if (wordCount >= 5 && wordCount <= 25) {
          score += 20
        } else if (wordCount < 4 || wordCount > 35) {
          score -= 15
        }

        // Length criteria
        if (charCount >= 20 && charCount <= 220) {
          score += 15
        } else if (charCount < 10 || charCount > 280) {
          score -= 20
        }

        // Bold & centered styling
        const isBold = isEntirelyBold(innerHtml) || tag.startsWith("h")
        const isCentered = innerHtml.includes("text-align: center") || match[0].includes("align=\"center\"") || innerHtml.includes("align:center")
        
        if (isBold) score += 25
        if (isCentered) score += 15

        // Position criteria
        if (blockIndex === 0) score += 35
        else if (blockIndex === 1) score += 30
        else if (blockIndex === 2) score += 25
        else if (blockIndex === 3) score += 20
        else if (blockIndex === 4) score += 15
        else if (blockIndex === 5) score += 10
        else if (blockIndex > 12) score -= 30

        // Relation to abstract position
        if (blockIndex < abstractIndex) {
          score += 40
        } else {
          score -= 60
        }

        // Negative check: starts with numbering (like 3.1)
        if (hasSectionNumbering(text)) {
          score -= 100
        }

        // Negative check: matches academic keywords
        if (matchesAcademicKeyword(text)) {
          score -= 100
        }

        // Negative check: email and affiliations
        const hasEmail = text.includes("@") || text.toLowerCase().includes("email:")
        const hasAffiliation = /universitas|institut|politeknik|fakultas|jurusan|program studi|dept\.|department|dosen|mahasiswa/i.test(text)
        if (hasEmail) score -= 50
        if (hasAffiliation) score -= 45

        // Negative check: too short or all uppercase single words
        if (wordCount <= 1 || text.toUpperCase() === text) {
          if (!isBold && wordCount <= 2) {
            score -= 40
          }
        }

        candidates.push({ text, score })
      }
      blockIndex++
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score)
      console.log("[Title Detection Debug] Top Title Candidates:", candidates.slice(0, 5))
      
      if (candidates[0].score > 0) {
        return candidates[0].text
      }
    }
  }

  // Fallback to legacy priorities if html is not provided or if all candidate scores are negative
  const nativeH1 = headings.find(
    (h) => h.level === 1 && h.detectionMethod === "native"
  )
  if (nativeH1) return nativeH1.text

  const anyH1 = headings.find((h) => h.level === 1)
  if (anyH1) {
    const cleaned = cleanForKeywordMatch(anyH1.text)
    const isStandardSection = ACADEMIC_KEYWORDS.includes(cleaned)
    if (!isStandardSection) return anyH1.text
  }

  const titleCandidate = headings.find((h) => {
    const cleaned = cleanForKeywordMatch(h.text)
    return !ACADEMIC_KEYWORDS.includes(cleaned)
  })
  if (titleCandidate) return titleCandidate.text

  if (paragraphs && paragraphs.length > 0) {
    const firstHeadingPos = headings.length > 0 ? (headings[0].charIndex ?? Infinity) : Infinity
    const titleParagraph = paragraphs.find((p) => {
      if ((p.charIndex ?? 0) >= firstHeadingPos) return false
      if (p.text.length < 5 || p.text.length > 200) return false
      if (p.wordCount < 2 || p.wordCount > 25) return false
      const cleaned = cleanForKeywordMatch(p.text)
      return !ACADEMIC_KEYWORDS.includes(cleaned)
    })
    if (titleParagraph) return titleParagraph.text
  }

  if (headings.length > 0) return headings[0].text
  if (paragraphs && paragraphs.length > 0) {
    const first = paragraphs[0]
    if (first.text.length <= 200) return first.text
    return first.text.slice(0, 197) + "..."
  }

  return "Untitled Document"
}

/**
 * Compute document statistics from extracted data.
 */
export function computeStatistics(
  rawText: string,
  paragraphs: Paragraph[],
  sections: Section[],
  headings: Heading[]
): DocumentStatistics {
  return {
    wordCount: countWords(rawText),
    paragraphCount: paragraphs.length,
    sectionCount: sections.length,
    headingCount: headings.length,
    characterCount: rawText.length,
  }
}
