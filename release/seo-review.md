# SIMPAI SEO & Discoverability Review

This document summarizes the search engine optimization and shareability configuration designed for the SIMPAI production release.

## 1. Title, Description, and Headings Hierarchy

* **Heading Rules**: Each page contains a single `<h1>` tag indicating the context, followed by structured `<h2>` and `<h3>` tags for sub-features.
* **Semantic HTML**: Structural layout uses HTML5 semantic tags (`<header>`, `<main>`, `<section>`, `<footer>`) to help Google crawlers parse sections properly.
* **Meta Description**: Descriptive summaries are injected on each page, emphasizing SIMPAI's core utility (AI scientific writing assistant, Indonesian KBBI/PUEBI grammar checkers).

## 2. Robots.txt Boundaries (`src/app/robots.ts`)

To prevent indexing private dashboard panels or exposing personal draft evaluations:

* **Allowed Crawl Directories**: `/` (landing), `/login`, `/register`, `/forgot-password`.
* **Blocked Crawl Directories**: `/dashboard`, `/profile`, `/settings`, `/analysis`, `/templates`, `/api/`, `/auth/callback`.

## 3. Dynamic XML Sitemap (`src/app/sitemap.ts`)

A dynamic sitemap is automatically generated at `/sitemap.xml` pointing to indexable routes:

* **Priority**: Landings pages are prioritized with a value of `1.0`, while auth pages are set to `0.8`.
* **Update Frequency**: Configured to `daily` for the landing page and `monthly` for auth templates.

## 4. Mobile Web Application Manifest (`src/app/manifest.ts`)

The PWA manifest configures SIMPAI as an installable standalone web application:
* **Background/Theme Color**: Emerald green theme (#10b981) to integrate seamlessly with Android/iOS browser headers.
* **Display Mode**: Standalone to hide mobile address bars.

## 5. Rich Share Previews (OpenGraph & Twitter Cards)

To encourage citation and sharing in academic journals or university forums:
* **Standard Tags**: Configured OpenGraph title, locale (`id_ID`), description, and target canonical URL.
* **OpenGraph Image**: Dynamically generated image at `/opengraph-image` utilizing Next.js `ImageResponse`. It renders high-resolution branding, tagline, and features in emerald green directly when the link is shared on WhatsApp, Telegram, Twitter, or Slack.
