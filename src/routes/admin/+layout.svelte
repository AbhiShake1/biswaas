<script lang="ts">
  import { page } from '$app/stores';
  import { LayoutDashboard, Building2, MessageSquare, FolderOpen, ShieldCheck, Users, Scale } from '@lucide/svelte';

  let { children } = $props();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/businesses', label: 'Businesses', icon: Building2 },
    { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
    { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { href: '/admin/claims', label: 'Claims', icon: ShieldCheck },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/disputes', label: 'Disputes', icon: Scale },
  ];

  let currentPath = $derived($page.url.pathname);
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex flex-col gap-8 md:flex-row">
    <aside class="w-full shrink-0 md:w-56">
      <div class="mb-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin Panel</h2>
      </div>
      <nav class="space-y-1">
        {#each navItems as item}
          {@const active = currentPath === item.href}
          <a
            href={item.href}
            class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors {active
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
          >
            <item.icon class="h-4 w-4" />
            {item.label}
          </a>
        {/each}
      </nav>
    </aside>

    <div class="flex-1 min-w-0">
      {@render children()}
    </div>
  </div>
</div>
