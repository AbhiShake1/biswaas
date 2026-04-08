<script lang="ts">
  import { page } from '$app/stores';
  import { Search, Star } from '@lucide/svelte';

  let query = $derived($page.url.searchParams.get('q') ?? '');
  let searchInput = $state($page.url.searchParams.get('q') ?? '');

  // Mock search results
  const allBusinesses = [
    { name: 'AECC Global Nepal', slug: 'aecc-global-nepal', category: 'Education Consultancies', trustScore: 4.2, totalReviews: 87 },
    { name: 'Daraz Nepal', slug: 'daraz-nepal', category: 'E-Commerce', trustScore: 2.1, totalReviews: 1543 },
    { name: 'WorldLink Communications', slug: 'worldlink', category: 'ISPs & Telecom', trustScore: 3.1, totalReviews: 892 },
    { name: 'Norvic International Hospital', slug: 'norvic-hospital', category: 'Hospitals & Healthcare', trustScore: 4.0, totalReviews: 345 },
    { name: 'Nepal Intrepid Treks', slug: 'nepal-intrepid-treks', category: 'Trekking & Tourism', trustScore: 4.6, totalReviews: 312 },
    { name: 'IDP Nepal', slug: 'idp-nepal', category: 'Education Consultancies', trustScore: 4.5, totalReviews: 203 },
    { name: 'Foodmandu', slug: 'foodmandu', category: 'E-Commerce', trustScore: 3.8, totalReviews: 567 },
    { name: 'Nepal Telecom', slug: 'nepal-telecom', category: 'ISPs & Telecom', trustScore: 2.8, totalReviews: 1204 },
  ];

  let results = $derived(
    query
      ? allBusinesses.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))
      : []
  );
</script>

<svelte:head>
  <title>{query ? `"${query}" — Search` : 'Search'} — Biswaas</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <form action="/search" method="GET" class="mx-auto max-w-xl">
    <div class="relative">
      <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <!-- svelte-ignore a11y_autofocus -->
      <input
        type="search"
        name="q"
        value={searchInput}
        oninput={(e) => searchInput = (e.target as HTMLInputElement).value}
        placeholder="Search for a business..."
        class="w-full rounded-full border py-3 pl-12 pr-4 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        autofocus
      />
    </div>
  </form>

  {#if query}
    <p class="mt-6 text-sm text-muted-foreground">
      {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
    </p>

    <div class="mt-4 space-y-3">
      {#each results as biz}
        <a href="/review/{biz.slug}" class="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
            {biz.name.charAt(0)}
          </div>
          <div class="flex-1">
            <h3 class="font-medium">{biz.name}</h3>
            <span class="text-xs text-muted-foreground">{biz.category}</span>
          </div>
          <div class="flex items-center gap-1 text-sm">
            <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span class="font-medium">{biz.trustScore}</span>
            <span class="text-muted-foreground">({biz.totalReviews})</span>
          </div>
        </a>
      {/each}

      {#if results.length === 0}
        <p class="py-12 text-center text-muted-foreground">No businesses found for "{query}"</p>
      {/if}
    </div>
  {:else}
    <p class="mt-12 text-center text-muted-foreground">Type a business name to search</p>
  {/if}
</div>
