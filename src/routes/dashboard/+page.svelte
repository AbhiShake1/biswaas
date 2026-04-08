<script lang="ts">
  import { Star, MessageSquare, TrendingUp, BarChart3, Pencil, Code, ThumbsUp } from '@lucide/svelte';

  // Mock data
  const stats = {
    trustScore: 4.2,
    totalReviews: 156,
    monthReviews: 12,
    ratingDistribution: { five: 76, four: 52, three: 15, two: 8, one: 5 },
  };

  const total = Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0);

  const recentReviews = [
    { id: '1', author: 'Ram B.', stars: 5, title: 'Excellent service', body: 'Very professional and helped me get admission to my dream university.', createdAt: Date.now() - 86400000 * 2 },
    { id: '2', author: 'Sita K.', stars: 4, title: 'Good but expensive', body: 'They provided good guidance but the consultation fee was a bit high.', createdAt: Date.now() - 86400000 * 5 },
    { id: '3', author: 'Hari P.', stars: 2, title: 'Delayed processing', body: 'My application took much longer than promised.', createdAt: Date.now() - 86400000 * 8 },
  ];

  let replyingTo = $state<string | null>(null);
  let replyText = $state('');

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }

  function submitReply(reviewId: string) {
    // Mock - would send to API
    replyingTo = null;
    replyText = '';
  }
</script>

<svelte:head>
  <title>Dashboard — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold">Dashboard</h1>
  <p class="mt-1 text-sm text-muted-foreground">Manage your business presence on Biswaas</p>

  <!-- Stats Cards -->
  <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div class="rounded-lg border p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">Trust Score</span>
        <TrendingUp class="h-4 w-4 text-muted-foreground" />
      </div>
      <div class="mt-2 flex items-baseline gap-1">
        <span class="text-3xl font-bold">{stats.trustScore}</span>
        <span class="text-sm text-muted-foreground">/5</span>
      </div>
    </div>

    <div class="rounded-lg border p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">Total Reviews</span>
        <MessageSquare class="h-4 w-4 text-muted-foreground" />
      </div>
      <div class="mt-2 text-3xl font-bold">{stats.totalReviews}</div>
    </div>

    <div class="rounded-lg border p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">This Month</span>
        <Star class="h-4 w-4 text-muted-foreground" />
      </div>
      <div class="mt-2 text-3xl font-bold">{stats.monthReviews}</div>
    </div>

    <div class="rounded-lg border p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">Rating Distribution</span>
        <BarChart3 class="h-4 w-4 text-muted-foreground" />
      </div>
      <div class="mt-2 space-y-1">
        {#each [['5', stats.ratingDistribution.five], ['4', stats.ratingDistribution.four], ['3', stats.ratingDistribution.three], ['2', stats.ratingDistribution.two], ['1', stats.ratingDistribution.one]] as [label, count]}
          <div class="flex items-center gap-1 text-xs">
            <span class="w-2">{label}</span>
            <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div class="h-full rounded-full bg-yellow-400" style="width: {(Number(count) / total * 100)}%"></div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Quick Links -->
  <div class="mt-6 flex flex-wrap gap-3">
    <a href="/dashboard/profile" class="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
      <Pencil class="h-4 w-4" /> Edit Profile
    </a>
    <a href="/dashboard/widgets" class="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
      <Code class="h-4 w-4" /> Manage Widgets
    </a>
  </div>

  <!-- Recent Reviews -->
  <div class="mt-8">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Recent Reviews</h2>
      <a href="/dashboard/reviews" class="text-sm text-primary hover:underline">View all</a>
    </div>

    <div class="mt-4 space-y-4">
      {#each recentReviews as review}
        <div class="rounded-lg border p-4">
          <div class="flex items-start justify-between">
            <div>
              <span class="font-medium">{review.author}</span>
              <div class="mt-1 flex items-center gap-1">
                {#each starArray(review.stars) as filled}
                  <Star class="h-3 w-3 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
                {/each}
                <span class="ml-2 text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
              </div>
            </div>
            <button
              onclick={() => replyingTo = replyingTo === review.id ? null : review.id}
              class="flex items-center gap-1 rounded-md border px-3 py-1 text-xs font-medium hover:bg-muted"
            >
              <ThumbsUp class="h-3 w-3" /> Reply
            </button>
          </div>

          <h3 class="mt-2 font-medium">{review.title}</h3>
          <p class="mt-1 text-sm text-muted-foreground">{review.body}</p>

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
</div>
