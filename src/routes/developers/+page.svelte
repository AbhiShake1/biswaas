<script lang="ts">
  import { Code, Key, Clock, FileJson } from '@lucide/svelte';

  const endpoints = [
    { method: 'GET', path: '/api/v1/businesses', description: 'List all businesses. Supports pagination, filtering by category, and search.' },
    { method: 'GET', path: '/api/v1/businesses/:id', description: 'Get details for a specific business including trust score and review summary.' },
    { method: 'GET', path: '/api/v1/businesses/:id/reviews', description: 'List reviews for a specific business. Supports pagination and sorting.' },
    { method: 'GET', path: '/api/v1/categories', description: 'List all available business categories.' },
    { method: 'GET', path: '/api/v1/reviews/recent', description: 'Get the most recent reviews across all businesses.' },
    { method: 'POST', path: '/api/v1/reviews', description: 'Submit a new review (requires authentication).' },
    { method: 'GET', path: '/api/v1/search', description: 'Search businesses by name, category, or location.' },
  ];

  const methodColors: Record<string, string> = {
    GET: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  let activeTab = $state<'curl' | 'javascript'>('curl');

  const curlExample = `curl -X GET "https://api.biswaas.com/api/v1/businesses?category=education-consultancies&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: application/json"`;

  const jsExample = `const response = await fetch(
  "https://api.biswaas.com/api/v1/businesses?category=education-consultancies&limit=10",
  {
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Accept": "application/json",
    },
  }
);

const data = await response.json();
console.log(data.businesses);`;

  const sampleResponse = `{
  "businesses": [
    {
      "id": "biz_abc123",
      "name": "Nepal Education Gateway",
      "category": "education-consultancies",
      "trustScore": 4.5,
      "reviewCount": 89,
      "location": "Kathmandu",
      "verified": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42
  }
}`;
</script>

<svelte:head>
  <title>Developer Portal — Biswaas API</title>
  <meta name="description" content="Biswaas API documentation for developers. Access business listings, reviews, and trust scores programmatically." />
</svelte:head>

<div class="container mx-auto px-4 py-12">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold">Developer Portal</h1>
    <p class="mt-2 text-muted-foreground">Access Biswaas data programmatically. Build integrations, widgets, and tools on top of Nepal's trust platform.</p>

    <!-- Authentication -->
    <section class="mt-10">
      <div class="flex items-center gap-2">
        <Key class="h-5 w-5 text-primary" />
        <h2 class="text-xl font-semibold">Authentication</h2>
      </div>
      <div class="mt-4 rounded-lg border bg-muted/30 p-6">
        <p class="text-sm text-muted-foreground">
          API keys are <strong class="text-foreground">coming soon</strong>. Once available, include your API key in the <code class="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">Authorization</code> header as a Bearer token.
        </p>
        <div class="mt-3 rounded-md bg-muted p-3 font-mono text-xs">
          Authorization: Bearer YOUR_API_KEY
        </div>
        <p class="mt-3 text-sm text-muted-foreground">
          Public endpoints (read-only) will be available without authentication with lower rate limits.
        </p>
      </div>
    </section>

    <!-- Rate Limits -->
    <section class="mt-10">
      <div class="flex items-center gap-2">
        <Clock class="h-5 w-5 text-primary" />
        <h2 class="text-xl font-semibold">Rate Limits</h2>
      </div>
      <div class="mt-4 overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b text-left">
              <th class="pb-2 font-medium">Tier</th>
              <th class="pb-2 font-medium">Requests/min</th>
              <th class="pb-2 font-medium">Requests/day</th>
            </tr>
          </thead>
          <tbody class="text-muted-foreground">
            <tr class="border-b">
              <td class="py-2">Public (no key)</td>
              <td class="py-2">30</td>
              <td class="py-2">1,000</td>
            </tr>
            <tr class="border-b">
              <td class="py-2">Authenticated</td>
              <td class="py-2">120</td>
              <td class="py-2">10,000</td>
            </tr>
            <tr>
              <td class="py-2">Enterprise</td>
              <td class="py-2">Custom</td>
              <td class="py-2">Custom</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-xs text-muted-foreground">Rate limit headers: <code class="rounded bg-muted px-1 py-0.5 font-mono">X-RateLimit-Remaining</code>, <code class="rounded bg-muted px-1 py-0.5 font-mono">X-RateLimit-Reset</code></p>
    </section>

    <!-- Endpoints -->
    <section class="mt-10">
      <div class="flex items-center gap-2">
        <Code class="h-5 w-5 text-primary" />
        <h2 class="text-xl font-semibold">Endpoints</h2>
      </div>
      <div class="mt-4 space-y-2">
        {#each endpoints as ep}
          <div class="flex items-start gap-3 rounded-lg border p-4">
            <span class="shrink-0 rounded px-2 py-0.5 text-xs font-bold {methodColors[ep.method]}">{ep.method}</span>
            <div>
              <code class="text-sm font-mono font-medium">{ep.path}</code>
              <p class="mt-1 text-sm text-muted-foreground">{ep.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Code Examples -->
    <section class="mt-10">
      <h2 class="text-xl font-semibold">Code Examples</h2>
      <div class="mt-4">
        <div class="flex gap-1 border-b">
          <button
            onclick={() => activeTab = 'curl'}
            class="px-4 py-2 text-sm font-medium transition-colors {activeTab === 'curl' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}"
          >
            cURL
          </button>
          <button
            onclick={() => activeTab = 'javascript'}
            class="px-4 py-2 text-sm font-medium transition-colors {activeTab === 'javascript' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}"
          >
            JavaScript
          </button>
        </div>
        <div class="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed">
          {#if activeTab === 'curl'}
            <pre>{curlExample}</pre>
          {:else}
            <pre>{jsExample}</pre>
          {/if}
        </div>
      </div>
    </section>

    <!-- Response Format -->
    <section class="mt-10">
      <div class="flex items-center gap-2">
        <FileJson class="h-5 w-5 text-primary" />
        <h2 class="text-xl font-semibold">Response Format</h2>
      </div>
      <p class="mt-2 text-sm text-muted-foreground">All responses are JSON. Successful responses return the data directly. Errors include a <code class="rounded bg-muted px-1 py-0.5 text-xs font-mono">message</code> field.</p>
      <div class="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed">
        <pre>{sampleResponse}</pre>
      </div>
    </section>

    <!-- Contact -->
    <section class="mt-10 rounded-lg border bg-muted/30 p-6 text-center">
      <h2 class="text-lg font-semibold">Need Help?</h2>
      <p class="mt-1 text-sm text-muted-foreground">Contact us at <a href="mailto:developers@biswaas.com" class="text-primary hover:underline">developers@biswaas.com</a> for API access, custom integrations, or partnership inquiries.</p>
    </section>
  </div>
</div>
