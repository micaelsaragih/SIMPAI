# SIMPAI Production Monitoring & Observability Plan

A structured monitoring approach ensures SIMPAI is stable, performant, and reliable during thesis defenses and academic demonstrations.

## 1. Structured Application Logging (`src/lib/logger.ts`)

A custom logger has been written to log events on the server:

* **Log Format**: Consists of timestamp, log level (INFO, WARN, ERROR, DEBUG), execution context, and arbitrary serialized metadata.
* **Sensitive Redaction**: Passwords, authorization headers, cookies, and database connection strings are automatically scrubbed.
* **Format by Environment**:
  * **Development**: Readable colored strings.
  * **Production**: Compact JSON records matching Vercel/Datadog logging requirements.

## 2. API Health & Fallback Telemetry

* **AI Provider Orchestrator**:
  * Success and failure counts are tracked for each API request.
  * Failures trigger an automatic fallback: when OpenRouter or Gemini fails, the system switches to offline fallback models, registering a `WARN` log.
* **API Rate Limiter**:
  * Logs warnings when a specific IP or User ID hits 429 boundaries, suggesting potential bot attacks or API key harvesting.

## 3. Database & Authentication Monitoring

* **Supabase Connection**:
  * Database query exceptions and schema lookup errors are logged under the `DATABASE` context.
* **Auth Audits**:
  * Account creation, login events, password recovery requests, and email validations are logged to trace user lifecycle activity.

## 4. Vercel Console & Web Analytics

* **Build Failures**: Configure Vercel integration to trigger email and Slack alerts immediately if a commit fails type checking or compilation.
* **Vercel Web Analytics**:
  * Enabled in the Vercel dashboard to monitor Core Web Vitals (LCP, FID, CLS) in real-time across student and lecturer devices.
* **Vercel Speed Insights**: Tracks dynamic path latency (e.g., how long `/api/analysis` takes to respond on average).
