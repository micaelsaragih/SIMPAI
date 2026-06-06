/**
 * PUEBI Checker — Layer 2: PUEBI spelling & grammar rules.
 * Applies regex-based checks for capitalization, punctuation, abbreviation, and prefix usage.
 */

import type { ParsedDocument } from "@/types/analysis";
import type { PUEBICheckResult, PUEBIIssue, LanguageSeverity, PUEBIIssueType } from "../types";
import { MAX_ISSUES_PER_CATEGORY, ISSUE_ID_PREFIX, EXCLUDED_SECTIONS_FROM_LANGUAGE_CHECK } from "../constants";
import puebiRulesRaw from "../datasets/puebi-rules.json";

// Cast raw dataset
const PUEBI_RULES = puebiRulesRaw as Array<{
  id: string;
  name: string;
  description: string;
  pattern: string;
  flags: string;
  replacement: string;
  severity: string;
  issueType: string;
}>;

/**
 * Checks a ParsedDocument for PUEBI compliance.
 */
export function checkPUEBI(document: ParsedDocument): PUEBICheckResult {
  const issues: PUEBIIssue[] = [];
  let violationCount = 0;
  let totalRulesChecked = 0;
  let issueCounter = 1;

  // Compile regexes once
  const compiledRules = PUEBI_RULES.map((rule) => {
    try {
      return {
        ...rule,
        regex: new RegExp(rule.pattern, rule.flags),
      };
    } catch (e) {
      console.error(`Failed to compile regex for rule ${rule.id}:`, e);
      return null;
    }
  }).filter((r): r is NonNullable<typeof r> => r !== null);

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

        for (const rule of compiledRules) {
          totalRulesChecked++;
          rule.regex.lastIndex = 0;

          let match;
          while ((match = rule.regex.exec(sentence)) !== null) {
            violationCount++;

            if (issues.length < MAX_ISSUES_PER_CATEGORY) {
              const originalText = match[0];
              let suggestedReplacement: string | null = null;

              if (rule.id === "PUEBI-001") {
                suggestedReplacement = originalText.toUpperCase();
              } else if (rule.replacement) {
                suggestedReplacement = originalText.replace(rule.regex, rule.replacement);
              }

              const issueId = `${ISSUE_ID_PREFIX.puebi}-${String(issueCounter++).padStart(3, "0")}`;
              const suggestionText = suggestedReplacement 
                ? `Ganti dengan "${suggestedReplacement}".`
                : rule.description;

              issues.push({
                id: issueId,
                category: "puebi",
                severity: rule.severity as LanguageSeverity,
                issueType: rule.issueType as PUEBIIssueType,
                ruleId: rule.id,
                ruleDescription: rule.description,
                message: `Pelanggaran aturan ${rule.name}: "${originalText}".`,
                suggestion: suggestionText,
                originalText,
                suggestedReplacement,
                location: {
                  sectionHeading: section.heading,
                  sectionIndex: sIdx,
                  paragraphIndex: pIdx,
                  sentenceIndex: senIdx,
                },
              });
            }

            // Prevent infinite loop for zero-width matches
            if (match.index === rule.regex.lastIndex) {
              rule.regex.lastIndex++;
            }
          }
        }
      }
    }
  }

  const complianceRate = totalRulesChecked > 0 
    ? Math.max(0, 1 - violationCount / totalRulesChecked)
    : 1.0;

  return {
    issues,
    rulesChecked: totalRulesChecked,
    violationCount,
    complianceRate,
  };
}
