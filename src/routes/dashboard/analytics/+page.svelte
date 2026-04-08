<script lang="ts">
  import { TrendingUp, TrendingDown, MessageSquare, Star, Clock, BarChart3, Hash } from '@lucide/svelte';

  // Mock monthly review volume data (last 12 months)
  const monthlyVolume = [
    { month: 'May', count: 8 },
    { month: 'Jun', count: 12 },
    { month: 'Jul', count: 15 },
    { month: 'Aug', count: 10 },
    { month: 'Sep', count: 18 },
    { month: 'Oct', count: 22 },
    { month: 'Nov', count: 14 },
    { month: 'Dec', count: 9 },
    { month: 'Jan', count: 16 },
    { month: 'Feb', count: 20 },
    { month: 'Mar', count: 25 },
    { month: 'Apr', count: 19 },
  ];

  const maxCount = Math.max(...monthlyVolume.map(m => m.count));

  // Rating trend over time (monthly averages)
  const ratingTrend = [
    { month: 'May', avg: 3.8 },
    { month: 'Jun', avg: 3.9 },
    { month: 'Jul', avg: 4.1 },
    { month: 'Aug', avg: 3.7 },
    { month: 'Sep', avg: 4.0 },
    { month: 'Oct', avg: 4.2 },
    { month: 'Nov', avg: 4.3 },
    { month: 'Dec', avg: 4.1 },
    { month: 'Jan', avg: 4.4 },
    { month: 'Feb', avg: 4.2 },
    { month: 'Mar', avg: 4.5 },
    { month: 'Apr', avg: 4.3 },
  ];

  // Top keywords from reviews
  const topKeywords = [
    { word: 'professional', count: 42, sentiment: 'positive' },
    { word: 'helpful', count: 38, sentiment: 'positive' },
    { word: 'university', count: 35, sentiment: 'neutral' },
    { word: 'visa', count: 31, sentiment: 'neutral' },
    { word: 'quick', count: 28, sentiment: 'positive' },
    { word: 'expensive', count: 22, sentiment: 'negative' },
    { word: 'friendly', count: 20, sentiment: 'positive' },
    { word: 'delayed', count: 15, sentiment: 'negative' },
    { word: 'recommended', count: 14, sentiment: 'positive' },
    { word: 'communication', count: 12, sentiment: 'neutral' },
  ];

  const maxKeyword = Math.max(...topKeywords.map(k => k.count));

  const sentimentColors: Record<string, string> = {
    positive: 'bg-green-500',
    neutral: 'bg-blue-500',
    negative: 'bg-red-500',
  };

  const sentimentBadge: Record<string, string> = {
    positive: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    neutral: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    negative: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  // Summary stats
  const overallRating = 4.2;
  const totalReviews = 188;
  const responseRate = 68;
  const avgResponseTime = '4.2 hrs';

  // Rating distribution
  const ratingDistribution = [
    { stars: 5, count: 76, pct: 40 },
    { stars: 4, count: 52, pct: 28 },
    { stars: 3, count: 30, pct: 16 },
    { stars: 2, count: 18, pct: 10 },
    { stars: 1, count: 12, pct: 6 },
  ];
</script>

<svelte:head>
  <title>Analytics — Dashboard — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold">Analytics</h1>
  <p class="mt-1 text-sm text-muted-foreground">Track your review performance and customer sentiment</p>

  <!-- Summary Cards -->
  <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div class="rounded-lg border p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">Average Rating</span>
        <Star class="h-4 w-4 text-yellow-400" />
      </div>
      <div class="mt-2 flex items-baseline gap-1">
        <span class="text-3xl font-bold">{overallRating}</span>
        <span class="text-sm text-muted-foreground">/5</span>
      </div>
      <div class="mt-1 flex items-center gap-1 text-xs text-green-600">
        <TrendingUp class="h-3 w-3" /> +0.3 from last month
      </div>
    </div>

    <div class="rounded-lg border p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">Total Reviews</span>
        <MessageSquare class="h-4 w-4 text-muted-foreground" />
      </div>
      <div class="mt-2 text-3xl font-bold">{totalReviews}</div>
      <div class="mt-1 flex items-center gap-1 text-xs text-green-600">
        <TrendingUp class="h-3 w-3" /> +19 this month
      </div>
    </div>

    <div class="rounded-lg border p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">Response Rate</span>
        <Clock class="h-4 w-4 text-muted-foreground" />
      </div>
      <div class="mt-2 flex items-baseline gap-1">
        <span class="text-3xl font-bold">{responseRate}</span>
        <span class="text-sm text-muted-foreground">%</span>
      </div>
      <div class="mt-1 flex items-center gap-1 text-xs text-red-600">
        <TrendingDown class="h-3 w-3" /> -2% from last month
      </div>
    </div>

    <div class="rounded-lg border p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">Avg Response Time</span>
        <Clock class="h-4 w-4 text-muted-foreground" />
      </div>
      <div class="mt-2 text-3xl font-bold">{avgResponseTime}</div>
      <div class="mt-1 flex items-center gap-1 text-xs text-green-600">
        <TrendingUp class="h-3 w-3" /> 1.5 hrs faster
      </div>
    </div>
  </div>

  <!-- Review Volume Chart -->
  <div class="mt-8 rounded-lg border p-6">
    <div class="flex items-center gap-2">
      <BarChart3 class="h-5 w-5" />
      <h2 class="text-lg font-semibold">Review Volume by Month</h2>
    </div>
    <p class="mt-1 text-sm text-muted-foreground">Number of reviews received each month over the past year</p>

    <div class="mt-6 flex items-end gap-2" style="height: 200px;">
      {#each monthlyVolume as { month, count }}
        <div class="flex flex-1 flex-col items-center gap-1">
          <span class="text-xs font-medium">{count}</span>
          <div
            class="w-full rounded-t-md bg-primary transition-all hover:bg-primary/80"
            style="height: {(count / maxCount) * 100}%;"
            title="{month}: {count} reviews"
          ></div>
          <span class="text-[10px] text-muted-foreground">{month}</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- Rating Trend + Distribution -->
  <div class="mt-6 grid gap-6 lg:grid-cols-2">
    <!-- Rating Trend -->
    <div class="rounded-lg border p-6">
      <h2 class="text-lg font-semibold">Rating Trend</h2>
      <p class="mt-1 text-sm text-muted-foreground">Average rating per month</p>

      <div class="mt-4 space-y-2">
        {#each ratingTrend as { month, avg }}
          <div class="flex items-center gap-3">
            <span class="w-8 text-xs text-muted-foreground">{month}</span>
            <div class="flex-1">
              <div class="h-6 overflow-hidden rounded-md bg-muted">
                <div
                  class="flex h-full items-center rounded-md px-2 text-xs font-medium text-primary-foreground transition-all {avg >= 4.0 ? 'bg-green-500' : avg >= 3.0 ? 'bg-yellow-500' : 'bg-red-500'}"
                  style="width: {(avg / 5) * 100}%;"
                >
                  {avg.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Rating Distribution -->
    <div class="rounded-lg border p-6">
      <h2 class="text-lg font-semibold">Rating Distribution</h2>
      <p class="mt-1 text-sm text-muted-foreground">Breakdown of all reviews by star rating</p>

      <div class="mt-4 space-y-3">
        {#each ratingDistribution as { stars, count, pct }}
          <div class="flex items-center gap-3">
            <div class="flex w-12 items-center gap-0.5">
              <Star class="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span class="text-sm font-medium">{stars}</span>
            </div>
            <div class="flex-1">
              <div class="h-5 overflow-hidden rounded-full bg-muted">
                <div
                  class="h-full rounded-full bg-yellow-400 transition-all"
                  style="width: {pct}%;"
                ></div>
              </div>
            </div>
            <span class="w-16 text-right text-xs text-muted-foreground">{count} ({pct}%)</span>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Top Keywords -->
  <div class="mt-6 rounded-lg border p-6">
    <div class="flex items-center gap-2">
      <Hash class="h-5 w-5" />
      <h2 class="text-lg font-semibold">Top Keywords</h2>
    </div>
    <p class="mt-1 text-sm text-muted-foreground">Most frequently mentioned words in reviews</p>

    <div class="mt-4 space-y-2">
      {#each topKeywords as { word, count, sentiment }}
        <div class="flex items-center gap-3">
          <span class="w-28 truncate text-sm font-medium">{word}</span>
          <div class="flex-1">
            <div class="h-5 overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full transition-all {sentimentColors[sentiment]}"
                style="width: {(count / maxKeyword) * 100}%;"
              ></div>
            </div>
          </div>
          <span class="w-10 text-right text-xs text-muted-foreground">{count}</span>
          <span class="inline-flex w-16 items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-medium {sentimentBadge[sentiment]}">
            {sentiment}
          </span>
        </div>
      {/each}
    </div>
  </div>
</div>
