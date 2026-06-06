# SIMPAI Security Architecture & Vulnerability Review

This document outlines the security controls, validation processes, and risk mitigations implemented for SIMPAI to prepare it for production.

## 1. Authentication & Session Management

* **Provider**: Supabase Auth (OAuth 2.0 / JWT)
* **Session Transport**: Enforced via secure server-side cookies managed by `@supabase/ssr`.
* **Token Verification**: Tokens are parsed and verified on the server for every request to protected routes.
* **Flows**: Email/Password login, registration with email verification, forgot password, and dynamic auth callback redirection (`/auth/callback`).

## 2. Row Level Security (RLS) & Database Access Control

To protect academic profiles and settings, Row Level Security is strictly enforced at the PostgreSQL database level.

* **Profiles Table (`profiles`)**:
  * `SELECT`: Enabled only for authenticated users requesting their own `id`.
  * `UPDATE`: Restrained to user matching the `id` field.
  * `INSERT`: Triggers automatically run with `SECURITY DEFINER` to safely insert profiles during registration without client-side permission.
* **User Settings Table (`user_settings`)**:
  * RLS policies ensure users can only query or update their own settings.

## 3. Route & API Protection

* **Client/Layout Level**: Protected pages are wrapped in server-side layouts checking for active sessions. Unauthenticated traffic is redirected to `/login`.
* **Middleware**: `src/services/supabase/middleware.ts` intercepts incoming requests, verifies JWT token validity, refreshes sessions automatically, and enforces boundary route protection.
* **API Rate Limiting**: API routes (e.g. `/api/analysis`) incorporate the memory rate limiter in `src/lib/rate-limiter.ts`. This protects the system from Denial of Service (DoS) and API abuse by limiting users to **10 analysis requests per minute**.

## 4. HTTP Security Headers (`next.config.ts`)

SIMPAI sends the following headers with all HTTP responses to enforce transport and client-side sandbox boundaries:

```typescript
{
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://*.supabase.co https://*.googleusercontent.com; connect-src 'self' https://*.supabase.co https://openrouter.ai;"
}
```

* **X-Frame-Options**: Prevents clickjacking attacks.
* **X-Content-Type-Options**: Blocks MIME sniffing.
* **HSTS**: Forces SSL in production.
* **CSP**: restrains resources to verified domains, protecting against cross-site scripting (XSS).

## 5. Input Validation & Data Minimization

* **Schema Validation**: Dynamic form inputs (login, register, profiles) use `Zod` schemas to strictly validate inputs on the client and server prior to submission.
* **File Processing**: Draft and template documents are parsed completely on the server-side, reducing client-side code execution risks.
* **Log Redaction**: The logger utility automatically redacts credentials, cookie strings, passwords, and private API tokens prior to printing.
