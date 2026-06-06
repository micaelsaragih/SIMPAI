# SIMPAI Master Production Deployment Checklist

This master checklist compiles all necessary verification steps to declare SIMPAI ready for production launch.

## 1. Environment & Config Variables

- [ ] Create `.env` (or `.env.local`) based on [.env.example](file:///c:/penulisan-ilmiah/.env.example).
- [ ] Configure `NEXT_PUBLIC_SUPABASE_URL` with production endpoint.
- [ ] Configure `NEXT_PUBLIC_SUPABASE_ANON_KEY` with production key.
- [ ] Configure `NEXT_PUBLIC_SITE_URL` matching target deployment domain (e.g. `https://simpai.vercel.app`).
- [ ] Populate `OPENROUTER_API_KEY` for AI orchestrator.
- [ ] Optionally set fallback provider keys (`DEEPSEEK_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`).
- [ ] Run the runtime environment check `validateEnv()` in layout on startup.

## 2. Supabase Settings & RLS Check

- [ ] Confirm Row Level Security (RLS) is active on `profiles`.
- [ ] Confirm RLS is active on `user_settings`.
- [ ] Confirm RLS is active on `templates`.
- [ ] Verify triggers (`handle_new_user`, `handle_updated_at`) are successfully compiled in the production database.
- [ ] Whitelist `https://[your-app-domain]/auth/callback` in Supabase Auth Redirect URLs.

## 3. Next.js & Asset Optimization

- [ ] Verify `poweredByHeader` is set to `false` in `next.config.ts`.
- [ ] Verify Content Security Policy (CSP) and HSTS headers are active.
- [ ] Confirm `next/image` is matching remote patterns configuration.
- [ ] Confirm fonts are loaded locally using `next/font/google` and styled as CSS variables.

## 4. Custom Error Handling

- [ ] Verify global error boundary `src/app/error.tsx` renders fallback layout with retry and dashboard navigation links.
- [ ] Verify custom 404 page `src/app/not-found.tsx` displays academic theme warning.
- [ ] Verify skeleton loading indicator `src/app/(protected)/loading.tsx` resolves on slow connections.

## 5. Security & Rate Limiting

- [ ] Verify rate limiting is bound at `/api/analysis` route utilizing `src/lib/rate-limiter.ts`.
- [ ] Ensure API calls to AI providers are routed entirely on the server side to protect private key headers.

## 6. SEO & PWA Discovery

- [ ] Verify `robots.ts` allows indexation of public landing and blocks dashboard directories.
- [ ] Verify `sitemap.ts` dynamic output matches canonical URL.
- [ ] Verify web application manifest (`manifest.ts`) contains app icons and brand colors.
- [ ] Verify dynamic OpenGraph image `opengraph-image.tsx` loads.

## 7. Verification Steps

- [ ] Build verification: Run `npm run build` locally and ensure it reports `Compiled successfully`.
- [ ] Syntax check: Run `npm run lint` and verify there are no blocking errors.
- [ ] Test auth flow: Log in, verify redirection callback logic, edit profile, and log out.
