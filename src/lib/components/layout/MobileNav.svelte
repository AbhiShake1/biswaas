<script lang="ts">
  import { X } from '@lucide/svelte';

  let {
    open = false,
    onClose = () => {},
    categories = []
  }: {
    open: boolean;
    onClose: () => void;
    categories: Array<{ slug: string; name: string }>;
  } = $props();
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 bg-[rgba(33,24,20,0.42)] backdrop-blur-md"
    role="presentation"
    onclick={onClose}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
  >
    <div
      class="surface-panel fixed left-0 top-0 h-full w-80 border-r border-border/60 p-6 shadow-[0_30px_70px_-28px_rgba(60,39,23,0.55)]"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <div class="mb-8 flex items-center justify-between">
        <div>
          <div class="font-display text-2xl font-semibold text-foreground">विश्वास</div>
          <div class="text-xs uppercase tracking-[0.24em] text-muted-foreground">Biswaas</div>
        </div>
        <button
          onclick={onClose}
          aria-label="Close menu"
          class="brand-badge inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <div class="space-y-2">
        <a href="/" class="block rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground" onclick={onClose}>Home</a>
        <a href="/categories" class="block rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onclick={onClose}>All Categories</a>
        <a href="/search" class="block rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onclick={onClose}>Search</a>
        <a href="/about" class="block rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onclick={onClose}>About</a>

        <div class="pt-4">
          <p class="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Categories</p>
        </div>

        {#each categories as category}
          <a
            href="/categories/{category.slug}"
            class="block rounded-2xl px-4 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            onclick={onClose}
          >
            {category.name}
          </a>
        {/each}

        <div class="border-t border-border/50 pt-5">
          <a
            href="/auth/login"
            class="block rounded-2xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_92%,white),color-mix(in_oklab,var(--accent)_64%,var(--primary)))] px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_24px_48px_-28px_rgba(158,92,35,0.7)]"
            onclick={onClose}
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}
