<script lang="ts">
  import { Star, ThumbsUp } from '@lucide/svelte';
  import ReviewFilters from '$lib/components/review/ReviewFilters.svelte';

  type DateRange = 'week' | 'month' | 'year' | 'all';

  let activeFilters = $state<{
    rating: number | null;
    dateRange: DateRange;
    verifiedOnly: boolean;
    keyword: string;
    withReplies: boolean;
  }>({
    rating: null,
    dateRange: 'all',
    verifiedOnly: false,
    keyword: '',
    withReplies: false,
  });

  const allReviews = [
    { id: '1', author: 'Ram B.', stars: 5, title: 'Excellent service', body: 'Very professional and helped me get admission to my dream university in Australia. Highly recommended!', createdAt: Date.now() - 86400000 * 2, replyText: null, verified: true },
    { id: '2', author: 'Sita K.', stars: 4, title: 'Good but expensive', body: 'They provided good guidance but the consultation fee was a bit high compared to others.', createdAt: Date.now() - 86400000 * 5, replyText: null, verified: true },
    { id: '3', author: 'Hari P.', stars: 2, title: 'Delayed processing', body: 'My application took much longer than promised. Communication could be better.', createdAt: Date.now() - 86400000 * 8, replyText: 'We apologize for the delay. We have improved our processing times since then.', verified: false },
    { id: '4', author: 'Gita S.', stars: 5, title: 'Best consultancy in Kathmandu', body: 'They walked me through every step of the process. Got my visa on the first attempt!', createdAt: Date.now() - 86400000 * 14, replyText: null, verified: true },
    { id: '5', author: 'Bikash M.', stars: 3, title: 'Average experience', body: 'The service was okay but nothing exceptional. Staff were helpful but the office was crowded.', createdAt: Date.now() - 86400000 * 20, replyText: null, verified: false },
    { id: '6', author: 'Anita T.', stars: 1, title: 'Very disappointed', body: 'They promised a lot during consultation but delivered very little. Would not recommend.', createdAt: Date.now() - 86400000 * 25, replyText: null, verified: true },
  ];

  function getDateThreshold(range: DateRange): number {
    const now = Date.now();
    switch (range) {
      case 'week': return now - 7 * 86400000;
      case 'month': return now - 30 * 86400000;
      case 'year': return now - 365 * 86400000;
      default: return 0;
    }
  }

  const reviews = $derived(
    allReviews.filter(r => {
      if (activeFilters.rating !== null && r.stars !== activeFilters.rating) return false;
      if (activeFilters.dateRange !== 'all' && r.createdAt < getDateThreshold(activeFilters.dateRange)) return false;
      if (activeFilters.verifiedOnly && !r.verified) return false;
      if (activeFilters.withReplies && !r.replyText) return false;
      if (activeFilters.keyword) {
        const kw = activeFilters.keyword.toLowerCase();
        if (!r.title.toLowerCase().includes(kw) && !r.body.toLowerCase().includes(kw)) return false;
      }
      return true;
    })
  );

  let replyingTo = $state<string | null>(null);
  let replyText = $state('');

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }

  function submitReply(reviewId: string) {
    replyingTo = null;
    replyText = '';
  }
</script>

<svelte:head>
  <title>Reviews — Dashboard — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold">Reviews</h1>
  <p class="mt-1 text-sm text-muted-foreground">Manage and respond to all your business reviews</p>

  <div class="mt-6">
    <ReviewFilters onfilter={(f) => activeFilters = f} />
  </div>

  <div class="mt-4 space-y-4">
    {#if reviews.length === 0}
      <div class="rounded-lg border border-dashed p-8 text-center">
        <p class="text-sm text-muted-foreground">No reviews match your filters.</p>
      </div>
    {/if}
    {#each reviews as review}
      <div class="rounded-lg border p-4">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-medium">{review.author}</span>
              <span class="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
            </div>
            <div class="mt-1 flex items-center gap-1">
              {#each starArray(review.stars) as filled}
                <Star class="h-4 w-4 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
              {/each}
            </div>
          </div>
          {#if !review.replyText}
            <button
              onclick={() => replyingTo = replyingTo === review.id ? null : review.id}
              class="flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              <ThumbsUp class="h-3 w-3" /> Reply
            </button>
          {/if}
        </div>

        <h3 class="mt-2 font-medium">{review.title}</h3>
        <p class="mt-1 text-sm text-muted-foreground">{review.body}</p>

        {#if review.replyText}
          <div class="mt-3 rounded-md bg-muted/50 p-3">
            <p class="text-xs font-medium">Your reply</p>
            <p class="mt-1 text-sm text-muted-foreground">{review.replyText}</p>
          </div>
        {/if}

        {#if replyingTo === review.id}
          <div class="mt-3 space-y-2">
            <textarea
              bind:value={replyText}
              placeholder="Write your reply..."
              rows="3"
              class="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            ></textarea>
            <div class="flex gap-2">
              <button
                onclick={() => submitReply(review.id)}
                class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                Send Reply
              </button>
              <button
                onclick={() => { replyingTo = null; replyText = ''; }}
                class="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
