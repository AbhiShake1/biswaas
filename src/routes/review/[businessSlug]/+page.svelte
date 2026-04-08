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
          <a href="/review/{business.slug}/write" class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
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

              {#if review.replies && review.replies.length > 0}
                <div class="mt-4 space-y-3 border-l border-muted pl-4">
                  {#each review.replies as reply}
                    <div class="rounded-md bg-muted/40 p-3">
                      <div class="flex items-center gap-2 text-xs">
                        <span class="font-semibold text-foreground">{reply.author}</span>
                        <span class="text-muted-foreground">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p class="mt-1 text-sm text-muted-foreground">{reply.body}</p>
                    </div>
                  {/each}
                </div>
              {/if}

              <div class="mt-4 rounded-lg border border-dashed p-3">
                <div class="mb-2 flex items-center gap-2 text-sm font-medium">
                  <MessageSquareReply class="h-4 w-4" />
                  <span>Reply to this comment</span>
                </div>

                {#if currentUser}
                  <form method="POST" action="?/reply">
                    <input type="hidden" name="reviewId" value={review.id} />
                    <textarea
                      data-testid="reply-input"
                      data-review-id={review.id}
                      class="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Add your reply"
                      name="body"
                    ></textarea>
                    <div class="mt-3 flex items-center justify-between">
                      <span class="text-xs text-muted-foreground">Posting as {currentUser.name}</span>
                      <button
                        data-testid="reply-submit"
                        data-review-id={review.id}
                        class="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
                    <a href="/auth/login" class="font-medium text-primary hover:underline">Sign in</a>
                    to reply to this comment.
                  </p>
                {/if}
              </div>
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

        <div class="mt-6 border-t pt-4">
          <p class="text-xs text-muted-foreground">Need to show this rating elsewhere?</p>
          <a href="/review/{business.slug}/embed" class="mt-2 block rounded-md border px-3 py-2 text-center text-sm font-medium hover:bg-muted">
            Get Embeddable Widgets
          </a>
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
