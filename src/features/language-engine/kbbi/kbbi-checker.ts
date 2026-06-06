/**
 * KBBI Checker — Layer 1: Word-level KBBI validation.
 * Flags non-standard words, slang, and informal words using a dictionary map.
 */

import type { ParsedDocument } from "@/types/analysis";
import type { KBBICheckResult, KBBIIssue, KBBIIssueType, LanguageSeverity } from "../types";
import { WORD_TOKENIZER_PATTERN, MAX_ISSUES_PER_CATEGORY, ISSUE_ID_PREFIX, EXCLUDED_SECTIONS_FROM_LANGUAGE_CHECK } from "../constants";
import nonStandardWordsRaw from "../datasets/non-standard-words.json";

// Cast raw dataset
const nonStandardWords = nonStandardWordsRaw as Array<{ nonStandard: string; standard: string; category: string }>;

// Initialize O(1) lookup map
const nonStandardMap = new Map<string, { standard: string; category: KBBIIssueType }>();
for (const entry of nonStandardWords) {
  nonStandardMap.set(entry.nonStandard.toLowerCase(), {
    standard: entry.standard,
    category: entry.category as KBBIIssueType,
  });
}

/**
 * Returns severity based on KBBI issue type.
 */
function getSeverityForType(type: KBBIIssueType): LanguageSeverity {
  switch (type) {
    case "slang":
    case "non-standard-word":
      return "error";
    case "informal-word":
    case "regional-word":
      return "warning";
    default:
      return "suggestion";
  }
}

/**
 * Returns user-friendly description of the issue type.
 */
function getLabelForType(type: KBBIIssueType): string {
  switch (type) {
    case "non-standard-word":
      return "Kata tidak baku";
    case "informal-word":
      return "Kata informal/percakapan";
    case "slang":
      return "Bahasa gaul/slang";
    case "regional-word":
      return "Kata kedaerahan";
    default:
      return "Ketidaksesuaian KBBI";
  }
}

/**
 * Checks a ParsedDocument for KBBI compliance.
 */
export function checkKBBI(document: ParsedDocument): KBBICheckResult {
  const issues: KBBIIssue[] = [];
  let totalWordsChecked = 0;
  let nonStandardCount = 0;
  let issueCounter = 1;

  for (let sIdx = 0; sIdx < document.sections.length; sIdx++) {
    const section = document.sections[sIdx];
    
    // Check if section should be excluded
    const isExcluded = EXCLUDED_SECTIONS_FROM_LANGUAGE_CHECK.some(
      (ex) => section.heading.toLowerCase().includes(ex)
    );
    if (isExcluded) continue;

    // Split section content into paragraphs
    const paragraphs = section.content.split("\n").filter((p) => p.trim().length > 0);

    for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
      const paragraph = paragraphs[pIdx];
      
      // Split paragraph into sentences preserving punctuation
      const sentences = paragraph.match(/[^.!?]+[.!?]*/g) || [paragraph];

      for (let senIdx = 0; senIdx < sentences.length; senIdx++) {
        const sentence = sentences[senIdx].trim();
        if (!sentence) continue;

        // Tokenize sentence into words
        const words = sentence.match(WORD_TOKENIZER_PATTERN) || [];
        totalWordsChecked += words.length;

        for (const word of words) {
          const normalizedWord = word.toLowerCase();
          const match = nonStandardMap.get(normalizedWord);

          if (match) {
            nonStandardCount++;

            if (issues.length < MAX_ISSUES_PER_CATEGORY) {
              const issueId = `${ISSUE_ID_PREFIX.kbbi}-${String(issueCounter++).padStart(3, "0")}`;
              const label = getLabelForType(match.category);
              const severity = getSeverityForType(match.category);

              issues.push({
                id: issueId,
                category: "kbbi",
                severity,
                issueType: match.category,
                standardForm: match.standard,
                message: `${label} "${word}" terdeteksi.`,
                suggestion: `Ganti dengan kata baku "${match.standard}".`,
                originalText: word,
                suggestedReplacement: match.standard,
                location: {
                  sectionHeading: section.heading,
                  sectionIndex: sIdx,
                  paragraphIndex: pIdx,
                  sentenceIndex: senIdx,
                },
              });
            }
          }
        }
      }
    }
  }

  const standardWordRatio = totalWordsChecked > 0 
    ? Math.max(0, 1 - nonStandardCount / totalWordsChecked) 
    : 1.0;

  return {
    issues,
    totalWordsChecked,
    nonStandardCount,
    standardWordRatio,
  };
}
