<script lang="ts">
  import { categories } from '$lib/data/businesses';
</script>

<nav class="border-b bg-muted/20">
  <div class="container mx-auto flex items-center gap-1 overflow-x-auto px-4 py-2">
    <a
      href="/categories"
      class="whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      All
    </a>
    {#each categories as category}
      <a
        href="/categories/{category.slug}"
        class="whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        {category.name}
      </a>
    {/each}
  </div>
</nav>
