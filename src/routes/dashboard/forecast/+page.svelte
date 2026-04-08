<script lang="ts">
  import { TrendingUp, Target, Star, Sliders } from '@lucide/svelte';

  // Current trust score
  const currentScore = 4.2;

  // Projected scores based on mock trends
  const projections = [
    { period: '30 days', score: 4.3, delta: 0.1 },
    { period: '60 days', score: 4.4, delta: 0.2 },
    { period: '90 days', score: 4.5, delta: 0.3 },
  ];

  // "What if" slider state
  let newFiveStarReviews = $state(10);

  // Calculate projected score with additional 5-star reviews
  const whatIfScore = $derived(() => {
    const currentTotal = 156; // current total reviews
    const currentWeighted = currentScore * currentTotal;
    const newWeighted = currentWeighted + newFiveStarReviews * 5;
    const newTotal = currentTotal + newFiveStarReviews;
    return Math.min(5, Math.round((newWeighted / newTotal) * 100) / 100);
  });

  function scoreBarWidth(score: number): string {
    return `${(score / 5) * 100}%`;
  }

  function scoreColor(score: number): string {
    if (score >= 4.5) return 'bg-green-500';
    if (score >= 4.0) return 'bg-blue-500';
    if (score >= 3.5) return 'bg-yellow-500';
    return 'bg-red-500';
  }
</script>

<svelte:head>
  <title>Trust Score Forecast — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold">Trust Score Forecast</h1>
  <p class="mt-1 text-sm text-muted-foreground">See where your trust score is heading</p>

  <!-- Current Score -->
  <div class="mt-6 rounded-lg border p-6">
    <div class="flex items-center gap-3">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Star class="h-6 w-6 text-primary" />
      </div>
      <div>
        <p class="text-sm text-muted-foreground">Current Trust Score</p>
        <p class="text-3xl font-bold">{currentScore}</p>
      </div>
    </div>
    <div class="mt-4 h-3 overflow-hidden rounded-full bg-muted">
      <div class="h-full rounded-full {scoreColor(currentScore)} transition-all" style="width: {scoreBarWidth(currentScore)}"></div>
    </div>
    <p class="mt-2 text-xs text-muted-foreground">Based on 156 total reviews</p>
  </div>

  <!-- Projections -->
  <div class="mt-6">
    <div class="flex items-center gap-2">
      <TrendingUp class="h-5 w-5 text-primary" />
      <h2 class="text-lg font-semibold">Projected Scores</h2>
    </div>
    <p class="mt-1 text-sm text-muted-foreground">Based on your current review trends</p>

    <div class="mt-4 grid gap-4 sm:grid-cols-3">
      {#each projections as proj}
        <div class="rounded-lg border p-4">
          <p class="text-sm font-medium text-muted-foreground">{proj.period}</p>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-bold">{proj.score}</span>
            <span class="text-sm font-medium text-green-600 dark:text-green-400">+{proj.delta}</span>
          </div>
          <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
            <div class="h-full rounded-full {scoreColor(proj.score)} transition-all" style="width: {scoreBarWidth(proj.score)}"></div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- What If Slider -->
  <div class="mt-8 rounded-lg border p-6">
    <div class="flex items-center gap-2">
      <Sliders class="h-5 w-5 text-primary" />
      <h2 class="text-lg font-semibold">What If Scenario</h2>
    </div>
    <p class="mt-1 text-sm text-muted-foreground">See how new 5-star reviews would impact your score</p>

    <div class="mt-6">
      <div class="flex items-center justify-between">
        <label for="five-star-slider" class="text-sm font-medium">
          New 5-star reviews
        </label>
        <span class="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {newFiveStarReviews}
        </span>
      </div>

      <input
        id="five-star-slider"
        type="range"
        min="0"
        max="50"
        step="1"
        bind:value={newFiveStarReviews}
        class="mt-3 w-full accent-primary"
      />

      <div class="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span>0</span>
        <span>10</span>
        <span>20</span>
        <span>30</span>
        <span>40</span>
        <span>50</span>
      </div>
    </div>

    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <div class="rounded-lg bg-muted/50 p-4">
        <p class="text-xs text-muted-foreground">Current Score</p>
        <p class="mt-1 text-xl font-bold">{currentScore}</p>
        <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
          <div class="h-full rounded-full {scoreColor(currentScore)}" style="width: {scoreBarWidth(currentScore)}"></div>
        </div>
      </div>

      <div class="rounded-lg bg-green-50/50 p-4 dark:bg-green-950/20">
        <p class="text-xs text-muted-foreground">Projected Score</p>
        <div class="mt-1 flex items-baseline gap-2">
          <span class="text-xl font-bold">{whatIfScore()}</span>
          {#if whatIfScore() > currentScore}
            <span class="text-sm font-medium text-green-600 dark:text-green-400">
              +{(whatIfScore() - currentScore).toFixed(2)}
            </span>
          {/if}
        </div>
        <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
          <div class="h-full rounded-full {scoreColor(whatIfScore())} transition-all" style="width: {scoreBarWidth(whatIfScore())}"></div>
        </div>
      </div>
    </div>

    {#if newFiveStarReviews > 0}
      <div class="mt-4 flex items-start gap-2 rounded-md border border-green-200 bg-green-50/50 p-3 dark:border-green-900/50 dark:bg-green-950/20">
        <Target class="mt-0.5 h-4 w-4 text-green-600 dark:text-green-400" />
        <p class="text-sm text-green-700 dark:text-green-300">
          Getting <strong>{newFiveStarReviews}</strong> more 5-star reviews would raise your score to
          <strong>{whatIfScore()}</strong> out of 5.0
        </p>
      </div>
    {/if}
  </div>
</div>
