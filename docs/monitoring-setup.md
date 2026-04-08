# Biswaas Monitoring Setup

## Overview

This document covers setting up error tracking (Sentry), uptime monitoring, and performance alerting for the Biswaas SvelteKit application.

## 1. Sentry Error Tracking

### Installation

```bash
npm install @sentry/sveltekit
```

### SvelteKit Configuration

**`src/hooks.client.ts`**

```typescript
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0', // Replace with your DSN
  environment: import.meta.env.MODE, // 'development' | 'production'
  tracesSampleRate: 1.0, // Capture 100% of transactions in dev, reduce in prod
  replaysSessionSampleRate: 0.1, // Record 10% of sessions
  replaysOnErrorSampleRate: 1.0, // Always record sessions with errors
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
  ],
});
```

**`src/hooks.server.ts`**

```typescript
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0', // Replace with your DSN
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});

export const handleError = Sentry.handleErrorWithSentry();
```

**`vite.config.ts`**

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: 'biswaas',
        project: 'biswaas-web',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
    sveltekit(),
  ],
});
```

### Environment Variables

Add to `.env` (do NOT commit):

```
SENTRY_DSN=https://your-key@o0.ingest.sentry.io/your-project-id
SENTRY_AUTH_TOKEN=sntrys_your-auth-token
SENTRY_ORG=biswaas
SENTRY_PROJECT=biswaas-web
```

Add to Vercel environment variables:

```bash
vercel env add SENTRY_DSN
vercel env add SENTRY_AUTH_TOKEN
```

### Custom Error Context

```typescript
// Tag errors with business context
Sentry.setTag('business_id', businessId);
Sentry.setUser({ id: userId, email: userEmail });

// Capture specific events
Sentry.captureMessage('Review submission failed', {
  level: 'warning',
  extra: { businessId, reviewId },
});
```

### Sentry Alerts

Configure in Sentry dashboard (Settings > Alerts):

| Alert                    | Condition                        | Action            |
| ------------------------ | -------------------------------- | ----------------- |
| High error rate          | >10 events/min for 5 min        | Slack + Email     |
| New issue                | First occurrence of new error    | Slack             |
| Review submission errors | Tag `transaction:review_submit`  | PagerDuty + Email |
| Slow page load           | p95 LCP > 4s for 15 min         | Slack             |

## 2. Uptime Monitoring

### Option A: Vercel Speed Insights (Built-in)

Already available on Vercel deployments:

```bash
npm install @vercel/speed-insights
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { SpeedInsights } from '@vercel/speed-insights/sveltekit';
</script>

<SpeedInsights />
```

### Option B: External Uptime Monitor

Use any HTTP monitoring service (e.g., Better Stack, Pingdom, UptimeRobot).

**Health check endpoint** — create `src/routes/api/health/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev',
  });
};
```

**Monitor configuration:**

| Check              | URL                              | Interval | Alert after |
| ------------------ | -------------------------------- | -------- | ----------- |
| Homepage           | `https://biswaas.com`            | 60s      | 2 failures  |
| API Health         | `https://biswaas.com/api/health` | 30s      | 1 failure   |
| Dashboard          | `https://biswaas.com/dashboard`  | 120s     | 3 failures  |

## 3. Performance Alerting

### Core Web Vitals Thresholds

| Metric | Good    | Needs Work | Poor   |
| ------ | ------- | ---------- | ------ |
| LCP    | < 2.5s  | < 4.0s     | > 4.0s |
| FID    | < 100ms | < 300ms    | > 300ms|
| CLS    | < 0.1   | < 0.25     | > 0.25 |
| TTFB   | < 800ms | < 1.8s     | > 1.8s |

### Vercel Web Analytics

```bash
npm install @vercel/analytics
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { Analytics } from '@vercel/analytics/sveltekit';
</script>

<Analytics />
```

### Custom Performance Tracking

```typescript
// Track review form submission time
const start = performance.now();
await submitReview(data);
const duration = performance.now() - start;

Sentry.metrics.distribution('review_submit_duration', duration, {
  unit: 'millisecond',
  tags: { business_type: 'restaurant' },
});
```

## 4. Logging

### Structured Logging

```typescript
// src/lib/server/logger.ts
export function log(level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
  console[level](JSON.stringify(entry));
}
```

### Log Drain (Vercel)

Configure in Vercel dashboard: Settings > Log Drains

Supported destinations:

- **Better Stack** (Logtail) — recommended for structured log search
- **Datadog** — if already using their APM stack
- **Axiom** — cost-effective log storage with Vercel integration

## 5. Status Page

Consider setting up a public status page at `status.biswaas.com`:

- **Better Stack** — includes uptime monitors + incidents
- **Instatus** — simple, affordable status pages
- **Vercel Status** — built-in deployment status

## Quick Start Checklist

- [ ] Create Sentry project at https://sentry.io
- [ ] Add `SENTRY_DSN` and `SENTRY_AUTH_TOKEN` to Vercel env vars
- [ ] Install `@sentry/sveltekit` and configure hooks
- [ ] Add `@vercel/analytics` and `@vercel/speed-insights`
- [ ] Create `/api/health` endpoint
- [ ] Set up uptime monitor (Better Stack or UptimeRobot)
- [ ] Configure Sentry alert rules
- [ ] Set up log drain in Vercel dashboard
- [ ] Test error capture: `throw new Error('Sentry test')`
