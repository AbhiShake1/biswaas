<script lang="ts">
  import { MapPin, Star } from '@lucide/svelte';
  let { data } = $props();

  let category = $derived(data.category);
  let categoryBusinesses = $derived(data.category?.businesses ?? []);

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, index) => index < count);
  }
</script>

<svelte:head>
  <title>{category ? `${category.name} — Categories` : 'Category'} — Biswaas</title>
</svelte:head>

{#if category}
  <section class="relative overflow-hidden px-4 py-10 md:py-14">
    <div class="absolute right-[-2rem] top-[-2rem] h-28 w-28 rounded-full bg-[var(--theme-orange)]/90"></div>
    <div class="absolute bottom-0 left-[-1rem] h-20 w-44 rounded-tr-[2rem] rounded-tl-[4rem] bg-[var(--theme-yellow)]"></div>

    <div class="relative mx-auto max-w-6xl">
      <nav class="mb-6 text-sm text-muted-foreground">
        <a href="/" class="hover:text-foreground">Home</a>
        <span class="mx-1">/</span>
        <a href="/categories" class="hover:text-foreground">Categories</a>
        <span class="mx-1">/</span>
        <span class="text-foreground">{category.name}</span>
      </nav>

      <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--theme-blue)]">Category focus</p>
          <h1 class="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-5xl">{category.name}</h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{category.description}</p>
        </div>
        <div class="rounded-full bg-[var(--theme-green)]/14 px-4 py-2 text-sm font-semibold text-[var(--theme-ink)]">
          {categoryBusinesses.length} visible listings
        </div>
      </div>

      <div class="grid gap-4">
        {#each categoryBusinesses as business}
          <a
            href="/review/{business.slug}"
            class="surface-panel group flex items-start gap-4 rounded-[1.8rem] p-5 hover:-translate-y-1 hover:border-[var(--theme-blue)]/35"
          >
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-[var(--theme-green)]/15 text-lg font-bold text-[var(--theme-ink)]">
              {business.name.charAt(0)}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 class="text-lg font-semibold text-foreground group-hover:text-[var(--theme-blue)]">{business.name}</h2>
                  <p class="mt-1 text-sm text-muted-foreground">{business.description}</p>
                </div>
                <div class="rounded-full bg-[var(--theme-blue)]/10 px-3 py-1 text-sm font-semibold text-[var(--theme-blue)]">
                  {business.trustScore}
                </div>
              </div>

              <div class="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span class="flex items-center gap-1 text-muted-foreground">
                  {#each starArray(business.starRating) as filled}
                    <Star class="h-3.5 w-3.5 {filled ? 'fill-[var(--theme-green)] text-[var(--theme-green)]' : 'text-muted-foreground/30'}" />
                  {/each}
                </span>
                <span class="text-muted-foreground">{business.totalReviews} reviews</span>
                <span class="flex items-center gap-1 text-muted-foreground">
                  <MapPin class="h-4 w-4 text-[var(--theme-blue)]" />
                  {business.municipality}, {business.district}
                </span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>
{:else}
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-2xl font-bold">Category not found</h1>
    <p class="mt-2 text-muted-foreground">The requested category does not exist in the current focused scope.</p>
  </div>
{/if}
