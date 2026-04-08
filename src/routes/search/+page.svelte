<script lang="ts">
  import { MapPin, Search, Star } from '@lucide/svelte';
  let { data } = $props();

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, index) => index < count);
  }
</script>

<svelte:head>
  <title>{data.query ? `"${data.query}" — Search` : 'Search'} — Biswaas</title>
</svelte:head>

<section class="relative overflow-hidden px-4 py-10 md:py-14">
  <div class="absolute right-[-2rem] top-[-2rem] h-28 w-28 rounded-full bg-[var(--theme-orange)]/90"></div>
  <div class="absolute bottom-0 left-[-2rem] h-20 w-40 rounded-tr-[2rem] rounded-tl-[4rem] bg-[var(--theme-yellow)]"></div>

  <div class="relative mx-auto max-w-6xl">
    <div class="mb-8">
      <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--theme-blue)]">Search by place or category</p>
      <h1 class="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-5xl">Search the trust index.</h1>
      <p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
        Search by business name, district, municipality, category, or address.
      </p>
    </div>

    <form action="/search" method="GET" class="max-w-3xl">
      <div class="relative rounded-full bg-white p-2 shadow-[0_18px_40px_-26px_rgba(23,23,23,0.22)]">
        <Search class="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--theme-blue)]" />
        <div class="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            type="search"
            name="q"
            value={data.query}
            placeholder="Try Kathmandu, Pokhara, Education, or a business name"
            class="h-14 flex-1 rounded-full bg-transparent pl-14 pr-4 text-base text-foreground outline-none placeholder:text-muted-foreground/85"
          />
          <button
            type="submit"
            class="flex h-14 items-center justify-center rounded-full bg-[var(--theme-blue)] px-6 text-sm font-semibold text-white shadow-[0_18px_36px_-20px_rgba(75,97,209,0.72)] hover:-translate-y-0.5"
          >
            Search
          </button>
        </div>
      </div>
    </form>

    {#if data.query}
      <p class="mt-6 text-sm text-muted-foreground">
        {data.results.length} result{data.results.length === 1 ? '' : 's'} for "{data.query}"
      </p>

      <div class="mt-6 grid gap-4 lg:grid-cols-2">
        {#each data.results as business}
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
                  <p class="mt-1 text-sm text-muted-foreground">{business.categoryName}</p>
                </div>
                <div class="rounded-full bg-[var(--theme-blue)]/10 px-3 py-1 text-sm font-semibold text-[var(--theme-blue)]">
                  {business.trustScore}
                </div>
              </div>

              <div class="mt-3 flex items-center gap-1">
                {#each starArray(business.starRating) as filled}
                  <Star class="h-3.5 w-3.5 {filled ? 'fill-[var(--theme-green)] text-[var(--theme-green)]' : 'text-muted-foreground/30'}" />
                {/each}
                <span class="ml-2 text-xs text-muted-foreground">{business.totalReviews} reviews</span>
              </div>

              <div class="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin class="h-4 w-4 text-[var(--theme-blue)]" />
                <span>{business.municipality}, {business.district}</span>
              </div>
            </div>
          </a>
        {/each}
      </div>

      {#if data.results.length === 0}
        <div class="surface-panel mt-6 rounded-[1.8rem] p-8 text-center">
          <h2 class="text-2xl font-bold text-foreground">No businesses matched that search.</h2>
          <p class="mt-2 text-sm text-muted-foreground">Try a district, municipality, or category name instead.</p>
        </div>
      {/if}
    {/if}
  </div>
</section>
