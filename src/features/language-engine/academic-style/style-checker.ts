/**
 * Academic Style Checker — Layer 3: Academic writing style analysis.
 * Analyzes tone, redundancy, subjective language, and informal markers.
 */

import type { ParsedDocument } from "@/types/analysis";
import type { AcademicStyleResult, AcademicStyleIssue, AcademicStyleIssueType, LanguageSeverity } from "../types";
import { MAX_ISSUES_PER_CATEGORY, ISSUE_ID_PREFIX, EXCLUDED_SECTIONS_FROM_LANGUAGE_CHECK } from "../constants";
import academicPhrasesRaw from "../datasets/academic-phrases.json";
import informalMarkersRaw from "../datasets/informal-markers.json";

// Cast raw datasets
const ACADEMIC_PHRASES = academicPhrasesRaw as Array<{
  informal: string;
  academic: string;
  issueType: string;
}>;

const INFORMAL_MARKERS = informalMarkersRaw as Array<{
  pattern: string;
  flags: string;
  replacement: string;
  issueType: string;
  description: string;
}>;

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Returns severity based on style issue type.
 */
function getSeverityForType(type: AcademicStyleIssueType): LanguageSeverity {
  switch (type) {
    case "first-person":
    case "subjective-language":
    case "colloquial":
    case "non-academic-connector":
    case "informal-phrase":
      return "warning";
    case "redundant-phrase":
    case "weak-verb":
    default:
      return "suggestion";
  }
}

/**
 * Checks a ParsedDocument for academic style compliance.
 */
export function checkAcademicStyle(document: ParsedDocument): AcademicStyleResult {
  const issues: AcademicStyleIssue[] = [];
  let totalSentencesChecked = 0;
  let informalCount = 0;
  let issueCounter = 1;

  // Compile phrase regexes
  const compiledPhrases = ACADEMIC_PHRASES.map((phrase) => {
    try {
      const patternStr = `\\b${escapeRegExp(phrase.informal)}\\b`;
      return {
        ...phrase,
        regex: new RegExp(patternStr, "gi"),
      };
    } catch (e) {
      console.error(`Failed to compile phrase regex for "${phrase.informal}":`, e);
      return null;
    }
  }).filter((p): p is NonNullable<typeof p> => p !== null);

  // Compile marker regexes
  const compiledMarkers = INFORMAL_MARKERS.map((marker) => {
    try {
      return {
        ...marker,
        regex: new RegExp(marker.pattern, marker.flags),
      };
    } catch (e) {
      console.error(`Failed to compile marker regex for "${marker.pattern}":`, e);
      return null;
    }
  }).filter((m): m is NonNullable<typeof m> => m !== null);

  for (let sIdx = 0; sIdx < document.sections.length; sIdx++) {
    const section = document.sections[sIdx];
    
    // Check if section is excluded
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

        totalSentencesChecked++;
        let sentenceHasIssue = false;

        // 1. Check literal academic phrases
        for (const phrase of compiledPhrases) {
          phrase.regex.lastIndex = 0;
          let match;
          while ((match = phrase.regex.exec(sentence)) !== null) {
            sentenceHasIssue = true;

            if (issues.length < MAX_ISSUES_PER_CATEGORY) {
              const originalText = match[0];
              const issueId = `${ISSUE_ID_PREFIX.academicStyle}-${String(issueCounter++).padStart(3, "0")}`;
              const severity = getSeverityForType(phrase.issueType as AcademicStyleIssueType);

              issues.push({
                id: issueId,
                category: "academic-style",
                severity,
                issueType: phrase.issueType as AcademicStyleIssueType,
                academicAlternative: phrase.academic,
                message: `Gaya penulisan tidak baku: "${originalText}".`,
                suggestion: `Ganti dengan kalimat akademis "${phrase.academic}".`,
                originalText,
                suggestedReplacement: phrase.academic,
                location: {
                  sectionHeading: section.heading,
                  sectionIndex: sIdx,
                  paragraphIndex: pIdx,
                  sentenceIndex: senIdx,
                },
              });
            }

            // Prevent infinite loop
            if (match.index === phrase.regex.lastIndex) {
              phrase.regex.lastIndex++;
            }
          }
        }

        // 2. Check regex informal markers
        for (const marker of compiledMarkers) {
          marker.regex.lastIndex = 0;
          let match;
          while ((match = marker.regex.exec(sentence)) !== null) {
            sentenceHasIssue = true;

            if (issues.length < MAX_ISSUES_PER_CATEGORY) {
              const originalText = match[0];
              const issueId = `${ISSUE_ID_PREFIX.academicStyle}-${String(issueCounter++).padStart(3, "0")}`;
              const severity = getSeverityForType(marker.issueType as AcademicStyleIssueType);

              issues.push({
                id: issueId,
                category: "academic-style",
                severity,
                issueType: marker.issueType as AcademicStyleIssueType,
                academicAlternative: marker.replacement,
                message: `${marker.description}: "${originalText}".`,
                suggestion: marker.replacement 
                  ? `Pertimbangkan untuk menggunakan "${marker.replacement}".`
                  : `Hapus kata/ungkapan ini atau susun ulang kalimat.`,
                originalText,
                suggestedReplacement: marker.replacement || null,
                location: {
                  sectionHeading: section.heading,
                  sectionIndex: sIdx,
                  paragraphIndex: pIdx,
                  sentenceIndex: senIdx,
                },
              });
            }

            // Prevent infinite loop
            if (match.index === marker.regex.lastIndex) {
              marker.regex.lastIndex++;
            }
          }
        }

        if (sentenceHasIssue) {
          informalCount++;
        }
      }
    }
  }

  const cleanSentencesCount = totalSentencesChecked - informalCount;
  const academicScore = totalSentencesChecked > 0 
    ? Math.round((cleanSentencesCount / totalSentencesChecked) * 100) 
    : 100;

  return {
    issues,
    totalSentencesChecked,
    informalCount,
    academicScore,
  };
}
