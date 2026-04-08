<script lang="ts">
  import { ArrowRight } from '@lucide/svelte';
  import { businesses, categories } from '$lib/data/businesses';
</script>

<svelte:head>
  <title>Categories — Biswaas</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold">All Categories</h1>
  <p class="mt-2 text-muted-foreground">Browse businesses by category across Nepal.</p>

  <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each categories as category}
      <a href="/categories/{category.slug}" class="group rounded-lg border p-6 transition-all hover:border-primary/50 hover:shadow-md">
        <h2 class="text-lg font-semibold group-hover:text-primary">{category.name}</h2>
        <p class="mt-2 text-sm text-muted-foreground">{category.description}</p>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-sm text-muted-foreground">{businesses.filter((business) => business.categorySlug === category.slug).length} businesses</span>
          <ArrowRight class="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </a>
    {/each}
  </div>
</div>
