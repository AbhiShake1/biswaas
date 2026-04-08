<script lang="ts">
  import { X } from '@lucide/svelte';
  import { categories } from '$lib/data/businesses';

  let { open = false, onClose = () => {} }: { open: boolean; onClose: () => void } = $props();
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-50 bg-black/50" role="presentation" onclick={onClose} onkeydown={(e) => e.key === 'Escape' && onClose()}>
    <div
      class="fixed left-0 top-0 h-full w-72 bg-background p-6 shadow-lg"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
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
        <a href="/search" class="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onclick={onClose}>Search</a>
        <a href="/about" class="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onclick={onClose}>About</a>

        <div class="py-2">
          <p class="px-3 text-xs font-semibold uppercase text-muted-foreground">Categories</p>
        </div>

        {#each categories as category}
          <a href="/categories/{category.slug}" class="block rounded-md px-3 py-2 text-sm hover:bg-muted" onclick={onClose}>
            {category.name}
          </a>
        {/each}

        <div class="border-t pt-2">
          <a href="/auth/login" class="block rounded-md px-3 py-2 text-sm hover:bg-muted" onclick={onClose}>Sign In</a>
        </div>
      </div>
    </div>
  </div>
{/if}
