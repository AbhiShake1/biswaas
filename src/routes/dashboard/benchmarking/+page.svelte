<script lang="ts">
  import { BarChart3, Trophy, Star, MessageSquare, Clock } from '@lucide/svelte';

  interface Competitor {
    name: string;
    isYou: boolean;
    trustScore: number;
    reviewVolume: number;
    responseRate: number;
    avgRating: number;
  }

  const competitors: Competitor[] = [
    {
      name: 'Your Business',
      isYou: true,
      trustScore: 4.2,
      reviewVolume: 156,
      responseRate: 68,
      avgRating: 4.2,
    },
    {
      name: 'Himalayan Consulting',
      isYou: false,
      trustScore: 3.8,
      reviewVolume: 210,
      responseRate: 45,
      avgRating: 3.9,
    },
    {
      name: 'Nepal Education Hub',
      isYou: false,
      trustScore: 4.5,
      reviewVolume: 320,
      responseRate: 82,
      avgRating: 4.6,
    },
  ];

  // Compute max values for bar widths
  const maxTrustScore = 5;
  const maxReviewVolume = Math.max(...competitors.map((c) => c.reviewVolume));
  const maxResponseRate = 100;
  const maxAvgRating = 5;

  function barWidth(value: number, max: number): string {
    return `${(value / max) * 100}%`;
  }

  function rankColor(rank: number): string {
    if (rank === 0) return 'text-yellow-500';
    if (rank === 1) return 'text-muted-foreground';
    return 'text-orange-400';
  }

  // Determine rank by trust score
  const ranked = $derived(
    [...competitors]
      .sort((a, b) => b.trustScore - a.trustScore)
      .map((c, i) => ({ ...c, rank: i + 1 }))
  );

  const yourRank = $derived(ranked.find((c) => c.isYou)?.rank ?? 0);
</script>

<svelte:head>
  <title>Competitor Benchmarking — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold">Competitor Benchmarking</h1>
  <p class="mt-1 text-sm text-muted-foreground">Compare your performance against competitors</p>

  <!-- Rank Banner -->
  <div class="mt-6 flex items-center gap-4 rounded-lg border p-4">
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
      <Trophy class="h-6 w-6 text-primary" />
    </div>
    <div>
      <p class="text-sm text-muted-foreground">Your Ranking</p>
      <p class="text-2xl font-bold">
        #{yourRank}
        <span class="text-sm font-normal text-muted-foreground">of {competitors.length} businesses</span>
      </p>
    </div>
  </div>

  <!-- Comparison Table -->
  <div class="mt-6 overflow-x-auto rounded-lg border">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b bg-muted/50">
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Business</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Trust Score</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Reviews</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Response Rate</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Avg Rating</th>
        </tr>
      </thead>
      <tbody>
        {#each ranked as comp}
          <tr class="border-b last:border-b-0 {comp.isYou ? 'bg-primary/5' : ''}">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-bold {rankColor(comp.rank - 1)}">
                  {comp.rank}
                </span>
                <span class="font-medium {comp.isYou ? 'text-primary' : ''}">{comp.name}</span>
                {#if comp.isYou}
                  <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">You</span>
                {/if}
              </div>
            </td>
            <td class="px-4 py-3 font-semibold">{comp.trustScore}</td>
            <td class="px-4 py-3">{comp.reviewVolume}</td>
            <td class="px-4 py-3">{comp.responseRate}%</td>
            <td class="px-4 py-3">{comp.avgRating}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Visual Bar Charts -->
  <div class="mt-8 space-y-8">
    <!-- Trust Score -->
    <div>
      <div class="flex items-center gap-2">
        <Star class="h-4 w-4 text-primary" />
        <h3 class="text-sm font-semibold">Trust Score</h3>
      </div>
      <div class="mt-3 space-y-2.5">
        {#each competitors as comp}
          <div class="flex items-center gap-3">
            <span class="w-40 truncate text-sm {comp.isYou ? 'font-semibold text-primary' : 'text-muted-foreground'}">
              {comp.name}
            </span>
            <div class="flex-1">
              <div class="h-6 overflow-hidden rounded bg-muted">
                <div
                  class="flex h-full items-center rounded px-2 text-[11px] font-bold text-white transition-all {comp.isYou ? 'bg-primary' : 'bg-muted-foreground/40'}"
                  style="width: {barWidth(comp.trustScore, maxTrustScore)}"
                >
                  {comp.trustScore}
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Review Volume -->
    <div>
      <div class="flex items-center gap-2">
        <MessageSquare class="h-4 w-4 text-primary" />
        <h3 class="text-sm font-semibold">Review Volume</h3>
      </div>
      <div class="mt-3 space-y-2.5">
        {#each competitors as comp}
          <div class="flex items-center gap-3">
            <span class="w-40 truncate text-sm {comp.isYou ? 'font-semibold text-primary' : 'text-muted-foreground'}">
              {comp.name}
            </span>
            <div class="flex-1">
              <div class="h-6 overflow-hidden rounded bg-muted">
                <div
                  class="flex h-full items-center rounded px-2 text-[11px] font-bold text-white transition-all {comp.isYou ? 'bg-primary' : 'bg-muted-foreground/40'}"
                  style="width: {barWidth(comp.reviewVolume, maxReviewVolume)}"
                >
                  {comp.reviewVolume}
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Response Rate -->
    <div>
      <div class="flex items-center gap-2">
        <Clock class="h-4 w-4 text-primary" />
        <h3 class="text-sm font-semibold">Response Rate</h3>
      </div>
      <div class="mt-3 space-y-2.5">
        {#each competitors as comp}
          <div class="flex items-center gap-3">
            <span class="w-40 truncate text-sm {comp.isYou ? 'font-semibold text-primary' : 'text-muted-foreground'}">
              {comp.name}
            </span>
            <div class="flex-1">
              <div class="h-6 overflow-hidden rounded bg-muted">
                <div
                  class="flex h-full items-center rounded px-2 text-[11px] font-bold text-white transition-all {comp.isYou ? 'bg-primary' : 'bg-muted-foreground/40'}"
                  style="width: {barWidth(comp.responseRate, maxResponseRate)}"
                >
                  {comp.responseRate}%
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Avg Rating -->
    <div>
      <div class="flex items-center gap-2">
        <BarChart3 class="h-4 w-4 text-primary" />
        <h3 class="text-sm font-semibold">Average Rating</h3>
      </div>
      <div class="mt-3 space-y-2.5">
        {#each competitors as comp}
          <div class="flex items-center gap-3">
            <span class="w-40 truncate text-sm {comp.isYou ? 'font-semibold text-primary' : 'text-muted-foreground'}">
              {comp.name}
            </span>
            <div class="flex-1">
              <div class="h-6 overflow-hidden rounded bg-muted">
                <div
                  class="flex h-full items-center rounded px-2 text-[11px] font-bold text-white transition-all {comp.isYou ? 'bg-primary' : 'bg-muted-foreground/40'}"
                  style="width: {barWidth(comp.avgRating, maxAvgRating)}"
                >
                  {comp.avgRating}
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
