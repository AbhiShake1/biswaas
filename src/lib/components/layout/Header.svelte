<script lang="ts">
  import { Menu, Search } from '@lucide/svelte';

  let { user = null, onToggleMobile = () => {} }: { user: any; onToggleMobile: () => void } = $props();
  let searchQuery = $state('');
</script>

<header class="sticky top-0 z-50 w-full border-b border-border/60 bg-background/75 backdrop-blur-xl">
  <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

  <div class="section-wrap flex min-h-18 items-center gap-3 py-3">
    <button
      onclick={onToggleMobile}
      class="brand-badge inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground md:hidden"
      aria-label="Toggle menu"
    >
      <Menu class="h-5 w-5" />
    </button>

    <a href="/" class="mr-2 flex min-w-0 items-center gap-3">
      <div class="brand-badge flex h-11 w-11 items-center justify-center rounded-2xl text-base font-semibold text-primary shadow-[0_18px_40px_-28px_rgba(139,86,35,0.65)]">
        बि
      </div>
      <div class="min-w-0">
        <div class="font-display text-xl font-semibold leading-none tracking-[0.02em] text-foreground">विश्वास</div>
        <div class="text-xs uppercase tracking-[0.28em] text-muted-foreground">Biswaas</div>
      </div>
    </a>

    <div class="hidden flex-1 md:block md:px-4">
      <form action="/search" method="GET" class="surface-panel glow-ring relative mx-auto max-w-xl rounded-full">
        <Search class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
        <input
          type="search"
          name="q"
          placeholder="Search by business or area"
          bind:value={searchQuery}
          class="h-12 w-full rounded-full bg-transparent py-3 pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/80 focus:ring-2 focus:ring-primary/15"
        />
      </form>
    </div>

    <nav class="ml-auto flex items-center gap-2">
      <a
        href="/categories"
        class="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground md:inline-flex"
      >
        Categories
      </a>
      <a href="/about" class="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground md:inline-flex">About</a>

      {#if user}
        <span class="brand-badge hidden rounded-full px-4 py-2 text-sm font-medium text-foreground md:inline-flex">
          {user.name}
        </span>
        <a href="/auth/logout" class="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">Sign Out</a>
      {:else}
        <a
          href="/auth/login"
          class="rounded-full bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_92%,white),color-mix(in_oklab,var(--accent)_66%,var(--primary)))] px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_20px_44px_-24px_rgba(158,92,35,0.65)] hover:-translate-y-0.5"
        >
          Sign In
        </a>
      {/if}
    </nav>
  </div>
</header>
