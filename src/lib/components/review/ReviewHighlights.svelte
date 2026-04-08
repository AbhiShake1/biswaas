<script lang="ts">
  import { Star, ThumbsUp, Clock } from '@lucide/svelte';

  type Review = {
    id: string;
    author: string;
    stars: number;
    title: string;
    body: string;
    createdAt: number;
    helpfulCount: number;
  };

  let { reviews = [] }: { reviews: Review[] } = $props();

  const mostHelpful = $derived(
    [...reviews].sort((a, b) => b.helpfulCount - a.helpfulCount)[0] ?? null
  );

  const mostRecent = $derived(
    [...reviews].sort((a, b) => b.createdAt - a.createdAt)[0] ?? null
  );

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
</script>

{#if mostHelpful || mostRecent}
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Featured Reviews</h3>

    <div class="grid gap-4 sm:grid-cols-2">
      {#if mostHelpful}
        <div class="rounded-lg border bg-yellow-50/50 p-4 dark:bg-yellow-950/10">
          <div class="flex items-center gap-1.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
            <ThumbsUp class="h-3.5 w-3.5" /> Most Helpful
          </div>
          <div class="mt-2 flex items-center gap-1">
            {#each starArray(mostHelpful.stars) as filled}
              <Star class="h-3.5 w-3.5 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
            {/each}
          </div>
          <h4 class="mt-1.5 text-sm font-medium">{mostHelpful.title}</h4>
          <p class="mt-1 line-clamp-2 text-xs text-muted-foreground">{mostHelpful.body}</p>
          <p class="mt-2 text-[10px] text-muted-foreground">
            {mostHelpful.author} - {formatDate(mostHelpful.createdAt)} - {mostHelpful.helpfulCount} found helpful
          </p>
        </div>
      {/if}

      {#if mostRecent && mostRecent.id !== mostHelpful?.id}
        <div class="rounded-lg border bg-blue-50/50 p-4 dark:bg-blue-950/10">
          <div class="flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400">
            <Clock class="h-3.5 w-3.5" /> Most Recent
          </div>
          <div class="mt-2 flex items-center gap-1">
            {#each starArray(mostRecent.stars) as filled}
              <Star class="h-3.5 w-3.5 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
            {/each}
          </div>
          <h4 class="mt-1.5 text-sm font-medium">{mostRecent.title}</h4>
          <p class="mt-1 line-clamp-2 text-xs text-muted-foreground">{mostRecent.body}</p>
          <p class="mt-2 text-[10px] text-muted-foreground">
            {mostRecent.author} - {formatDate(mostRecent.createdAt)}
          </p>
        </div>
      {/if}
    </div>
  </div>
{/if}
