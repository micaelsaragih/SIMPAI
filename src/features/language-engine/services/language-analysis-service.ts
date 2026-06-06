/**
 * Language Analysis Service — Orchestration service for the Indonesian Academic Language Engine.
 * Runs all analysis layers sequentially and aggregates results with scoring and summary metrics.
 */

import type { ParsedDocument } from "@/types/analysis";
import type { LanguageAnalysisResult, LanguageIssueSummary, LanguageGrade } from "../types";
import { checkKBBI } from "../kbbi/kbbi-checker";
import { checkPUEBI } from "../puebi/puebi-checker";
import { checkAcademicStyle } from "../academic-style/style-checker";
import { calculateLanguageScore } from "../scorers/language-scorer";
import { SUMMARY_MESSAGES } from "../constants";

/**
 * Maps a LanguageGrade to a predefined summary message.
 */
function getSummaryMessage(grade: LanguageGrade): string {
  switch (grade) {
    case "Excellent":
      return SUMMARY_MESSAGES.excellent;
    case "Good":
      return SUMMARY_MESSAGES.good;
    case "Fair":
      return SUMMARY_MESSAGES.fair;
    case "Needs Improvement":
      return SUMMARY_MESSAGES.needsImprovement;
    default:
      return "Analisis bahasa selesai.";
  }
}

/**
 * Runs the complete Indonesian Academic Language Analysis Engine on a document.
 */
export function analyzeLanguage(document: ParsedDocument): LanguageAnalysisResult {
  // Run all three checkers
  const kbbiResult = checkKBBI(document);
  const puebiResult = checkPUEBI(document);
  const styleResult = checkAcademicStyle(document);

  // Compute composite score and grade
  const scoreResult = calculateLanguageScore(kbbiResult, puebiResult, styleResult);

  // Collect all issues for metadata aggregation
  const allIssues = [
    ...kbbiResult.issues,
    ...puebiResult.issues,
    ...styleResult.issues,
  ];

  // Aggregate issues by severity
  const bySeverity = {
    error: 0,
    warning: 0,
    info: 0,
    suggestion: 0,
  };
  for (const issue of allIssues) {
    bySeverity[issue.severity]++;
  }

  // Aggregate issues by category
  const byCategory = {
    kbbi: kbbiResult.issues.length,
    puebi: puebiResult.issues.length,
    academicStyle: styleResult.issues.length,
  };

  // Generate dynamic highlights
  const highlights: string[] = [];
  highlights.push(`Tingkat kesesuaian aturan PUEBI sebesar ${Math.round(puebiResult.complianceRate * 100)}%.`);

  if (kbbiResult.nonStandardCount > 0) {
    highlights.push(`Terdeteksi ${kbbiResult.nonStandardCount} kata tidak baku atau bahasa percakapan.`);
  } else {
    highlights.push("Seluruh kosa kata yang dianalisis sesuai dengan standar KBBI.");
  }

  if (styleResult.informalCount > 0) {
    highlights.push(`Ditemukan ${styleResult.informalCount} kalimat yang mengandung gaya bahasa kurang formal.`);
  } else {
    highlights.push("Gaya bahasa penulisan sepenuhnya formal dan bernada akademik.");
  }

  if (allIssues.length > 0) {
    // Find section with the most issues
    const sectionCounts: Record<string, number> = {};
    for (const issue of allIssues) {
      const heading = issue.location.sectionHeading || "Tanpa Bagian";
      sectionCounts[heading] = (sectionCounts[heading] || 0) + 1;
    }
    let maxSection = "";
    let maxCount = 0;
    for (const [section, count] of Object.entries(sectionCounts)) {
      if (count > maxCount) {
        maxSection = section;
        maxCount = count;
      }
    }
    if (maxSection) {
      highlights.push(`Bagian "${maxSection}" memiliki catatan kebahasaan terbanyak (${maxCount} temuan).`);
    }
  }

  const summaryText = getSummaryMessage(scoreResult.grade);

  const summary: LanguageIssueSummary = {
    totalIssues: allIssues.length,
    bySeverity,
    byCategory,
    summaryText,
    highlights,
  };

  return {
    kbbi: kbbiResult,
    puebi: puebiResult,
    academicStyle: styleResult,
    score: scoreResult,
    summary,
    analyzedAt: new Date().toISOString(),
  };
}
