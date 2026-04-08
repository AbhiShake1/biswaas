<script lang="ts">
  import { CreditCard, ExternalLink, CheckCircle, XCircle } from '@lucide/svelte';

  interface PaymentProvider {
    id: string;
    name: string;
    description: string;
    fee: string;
    status: 'connected' | 'disconnected';
    logo: string;
    color: string;
  }

  let providers = $state<PaymentProvider[]>([
    {
      id: 'esewa',
      name: 'eSewa',
      description: 'Nepal\'s leading digital wallet. Accept payments directly from eSewa users.',
      fee: '1.5% per transaction',
      status: 'disconnected',
      logo: 'eSewa',
      color: 'bg-green-500',
    },
    {
      id: 'khalti',
      name: 'Khalti',
      description: 'Digital wallet and payment gateway. Supports bank transfers and mobile payments.',
      fee: '1.8% per transaction',
      status: 'disconnected',
      logo: 'Khalti',
      color: 'bg-purple-500',
    },
    {
      id: 'connectips',
      name: 'ConnectIPS',
      description: 'Nepal Clearing House interbank payment system. Direct bank-to-bank transfers.',
      fee: 'NPR 5 flat per transaction',
      status: 'disconnected',
      logo: 'CIPS',
      color: 'bg-blue-500',
    },
  ]);

  let selectedProvider = $state<string | null>(null);
</script>

<svelte:head>
  <title>Payment Settings — Biswaas Dashboard</title>
</svelte:head>

<div>
  <div>
    <h1 class="text-2xl font-bold">Payment Settings</h1>
    <p class="mt-1 text-sm text-muted-foreground">Configure payment providers to accept payments for premium review features</p>
  </div>

  <!-- Payment Providers -->
  <div class="mt-8 space-y-4">
    {#each providers as provider}
      <div class="rounded-lg border p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg {provider.color} text-white text-sm font-bold">
              {provider.logo}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-semibold">{provider.name}</h3>
                {#if provider.status === 'connected'}
                  <span class="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle class="h-3 w-3" /> Connected
                  </span>
                {:else}
                  <span class="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    <XCircle class="h-3 w-3" /> Not Connected
                  </span>
                {/if}
              </div>
              <p class="mt-1 text-sm text-muted-foreground">{provider.description}</p>
              <div class="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span class="flex items-center gap-1">
                  <CreditCard class="h-3 w-3" />
                  Fee: {provider.fee}
                </span>
              </div>
            </div>
          </div>
          <div>
            <button
              disabled
              class="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium opacity-50 cursor-not-allowed"
              title="Coming soon"
            >
              <ExternalLink class="h-4 w-4" />
              Connect
            </button>
          </div>
        </div>

        <!-- Expanded details -->
        {#if selectedProvider === provider.id}
          <div class="mt-4 rounded-md bg-muted/50 p-4">
            <h4 class="text-sm font-medium">Integration Details</h4>
            <div class="mt-2 space-y-2 text-sm text-muted-foreground">
              <p>Merchant ID: <span class="font-mono text-foreground">Not configured</span></p>
              <p>Webhook URL: <span class="font-mono text-foreground">https://biswaas.com/api/payments/{provider.id}/webhook</span></p>
              <p>Test Mode: <span class="text-yellow-600 dark:text-yellow-400">Enabled</span></p>
            </div>
          </div>
        {/if}

        <button
          onclick={() => selectedProvider = selectedProvider === provider.id ? null : provider.id}
          class="mt-3 text-xs text-primary hover:underline"
        >
          {selectedProvider === provider.id ? 'Hide details' : 'View integration details'}
        </button>
      </div>
    {/each}
  </div>

  <!-- Coming Soon Notice -->
  <div class="mt-8 rounded-lg border border-dashed border-yellow-300 bg-yellow-50/50 p-6 dark:border-yellow-800 dark:bg-yellow-900/10">
    <div class="flex items-start gap-3">
      <CreditCard class="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
      <div>
        <h3 class="font-medium text-yellow-800 dark:text-yellow-300">Payment Integration Coming Soon</h3>
        <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-400/80">
          Payment provider integrations are currently under development. Once available, you'll be able to:
        </p>
        <ul class="mt-2 list-inside list-disc space-y-1 text-sm text-yellow-700 dark:text-yellow-400/80">
          <li>Accept payments for premium review placement</li>
          <li>Charge for verified business badges</li>
          <li>Process subscription payments for Biswaas Pro</li>
          <li>Issue refunds directly from the dashboard</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Payout Settings -->
  <div class="mt-8 rounded-lg border p-6">
    <h2 class="text-lg font-semibold">Payout Settings</h2>
    <p class="mt-1 text-sm text-muted-foreground">Configure how you receive payments from Biswaas</p>
    <div class="mt-4 grid gap-4 sm:grid-cols-2">
      <div>
        <label class="block text-sm font-medium">Bank Name</label>
        <input
          type="text"
          disabled
          placeholder="e.g., Nabil Bank"
          class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm opacity-50 cursor-not-allowed"
        />
      </div>
      <div>
        <label class="block text-sm font-medium">Account Number</label>
        <input
          type="text"
          disabled
          placeholder="e.g., 01234567890"
          class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm opacity-50 cursor-not-allowed"
        />
      </div>
      <div>
        <label class="block text-sm font-medium">Account Holder Name</label>
        <input
          type="text"
          disabled
          placeholder="e.g., Biswaas Pvt. Ltd."
          class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm opacity-50 cursor-not-allowed"
        />
      </div>
      <div>
        <label class="block text-sm font-medium">Payout Schedule</label>
        <select disabled class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm opacity-50 cursor-not-allowed">
          <option>Monthly</option>
          <option>Bi-weekly</option>
          <option>Weekly</option>
        </select>
      </div>
    </div>
  </div>
</div>
