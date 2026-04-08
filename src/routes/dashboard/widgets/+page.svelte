<script lang="ts">
  import { Copy, Check, Code, Star, Award } from '@lucide/svelte';

  const businessId = 'aecc-global-nepal';
  const baseUrl = 'https://biswaas.com';

  const widgets = [
    {
      id: 'badge',
      name: 'Trust Badge',
      description: 'Show your Biswaas trust score as a compact badge',
      icon: Award,
      code: `<iframe src="${baseUrl}/embed/badge/${businessId}" width="200" height="80" frameborder="0"></iframe>`,
    },
    {
      id: 'stars',
      name: 'Star Rating',
      description: 'Display your star rating with review count',
      icon: Star,
      code: `<iframe src="${baseUrl}/embed/stars/${businessId}" width="250" height="60" frameborder="0"></iframe>`,
    },
    {
      id: 'carousel',
      name: 'Review Carousel',
      description: 'Showcase your best reviews in a scrollable carousel',
      icon: Code,
      code: `<iframe src="${baseUrl}/embed/carousel/${businessId}" width="100%" height="300" frameborder="0"></iframe>`,
    },
  ];

  let copiedId = $state<string | null>(null);

  async function copyCode(id: string, code: string) {
    await navigator.clipboard.writeText(code);
    copiedId = id;
    setTimeout(() => (copiedId = null), 2000);
  }
</script>

<svelte:head>
  <title>Widgets — Dashboard — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold">Widgets</h1>
  <p class="mt-1 text-sm text-muted-foreground">Embed Biswaas reviews and trust scores on your website</p>

  <div class="mt-6 space-y-6">
    {#each widgets as widget}
      <div class="rounded-lg border p-5">
        <div class="flex items-start gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <widget.icon class="h-5 w-5 text-primary" />
          </div>
          <div class="flex-1">
            <h2 class="font-semibold">{widget.name}</h2>
            <p class="mt-0.5 text-sm text-muted-foreground">{widget.description}</p>
          </div>
        </div>

        <div class="mt-4">
          <div class="flex items-center justify-between rounded-t-md border border-b-0 bg-muted/50 px-3 py-2">
            <span class="text-xs font-medium text-muted-foreground">Embed Code</span>
            <button
              onclick={() => copyCode(widget.id, widget.code)}
              class="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium hover:bg-muted"
            >
              {#if copiedId === widget.id}
                <Check class="h-3 w-3 text-green-500" /> Copied!
              {:else}
                <Copy class="h-3 w-3" /> Copy
              {/if}
            </button>
          </div>
          <pre class="overflow-x-auto rounded-b-md border bg-muted/30 p-3 text-xs"><code>{widget.code}</code></pre>
        </div>

        <div class="mt-4">
          <p class="mb-2 text-xs font-medium text-muted-foreground">Preview</p>
          <div class="rounded-md border bg-white p-4">
            <a href="/embed/{widget.id}/{businessId}" class="text-sm text-primary hover:underline">
              Open preview in new tab
            </a>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
