<script lang="ts">
  import { Search, Star, Shield, ArrowRight, TrendingUp, Clock, Sparkles } from '@lucide/svelte';

  const categories = [
    { name: 'Education Consultancies', slug: 'education-consultancies', count: 100, description: 'Study abroad, language schools, test prep' },
    { name: 'E-Commerce', slug: 'ecommerce', count: 80, description: 'Online marketplaces, food delivery, shopping' },
    { name: 'Trekking & Tourism', slug: 'trekking-tourism', count: 100, description: 'Trekking agencies, travel, hotels, adventure' },
    { name: 'ISPs & Telecom', slug: 'isp-telecom', count: 70, description: 'Broadband, mobile operators, digital TV' },
    { name: 'Hospitals & Healthcare', slug: 'hospitals-healthcare', count: 100, description: 'Hospitals, clinics, diagnostics, pharmacies' },
  ];

  const trendingBusinesses = [
    { name: 'Everest Trek Adventures', slug: 'everest-trek-adventures', category: 'Trekking & Tourism', trustScore: 4.8, reviewCount: 156 },
    { name: 'Nepal Education Gateway', slug: 'nepal-education-gateway', category: 'Education Consultancies', trustScore: 4.5, reviewCount: 89 },
    { name: 'Grande Hospital', slug: 'grande-hospital', category: 'Hospitals & Healthcare', trustScore: 4.3, reviewCount: 112 },
    { name: 'WorldLink Internet', slug: 'worldlink-internet', category: 'ISPs & Telecom', trustScore: 3.8, reviewCount: 234 },
  ];

  const recentReviews = [
    { business: 'Everest Trek Adventures', author: 'Suman G.', stars: 5, snippet: 'Best trekking experience! The guides were incredibly knowledgeable.', time: '2 hours ago' },
    { business: 'WorldLink Internet', author: 'Priya S.', stars: 3, snippet: 'Speed is decent but frequent outages in my area during monsoon.', time: '5 hours ago' },
    { business: 'Nepal Education Gateway', author: 'Ram B.', stars: 5, snippet: 'Got my Australian visa processed smoothly. Highly recommend!', time: '1 day ago' },
    { business: 'Daraz Nepal', author: 'Anita M.', stars: 4, snippet: 'Good product range but delivery can be slow outside Kathmandu.', time: '2 days ago' },
  ];

  const featuredCategory = {
    name: 'Education Consultancies',
    slug: 'education-consultancies',
    description: 'Nepal has 1,500+ education consultancies helping students study abroad. Read reviews from real students before choosing your consultancy.',
    stats: { businesses: 100, reviews: 1200, avgScore: 4.1 },
  };

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }
</script>

<svelte:head>
  <title>Biswaas — Nepal's Trust & Review Platform</title>
  <meta name="description" content="Read and write reviews for businesses in Nepal. Find trusted education consultancies, e-commerce platforms, trekking agencies, ISPs, and hospitals." />
</svelte:head>

<section class="border-b bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
  <div class="container mx-auto px-4 text-center">
    <h1 class="text-4xl font-bold tracking-tight md:text-5xl">
      विश्वास <span class="text-primary">Biswaas</span>
    </h1>
    <p class="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
      Nepal's trusted review platform. Find honest reviews for businesses across Nepal — from education consultancies to hospitals.
    </p>

    <form action="/search" method="GET" class="mx-auto mt-8 max-w-lg">
      <div class="relative">
        <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          name="q"
          placeholder="Search for a business, category, or service..."
          class="w-full rounded-full border bg-background py-3 pl-12 pr-4 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </form>

    <div class="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
      <span class="flex items-center gap-1"><Star class="h-4 w-4 text-yellow-500" /> 450+ Businesses</span>
      <span class="flex items-center gap-1"><Shield class="h-4 w-4 text-green-500" /> Verified Reviews</span>
    </div>
  </div>
</section>

<section class="py-12">
  <div class="container mx-auto px-4">
    <h2 class="mb-8 text-2xl font-bold">Browse Categories</h2>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each categories as cat}
        <a
          href="/categories/{cat.slug}"
          class="group rounded-lg border p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
        >
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-semibold group-hover:text-primary">{cat.name}</h3>
              <p class="mt-1 text-sm text-muted-foreground">{cat.description}</p>
            </div>
            <ArrowRight class="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </div>
          <p class="mt-3 text-xs text-muted-foreground">{cat.count} businesses</p>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- Trending Businesses -->
<section class="border-t py-12">
  <div class="container mx-auto px-4">
    <div class="flex items-center gap-2 mb-8">
      <TrendingUp class="h-5 w-5 text-primary" />
      <h2 class="text-2xl font-bold">Trending Businesses</h2>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {#each trendingBusinesses as biz}
        <a href="/search?q={biz.slug}" class="group rounded-lg border p-5 transition-colors hover:border-primary/50 hover:bg-muted/50">
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold">{biz.trustScore}</span>
            <div class="flex gap-0.5">
              {#each starArray(Math.round(biz.trustScore)) as filled}
                <Star class="h-3 w-3 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
              {/each}
            </div>
          </div>
          <h3 class="mt-2 font-semibold group-hover:text-primary">{biz.name}</h3>
          <p class="mt-1 text-xs text-muted-foreground">{biz.category} &middot; {biz.reviewCount} reviews</p>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- Recently Reviewed -->
<section class="border-t bg-muted/30 py-12">
  <div class="container mx-auto px-4">
    <div class="flex items-center gap-2 mb-8">
      <Clock class="h-5 w-5 text-primary" />
      <h2 class="text-2xl font-bold">Recently Reviewed</h2>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {#each recentReviews as review}
        <div class="rounded-lg border bg-background p-5">
          <div class="flex items-center gap-1">
            {#each starArray(review.stars) as filled}
              <Star class="h-3 w-3 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
            {/each}
          </div>
          <p class="mt-2 text-sm text-muted-foreground line-clamp-2">{review.snippet}</p>
          <div class="mt-3 flex items-center justify-between text-xs">
            <span class="font-medium">{review.author}</span>
            <span class="text-muted-foreground">{review.time}</span>
          </div>
          <p class="mt-1 text-xs text-primary">{review.business}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Featured Category Spotlight -->
<section class="border-t py-12">
  <div class="container mx-auto px-4">
    <div class="flex items-center gap-2 mb-6">
      <Sparkles class="h-5 w-5 text-primary" />
      <h2 class="text-2xl font-bold">Featured Category</h2>
    </div>
    <div class="rounded-xl border bg-gradient-to-r from-primary/5 to-background p-8">
      <h3 class="text-xl font-bold">{featuredCategory.name}</h3>
      <p class="mt-2 max-w-2xl text-muted-foreground">{featuredCategory.description}</p>
      <div class="mt-4 flex gap-6 text-sm">
        <span><strong>{featuredCategory.stats.businesses}</strong> businesses</span>
        <span><strong>{featuredCategory.stats.reviews.toLocaleString()}</strong> reviews</span>
        <span><strong>{featuredCategory.stats.avgScore}</strong> avg. score</span>
      </div>
      <a href="/categories/{featuredCategory.slug}" class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
        Explore {featuredCategory.name} <ArrowRight class="h-4 w-4" />
      </a>
    </div>
  </div>
</section>

<section class="border-t bg-muted/30 py-12">
  <div class="container mx-auto px-4 text-center">
    <h2 class="text-2xl font-bold">Own a Business in Nepal?</h2>
    <p class="mt-2 text-muted-foreground">Claim your profile, respond to reviews, and build trust with customers.</p>
    <a href="/auth/login" class="mt-4 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
      Claim Your Business
    </a>
  </div>
</section>
