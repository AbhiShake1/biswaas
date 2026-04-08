<script lang="ts">
  import { Menu, Search, Globe } from '@lucide/svelte';

  let { user = null, onToggleMobile = () => {} }: { user: any; onToggleMobile: () => void } = $props();
  let searchQuery = $state('');
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container mx-auto flex h-14 items-center px-4">
    <button onclick={onToggleMobile} class="mr-2 md:hidden" aria-label="Toggle menu">
      <Menu class="h-5 w-5" />
    </button>

    <a href="/" class="mr-6 flex items-center space-x-2">
      <span class="text-xl font-bold">विश्वास</span>
      <span class="hidden text-sm text-muted-foreground sm:inline">Biswaas</span>
    </a>

    <div class="flex-1 md:mx-8">
      <form action="/search" method="GET" class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          name="q"
          placeholder="Search businesses..."
          bind:value={searchQuery}
          class="w-full rounded-md border bg-muted/50 py-1.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </form>
    </div>

    <nav class="flex items-center space-x-2">
      <button class="rounded-md p-2 text-muted-foreground hover:bg-muted" aria-label="Switch language">
        <Globe class="h-4 w-4" />
      </button>

      {#if user}
        <a href="/dashboard" class="rounded-md px-3 py-1.5 text-sm hover:bg-muted">Dashboard</a>
        <a href="/auth/logout" class="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">Sign Out</a>
      {:else}
        <a href="/auth/login" class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Sign In</a>
      {/if}
    </nav>
  </div>
</header>
