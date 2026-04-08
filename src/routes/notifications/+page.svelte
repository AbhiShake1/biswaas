<script lang="ts">
  import { Bell, Star, ThumbsUp, Shield, MessageSquare, CheckCheck, Trash2 } from '@lucide/svelte';

  type Notification = {
    id: string;
    type: 'review' | 'helpful' | 'claim' | 'reply' | 'system';
    title: string;
    body: string;
    time: string;
    read: boolean;
  };

  let notifications = $state<Notification[]>([
    {
      id: '1',
      type: 'review',
      title: 'New review on your business',
      body: 'Suman G. left a 5-star review on Everest Trek Adventures: "Best trekking experience!"',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: '2',
      type: 'helpful',
      title: 'Your review got 5 helpful votes',
      body: 'Your review on WorldLink Internet has been marked helpful by 5 people.',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'claim',
      title: 'Claim approved',
      body: 'Your claim for Nepal Education Gateway has been verified and approved. You can now manage your business profile.',
      time: '3 hours ago',
      read: false,
    },
    {
      id: '4',
      type: 'reply',
      title: 'Business replied to your review',
      body: 'Grande Hospital responded to your review: "Thank you for your feedback, we appreciate..."',
      time: '1 day ago',
      read: true,
    },
    {
      id: '5',
      type: 'system',
      title: 'Welcome to Biswaas!',
      body: 'Start by writing your first review or claiming your business. Your voice helps build trust in Nepal.',
      time: '3 days ago',
      read: true,
    },
    {
      id: '6',
      type: 'review',
      title: 'New review on your business',
      body: 'Priya S. left a 3-star review on WorldLink Internet: "Speed is decent but frequent outages..."',
      time: '5 days ago',
      read: true,
    },
    {
      id: '7',
      type: 'helpful',
      title: 'Your review got 10 helpful votes',
      body: 'Your review on Daraz Nepal has reached 10 helpful votes. Keep sharing your experiences!',
      time: '1 week ago',
      read: true,
    },
  ]);

  const unreadCount = $derived(notifications.filter((n) => !n.read).length);

  function markAsRead(id: string) {
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  }

  function markAllAsRead() {
    notifications = notifications.map((n) => ({ ...n, read: true }));
  }

  function removeNotification(id: string) {
    notifications = notifications.filter((n) => n.id !== id);
  }

  function clearAll() {
    notifications = [];
  }

  function iconForType(type: Notification['type']) {
    switch (type) {
      case 'review': return Star;
      case 'helpful': return ThumbsUp;
      case 'claim': return Shield;
      case 'reply': return MessageSquare;
      case 'system': return Bell;
    }
  }

  function colorForType(type: Notification['type']) {
    switch (type) {
      case 'review': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-950/30';
      case 'helpful': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-950/30';
      case 'claim': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950/30';
      case 'reply': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-950/30';
      case 'system': return 'text-muted-foreground bg-muted';
    }
  }
</script>

<svelte:head>
  <title>Notifications - Biswaas</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-8">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <Bell class="h-6 w-6 text-primary" />
      <h1 class="text-2xl font-bold">Notifications</h1>
      {#if unreadCount > 0}
        <span class="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
          {unreadCount}
        </span>
      {/if}
    </div>
    <div class="flex items-center gap-2">
      {#if unreadCount > 0}
        <button
          onclick={markAllAsRead}
          class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <CheckCheck class="h-3.5 w-3.5" />
          Mark all read
        </button>
      {/if}
      {#if notifications.length > 0}
        <button
          onclick={clearAll}
          class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 class="h-3.5 w-3.5" />
          Clear all
        </button>
      {/if}
    </div>
  </div>

  <div class="mt-6 space-y-2">
    {#if notifications.length === 0}
      <div class="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <Bell class="h-10 w-10 text-muted-foreground/30" />
        <p class="mt-3 text-sm font-medium text-muted-foreground">No notifications</p>
        <p class="mt-1 text-xs text-muted-foreground/70">You're all caught up!</p>
      </div>
    {:else}
      {#each notifications as notif (notif.id)}
        {@const Icon = iconForType(notif.type)}
        <div
          class="group flex gap-3 rounded-lg border p-4 transition-colors
            {notif.read ? 'bg-background' : 'border-primary/20 bg-primary/5'}"
        >
          <div class="flex-shrink-0">
            <div class="flex h-9 w-9 items-center justify-center rounded-full {colorForType(notif.type)}">
              <Icon class="h-4 w-4" />
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-sm font-medium {notif.read ? 'text-foreground' : 'text-foreground'}">
                {notif.title}
                {#if !notif.read}
                  <span class="ml-1.5 inline-block h-2 w-2 rounded-full bg-primary"></span>
                {/if}
              </h3>
              <span class="flex-shrink-0 text-[10px] text-muted-foreground">{notif.time}</span>
            </div>
            <p class="mt-0.5 text-xs leading-relaxed text-muted-foreground">{notif.body}</p>
            <div class="mt-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              {#if !notif.read}
                <button
                  onclick={() => markAsRead(notif.id)}
                  class="text-[10px] font-medium text-primary hover:underline"
                >
                  Mark as read
                </button>
              {/if}
              <button
                onclick={() => removeNotification(notif.id)}
                class="text-[10px] font-medium text-muted-foreground hover:text-destructive hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
