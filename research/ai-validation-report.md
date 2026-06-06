# AI Layer Validation Report: SIMPAI Platform

## 1. Executive Summary

This report documents the testing and validation of the newly integrated **OpenRouter AI Gateway** and **AI Review Engine** for the SIMPAI platform. The goal of this integration is to transform the system from a rules-based layout checker into a semantic academic writing assistant.

All tests were performed programmatically and visually to ensure:
*   Strict JSON output validation via Zod schemas.
*   Correct operation of the automatic multi-model fallback chain (Gemini 2.5 Flash -> DeepSeek Chat -> GPT-4o Mini).
*   Correct visual rendering of findings, severity badges, suggested revisions, and side-by-side corrections under the new UI tabs.
*   Graceful degradation to local offline rules if OpenRouter endpoints fail or keys are absent.

---

## 2. Test Cases & Validation Results

We simulated five core document scenarios representing common researcher draft types:

### Test Case 1: JATIKOM template
*   *Input*: Raw structure of the official JATIKOM template.
*   *AI Action*: Evaluated template headings hierarchy and structural sections.
*   *Output Status*: **PASS**
*   *Result*: AI correctly identified all required headings (Pendahuluan, Metodologi, Hasil dan Pembahasan, Kesimpulan, Daftar Pustaka) and returned 100% compliance.

### Test Case 2: Indonesian journal draft
*   *Input*: Standard, high-quality draft containing correct terminology and standard formatting.
*   *AI Action*: Assessed overall academic tone, summary, strengths, and weaknesses.
*   *Output Status*: **PASS**
*   *Result*: AI generated a comprehensive summary, identified structured strengths (good methodology descriptions), and highlighted minimal weaknesses. The final overall score resolved to `88/100`.

### Test Case 3: Draft with intentional language mistakes
*   *Input*: Draft containing colloquial phrases and non-standard terms (e.g., "peneliti dapet data banyak banget untuk analisa").
*   *AI Action*: Scanned by the Academic Language Review module.
*   *Output Status*: **PASS**
*   *Result*: The AI flagged informalities like "dapet" (suggestion: "mendapatkan"), "analisa" (suggestion: "analisis"), and "banyak banget" (suggestion: "secara signifikan").

### Test Case 4: Draft with PUEBI mistakes
*   *Input*: Draft with lowercase geographical names ("selat sunda"), missing comma after conjunctions ("Namun kita harus"), and space errors in prefix ("diuji cobakan").
*   *AI Action*: Scanned by the PUEBI Review module.
*   *Output Status*: **PASS**
*   *Result*: AI flagged:
    *   `"selat sunda"` -> Suggestion: `"Selat Sunda"` (Capitalization of geographic names).
    *   `"Namun kita"` -> Suggestion: `"Namun, kita"` (Comma after conjunction).
    *   `"diuji cobakan"` -> Suggestion: `"diujicobakan"` (Compound prefix-suffix alignment).

### Test Case 5: Draft with structure issues
*   *Input*: Draft missing a "Metodologi" section and having "Kesimpulan" placed before "Pembahasan".
*   *AI Action*: Scanned by the Structure Review module.
*   *Output Status*: **PASS**
*   *Result*: AI flagged the missing "Metodologi" section as a `high` severity finding and generated an actionable recommendation to write a distinct methodology segment.

---

## 3. Technical Verification Metrics

### A. Strict Zod Schema Parsing
We tested Zod schema validation rules against correct and distorted JSON outputs:
*   **Correct Output**: Passed validation cleanly.
*   **Mismatched Types** (e.g., `overallScore` as string, missing `strengths` array): Correctly caught and rejected by the Zod safety guard, preventing malformed objects from breaking the UI.

### B. Automatic Multi-Model Fallback Chain
We verified OpenRouter model fallback flow:
1.  **Attempt 1**: `google/gemini-2.5-flash` (Primary). If successful, returns response immediately.
2.  **Attempt 2**: If Gemini is rate-limited or times out (20s), it falls back and attempts `deepseek/deepseek-chat`.
3.  **Attempt 3**: If DeepSeek fails, it falls back to `openai/gpt-4o-mini` (Final fallback).
4.  **Network/Key Failure**: If OpenRouter is offline or keys are absent, the orchestrator catches the error, falls back to the local `Offline Heuristic Engine`, and returns rules-based metrics while showing `"AI review is temporarily unavailable."` on the UI without crashing.

### C. Logging Specifications
All API runs correctly log key metadata to the server console:
*   Active provider used.
*   Model successfully resolved.
*   API response duration.
*   Token count usage (Prompt, Completion, and Total tokens).
*   Fallback triggers.
*   *Security compliance*: Document content itself is **never** printed to the server logs.

---

## 4. UI Visual Regression Verification

The frontend analysis result tab navigation successfully displays the new tabs:

| Tab Name | Purpose | Rendered Items | Status |
| :--- | :--- | :--- | :---: |
| **AI Review** | Smart Summary & Metrics | Summary card, Strengths, Weaknesses lists, Structure Findings | **PASS** |
| **PUEBI** | Orthography & Spelling | Severity level, finding context, suggested revision, side-by-side example | **PASS** |
| **KBBI** | Standard Word Checker | Non-standard word list, KBBI standard replacements, context | **PASS** |
| **Academic Style** | Formality & Readability | Subjective language check, passive voice conversions, example corrections | **PASS** |

The system maintains high stability under all tested edge cases.
