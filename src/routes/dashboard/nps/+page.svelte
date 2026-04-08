<script lang="ts">
  import { TrendingUp, TrendingDown, Minus, Users } from '@lucide/svelte';

  interface NpsResponse {
    id: string;
    score: number;
    feedback: string;
    customerName: string;
    date: string;
    category: 'promoter' | 'passive' | 'detractor';
  }

  let npsScore = $state(42);
  let totalResponses = $state(156);
  let promoters = $state(68);
  let passives = $state(52);
  let detractors = $state(36);

  let responses = $state<NpsResponse[]>([
    { id: '1', score: 10, feedback: 'Excellent platform for honest reviews!', customerName: 'Rajesh S.', date: '2026-04-07', category: 'promoter' },
    { id: '2', score: 9, feedback: 'Very useful for finding trustworthy businesses.', customerName: 'Sunita K.', date: '2026-04-06', category: 'promoter' },
    { id: '3', score: 7, feedback: 'Good but needs more businesses listed.', customerName: 'Prakash M.', date: '2026-04-06', category: 'passive' },
    { id: '4', score: 8, feedback: 'Nice interface, could use a mobile app.', customerName: 'Anita T.', date: '2026-04-05', category: 'passive' },
    { id: '5', score: 3, feedback: 'Hard to navigate, verification process is confusing.', customerName: 'Bikash R.', date: '2026-04-05', category: 'detractor' },
    { id: '6', score: 10, feedback: 'Finally a review platform we can trust in Nepal!', customerName: 'Sita G.', date: '2026-04-04', category: 'promoter' },
    { id: '7', score: 6, feedback: 'Decent platform, but slow loading times.', customerName: 'Hari P.', date: '2026-04-04', category: 'passive' },
    { id: '8', score: 2, feedback: 'Could not verify my business after multiple attempts.', customerName: 'Deepak L.', date: '2026-04-03', category: 'detractor' },
  ]);

  let filterCategory = $state<'all' | 'promoter' | 'passive' | 'detractor'>('all');

  let filteredResponses = $derived(
    filterCategory === 'all' ? responses : responses.filter((r) => r.category === filterCategory)
  );

  let promoterPct = $derived(Math.round((promoters / totalResponses) * 100));
  let passivePct = $derived(Math.round((passives / totalResponses) * 100));
  let detractorPct = $derived(Math.round((detractors / totalResponses) * 100));

  function getScoreColor(score: number): string {
    if (score >= 50) return 'text-green-500';
    if (score >= 0) return 'text-yellow-500';
    return 'text-red-500';
  }

  function getCategoryColor(cat: string): string {
    if (cat === 'promoter') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (cat === 'passive') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  }

  function getScoreBadgeColor(score: number): string {
    if (score >= 9) return 'bg-green-500 text-white';
    if (score >= 7) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  }
</script>

<svelte:head>
  <title>NPS Survey — Biswaas Dashboard</title>
</svelte:head>

<div>
  <div>
    <h1 class="text-2xl font-bold">NPS Survey</h1>
    <p class="mt-1 text-sm text-muted-foreground">Track customer loyalty with Net Promoter Score</p>
  </div>

  <!-- NPS Score Card -->
  <div class="mt-8 rounded-lg border p-6 text-center">
    <p class="text-sm font-medium text-muted-foreground">Current NPS Score</p>
    <p class="mt-2 text-6xl font-bold {getScoreColor(npsScore)}">{npsScore}</p>
    <p class="mt-1 text-xs text-muted-foreground">Scale: -100 to +100</p>
    <div class="mt-4 flex items-center justify-center gap-1 text-sm">
      {#if npsScore >= 50}
        <TrendingUp class="h-4 w-4 text-green-500" />
        <span class="text-green-500">Excellent</span>
      {:else if npsScore >= 0}
        <Minus class="h-4 w-4 text-yellow-500" />
        <span class="text-yellow-500">Good — room to improve</span>
      {:else}
        <TrendingDown class="h-4 w-4 text-red-500" />
        <span class="text-red-500">Needs attention</span>
      {/if}
    </div>
  </div>

  <!-- Breakdown -->
  <div class="mt-6 grid gap-4 sm:grid-cols-3">
    <div class="rounded-lg border p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-green-600 dark:text-green-400">Promoters (9-10)</span>
        <span class="text-sm font-bold">{promoterPct}%</span>
      </div>
      <p class="mt-1 text-2xl font-bold">{promoters}</p>
      <div class="mt-2 h-2 rounded-full bg-muted">
        <div class="h-2 rounded-full bg-green-500" style="width: {promoterPct}%"></div>
      </div>
    </div>
    <div class="rounded-lg border p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-yellow-600 dark:text-yellow-400">Passives (7-8)</span>
        <span class="text-sm font-bold">{passivePct}%</span>
      </div>
      <p class="mt-1 text-2xl font-bold">{passives}</p>
      <div class="mt-2 h-2 rounded-full bg-muted">
        <div class="h-2 rounded-full bg-yellow-500" style="width: {passivePct}%"></div>
      </div>
    </div>
    <div class="rounded-lg border p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-red-600 dark:text-red-400">Detractors (0-6)</span>
        <span class="text-sm font-bold">{detractorPct}%</span>
      </div>
      <p class="mt-1 text-2xl font-bold">{detractors}</p>
      <div class="mt-2 h-2 rounded-full bg-muted">
        <div class="h-2 rounded-full bg-red-500" style="width: {detractorPct}%"></div>
      </div>
    </div>
  </div>

  <!-- Formula -->
  <div class="mt-4 rounded-md bg-muted/50 p-3 text-center text-xs text-muted-foreground">
    NPS = % Promoters - % Detractors = {promoterPct}% - {detractorPct}% = <span class="font-bold text-foreground">{promoterPct - detractorPct}</span>
  </div>

  <!-- Responses -->
  <div class="mt-8">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Recent Responses</h2>
      <div class="flex items-center gap-1">
        <Users class="h-4 w-4 text-muted-foreground" />
        <span class="text-sm text-muted-foreground">{totalResponses} total</span>
      </div>
    </div>

    <!-- Filter -->
    <div class="mt-4 flex gap-2">
      {#each [{ value: 'all', label: 'All' }, { value: 'promoter', label: 'Promoters' }, { value: 'passive', label: 'Passives' }, { value: 'detractor', label: 'Detractors' }] as filter}
        <button
          onclick={() => filterCategory = filter.value as typeof filterCategory}
          class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors {filterCategory === filter.value
            ? 'bg-primary text-primary-foreground'
            : 'border hover:bg-muted'}"
        >
          {filter.label}
        </button>
      {/each}
    </div>

    <!-- Response List -->
    <div class="mt-4 space-y-3">
      {#each filteredResponses as response}
        <div class="rounded-md border p-4">
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold {getScoreBadgeColor(response.score)}">
                {response.score}
              </span>
              <div>
                <div class="flex items-center gap-2">
                  <p class="text-sm font-medium">{response.customerName}</p>
                  <span class="rounded-full px-2 py-0.5 text-xs font-medium {getCategoryColor(response.category)}">{response.category}</span>
                </div>
                <p class="mt-1 text-sm text-muted-foreground">{response.feedback}</p>
              </div>
            </div>
            <span class="text-xs text-muted-foreground">{response.date}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
