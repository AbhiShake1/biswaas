<script lang="ts">
  import { Webhook, Plus, Trash2, TestTube, CheckCircle, XCircle, Clock } from '@lucide/svelte';

  interface WebhookEntry {
    id: string;
    url: string;
    events: string[];
    active: boolean;
    createdAt: string;
  }

  interface DeliveryLog {
    id: string;
    webhookId: string;
    event: string;
    status: 'success' | 'failed' | 'pending';
    statusCode: number | null;
    timestamp: string;
  }

  const eventTypes = [
    { value: 'new_review', label: 'New Review', description: 'When a new review is submitted for your business' },
    { value: 'review_reply', label: 'Review Reply', description: 'When someone replies to a review' },
    { value: 'claim_request', label: 'Claim Request', description: 'When someone submits a claim for your business' },
  ];

  let webhooks = $state<WebhookEntry[]>([
    { id: 'wh_1', url: 'https://example.com/webhooks/biswaas', events: ['new_review', 'review_reply'], active: true, createdAt: '2026-03-15' },
  ]);

  let deliveryLogs = $state<DeliveryLog[]>([
    { id: 'dl_1', webhookId: 'wh_1', event: 'new_review', status: 'success', statusCode: 200, timestamp: '2026-04-07 10:30:00' },
    { id: 'dl_2', webhookId: 'wh_1', event: 'review_reply', status: 'success', statusCode: 200, timestamp: '2026-04-06 15:22:00' },
    { id: 'dl_3', webhookId: 'wh_1', event: 'new_review', status: 'failed', statusCode: 500, timestamp: '2026-04-05 09:11:00' },
    { id: 'dl_4', webhookId: 'wh_1', event: 'new_review', status: 'success', statusCode: 200, timestamp: '2026-04-04 18:45:00' },
  ]);

  let newUrl = $state('');
  let selectedEvents = $state<string[]>([]);
  let showAddForm = $state(false);

  function toggleEvent(value: string) {
    if (selectedEvents.includes(value)) {
      selectedEvents = selectedEvents.filter((e) => e !== value);
    } else {
      selectedEvents = [...selectedEvents, value];
    }
  }

  function addWebhook() {
    if (!newUrl || selectedEvents.length === 0) return;
    webhooks = [
      ...webhooks,
      {
        id: `wh_${Date.now()}`,
        url: newUrl,
        events: [...selectedEvents],
        active: true,
        createdAt: new Date().toISOString().split('T')[0],
      },
    ];
    newUrl = '';
    selectedEvents = [];
    showAddForm = false;
  }

  function removeWebhook(id: string) {
    webhooks = webhooks.filter((w) => w.id !== id);
  }

  function testWebhook(id: string) {
    const log: DeliveryLog = {
      id: `dl_${Date.now()}`,
      webhookId: id,
      event: 'test',
      status: 'pending',
      statusCode: null,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    deliveryLogs = [log, ...deliveryLogs];
    // Simulate response
    setTimeout(() => {
      deliveryLogs = deliveryLogs.map((d) =>
        d.id === log.id ? { ...d, status: 'success' as const, statusCode: 200 } : d
      );
    }, 1500);
  }

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
</script>

<svelte:head>
  <title>Webhooks — Biswaas Dashboard</title>
</svelte:head>

<div>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold">Webhooks</h1>
      <p class="mt-1 text-sm text-muted-foreground">Receive real-time notifications when events happen on your business profile</p>
    </div>
    <button
      onclick={() => showAddForm = !showAddForm}
      class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      <Plus class="h-4 w-4" /> Add Webhook
    </button>
  </div>

  <!-- Add Form -->
  {#if showAddForm}
    <div class="mt-6 rounded-lg border p-6">
      <h2 class="font-semibold">New Webhook</h2>
      <div class="mt-4 space-y-4">
        <div>
          <label for="webhook-url" class="block text-sm font-medium">Endpoint URL</label>
          <input
            id="webhook-url"
            type="url"
            bind:value={newUrl}
            placeholder="https://your-server.com/webhooks/biswaas"
            class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label class="block text-sm font-medium">Events</label>
          <div class="mt-2 space-y-2">
            {#each eventTypes as event}
              <label class="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(event.value)}
                  onchange={() => toggleEvent(event.value)}
                  class="mt-0.5"
                />
                <div>
                  <span class="text-sm font-medium">{event.label}</span>
                  <p class="text-xs text-muted-foreground">{event.description}</p>
                </div>
              </label>
            {/each}
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick={addWebhook} class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Create Webhook
          </button>
          <button onclick={() => showAddForm = false} class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Webhooks List -->
  <div class="mt-6 space-y-4">
    {#each webhooks as webhook}
      <div class="rounded-lg border p-4">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2">
            <Webhook class="h-4 w-4 text-muted-foreground" />
            <code class="text-sm font-mono">{webhook.url}</code>
            {#if webhook.active}
              <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</span>
            {/if}
          </div>
          <div class="flex gap-1">
            <button onclick={() => testWebhook(webhook.id)} class="rounded-md border p-1.5 hover:bg-muted" title="Test webhook">
              <TestTube class="h-4 w-4" />
            </button>
            <button onclick={() => removeWebhook(webhook.id)} class="rounded-md border p-1.5 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20" title="Delete webhook">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
        <div class="mt-2 flex flex-wrap gap-1">
          {#each webhook.events as event}
            <span class="rounded bg-muted px-2 py-0.5 text-xs font-mono">{event}</span>
          {/each}
        </div>
        <p class="mt-2 text-xs text-muted-foreground">Created: {webhook.createdAt}</p>
      </div>
    {/each}
  </div>

  <!-- Delivery Log -->
  <div class="mt-8">
    <h2 class="text-lg font-semibold">Delivery Log</h2>
    <p class="mt-1 text-sm text-muted-foreground">Recent webhook deliveries</p>

    <div class="mt-4 overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b text-left">
            <th class="pb-2 font-medium">Status</th>
            <th class="pb-2 font-medium">Event</th>
            <th class="pb-2 font-medium">HTTP Code</th>
            <th class="pb-2 font-medium">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {#each deliveryLogs as log}
            <tr class="border-b">
              <td class="py-2">
                <span class="flex items-center gap-1 {statusColor[log.status]}">
                  <svelte:component this={statusIcon[log.status]} class="h-4 w-4" />
                  {log.status}
                </span>
              </td>
              <td class="py-2"><code class="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{log.event}</code></td>
              <td class="py-2">{log.statusCode ?? '...'}</td>
              <td class="py-2 text-muted-foreground">{log.timestamp}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
