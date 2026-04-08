<script lang="ts">
  import { Globe, RefreshCw, CheckCircle, XCircle, Clock, ExternalLink } from '@lucide/svelte';

  interface SyncLog {
    id: string;
    action: string;
    status: 'success' | 'failed' | 'pending';
    timestamp: string;
    details: string;
  }

  let gbpConnected = $state(false);
  let autoSyncEnabled = $state(false);

  let syncLogs = $state<SyncLog[]>([
    { id: '1', action: 'Sync business hours', status: 'success', timestamp: '2026-04-07 09:00', details: 'Updated Mon-Fri hours to 9 AM - 6 PM' },
    { id: '2', action: 'Sync reviews', status: 'success', timestamp: '2026-04-06 21:00', details: 'Imported 3 new Google reviews' },
    { id: '3', action: 'Sync photos', status: 'failed', timestamp: '2026-04-06 15:00', details: 'Rate limit exceeded — retry in 1 hour' },
    { id: '4', action: 'Sync business info', status: 'success', timestamp: '2026-04-05 09:00', details: 'Updated business description and categories' },
    { id: '5', action: 'Initial sync', status: 'success', timestamp: '2026-04-04 12:30', details: 'Pulled full profile from Google Business' },
  ]);

  const statusIcon = {
    success: CheckCircle,
    failed: XCircle,
    pending: Clock,
  };

  const statusColor = {
    success: 'text-green-500',
    failed: 'text-red-500',
    pending: 'text-yellow-500',
  };

  function triggerSync() {
    const log: SyncLog = {
      id: `sync_${Date.now()}`,
      action: 'Manual sync',
      status: 'pending',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      details: 'Syncing all data...',
    };
    syncLogs = [log, ...syncLogs];
    setTimeout(() => {
      syncLogs = syncLogs.map((l) =>
        l.id === log.id ? { ...l, status: 'success' as const, details: 'All data synced successfully' } : l
      );
    }, 2000);
  }
</script>

<svelte:head>
  <title>Google Business Syndication — Biswaas Dashboard</title>
</svelte:head>

<div>
  <div>
    <h1 class="text-2xl font-bold">Google Business Profile Syndication</h1>
    <p class="mt-1 text-sm text-muted-foreground">Sync your Biswaas business data with Google Business Profile</p>
  </div>

  <!-- Connection Status -->
  <div class="mt-8 rounded-lg border p-6">
    <div class="flex items-start justify-between">
      <div class="flex items-start gap-4">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white">
          <Globe class="h-6 w-6" />
        </div>
        <div>
          <h2 class="font-semibold">Google Business Profile</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            {#if gbpConnected}
              Connected as <span class="font-medium text-foreground">mybusiness@gmail.com</span>
            {:else}
              Connect your Google Business Profile to sync data automatically
            {/if}
          </p>
        </div>
      </div>
      <button
        disabled
        class="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium opacity-50 cursor-not-allowed"
        title="Coming soon"
      >
        <ExternalLink class="h-4 w-4" />
        {gbpConnected ? 'Disconnect' : 'Connect GBP'}
      </button>
    </div>
  </div>

  <!-- Coming Soon Notice -->
  <div class="mt-4 rounded-lg border border-dashed border-blue-300 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/10">
    <p class="text-sm text-blue-700 dark:text-blue-400">
      Google Business Profile integration is coming soon. The settings below show how the feature will work once available.
    </p>
  </div>

  <!-- Sync Settings -->
  <div class="mt-8 rounded-lg border p-6">
    <h2 class="text-lg font-semibold">Sync Settings</h2>
    <div class="mt-4 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">Auto-Sync</p>
          <p class="text-xs text-muted-foreground">Automatically sync data every 6 hours</p>
        </div>
        <button
          onclick={() => autoSyncEnabled = !autoSyncEnabled}
          class="relative h-6 w-11 rounded-full transition-colors {autoSyncEnabled ? 'bg-primary' : 'bg-muted'}"
          role="switch"
          aria-checked={autoSyncEnabled}
        >
          <span
            class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm {autoSyncEnabled ? 'translate-x-5' : 'translate-x-0'}"
          ></span>
        </button>
      </div>

      <hr />

      <div class="space-y-2">
        <p class="text-sm font-medium">Sync Includes:</p>
        <div class="grid gap-2 sm:grid-cols-2">
          {#each ['Business name & description', 'Business hours', 'Photos & media', 'Reviews (import)', 'Address & contact', 'Categories'] as item}
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" checked disabled class="rounded" />
              {item}
            </label>
          {/each}
        </div>
      </div>

      <hr />

      <div class="flex gap-2">
        <button
          onclick={triggerSync}
          class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <RefreshCw class="h-4 w-4" /> Sync Now
        </button>
      </div>
    </div>
  </div>

  <!-- Sync Log -->
  <div class="mt-8">
    <h2 class="text-lg font-semibold">Sync History</h2>
    <p class="mt-1 text-sm text-muted-foreground">Recent synchronization activity</p>

    <div class="mt-4 space-y-3">
      {#each syncLogs as log}
        <div class="flex items-start gap-3 rounded-md border p-3">
          <span class="{statusColor[log.status]} mt-0.5">
            <svelte:component this={statusIcon[log.status]} class="h-4 w-4" />
          </span>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium">{log.action}</p>
              <span class="text-xs text-muted-foreground">{log.timestamp}</span>
            </div>
            <p class="text-xs text-muted-foreground">{log.details}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
