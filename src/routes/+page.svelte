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

<section class="relative overflow-hidden border-b border-border/45">
  <div class="hero-grid absolute inset-0"></div>
  <div class="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(186,133,57,0.18),transparent_58%)]"></div>

  <div class="section-wrap relative py-18 md:py-24">
    <div class="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_24rem] lg:gap-12">
      <div>
        <div class="brand-badge inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/80">
          Nepal Business Trust Index
        </div>

        <h1 class="font-display mt-6 max-w-4xl text-5xl leading-[0.95] font-semibold tracking-[-0.04em] text-foreground md:text-7xl">
          Local business discovery,
          <span class="text-gradient-brand">made luminous.</span>
        </h1>

        <p class="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          Biswaas brings together search, ratings, and real customer signals in a calmer, more trustworthy experience for Nepal.
        </p>

        <form action="/search" method="GET" class="mt-8 max-w-2xl">
          <div class="surface-panel glow-ring relative rounded-[1.75rem] p-2">
            <Search class="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/75" />
            <div class="flex flex-col gap-2 md:flex-row">
              <input
                type="search"
                name="q"
                placeholder="Search by business name, district, or municipality"
                class="h-14 flex-1 rounded-[1.2rem] bg-transparent pl-14 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/85"
              />
              <button
                type="submit"
                class="rounded-[1.1rem] bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_96%,white),color-mix(in_oklab,var(--accent)_66%,var(--primary)))] px-6 py-4 text-sm font-semibold text-primary-foreground shadow-[0_24px_48px_-26px_rgba(158,92,35,0.72)] hover:-translate-y-0.5"
              >
                Explore businesses
              </button>
            </div>
          </div>
        </form>

        <div class="mt-6 flex flex-wrap gap-2 text-sm">
          {#each areas as area}
            <a
              href="/search?q={area}"
              class="rounded-full border border-border/60 bg-background/55 px-4 py-2 text-muted-foreground shadow-[0_14px_32px_-26px_rgba(53,37,24,0.3)] hover:border-primary/40 hover:text-foreground"
            >
              {area}
            </a>
          {/each}
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-3">
          <div class="surface-panel rounded-[1.6rem] p-5">
            <div class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Coverage</div>
            <div class="font-display mt-3 text-3xl font-semibold text-foreground">{businesses.length}+</div>
            <p class="mt-2 text-sm text-muted-foreground">Verified-looking business profiles across important Nepal categories.</p>
          </div>
          <div class="surface-panel rounded-[1.6rem] p-5">
            <div class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Signal</div>
            <div class="font-display mt-3 text-3xl font-semibold text-foreground">4.8/5</div>
            <p class="mt-2 text-sm text-muted-foreground">A cleaner trust layer that makes ratings feel readable at a glance.</p>
          </div>
          <div class="surface-panel rounded-[1.6rem] p-5">
            <div class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Feel</div>
            <div class="font-display mt-3 text-3xl font-semibold text-foreground">Warm</div>
            <p class="mt-2 text-sm text-muted-foreground">Soft gradients, quiet glass, and a premium editorial rhythm throughout.</p>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="surface-panel relative overflow-hidden rounded-[2rem] p-6 md:p-7">
          <div class="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,rgba(189,129,57,0.28),rgba(255,255,255,0))]"></div>
          <div class="relative flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Featured trust view</p>
              <h2 class="font-display mt-2 text-2xl font-semibold text-foreground">Kathmandu at a glance</h2>
            </div>
            <div class="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">Live review energy</div>
          </div>

          <div class="mt-8 rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(249,243,236,0.88))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-foreground">Restaurants & Cafes</p>
                <p class="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Most-searched today</p>
              </div>
              <span class="rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">Top confidence</span>
            </div>

            <div class="mt-6 space-y-4">
              {#each featuredBusinesses.slice(0, 3) as business}
                <a href="/review/{business.slug}" class="block rounded-[1.2rem] border border-white/60 bg-background/65 p-4 hover:-translate-y-0.5 hover:border-primary/35">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p class="font-semibold text-foreground">{business.name}</p>
                      <p class="mt-1 text-sm text-muted-foreground">{business.municipality}, {business.district}</p>
                    </div>
                    <div class="text-right">
                      <div class="font-display text-2xl font-semibold text-foreground">{business.trustScore}</div>
                      <div class="mt-1 flex justify-end gap-0.5">
                        {#each starArray(business.starRating) as filled}
                          <Star class="h-3 w-3 {filled ? 'fill-primary text-primary' : 'text-muted-foreground/35'}" />
                        {/each}
                      </div>
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-14 md:py-18">
  <div class="section-wrap">
    <div class="mb-8 flex items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">Curated by intent</p>
        <h2 class="font-display mt-3 text-3xl font-semibold text-foreground md:text-4xl">Browse categories with more presence</h2>
      </div>
      <a href="/categories" class="hidden text-sm font-semibold text-muted-foreground hover:text-foreground md:inline-flex">See all categories</a>
    </div>

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {#each categories as category}
        <a
          href="/categories/{category.slug}"
          class="surface-panel group rounded-[1.8rem] p-6 hover:-translate-y-1 hover:border-primary/35"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                {businesses.filter((business) => business.categorySlug === category.slug).length} listings
              </div>
              <h3 class="mt-4 font-display text-2xl font-semibold text-foreground">{category.name}</h3>
              <p class="mt-3 text-sm leading-6 text-muted-foreground">{category.description}</p>
            </div>
            <div class="rounded-full bg-secondary p-3 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary">
              <ArrowRight class="h-4 w-4" />
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<section class="border-y border-border/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(246,236,225,0.6))] py-14 md:py-18">
  <div class="section-wrap">
    <div class="mb-8 flex items-center gap-3">
      <div class="brand-badge rounded-full p-3">
        <MapPin class="h-5 w-5 text-primary" />
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">Active reviews</p>
        <h2 class="font-display mt-2 text-3xl font-semibold text-foreground md:text-4xl">Businesses with visible momentum</h2>
      </div>
    </div>

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {#each featuredBusinesses as business}
        <a
          href="/review/{business.slug}"
          class="surface-panel group rounded-[1.8rem] p-6 hover:-translate-y-1 hover:border-primary/35"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="rounded-[1.4rem] bg-[linear-gradient(135deg,rgba(193,134,58,0.2),rgba(255,255,255,0.6))] px-4 py-3">
              <span class="font-display text-3xl font-semibold text-foreground">{business.trustScore}</span>
            </div>
            <div class="flex gap-1">
              {#each starArray(business.starRating) as filled}
                <Star class="h-3.5 w-3.5 {filled ? 'fill-primary text-primary' : 'text-muted-foreground/30'}" />
              {/each}
            </div>
          </div>

          <h3 class="mt-5 text-lg font-semibold text-foreground group-hover:text-primary">{business.name}</h3>
          <p class="mt-2 text-sm text-muted-foreground">{business.categoryName}</p>
          <p class="mt-4 text-sm text-muted-foreground">{business.municipality}, {business.district}</p>
          <div class="mt-5 flex items-center justify-between border-t border-border/50 pt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span>{business.totalReviews} reviews</span>
            <span>Open profile</span>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<section class="py-14 md:py-18">
  <div class="section-wrap">
    <div class="surface-panel overflow-hidden rounded-[2.4rem] p-8 md:p-10">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">Platform rhythm</p>
          <h2 class="font-display mt-3 text-3xl font-semibold text-foreground md:text-4xl">What the experience keeps beautifully simple</h2>
        </div>
        <div class="grid gap-4 text-left sm:grid-cols-2">
          <div class="rounded-[1.6rem] border border-border/60 bg-background/55 p-5">
            <h3 class="font-semibold text-foreground">Business listing</h3>
            <p class="mt-2 text-sm leading-6 text-muted-foreground">Category pages and area-based search for discovering businesses quickly.</p>
          </div>
          <div class="rounded-[1.6rem] border border-border/60 bg-background/55 p-5">
            <h3 class="font-semibold text-foreground">Business details</h3>
            <p class="mt-2 text-sm leading-6 text-muted-foreground">Business description, location, contact details, and rating summary.</p>
          </div>
          <div class="rounded-[1.6rem] border border-border/60 bg-background/55 p-5">
            <h3 class="font-semibold text-foreground">Ratings</h3>
            <p class="mt-2 text-sm leading-6 text-muted-foreground">Trust score, star rating, review totals, and rating distribution.</p>
          </div>
          <div class="rounded-[1.6rem] border border-border/60 bg-background/55 p-5">
            <h3 class="font-semibold text-foreground">Comments</h3>
            <p class="mt-2 text-sm leading-6 text-muted-foreground">Readable customer reviews plus a direct write-review path.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
