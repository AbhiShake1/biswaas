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
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <div class="text-sm font-semibold">{business.name}</div>
        <div class="text-xs text-slate-500">Recent reviews from Biswaas</div>
      </div>
      <a href="/review/{business.slug}" target="_blank" rel="noopener noreferrer" class="text-xs font-medium text-slate-600 no-underline">
        View all
      </a>
    </div>

    <div class="flex gap-3 overflow-x-auto pb-2">
      {#each business.reviews as review}
        <article class="w-64 shrink-0 rounded-xl bg-slate-50 p-4">
          <div class="flex gap-1">
            {#each starArray(review.stars) as filled}
              <Star class="h-3.5 w-3.5 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}" />
            {/each}
          </div>
          <h2 class="mt-3 text-sm font-semibold">{review.title}</h2>
          <p class="mt-2 line-clamp-4 text-xs text-slate-600">{review.body}</p>
          <div class="mt-3 text-xs font-medium text-slate-700">{review.author}</div>
        </article>
      {/each}
    </div>
  </div>
{/if}
