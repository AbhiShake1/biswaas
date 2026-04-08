<script lang="ts">
  import { Star } from '@lucide/svelte';
  let { data } = $props();

  let business = $derived(data.business);

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, index) => index < count);
  }
</script>

<svelte:head>
  <style>
    html, body {
      margin: 0;
      background: transparent;
      font-family: Inter, system-ui, sans-serif;
    }
  </style>
</svelte:head>

{#if business}
  <a
    href="/review/{business.slug}"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 no-underline shadow-sm"
  >
    <div>
      <div class="text-xl font-bold leading-none">{business.trustScore}</div>
      <div class="mt-1 flex gap-0.5">
        {#each starArray(business.starRating) as filled}
          <Star class="h-3.5 w-3.5 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}" />
        {/each}
      </div>
    </div>
    <div class="min-w-0">
      <div class="truncate text-sm font-semibold">{business.name}</div>
      <div class="text-xs text-slate-500">{business.totalReviews} reviews on Biswaas</div>
    </div>
  </a>
{/if}
