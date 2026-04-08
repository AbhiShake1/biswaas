<script lang="ts">
  import { page } from '$app/stores';
  import { Globe, MapPin, Phone, Star } from '@lucide/svelte';
  import { getBusiness } from '$lib/data/businesses';

  let slug = $derived($page.params.businessSlug ?? '');
  let business = $derived(getBusiness(slug));

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, index) => index < count);
  }

  const total = $derived(
    business
      ? Object.values(business.ratingDistribution).reduce((sum, count) => sum + count, 0)
      : 0
  );
</script>

<svelte:head>
  <title>{business ? `${business.name} Reviews` : 'Business Reviews'} — Biswaas</title>
  <meta name="description" content={business ? `Read ${business.totalReviews} reviews for ${business.name}. Trust Score ${business.trustScore}/5.` : 'Read business ratings and reviews on Biswaas.'} />
</svelte:head>

{#if business}
  <div class="container mx-auto px-4 py-8">
    <nav class="mb-6 text-sm text-muted-foreground">
      <a href="/" class="hover:text-foreground">Home</a>
      <span class="mx-1">/</span>
      <a href="/categories" class="hover:text-foreground">Categories</a>
      <span class="mx-1">/</span>
      <a href="/categories/{business.categorySlug}" class="hover:text-foreground">{business.categoryName}</a>
      <span class="mx-1">/</span>
      <span class="text-foreground">{business.name}</span>
    </nav>

    <div class="rounded-lg border p-6">
      <div class="flex flex-col gap-6 md:flex-row md:items-start">
        <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
          {business.name.charAt(0)}
        </div>

        <div class="flex-1">
          <div>
            <h1 class="text-2xl font-bold">{business.name}</h1>
            <p class="mt-1 text-muted-foreground">{business.description}</p>
          </div>

          <div class="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span class="flex items-center gap-1"><MapPin class="h-4 w-4" /> {business.address}</span>
            <span class="flex items-center gap-1"><Globe class="h-4 w-4" /> {business.websiteUrl}</span>
            <span class="flex items-center gap-1"><Phone class="h-4 w-4" /> {business.phone}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold">Comments and Ratings</h2>
            <p class="text-sm text-muted-foreground">{business.totalReviews} reviews from customers</p>
          </div>
          <a href="/review/{slug}/write" class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Write a Review
          </a>
        </div>

        <div class="space-y-4">
          {#each business.reviews as review}
            <div class="rounded-lg border p-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{review.author}</span>
                    {#if review.source === 'imported'}
                      <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">Imported</span>
                    {/if}
                  </div>
                  <div class="mt-1 flex items-center gap-1">
                    {#each starArray(review.stars) as filled}
                      <Star class="h-4 w-4 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
                    {/each}
                    <span class="ml-2 text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>

              <h3 class="mt-2 font-medium">{review.title}</h3>
              <p class="mt-1 text-sm text-muted-foreground">{review.body}</p>
            </div>
          {/each}
        </div>
      </div>

      <div class="sticky top-20 rounded-lg border p-6">
        <div class="text-center">
          <div class="text-4xl font-bold">{business.trustScore}</div>
          <div class="mt-1 flex items-center justify-center gap-1">
            {#each starArray(business.starRating) as filled}
              <Star class="h-5 w-5 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
            {/each}
          </div>
          <p class="mt-2 text-sm text-muted-foreground">Based on {business.totalReviews} reviews</p>
        </div>

        <div class="mt-6 rounded-lg bg-muted/40 p-4 text-sm">
          <p class="font-medium">Area</p>
          <p class="mt-1 text-muted-foreground">{business.municipality}, {business.district}</p>
        </div>

        <div class="mt-6 space-y-2">
          {#each [['5', business.ratingDistribution.five], ['4', business.ratingDistribution.four], ['3', business.ratingDistribution.three], ['2', business.ratingDistribution.two], ['1', business.ratingDistribution.one]] as [label, count]}
            <div class="flex items-center gap-2 text-sm">
              <span class="w-3">{label}</span>
              <Star class="h-3 w-3 text-yellow-400" />
              <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div class="h-full rounded-full bg-yellow-400" style="width: {(Number(count) / total) * 100}%"></div>
              </div>
              <span class="w-8 text-right text-xs text-muted-foreground">{count}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-2xl font-bold">Business not found</h1>
    <p class="mt-2 text-muted-foreground">The requested business could not be found in the current focused dataset.</p>
  </div>
{/if}
