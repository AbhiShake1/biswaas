<script lang="ts">
  import { page } from '$app/stores';
  import { LayoutDashboard, MessageSquare, User, Code, Mail, Users, FileSpreadsheet, ClipboardList, Megaphone, Upload, BookTemplate, Share2, Link2, Palette } from '@lucide/svelte';

  let { children } = $props();

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/reviews', label: 'Reviews', icon: MessageSquare },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/customize', label: 'Customize', icon: Palette },
    { href: '/dashboard/widgets', label: 'Widgets', icon: Code },
    { href: '/dashboard/invitations', label: 'Invitations', icon: Mail },
    { href: '/dashboard/team', label: 'Team', icon: Users },
    { href: '/dashboard/export', label: 'Export', icon: FileSpreadsheet },
    { href: '/dashboard/review-forms', label: 'Review Forms', icon: ClipboardList },
    { href: '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone },
    { href: '/dashboard/import', label: 'Import', icon: Upload },
    { href: '/dashboard/templates', label: 'Templates', icon: BookTemplate },
    { href: '/dashboard/social', label: 'Social Media', icon: Share2 },
    { href: '/dashboard/webhooks', label: 'Webhooks', icon: Link2 },
  ];

  let currentPath = $derived($page.url.pathname);
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex flex-col gap-8 md:flex-row">
    <aside class="w-full shrink-0 md:w-56">
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
