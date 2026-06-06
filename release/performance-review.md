# SIMPAI Production Performance Review

This document evaluates the runtime performance, bundle optimization, and architectural decisions made to ensure SIMPAI operates efficiently in production.

## 1. Page Weight & First Load JS Analysis

Based on the production build output from `next build`:

* **First Load JS Shared**: ~151 kB (excellent baseline)
* **Average Page Size**: 2.5 kB to 60 kB.
* **Heavy Routes**: `/analysis/new` (~136 kB) and `/templates/[id]` (~69.3 kB) contain document parsing and template editor libraries. They are safely separated from public routes so visitors to the landing page only download **17.6 kB** of Javascript.

## 2. Rendering Strategy (Server vs. Client Components)

SIMPAI adopts Next.js App Router best practices, splitting components into appropriate boundaries:

* **Server Components (Default)**: Used for data fetching, layouts, database connections (Supabase queries), and initial page layouts to maximize search engine crawlablity and minimize client bundle sizes.
* **Client Components (`"use client"`)**: Isolated strictly to interactive portions like forms (login, profile updates), upload targets, document previewers, and dashboards containing state management.

## 3. Font & Asset Optimization

* **Typography**: Integrated using `next/font/google`. The `Inter` font is preloaded, subsetted for Latin characters, and stored locally on the Vercel CDN. This completely eliminates layout shifts (CLS) and delays from fetching Google Fonts APIs.
* **Image Optimization**: Remote images (like user avatars) leverage the `next/image` component configured with explicit sizes and remote patterns to output modern, resized `WebP` files.

## 4. Analysis Engine Caching & Streamlining

* **Local Token Pruning**: The analysis orchestrator truncates user-uploaded text drafts to **15,000 characters** and templates to **10,000 characters** before making external AI API requests. This prevents payload overhead, keeps request times fast, and controls API consumption costs.
* **Rule-Based Pre-filtering**: Detached rule-based checks (like heading sequence detection and KBBI check) are computed locally in Javascript in milliseconds, minimizing load on heavy generative models.
