# Document Analysis Pipeline Audit Report

## 1. Introduction

This report documents the end-to-end audit of the document analysis pipeline in the SIMPAI system, tracing files from the moment of user upload on the frontend to structural layout rendering in the UI.

The goal of this audit is to ensure correctness, identify failure modes, and guarantee that the metadata (titles, headings, sections, and paragraphs) extracted from Indonesian academic papers matches the actual structure.

---

## 2. End-to-End Pipeline Architecture

The document analysis pipeline is composed of the following sequential stages:

```
[UI Upload Component]
       │
       ▼ (FormData: File)
[API Endpoint: POST /api/analysis/parse]
       │
       ├─► [Session Check & Validation]
       ▼
[DOCX Parser Service (docx-parser.ts)]
       │
       ├─► [Mammoth.js HTML Conversion]
       ▼
[HTML Extraction Engine (html-extractor.ts)]
       │
       ├─► [Layer 1-4 Heading Detection]
       ├─► [Paragraph Filtering]
       ├─► [Section Generation]
       ├─► [Title Extraction Heuristic]
       ▼
[UI Preview & Diagnostics (DocumentPreview.tsx)]
```

---

## 3. Step-by-Step Stage Breakdown

### Stage 1: Frontend File Upload
*   **Component**: `TemplateUploadStep.tsx` / `DraftUploadStep.tsx`
*   **Process**: The user drops or selects a `.docx` file. The frontend performs local validation (checking that the file is not empty and has a `.docx` extension).
*   **Action**: Dispatches the file buffer via an asynchronous fetch call to `/api/analysis/parse` wrapped in a `Multipart/Form-Data` request.

### Stage 2: API Route Handler
*   **Path**: `src/app/api/analysis/parse/route.ts`
*   **Authentication**: Performs a session check using Supabase `auth.getUser()`. If the user is unauthenticated, it aborts with status `401`.
*   **Validation**:
    *   File existence: Returns `400` if the payload does not contain a file.
    *   Size constraint: Checks that `file.size <= 20MB`.
    *   File type: Asserts MIME-type is `application/vnd.openxmlformats-officedocument.wordprocessingml.document` and name ends with `.docx`.
*   **Action**: Calls `parseDocx(buffer)` and returns the resulting `ParsedDocument` as JSON with a `200` OK status.

### Stage 3: DOCX Parser Service
*   **Path**: `src/services/document/docx-parser.ts`
*   **Mammoth Conversion**: Invokes `mammoth.convertToHtml({ buffer })` to produce semantic HTML.
*   **Debug Logs**: In development mode (`NODE_ENV === "development"`), prints stats of raw HTML elements (e.g., tag counts) and the first 2,000 characters to the server console.
*   **Extraction Core**: Coordinates the calls to the `html-extractor` utilities:
    1.  `extractHeadings(html)`
    2.  `extractParagraphs(html, headings)`
    3.  `buildSections(html, headings)`
    4.  `extractTitle(headings, paragraphs)`
    5.  `computeStatistics(rawText, paragraphs, sections, headings)`

### Stage 4: Extraction Engine Heuristics
*   **Path**: `src/services/document/html-extractor.ts`
*   **Multi-Layer Heading Detection**:
    *   **Layer 1 (Native)**: Scans for `<h1-6>` tags.
    *   **Layer 2 (Bold)**: Scans for `<p>` blocks wrapped entirely in `<strong>` or `<b>` with length < 80 characters.
    *   **Layer 3 (Uppercase)**: Scans for `<p>` blocks containing short (< 80 characters) all-caps text.
    *   **Layer 4 (Keywords)**: Matches cleaned paragraph text against Indonesian academic headers (e.g., `pendahuluan`, `daftar pustaka`).
*   **Paragraph Isolation**: Extracts standard paragraphs while discarding any paragraphs that were identified as headings, preventing duplicate metrics.
*   **Section Boundary Splitting**: Slices HTML content chronologically between detected heading offsets, creating discrete `Section` objects.
*   **Heuristic Title Resolution**: Selects the title from either the first non-keyword level-1 heading or the first paragraph appearing before any heading.

### Stage 5: Frontend Preview & UI Diagnostics
*   **Component**: `src/components/analysis/DocumentPreview.tsx`
*   **Rendering**: Displays summary metrics cards, a navigation tree of detected headings, and a content preview showing the first 4 sections.
*   **Diagnostics Panel**: In development mode, displays collapsible diagnostics indicating:
    *   The exact extracted title and method.
    *   Method distribution (how many headings were found via native, bold, uppercase, or keywords).
    *   First 10 headings, levels, and extraction confidence.
    *   Average heading detection confidence.

---

## 4. Pipeline Vulnerabilities & Fixes

Our audit addressed the following critical failure points:

1.  **Vulnerability**: mammoth.js outputs manually formatted academic titles and sections as `<p>` tags, which bypassed the original `<h1-6>` regex.
    *   *Fix*: Implemented paragraph-based multi-layer detection (bold, uppercase, keyword).
2.  **Vulnerability**: Text segments identified as headings were also counted as standard paragraphs, bloating paragraph statistics.
    *   *Fix*: Passed headings list to paragraph extractor to filter out heading nodes.
3.  **Vulnerability**: Title extraction fell back to "Untitled Document" because it found no headings.
    *   *Fix*: Implemented multi-stage title fallbacks checking headings, non-keyword headings, and pre-heading paragraph snippets.
