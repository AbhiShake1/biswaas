<script lang="ts">
  import { X } from '@lucide/svelte';

  let { open = false, onClose = () => {} }: { open: boolean; onClose: () => void } = $props();

  const categories = [
    { name: 'Education Consultancies', slug: 'education-consultancies' },
    { name: 'E-Commerce', slug: 'ecommerce' },
    { name: 'Trekking & Tourism', slug: 'trekking-tourism' },
    { name: 'ISPs & Telecom', slug: 'isp-telecom' },
    { name: 'Hospitals & Healthcare', slug: 'hospitals-healthcare' },
  ];
</script>

{#if open}
  <div class="fixed inset-0 z-50 bg-black/50" role="presentation" onclick={onClose}>
    <nav
      class="fixed left-0 top-0 h-full w-72 bg-background p-6 shadow-lg"
      role="navigation"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="mb-6 flex items-center justify-between">
        <span class="text-lg font-bold">विश्वास</span>
        <button onclick={onClose} aria-label="Close menu">
          <X class="h-5 w-5" />
        </button>
      </div>

      <div class="space-y-1">
        <a href="/" class="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onclick={onClose}>Home</a>
        <a href="/categories" class="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onclick={onClose}>All Categories</a>

        <div class="py-2">
          <p class="px-3 text-xs font-semibold uppercase text-muted-foreground">Categories</p>
        </div>

        {#each categories as cat}
          <a href="/categories/{cat.slug}" class="block rounded-md px-3 py-2 text-sm hover:bg-muted" onclick={onClose}>
            {cat.name}
          </a>
        {/each}

        <div class="border-t pt-2">
          <a href="/search" class="block rounded-md px-3 py-2 text-sm hover:bg-muted" onclick={onClose}>Search</a>
          <a href="/auth/login" class="block rounded-md px-3 py-2 text-sm hover:bg-muted" onclick={onClose}>Sign In</a>
        </div>
      </div>
    </nav>
  </div>
{/if}
