<script lang="ts">
  import { categories } from '$lib/data/businesses';
</script>

<nav class="border-b border-border/50 bg-background/35 backdrop-blur-xl">
  <div class="section-wrap flex items-center gap-2 overflow-x-auto py-3">
    <a
      href="/categories"
      class="brand-badge whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground"
    >
      All
    </a>
    {#each categories as category}
      <a
        href="/categories/{category.slug}"
        class="whitespace-nowrap rounded-full border border-transparent bg-background/35 px-4 py-2 text-xs font-medium text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground"
      >
        {category.name}
      </a>
    {/each}
  </div>
</nav>
