<script lang="ts">
  const categories = [
    { name: 'Education Consultancies', slug: 'education-consultancies' },
    { name: 'E-Commerce', slug: 'ecommerce' },
    { name: 'Trekking & Tourism', slug: 'trekking-tourism' },
    { name: 'ISPs & Telecom', slug: 'isp-telecom' },
    { name: 'Hospitals & Healthcare', slug: 'hospitals-healthcare' },
  ];
</script>

<nav class="border-b bg-muted/20">
  <div class="container mx-auto flex items-center gap-1 overflow-x-auto px-4 py-2">
    <a
      href="/categories"
      class="whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      All
    </a>
    {#each categories as cat}
      <a
        href="/categories/{cat.slug}"
        class="whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        {cat.name}
      </a>
    {/each}
  </div>
</nav>
