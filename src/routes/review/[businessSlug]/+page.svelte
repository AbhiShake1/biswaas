<script lang="ts">
  import { page } from '$app/stores';
  import { Star, MapPin, Globe, Phone, Shield } from '@lucide/svelte';
  import LocationMap from '$lib/components/business/LocationMap.svelte';
  import BookmarkButton from '$lib/components/business/BookmarkButton.svelte';
  import AttributeRating from '$lib/components/review/AttributeRating.svelte';
  import ReviewHighlights from '$lib/components/review/ReviewHighlights.svelte';
  import HelpfulVotes from '$lib/components/review/HelpfulVotes.svelte';
  import ReportReview from '$lib/components/review/ReportReview.svelte';

  let slug = $derived($page.params.businessSlug);

  // Mock data - will be replaced with Convex queries
  const mockBusiness = $derived({
    name: slug?.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') ?? 'Business',
    slug,
    description: 'A trusted business in Nepal providing quality services to customers across the country.',
    trustScore: 4.2,
    starRating: 4,
    totalReviews: 156,
    ratingDistribution: { one: 5, two: 8, three: 15, four: 52, five: 76 },
    category: 'Education Consultancies',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan City',
    address: 'Putalisadak, Kathmandu',
    phone: '+977-1-4XXXXXX',
    websiteUrl: 'https://example.com',
    isClaimed: false,
    isVerified: true,
    lat: 27.7103,
    lng: 85.3222,
  });

  const mockAttributes = [
    { name: 'Application Support', score: 4 },
    { name: 'Visa Guidance', score: 3 },
    { name: 'Communication', score: 5 },
    { name: 'Value for Money', score: 3 },
  ];

  const mockReviews = [
    { id: '1', author: 'Ram B.', stars: 5, title: 'Excellent service', body: 'Very professional and helped me get admission to my dream university in Australia. Highly recommended!', createdAt: Date.now() - 86400000 * 3, helpfulCount: 12, source: 'organic' },
    { id: '2', author: 'Sita K.', stars: 4, title: 'Good but expensive', body: 'They provided good guidance but the consultation fee was a bit high compared to others.', createdAt: Date.now() - 86400000 * 7, helpfulCount: 5, source: 'organic' },
    { id: '3', author: 'Hari P.', stars: 2, title: 'Delayed processing', body: 'My application took much longer than promised. Communication could be better.', createdAt: Date.now() - 86400000 * 14, helpfulCount: 8, source: 'imported', replyText: 'We apologize for the delay. We have improved our processing times since then.' },
    { id: '4', author: 'Gita S.', stars: 5, title: 'Best consultancy in Kathmandu', body: 'They walked me through every step of the process. Got my visa on the first attempt!', createdAt: Date.now() - 86400000 * 21, helpfulCount: 15, source: 'organic' },
  ];

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }

  const total = $derived(Object.values(mockBusiness.ratingDistribution).reduce((a, b) => a + b, 0));
</script>

<svelte:head>
  <title>{mockBusiness.name} Reviews — Biswaas</title>
  <meta name="description" content="Read {mockBusiness.totalReviews} reviews for {mockBusiness.name}. Trust Score: {mockBusiness.trustScore}/5" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <!-- Breadcrumb -->
  <nav class="mb-6 text-sm text-muted-foreground">
    <a href="/" class="hover:text-foreground">Home</a>
    <span class="mx-1">/</span>
    <a href="/categories" class="hover:text-foreground">Categories</a>
    <span class="mx-1">/</span>
    <span class="text-foreground">{mockBusiness.name}</span>
  </nav>

  <!-- Business Header -->
  <div class="rounded-lg border p-6">
    <div class="flex flex-col gap-6 md:flex-row md:items-start">
      <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
        {mockBusiness.name.charAt(0)}
      </div>

      <div class="flex-1">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-2xl font-bold">{mockBusiness.name}</h1>
            <p class="mt-1 text-muted-foreground">{mockBusiness.description}</p>
          </div>
          {#if mockBusiness.isVerified}
            <span class="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              <Shield class="h-3 w-3" /> Verified
            </span>
          {/if}
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {#if mockBusiness.address}
            <span class="flex items-center gap-1"><MapPin class="h-4 w-4" /> {mockBusiness.address}</span>
          {/if}
          {#if mockBusiness.websiteUrl}
            <span class="flex items-center gap-1"><Globe class="h-4 w-4" /> {mockBusiness.websiteUrl}</span>
          {/if}
          {#if mockBusiness.phone}
            <span class="flex items-center gap-1"><Phone class="h-4 w-4" /> {mockBusiness.phone}</span>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <div class="mt-8 grid gap-8 lg:grid-cols-3">
    <!-- Left: Reviews -->
    <div class="lg:col-span-2">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-bold">Reviews ({mockBusiness.totalReviews})</h2>
        <div class="flex items-center gap-2">
          <BookmarkButton businessSlug={slug ?? ''} />
          <a href="/review/{slug}/write" class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Write a Review
          </a>
        </div>
      </div>

      <div class="mb-6">
        <ReviewHighlights reviews={mockReviews} />
      </div>

      <div class="space-y-4">
        {#each mockReviews as review}
          <div class="rounded-lg border p-4">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-medium">{review.author}</span>
                  {#if review.source === 'imported'}
                    <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">Google</span>
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

            {#if review.replyText}
              <div class="mt-3 rounded-md bg-muted/50 p-3">
                <p class="text-xs font-medium">Reply from business</p>
                <p class="mt-1 text-sm text-muted-foreground">{review.replyText}</p>
              </div>
            {/if}

            <div class="mt-3 flex items-center gap-3">
              <HelpfulVotes reviewId={review.id} />
              <ReportReview reviewId={review.id} />
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Right: Score Sidebar -->
    <div>
      <div class="mb-4">
        <LocationMap address={mockBusiness.address} lat={mockBusiness.lat} lng={mockBusiness.lng} />
      </div>

      <div class="mb-4">
        <AttributeRating attributes={mockAttributes} />
      </div>

      <div class="sticky top-20 rounded-lg border p-6">
        <div class="text-center">
          <div class="text-4xl font-bold">{mockBusiness.trustScore}</div>
          <div class="mt-1 flex items-center justify-center gap-1">
            {#each starArray(mockBusiness.starRating) as filled}
              <Star class="h-5 w-5 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
            {/each}
          </div>
          <p class="mt-2 text-sm text-muted-foreground">Based on {mockBusiness.totalReviews} reviews</p>
        </div>

        <div class="mt-6 space-y-2">
          {#each [['5', mockBusiness.ratingDistribution.five], ['4', mockBusiness.ratingDistribution.four], ['3', mockBusiness.ratingDistribution.three], ['2', mockBusiness.ratingDistribution.two], ['1', mockBusiness.ratingDistribution.one]] as [label, count]}
            <div class="flex items-center gap-2 text-sm">
              <span class="w-3">{label}</span>
              <Star class="h-3 w-3 text-yellow-400" />
              <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div class="h-full rounded-full bg-yellow-400" style="width: {(Number(count) / total * 100)}%"></div>
              </div>
              <span class="w-8 text-right text-xs text-muted-foreground">{count}</span>
            </div>
          {/each}
        </div>

        {#if !mockBusiness.isClaimed}
          <div class="mt-6 border-t pt-4">
            <p class="text-xs text-muted-foreground">Is this your business?</p>
            <a href="/auth/login" class="mt-2 block rounded-md border px-3 py-2 text-center text-sm font-medium hover:bg-muted">
              Claim This Business
            </a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
