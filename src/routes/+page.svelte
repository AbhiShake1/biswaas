<script lang="ts">
  import { ArrowRight, MapPin, Search, Star } from '@lucide/svelte';
  let { data } = $props();

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }

  const areas = ['Kathmandu', 'Lalitpur', 'Pokhara', 'Kaski'];
</script>

<svelte:head>
  <title>Biswaas — Nepal's Trust & Review Platform</title>
  <meta
    name="description"
    content="Search Nepal businesses by district or municipality, compare ratings, and read real customer comments."
  />
</svelte:head>

<section class="relative overflow-hidden border-b border-border/45">
  <div class="hero-grid absolute inset-0"></div>
  <div class="absolute left-[12%] top-[-7rem] h-52 w-52 rounded-full bg-[var(--theme-orange)]"></div>
  <div class="absolute bottom-[-2.5rem] left-[-2rem] h-28 w-44 rounded-tr-[2rem] rounded-br-[4rem] rounded-tl-[5rem] bg-[var(--theme-yellow)]"></div>
  <div class="absolute bottom-0 right-[-3rem] h-24 w-72 rounded-tl-[3rem] bg-[var(--theme-green)]"></div>

  <div class="section-wrap relative py-18 md:py-24">
    <div class="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_24rem] lg:gap-12">
      <div>
        <div class="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--theme-blue)] shadow-[0_12px_26px_-18px_rgba(23,23,23,0.22)]">
          Nepal Business Trust Index
        </div>

        <h1 class="mt-6 max-w-4xl text-5xl leading-[0.95] font-extrabold tracking-[-0.07em] text-foreground md:text-7xl">
          Find a company
          <br />
          you can trust.
        </h1>

        <p class="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          Discover, read, and write reviews for Nepal businesses through a brighter, sharper trust layer built for fast local discovery.
        </p>

        <form action="/search" method="GET" class="mt-8 max-w-2xl">
          <div class="relative rounded-full bg-white p-2 shadow-[0_20px_44px_-28px_rgba(23,23,23,0.32)]">
            <Search class="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--theme-blue)]" />
            <div class="flex flex-col gap-2 md:flex-row md:items-center">
              <input
                type="search"
                name="q"
                placeholder="Search company or category"
                class="h-14 flex-1 rounded-full bg-transparent pl-14 pr-4 text-base text-foreground outline-none placeholder:text-muted-foreground/85"
              />
              <button
                type="submit"
                class="flex h-14 items-center justify-center rounded-full bg-[var(--theme-blue)] px-6 text-sm font-semibold text-white shadow-[0_18px_36px_-20px_rgba(75,97,209,0.72)] hover:-translate-y-0.5"
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
              class="rounded-full border border-border/70 bg-white px-4 py-2 text-muted-foreground shadow-[0_14px_32px_-26px_rgba(23,23,23,0.18)] hover:border-[var(--theme-blue)]/40 hover:text-foreground"
            >
              {area}
            </a>
          {/each}
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-3">
          <div class="surface-panel rounded-[1.6rem] p-5">
            <div class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-blue)]">Coverage</div>
            <div class="mt-3 text-3xl font-semibold text-foreground">{data.featuredBusinesses.length}+</div>
            <p class="mt-2 text-sm text-muted-foreground">Profiles across important Nepal categories, tuned for quick trust checks.</p>
          </div>
          <div class="surface-panel rounded-[1.6rem] p-5">
            <div class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-green)]">Signal</div>
            <div class="mt-3 text-3xl font-semibold text-foreground">4.8/5</div>
            <p class="mt-2 text-sm text-muted-foreground">A cleaner read on ratings, volume, and customer confidence.</p>
          </div>
          <div class="surface-panel rounded-[1.6rem] p-5">
            <div class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-orange)]">Feel</div>
            <div class="mt-3 text-3xl font-semibold text-foreground">Bold</div>
            <p class="mt-2 text-sm text-muted-foreground">Higher contrast, brighter accents, and simpler decision-making surfaces.</p>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="surface-panel relative overflow-hidden rounded-[2rem] p-6 md:p-7">
          <div class="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,rgba(75,97,209,0.18),rgba(255,255,255,0))]"></div>
          <div class="relative flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-blue)]">Featured trust view</p>
              <h2 class="mt-2 text-2xl font-bold text-foreground">Kathmandu at a glance</h2>
            </div>
            <div class="rounded-full bg-[var(--theme-green)]/14 px-3 py-1 text-xs font-semibold text-[var(--theme-ink)]">Live review energy</div>
          </div>

          <div class="mt-8 rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,240,233,0.96))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-foreground">Restaurants & Cafes</p>
                <p class="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Most-searched today</p>
              </div>
              <span class="rounded-full bg-[var(--theme-blue)]/12 px-3 py-1 text-xs font-semibold text-[var(--theme-blue)]">Top confidence</span>
            </div>

            <div class="mt-6 space-y-4">
              {#each data.featuredBusinesses.slice(0, 3) as business}
                <a href="/review/{business.slug}" class="block rounded-[1.2rem] border border-border/70 bg-white p-4 hover:-translate-y-0.5 hover:border-[var(--theme-blue)]/35">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p class="font-semibold text-foreground">{business.name}</p>
                      <p class="mt-1 text-sm text-muted-foreground">{business.municipality}, {business.district}</p>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-semibold text-foreground">{business.trustScore}</div>
                      <div class="mt-1 flex justify-end gap-0.5">
                        {#each starArray(business.starRating) as filled}
                          <Star class="h-3 w-3 {filled ? 'fill-[var(--theme-green)] text-[var(--theme-green)]' : 'text-muted-foreground/35'}" />
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
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-blue)]">Curated by intent</p>
        <h2 class="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-foreground md:text-4xl">Browse categories with more presence</h2>
      </div>
      <a href="/categories" class="hidden text-sm font-semibold text-muted-foreground hover:text-foreground md:inline-flex">See all categories</a>
    </div>

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {#each data.categories as category}
        <a href="/categories/{category.slug}" class="surface-panel group rounded-[1.8rem] p-6 hover:-translate-y-1 hover:border-[var(--theme-blue)]/35">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="rounded-full bg-[var(--theme-green)]/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--theme-ink)]">
                {category.businessCount} listings
              </div>
              <h3 class="mt-4 text-2xl font-bold text-foreground">{category.name}</h3>
              <p class="mt-3 text-sm leading-6 text-muted-foreground">{category.description}</p>
            </div>
            <div class="rounded-full bg-secondary p-3 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[var(--theme-blue)]">
              <ArrowRight class="h-4 w-4" />
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<section class="border-y border-border/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),rgba(240,238,231,0.92))] py-14 md:py-18">
  <div class="section-wrap">
    <div class="mb-8 flex items-center gap-3">
      <div class="brand-badge rounded-full p-3">
        <MapPin class="h-5 w-5 text-[var(--theme-blue)]" />
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-green)]">Active reviews</p>
        <h2 class="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-foreground md:text-4xl">Businesses with visible momentum</h2>
      </div>
    </div>

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {#each data.featuredBusinesses as business}
        <a href="/review/{business.slug}" class="surface-panel group rounded-[1.8rem] p-6 hover:-translate-y-1 hover:border-[var(--theme-blue)]/35">
          <div class="flex items-center justify-between gap-3">
            <div class="rounded-[1.4rem] bg-[linear-gradient(135deg,rgba(75,97,209,0.14),rgba(255,255,255,0.86))] px-4 py-3">
              <span class="text-3xl font-semibold text-foreground">{business.trustScore}</span>
            </div>
            <div class="flex gap-1">
              {#each starArray(business.starRating) as filled}
                <Star class="h-3.5 w-3.5 {filled ? 'fill-[var(--theme-green)] text-[var(--theme-green)]' : 'text-muted-foreground/30'}" />
              {/each}
            </div>
          </div>

          <h3 class="mt-5 text-lg font-semibold text-foreground group-hover:text-[var(--theme-blue)]">{business.name}</h3>
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
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-blue)]">Platform rhythm</p>
          <h2 class="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-foreground md:text-4xl">What the experience keeps beautifully simple</h2>
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
