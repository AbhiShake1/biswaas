<script lang="ts">
  import { page } from '$app/stores';
  import { MapPin, Star } from '@lucide/svelte';
  import { getBusinessesByCategory, getCategory } from '$lib/data/businesses';

  let slug = $derived($page.params.slug ?? '');
  let category = $derived(getCategory(slug));
  let categoryBusinesses = $derived(getBusinessesByCategory(slug));

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, index) => index < count);
  }
</script>

<svelte:head>
  <title>{category ? `${category.name} — Categories` : 'Category'} — Biswaas</title>
</svelte:head>

{#if category}
  <div class="container mx-auto px-4 py-8">
    <nav class="mb-6 text-sm text-muted-foreground">
      <a href="/" class="hover:text-foreground">Home</a>
      <span class="mx-1">/</span>
      <a href="/categories" class="hover:text-foreground">Categories</a>
      <span class="mx-1">/</span>
      <span class="text-foreground">{category.name}</span>
    </nav>

    <div class="mb-8">
      <h1 class="text-3xl font-bold">{category.name}</h1>
      <p class="mt-2 text-muted-foreground">{category.description}</p>
    </div>

    <div class="space-y-4">
      {#each categoryBusinesses as business}
        <a href="/review/{business.slug}" class="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-lg font-bold text-muted-foreground">
            {business.name.charAt(0)}
          </div>
          <div class="flex-1">
            <h3 class="font-semibold">{business.name}</h3>
            <p class="mt-0.5 text-sm text-muted-foreground">{business.description}</p>
            <div class="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span class="flex items-center gap-1 font-medium">
                <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {business.trustScore}
              </span>
              <span class="flex items-center gap-1 text-muted-foreground">
                {#each starArray(business.starRating) as filled}
                  <Star class="h-3 w-3 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
                {/each}
              </span>
              <span class="text-muted-foreground">{business.totalReviews} reviews</span>
              <span class="flex items-center gap-1 text-muted-foreground">
                <MapPin class="h-4 w-4" />
                {business.municipality}, {business.district}
              </span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
{:else}
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-2xl font-bold">Category not found</h1>
    <p class="mt-2 text-muted-foreground">The requested category does not exist in the current focused scope.</p>
  </div>
{/if}
