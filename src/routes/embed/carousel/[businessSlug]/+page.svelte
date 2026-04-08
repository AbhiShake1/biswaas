<script lang="ts">
  import { Star } from '@lucide/svelte';
  let { data } = $props();
  let business = $derived(data.business);

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, index) => index < count);
  }
</script>

{#if business}
  <div class="rounded-[1.6rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,240,233,0.96))] p-4 text-[var(--theme-ink)] shadow-[0_16px_34px_-24px_rgba(23,23,23,0.22)]">
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <div class="text-sm font-semibold">{business.name}</div>
        <div class="text-xs text-slate-600">Recent reviews from Biswaas</div>
      </div>
      <a href="/review/{business.slug}" target="_blank" rel="noopener noreferrer" class="rounded-full bg-[var(--theme-blue)] px-3 py-1.5 text-xs font-semibold text-white no-underline">
        View all
      </a>
    </div>

    <div class="flex gap-3 overflow-x-auto pb-2">
      {#each business.reviews as review}
        <article class="w-64 shrink-0 rounded-[1.25rem] border border-slate-200 bg-white p-4">
          <div class="flex gap-1">
            {#each starArray(review.stars) as filled}
              <Star class="h-3.5 w-3.5 {filled ? 'fill-[var(--theme-green)] text-[var(--theme-green)]' : 'text-slate-300'}" />
            {/each}
          </div>
          <h2 class="mt-3 text-sm font-semibold">{review.title}</h2>
          <p class="mt-2 line-clamp-4 text-xs leading-5 text-slate-600">{review.body}</p>
          <div class="mt-3 text-xs font-medium text-slate-700">{review.author}</div>
        </article>
      {/each}
    </div>
  </div>
{/if}
