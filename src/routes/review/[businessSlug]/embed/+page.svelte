<script lang="ts">
  import { page } from '$app/stores';
  import { Award, Check, Copy, ExternalLink, Star, PanelsTopLeft } from '@lucide/svelte';
  import { getBusiness } from '$lib/data/businesses';
  import { buildIframeCode, embedWidgets } from '$lib/data/embed';

  let slug = $derived($page.params.businessSlug ?? '');
  let business = $derived(getBusiness(slug));
  let copiedId = $state<string | null>(null);

  const widgetIcons = {
    badge: Award,
    stars: Star,
    carousel: PanelsTopLeft
  } as const;

  function origin() {
    if (typeof window !== 'undefined') return window.location.origin;
    return 'https://biswaas.com';
  }

  function fallbackCopy(code: string) {
    const textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  }

  async function copyCode(id: string, code: string) {
    let copied = false;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(code);
        copied = true;
      } catch {
        copied = fallbackCopy(code);
      }
    } else {
      copied = fallbackCopy(code);
    }

    if (!copied) return;

    copiedId = id;
    setTimeout(() => {
      copiedId = null;
    }, 2000);
  }
</script>

<svelte:head>
  <title>{business ? `Embed ${business.name}` : 'Embed Widgets'} — Biswaas</title>
</svelte:head>

{#if business}
  <div class="container mx-auto max-w-6xl px-4 py-8">
    <nav class="mb-6 text-sm text-muted-foreground">
      <a href="/" class="hover:text-foreground">Home</a>
      <span class="mx-1">/</span>
      <a href="/review/{business.slug}" class="hover:text-foreground">{business.name}</a>
      <span class="mx-1">/</span>
      <span class="text-foreground">Embeds</span>
    </nav>

    <div class="mb-8">
      <h1 class="text-3xl font-bold">Embeddable Widgets</h1>
      <p class="mt-2 text-muted-foreground">Add Biswaas trust indicators to your site without bringing back the full dashboard surface.</p>
    </div>

    <div class="space-y-6">
      {#each embedWidgets as widget}
        {@const WidgetIcon = widgetIcons[widget.id]}
        {@const iframeCode = buildIframeCode(origin(), business, widget)}

        <section class="rounded-[1.75rem] border p-10">
          <div class="flex items-start gap-6">
            <div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
              <WidgetIcon class="h-9 w-9" />
            </div>
            <div>
              <h2 class="text-3xl font-bold">{widget.name}</h2>
              <p class="mt-2 text-xl text-muted-foreground">{widget.description}</p>
            </div>
          </div>

          <div class="mt-10 rounded-3xl border">
            <div class="flex items-center justify-between border-b px-6 py-5">
              <span class="text-2xl font-semibold text-muted-foreground">Embed Code</span>
              <button
                onclick={() => copyCode(widget.id, iframeCode)}
                class="inline-flex items-center gap-2 rounded-md px-2 py-1 text-2xl font-semibold hover:bg-muted"
              >
                {#if copiedId === widget.id}
                  <Check class="h-6 w-6 text-green-600" /> Copied
                {:else}
                  <Copy class="h-6 w-6" /> Copy
                {/if}
              </button>
            </div>
            <pre class="overflow-x-auto p-6 text-[1.15rem]"><code>{iframeCode}</code></pre>
          </div>

          <div class="mt-8">
            <p class="mb-4 text-2xl font-semibold text-muted-foreground">Preview</p>
            <div class="rounded-3xl border p-6">
              <div class="mb-4">
                <a
                  href="/embed/{widget.id}/{business.slug}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-2xl font-medium hover:underline"
                >
                  Open preview in new tab
                  <ExternalLink class="h-5 w-5" />
                </a>
              </div>

              <div class="overflow-x-auto rounded-2xl bg-muted/30 p-4">
                <iframe
                  src="/embed/{widget.id}/{business.slug}"
                  title="{business.name} {widget.name} preview"
                  width={widget.width}
                  height={widget.height}
                  class="border-0 bg-transparent"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      {/each}
    </div>
  </div>
{:else}
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-2xl font-bold">Business not found</h1>
  </div>
{/if}
