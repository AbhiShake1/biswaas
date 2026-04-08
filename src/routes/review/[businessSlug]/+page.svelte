<script lang="ts">
  import { Globe, MapPin, MessageSquareReply, Phone, Star } from '@lucide/svelte';
  let { data, form }: { data: import('./$types').PageData; form: any } = $props();

  let business = $derived(data.business);
  let currentUser = $derived(data.user ?? null);

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
  <meta
    name="description"
    content={business ? `Read ${business.totalReviews} reviews for ${business.name}. Trust Score ${business.trustScore}/5.` : 'Read business ratings and reviews on Biswaas.'}
  />
</svelte:head>

{#if business}
  <section class="relative overflow-hidden px-4 py-10 md:py-14">
    <div class="absolute left-[-2rem] top-20 h-24 w-40 rounded-tr-[2rem] rounded-br-[4rem] rounded-tl-[4rem] bg-[var(--theme-yellow)]"></div>
    <div class="absolute right-[-2rem] top-0 h-28 w-28 rounded-full bg-[var(--theme-orange)]/90"></div>

    <div class="relative mx-auto max-w-6xl">
      <nav class="mb-6 text-sm text-muted-foreground">
        <a href="/" class="hover:text-foreground">Home</a>
        <span class="mx-1">/</span>
        <a href="/categories" class="hover:text-foreground">Categories</a>
        <span class="mx-1">/</span>
        <a href="/categories/{business.categorySlug}" class="hover:text-foreground">{business.categoryName}</a>
        <span class="mx-1">/</span>
        <span class="text-foreground">{business.name}</span>
      </nav>

      <div class="surface-panel rounded-[2rem] p-6 md:p-8">
        <div class="flex flex-col gap-6 md:flex-row md:items-start">
          <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.6rem] bg-[var(--theme-green)] text-2xl font-bold text-[var(--theme-ink)] shadow-[0_18px_36px_-26px_rgba(23,214,148,0.65)]">
            {business.name.charAt(0)}
          </div>

          <div class="flex-1">
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--theme-blue)]">Business details</p>
                <h1 class="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-foreground md:text-4xl">{business.name}</h1>
                <p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{business.description}</p>
              </div>

              <div class="rounded-[1.6rem] bg-[linear-gradient(135deg,rgba(75,97,209,0.14),rgba(255,255,255,0.94))] px-5 py-4 text-center shadow-[0_16px_34px_-24px_rgba(75,97,209,0.45)]">
                <div class="text-3xl font-bold text-foreground">{business.trustScore}</div>
                <div class="mt-2 flex justify-center gap-1">
                  {#each starArray(business.starRating) as filled}
                    <Star class="h-4 w-4 {filled ? 'fill-[var(--theme-green)] text-[var(--theme-green)]' : 'text-muted-foreground/30'}" />
                  {/each}
                </div>
                <p class="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{business.totalReviews} reviews</p>
              </div>
            </div>

            <div class="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <div class="rounded-[1.2rem] bg-background/70 px-4 py-3">
                <div class="flex items-center gap-2">
                  <MapPin class="h-4 w-4 text-[var(--theme-blue)]" />
                  <span>{business.address}</span>
                </div>
              </div>
              <div class="rounded-[1.2rem] bg-background/70 px-4 py-3">
                <div class="flex items-center gap-2">
                  <Globe class="h-4 w-4 text-[var(--theme-blue)]" />
                  <span class="truncate">{business.websiteUrl}</span>
                </div>
              </div>
              <div class="rounded-[1.2rem] bg-background/70 px-4 py-3">
                <div class="flex items-center gap-2">
                  <Phone class="h-4 w-4 text-[var(--theme-blue)]" />
                  <span>{business.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div class="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold text-foreground">Comments and Ratings</h2>
              <p class="text-sm text-muted-foreground">{business.totalReviews} reviews from customers</p>
            </div>
            <a
              href="/review/{business.slug}/write"
              class="rounded-full bg-[var(--theme-blue)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_-20px_rgba(75,97,209,0.72)] hover:-translate-y-0.5"
            >
              Write a Review
            </a>
          </div>

          <div class="space-y-4">
            {#each business.reviews as review}
              <article class="surface-panel rounded-[1.8rem] p-5">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-foreground">{review.author}</span>
                      {#if review.source === 'imported'}
                        <span class="rounded-full bg-[var(--theme-yellow)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-ink)]">
                          Imported
                        </span>
                      {/if}
                    </div>
                    <div class="mt-2 flex items-center gap-1">
                      {#each starArray(review.stars) as filled}
                        <Star class="h-4 w-4 {filled ? 'fill-[var(--theme-green)] text-[var(--theme-green)]' : 'text-muted-foreground/30'}" />
                      {/each}
                      <span class="ml-2 text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <h3 class="mt-3 text-lg font-semibold text-foreground">{review.title}</h3>
                <p class="mt-2 text-sm leading-6 text-muted-foreground">{review.body}</p>

                {#if review.replies && review.replies.length > 0}
                  <div class="mt-4 space-y-3 border-l border-[var(--theme-blue)]/20 pl-4">
                    {#each review.replies as reply}
                      <div class="rounded-[1.2rem] bg-[var(--theme-blue)]/6 p-4">
                        <div class="flex items-center gap-2 text-xs">
                          <span class="font-semibold text-foreground">{reply.author}</span>
                          <span class="text-muted-foreground">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p class="mt-2 text-sm text-muted-foreground">{reply.body}</p>
                      </div>
                    {/each}
                  </div>
                {/if}

                <div class="mt-5 rounded-[1.4rem] border border-dashed border-border/80 bg-background/45 p-4">
                  <div class="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <MessageSquareReply class="h-4 w-4 text-[var(--theme-blue)]" />
                    <span>Reply to this comment</span>
                  </div>

                  {#if currentUser}
                    <form method="POST" action="?/reply">
                      <input type="hidden" name="reviewId" value={review.id} />
                      <textarea
                        data-testid="reply-input"
                        data-review-id={review.id}
                        class="min-h-24 w-full rounded-[1.2rem] border bg-white px-4 py-3 text-sm outline-none focus:border-[var(--theme-blue)] focus:ring-1 focus:ring-[var(--theme-blue)]"
                        placeholder="Add your reply"
                        name="body"
                      ></textarea>
                      <div class="mt-3 flex items-center justify-between gap-3">
                        <span class="text-xs text-muted-foreground">Posting as {currentUser.name}</span>
                        <button
                          data-testid="reply-submit"
                          data-review-id={review.id}
                          class="rounded-full bg-[var(--theme-blue)] px-4 py-2 text-sm font-semibold text-white"
                          type="submit"
                        >
                          Reply
                        </button>
                      </div>
                      {#if form?.replyError && form?.replyReviewId === review.id}
                        <p class="mt-2 text-sm text-destructive">{form.replyError}</p>
                      {/if}
                      {#if form?.replySuccess && form?.replyReviewId === review.id}
                        <p class="mt-2 text-sm text-green-700">Reply posted.</p>
                      {/if}
                    </form>
                  {:else}
                    <p class="text-sm text-muted-foreground">
                      <a href="/auth/login" class="font-semibold text-[var(--theme-blue)] hover:underline">Sign in</a>
                      to reply to this comment.
                    </p>
                  {/if}
                </div>
              </article>
            {/each}
          </div>
        </div>

        <aside class="surface-panel sticky top-24 rounded-[1.8rem] p-6">
          <div class="text-center">
            <div class="text-4xl font-bold text-foreground">{business.trustScore}</div>
            <div class="mt-2 flex items-center justify-center gap-1">
              {#each starArray(business.starRating) as filled}
                <Star class="h-5 w-5 {filled ? 'fill-[var(--theme-green)] text-[var(--theme-green)]' : 'text-muted-foreground/30'}" />
              {/each}
            </div>
            <p class="mt-2 text-sm text-muted-foreground">Based on {business.totalReviews} reviews</p>
          </div>

          <div class="mt-6 rounded-[1.4rem] bg-background/70 p-4 text-sm">
            <p class="font-semibold text-foreground">Area</p>
            <p class="mt-1 text-muted-foreground">{business.municipality}, {business.district}</p>
          </div>

          <div class="mt-6 space-y-3">
            {#each [['5', business.ratingDistribution.five], ['4', business.ratingDistribution.four], ['3', business.ratingDistribution.three], ['2', business.ratingDistribution.two], ['1', business.ratingDistribution.one]] as [label, count]}
              <div class="flex items-center gap-2 text-sm">
                <span class="w-3 text-foreground">{label}</span>
                <Star class="h-3 w-3 text-[var(--theme-green)]" />
                <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div class="h-full rounded-full bg-[var(--theme-blue)]" style="width: {(Number(count) / total) * 100}%"></div>
                </div>
                <span class="w-8 text-right text-xs text-muted-foreground">{count}</span>
              </div>
            {/each}
          </div>

          <div class="mt-6 border-t border-border/60 pt-4">
            <p class="text-xs uppercase tracking-[0.18em] text-muted-foreground">Need to show this rating elsewhere?</p>
            <a
              href="/review/{business.slug}/embed"
              class="mt-3 block rounded-full border border-border/80 bg-white px-4 py-3 text-center text-sm font-semibold text-foreground shadow-[0_14px_28px_-22px_rgba(23,23,23,0.24)] hover:border-[var(--theme-blue)]/35"
            >
              Get Embeddable Widgets
            </a>
          </div>
        </aside>
      </div>
    </div>
  </section>
{:else}
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-2xl font-bold">Business not found</h1>
    <p class="mt-2 text-muted-foreground">The requested business could not be found in the current focused dataset.</p>
  </div>
{/if}
