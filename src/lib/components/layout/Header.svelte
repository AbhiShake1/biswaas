<script lang="ts">
  import { Menu, Search } from '@lucide/svelte';

  let { user = null, onToggleMobile = () => {} }: { user: any; onToggleMobile: () => void } = $props();
  let searchQuery = $state('');
</script>

<header class="sticky top-0 z-50 w-full border-b border-white/8 bg-[var(--theme-ink)] text-white shadow-[0_10px_30px_-20px_rgba(0,0,0,0.85)]">
  <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

  <div class="section-wrap flex min-h-18 items-center gap-3 py-3">
    <button
      onclick={onToggleMobile}
      class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white md:hidden"
      aria-label="Toggle menu"
    >
      <Menu class="h-5 w-5" />
    </button>

    <a href="/" class="mr-2 flex min-w-0 items-center gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--theme-green)] text-base font-semibold text-[var(--theme-ink)] shadow-[0_18px_40px_-28px_rgba(23,214,148,0.55)]">
        बि
      </div>
      <div class="min-w-0">
        <div class="text-xl font-extrabold leading-none tracking-[-0.03em] text-white">विश्वास</div>
        <div class="text-xs uppercase tracking-[0.28em] text-white/55">Biswaas</div>
      </div>
    </a>

    <div class="hidden flex-1 md:block md:px-4">
      <form action="/search" method="GET" class="relative mx-auto flex max-w-xl items-center rounded-full bg-white px-4 py-2 shadow-[0_14px_34px_-22px_rgba(0,0,0,0.45)]">
        <Search class="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-blue)]" />
        <input
          type="search"
          name="q"
          placeholder="Search by business or area"
          bind:value={searchQuery}
          class="h-10 w-full rounded-full bg-transparent py-2 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/80"
        />
      </form>
    </div>

    <nav class="ml-auto flex items-center gap-2">
      <a
        href="/categories"
        class="hidden rounded-full px-4 py-2 text-sm font-medium text-white/72 hover:bg-white/8 hover:text-white md:inline-flex"
      >
        Categories
      </a>
      <a href="/about" class="hidden rounded-full px-4 py-2 text-sm font-medium text-white/72 hover:bg-white/8 hover:text-white md:inline-flex">About</a>

      {#if user}
        <span class="hidden rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white md:inline-flex">
          {user.name}
        </span>
        <a href="/auth/logout" class="rounded-full px-4 py-2 text-sm font-medium text-white/72 hover:bg-white/8 hover:text-white">Sign Out</a>
      {:else}
        <a
          href="/auth/login"
          class="rounded-full bg-[var(--theme-blue)] px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_36px_-22px_rgba(75,97,209,0.72)] hover:-translate-y-0.5"
        >
          Sign In
        </a>
      {/if}
    </nav>
  </div>
</header>
