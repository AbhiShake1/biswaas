<script lang="ts">
  import { Award, Check, Copy, ExternalLink, PanelsTopLeft, Star } from '@lucide/svelte';
  import { buildIframeCode, embedWidgets } from '$lib/data/embed';
  let { data } = $props();

  let business = $derived(data.business);
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
  <section class="relative overflow-hidden px-4 py-10 md:py-14">
    <div class="absolute right-[-2rem] top-[-2rem] h-28 w-28 rounded-full bg-[var(--theme-orange)]/90"></div>
    <div class="absolute bottom-0 left-[-1rem] h-20 w-44 rounded-tr-[2rem] rounded-tl-[4rem] bg-[var(--theme-yellow)]"></div>

    <div class="relative mx-auto max-w-6xl">
      <nav class="mb-6 text-sm text-muted-foreground">
        <a href="/" class="hover:text-foreground">Home</a>
        <span class="mx-1">/</span>
        <a href="/review/{business.slug}" class="hover:text-foreground">{business.name}</a>
        <span class="mx-1">/</span>
        <span class="text-foreground">Embeds</span>
      </nav>

      <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--theme-blue)]">Public trust widgets</p>
          <h1 class="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-5xl">Embeddable widgets for {business.name}</h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            Add Biswaas trust indicators to your site without bringing back the full dashboard surface.
          </p>
        </div>
      </div>

      <div class="space-y-6">
        {#each embedWidgets as widget}
          {@const WidgetIcon = widgetIcons[widget.id]}
          {@const iframeCode = buildIframeCode(origin(), business, widget)}

          <section class="surface-panel rounded-[2rem] p-6 md:p-8">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div class="flex items-start gap-5">
                <div class="flex h-18 w-18 items-center justify-center rounded-[1.4rem] bg-[var(--theme-green)] text-[var(--theme-ink)] shadow-[0_18px_36px_-26px_rgba(23,214,148,0.65)]">
                  <WidgetIcon class="h-8 w-8" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-foreground">{widget.name}</h2>
                  <p class="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{widget.description}</p>
                </div>
              </div>

              <button
                onclick={() => copyCode(widget.id, iframeCode)}
                class="inline-flex items-center gap-2 rounded-full bg-[var(--theme-blue)] px-4 py-2 text-sm font-semibold text-white"
              >
                {#if copiedId === widget.id}
                  <Check class="h-4 w-4" /> Copied
                {:else}
                  <Copy class="h-4 w-4" /> Copy embed code
                {/if}
              </button>
            </div>

            <div class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div class="rounded-[1.6rem] border border-border/70 bg-white p-4">
                <p class="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-blue)]">Embed Code</p>
                <pre class="overflow-x-auto text-sm text-foreground"><code>{iframeCode}</code></pre>
              </div>

              <div class="rounded-[1.6rem] border border-border/70 bg-background/60 p-4">
                <div class="mb-4 flex items-center justify-between gap-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-blue)]">Preview</p>
                  <a
                    href="/embed/{widget.id}/{business.slug}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-sm font-semibold text-[var(--theme-blue)] hover:underline"
                  >
                    Open in new tab
                    <ExternalLink class="h-4 w-4" />
                  </a>
                </div>

                <div class="overflow-x-auto rounded-[1.2rem] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
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
  </section>
{:else}
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-2xl font-bold">Business not found</h1>
  </div>
{/if}
