<script lang="ts">
  import { MapPin, Star } from '@lucide/svelte';
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.query ? `"${data.query}" — Search` : 'Search'} — Biswaas</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold">Search</h1>
  <p class="mt-2 text-muted-foreground">Search by business name, district, municipality, category, or address.</p>

  <form action="/search" method="GET" class="mt-6 max-w-xl">
    <input
      type="search"
      name="q"
      value={data.query}
      placeholder="Try Kathmandu, Pokhara, Education, or a business name"
      class="w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
    />
  </form>

  {#if data.query}
    <p class="mt-4 text-sm text-muted-foreground">{data.results.length} result{data.results.length === 1 ? '' : 's'} for "{data.query}"</p>

    <div class="mt-4 space-y-3">
      {#each data.results as business}
        <a href="/review/{business.slug}" class="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
            {business.name.charAt(0)}
          </div>
          <div class="flex-1">
            <h3 class="font-medium">{business.name}</h3>
            <span class="text-xs text-muted-foreground">{business.categoryName}</span>
            <div class="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin class="h-3 w-3" />
              <span>{business.municipality}, {business.district}</span>
            </div>
          </div>
          <div class="flex items-center gap-1 text-sm">
            <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span class="font-medium">{business.trustScore}</span>
            <span class="text-muted-foreground">({business.totalReviews})</span>
          </div>
        </a>
      {/each}
    </div>

    {#if data.results.length === 0}
      <p class="mt-4 text-sm text-muted-foreground">No results found for "{data.query}"</p>
    {/if}
  {/if}
</div>
