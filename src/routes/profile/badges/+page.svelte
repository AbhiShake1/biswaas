<script lang="ts">
  import { Award, Star, ThumbsUp, BookOpen, Layers } from '@lucide/svelte';

  const badges = [
    {
      name: 'First Review',
      description: 'Write your very first review on Biswaas',
      tier: 'bronze',
      icon: Star,
      progress: 1,
      target: 1,
      earned: true,
      earnedDate: '2026-01-15',
    },
    {
      name: '5 Reviews',
      description: 'Write 5 reviews to earn this silver badge',
      tier: 'silver',
      icon: Award,
      progress: 3,
      target: 5,
      earned: false,
    },
    {
      name: '10 Reviews',
      description: 'Reach 10 reviews for gold status',
      tier: 'gold',
      icon: Award,
      progress: 3,
      target: 10,
      earned: false,
    },
    {
      name: 'Helpful Reviewer',
      description: 'Receive 50 helpful votes from other users',
      tier: 'gold',
      icon: ThumbsUp,
      progress: 12,
      target: 50,
      earned: false,
    },
    {
      name: 'Category Expert',
      description: 'Write 10 reviews in a single category',
      tier: 'silver',
      icon: Layers,
      progress: 2,
      target: 10,
      earned: false,
    },
  ];

  const tierColors: Record<string, { bg: string; text: string; border: string; bar: string }> = {
    bronze: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', bar: 'bg-orange-400' },
    silver: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-300', bar: 'bg-gray-400' },
    gold: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300', bar: 'bg-yellow-400' },
  };
</script>

<svelte:head>
  <title>My Badges — Biswaas</title>
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-8">
  <div class="flex items-center gap-3">
    <Award class="h-7 w-7 text-primary" />
    <div>
      <h1 class="text-2xl font-bold">My Badges</h1>
      <p class="text-sm text-muted-foreground">Track your achievements and progress on Biswaas</p>
    </div>
  </div>

  <!-- Summary -->
  <div class="mt-6 flex gap-4">
    <div class="rounded-lg border px-4 py-3 text-center">
      <div class="text-2xl font-bold">{badges.filter(b => b.earned).length}</div>
      <div class="text-xs text-muted-foreground">Earned</div>
    </div>
    <div class="rounded-lg border px-4 py-3 text-center">
      <div class="text-2xl font-bold">{badges.filter(b => !b.earned).length}</div>
      <div class="text-xs text-muted-foreground">In Progress</div>
    </div>
  </div>

  <!-- Badge Cards -->
  <div class="mt-8 space-y-4">
    {#each badges as badge}
      {@const colors = tierColors[badge.tier]}
      {@const pct = Math.min(100, Math.round((badge.progress / badge.target) * 100))}
      <div class="rounded-lg border p-5 {badge.earned ? colors.bg : ''}">
        <div class="flex items-start gap-4">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 {badge.earned ? colors.border : 'border-muted'}">
            <badge.icon class="h-6 w-6 {badge.earned ? colors.text : 'text-muted-foreground'}" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="font-semibold">{badge.name}</h3>
              <span class="rounded-full px-2 py-0.5 text-xs font-medium capitalize {colors.bg} {colors.text}">
                {badge.tier}
              </span>
              {#if badge.earned}
                <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Earned</span>
              {/if}
            </div>
            <p class="mt-1 text-sm text-muted-foreground">{badge.description}</p>

            {#if !badge.earned}
              <div class="mt-3">
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{badge.progress} / {badge.target}</span>
                  <span>{pct}%</span>
                </div>
                <div class="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div class="h-full rounded-full transition-all {colors.bar}" style="width: {pct}%"></div>
                </div>
              </div>
            {:else}
              <p class="mt-2 text-xs text-muted-foreground">Earned on {badge.earnedDate}</p>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
