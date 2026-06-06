# False Heading Analysis Report: Over-Detection in DOCX Extraction

## 1. Executive Summary

A diagnostic audit of the DOCX parsing pipeline in the SIMPAI system revealed a critical over-detection issue. While structure and paragraph counts are successfully extracted, the HTML extraction engine (`html-extractor.ts`) incorrectly classifies non-academic, diagrammatic, and diagram labels as headings. In a test run of the "SmartQBank" article, the parser reported **93 headings and 93 sections** instead of the expected **8–15 headings and sections**.

This report documents the root causes, categorizes the false positives, and details the logic to filter out non-academic labels.

---

## 2. Root Cause Analysis in Heuristics

The over-detection stems from the design of Layer 2 (bold-only paragraphs) and Layer 3 (uppercase short paragraphs) in `detectParagraphHeadings`:

```typescript
// Layer 2: Bold-only short paragraph
if (!detectionMethod && isEntirelyBold(block.innerHtml)) {
  detectionMethod = "bold";
  confidence = 0.85;
}

// Layer 3: Uppercase short paragraph
if (!detectionMethod && isUppercaseText(block.text)) {
  detectionMethod = "uppercase";
  confidence = 0.80;
}
```

### The Vulnerability
Any paragraph block with length `< 80` characters and `< 10` words was accepted if it was wrapped in `<strong>`/`<b>` or written in all-caps.
For example, FSM diagram state labels such as `IDLE`, `WAITING`, `CALLED`, `ENQUEUE`, `CANCEL`, `NO_SHOW`, and `TRANSFERRED` are:
1. Written in all-caps (matches Layer 3).
2. Very short (typically 1 word).
3. Do not match any academic keywords, but had no filter to check this.

Because Mammoth translates all text including diagram labels and table cell values into `<p>` paragraphs, these visual elements were misclassified as document headings.

---

## 3. Categorization of False Positives

We audited the output and categorized the false-positive headings:

| Category | Typical Candidates | Detection Cause | Impact |
| :--- | :--- | :--- | :--- |
| **FSM States** | `IDLE`, `WAITING`, `CALLED`, `ENQUEUE`, `CANCEL` | Uppercase, single word | Creates numerous tiny sections |
| **UML / Diagram Labels** | `START`, `END`, `YES`, `NO`, `TRANSITION` | Uppercase or bold | Visual noise, bloats heading count |
| **Figure Captions** | `Gambar 2. Diagram Alir FSM`, `Fig. 1` | Bold short paragraph | Captions counted as headings |
| **Table Entries** | `No.`, `Nama`, `FSM State`, `Aksi` | Bold header cells | Table columns counted as headings |
| **Mathematical/Variables** | `x = y + 1`, `N = 100`, `FSM_STATE` | Uppercase symbols | Math expressions treated as sections |
| **Enumerations / Lists** | `a.`, `b.`, `1.`, `2.` | Bold list bullet points | List items treated as headings |

---

## 4. Proposed Solution Architecture

To eliminate false positives while preserving legitimate subsections (like `3.1 Pemodelan FSM`), we will implement a multi-stage confidence filter and a blacklist:

```
Candidate Block
   │
   ├─► Check Blacklist (idle, waiting, yes, no...) ──► Reject (reason: "blacklist")
   ├─► Check Single Word & All Caps ───────────────► Reject (reason: "single-word-all-caps")
   ├─► Check Caption Prefixes (Gambar, Table...) ───► Reject (reason: "caption")
   ├─► Check Section Numbering (1., 3.1.2, BAB) ────► Accept (reason: "has-numbering")
   ├─► Check Academic Keywords (abstrak, intro) ──► Accept (reason: "keyword")
   ▼
Confidence Scoring (Base 0.5)
   ├─► Matches Academic Keyword (+0.5)
   ├─► Has Section Numbering (+0.45)
   ├─► Multi-word Bold / Uppercase (+0.15)
   ▼
Reject if Confidence < 0.7
```

This architecture ensures FSM states and captions are excluded, while structured numbered headings are retained.
