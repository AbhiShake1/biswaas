<script lang="ts">
  import { Star } from '@lucide/svelte';
  let { data } = $props();
  let business = $derived(data.business);

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, index) => index < count);
  }
</script>

{#if business}
  <a
    href="/review/{business.slug}"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-4 rounded-[1.4rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,240,233,0.96))] px-5 py-4 text-[var(--theme-ink)] no-underline shadow-[0_14px_28px_-20px_rgba(23,23,23,0.22)]"
  >
    <div class="rounded-[1rem] bg-[var(--theme-blue)] px-3 py-2 text-2xl font-bold text-white">{business.trustScore}</div>
    <div class="min-w-0">
      <div class="flex gap-1">
        {#each starArray(business.starRating) as filled}
          <Star class="h-4 w-4 {filled ? 'fill-[var(--theme-green)] text-[var(--theme-green)]' : 'text-slate-300'}" />
        {/each}
      </div>
      <div class="mt-1 truncate text-sm font-semibold">{business.name}</div>
      <div class="text-xs text-slate-600">{business.totalReviews} customer reviews</div>
    </div>
  </a>
{/if}
