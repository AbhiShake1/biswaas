<script lang="ts">
  let { data } = $props();
  let business = $derived(data.business);
</script>

{#if business}
  <a
    href="/review/{business.slug}"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-3 rounded-[1.25rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,240,233,0.96))] px-4 py-3 text-[var(--theme-ink)] no-underline shadow-[0_14px_28px_-20px_rgba(23,23,23,0.22)]"
  >
    <div class="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--theme-green)] text-lg font-bold text-[var(--theme-ink)]">
      ★
    </div>
    <div class="min-w-0">
      <div class="text-sm font-semibold">{business.name}</div>
      <div class="mt-1 text-xs text-slate-600">{business.trustScore}/5 trust score from {business.totalReviews} reviews</div>
    </div>
  </a>
{/if}
