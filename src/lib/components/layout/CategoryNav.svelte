<script lang="ts">
  import { categories } from '$lib/data/businesses';
</script>

<nav class="border-b border-border/60 bg-background/88 backdrop-blur-xl">
  <div class="section-wrap flex items-center gap-2 overflow-x-auto py-3">
    <a
      href="/categories"
      class="whitespace-nowrap rounded-full bg-[var(--theme-green)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--theme-ink)] shadow-[0_12px_24px_-18px_rgba(23,214,148,0.72)]"
    >
      All
    </a>
    {#each categories as category}
      <a
        href="/categories/{category.slug}"
        class="whitespace-nowrap rounded-full border border-border/75 bg-white px-4 py-2 text-xs font-medium text-muted-foreground shadow-[0_10px_22px_-20px_rgba(23,23,23,0.35)] hover:border-[var(--theme-blue)]/40 hover:text-foreground"
      >
        {category.name}
      </a>
    {/each}
  </div>
</nav>
