<script lang="ts">
  import { ArrowRight, MapPin, Search, Star } from '@lucide/svelte';
  import { businesses, categories } from '$lib/data/businesses';

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }

  const featuredBusinesses = businesses.slice(0, 6);
  const areas = ['Kathmandu', 'Lalitpur', 'Pokhara', 'Kaski'];
</script>

<svelte:head>
  <title>Biswaas — Nepal's Trust & Review Platform</title>
  <meta name="description" content="Search Nepal businesses by district or municipality, compare ratings, and read real customer comments." />
</svelte:head>

<section class="border-b bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
  <div class="container mx-auto px-4 text-center">
    <h1 class="text-4xl font-bold tracking-tight md:text-5xl">
      विश्वास <span class="text-primary">Biswaas</span>
    </h1>
    <p class="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
      Search by district, compare ratings, and read customer comments before choosing a business.
    </p>

    <form action="/search" method="GET" class="mx-auto mt-8 max-w-lg">
      <div class="relative">
        <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          name="q"
          placeholder="Search by business name, district, or municipality"
          class="w-full rounded-full border bg-background py-3 pl-12 pr-4 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </form>

    <div class="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
      {#each areas as area}
        <a href="/search?q={area}" class="rounded-full border px-3 py-1.5 text-muted-foreground hover:border-primary/50 hover:text-foreground">
          {area}
        </a>
      {/each}
    </div>
  </div>
</section>

<section class="py-12">
  <div class="container mx-auto px-4">
    <h2 class="mb-8 text-2xl font-bold">Browse Categories</h2>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each categories as category}
        <a
          href="/categories/{category.slug}"
          class="group rounded-lg border p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
        >
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-semibold group-hover:text-primary">{category.name}</h3>
              <p class="mt-1 text-sm text-muted-foreground">{category.description}</p>
            </div>
            <ArrowRight class="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </div>
          <p class="mt-3 text-xs text-muted-foreground">{businesses.filter((business) => business.categorySlug === category.slug).length} businesses</p>
        </a>
      {/each}
    </div>
  </div>
</section>

<section class="border-t py-12">
  <div class="container mx-auto px-4">
    <div class="mb-8 flex items-center gap-2">
      <MapPin class="h-5 w-5 text-primary" />
      <h2 class="text-2xl font-bold">Businesses With Active Reviews</h2>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each featuredBusinesses as business}
        <a href="/review/{business.slug}" class="group rounded-lg border p-5 transition-colors hover:border-primary/50 hover:bg-muted/50">
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold">{business.trustScore}</span>
            <div class="flex gap-0.5">
              {#each starArray(business.starRating) as filled}
                <Star class="h-3 w-3 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
              {/each}
            </div>
          </div>
          <h3 class="mt-2 font-semibold group-hover:text-primary">{business.name}</h3>
          <p class="mt-1 text-sm text-muted-foreground">{business.categoryName}</p>
          <p class="mt-2 text-xs text-muted-foreground">{business.municipality}, {business.district}</p>
          <p class="mt-2 text-xs text-muted-foreground">{business.totalReviews} reviews</p>
        </a>
      {/each}
    </div>
  </div>
</section>

<section class="border-t bg-muted/30 py-12">
  <div class="container mx-auto px-4">
    <div class="rounded-xl border bg-background p-8">
      <h2 class="text-2xl font-bold">What stays in scope</h2>
      <div class="mt-4 grid gap-4 text-left sm:grid-cols-2">
        <div class="rounded-lg border p-4">
          <h3 class="font-semibold">Business listing</h3>
          <p class="mt-2 text-sm text-muted-foreground">Category pages and area-based search for discovering businesses quickly.</p>
        </div>
        <div class="rounded-lg border p-4">
          <h3 class="font-semibold">Business details</h3>
          <p class="mt-2 text-sm text-muted-foreground">Business description, location, contact details, and rating summary.</p>
        </div>
        <div class="rounded-lg border p-4">
          <h3 class="font-semibold">Ratings</h3>
          <p class="mt-2 text-sm text-muted-foreground">Trust score, star rating, review totals, and rating distribution.</p>
        </div>
        <div class="rounded-lg border p-4">
          <h3 class="font-semibold">Comments</h3>
          <p class="mt-2 text-sm text-muted-foreground">Readable customer reviews plus a direct write-review path.</p>
        </div>
      </div>
    </div>
  </div>
</section>
