<script lang="ts">
  import { Scale, Eye, CheckCircle, AlertTriangle } from '@lucide/svelte';

  type DisputeStatus = 'Open' | 'Resolved';

  interface Dispute {
    id: string;
    businessName: string;
    claimant: string;
    reason: string;
    status: DisputeStatus;
    filedDate: string;
  }

  let disputes = $state<Dispute[]>([
    { id: 'D001', businessName: 'Himalayan Trekking Co.', claimant: 'Pemba Sherpa', reason: 'Ownership dispute — multiple parties claiming the same business listing', status: 'Open', filedDate: '2025-03-20' },
    { id: 'D002', businessName: 'Kathmandu Guest House', claimant: 'Anita Gurung', reason: 'Fraudulent claim — claimant is not affiliated with the business', status: 'Open', filedDate: '2025-03-15' },
    { id: 'D003', businessName: 'Pokhara Paragliding', claimant: 'Sunil Rai', reason: 'Business name mismatch — registered name differs from listing', status: 'Resolved', filedDate: '2025-02-28' },
    { id: 'D004', businessName: 'Newari Kitchen', claimant: 'Binod Maharjan', reason: 'Duplicate listing — business already claimed under a different account', status: 'Open', filedDate: '2025-03-25' },
    { id: 'D005', businessName: 'Chitwan Safari Lodge', claimant: 'Deepa Tharu', reason: 'Ownership transfer not reflected after sale of business', status: 'Resolved', filedDate: '2025-01-10' },
  ]);

  let viewingId = $state<string | null>(null);

  function resolveDispute(id: string) {
    disputes = disputes.map(d => d.id === id ? { ...d, status: 'Resolved' as DisputeStatus } : d);
    viewingId = null;
  }

  const statusStyle: Record<DisputeStatus, string> = {
    Open: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
</script>

<svelte:head>
  <title>Claim Disputes — Biswaas Admin</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold flex items-center gap-2">
    <Scale class="h-6 w-6" /> Claim Dispute Resolution
  </h1>
  <p class="mt-1 text-sm text-muted-foreground">Review and resolve disputed business claims.</p>

  <div class="mt-4 flex gap-2 text-sm">
    <span class="rounded-md bg-muted px-3 py-1">Total: {disputes.length}</span>
    <span class="rounded-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-3 py-1">Open: {disputes.filter(d => d.status === 'Open').length}</span>
    <span class="rounded-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1">Resolved: {disputes.filter(d => d.status === 'Resolved').length}</span>
  </div>

  <div class="mt-6 overflow-x-auto rounded-lg border">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b bg-muted/50">
          <th class="px-4 py-3 text-left font-medium">Business</th>
          <th class="px-4 py-3 text-left font-medium">Claimant</th>
          <th class="px-4 py-3 text-left font-medium">Reason</th>
          <th class="px-4 py-3 text-left font-medium">Status</th>
          <th class="px-4 py-3 text-left font-medium">Filed</th>
          <th class="px-4 py-3 text-right font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each disputes as d}
          <tr class="border-b last:border-0 hover:bg-muted/30">
            <td class="px-4 py-3 font-medium">{d.businessName}</td>
            <td class="px-4 py-3">{d.claimant}</td>
            <td class="px-4 py-3 text-muted-foreground max-w-xs truncate">{d.reason}</td>
            <td class="px-4 py-3">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium {statusStyle[d.status]}">{d.status}</span>
            </td>
            <td class="px-4 py-3 text-muted-foreground">{d.filedDate}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <button onclick={() => viewingId = viewingId === d.id ? null : d.id}
                  class="flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted">
                  <Eye class="h-3 w-3" /> Details
                </button>
                {#if d.status === 'Open'}
                  <button onclick={() => resolveDispute(d.id)}
                    class="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700">
                    <CheckCircle class="h-3 w-3" /> Resolve
                  </button>
                {/if}
              </div>
            </td>
          </tr>
          {#if viewingId === d.id}
            <tr>
              <td colspan="6" class="border-b bg-muted/20 px-4 py-4">
                <div class="flex items-start gap-2">
                  <AlertTriangle class="mt-0.5 h-4 w-4 text-yellow-500 shrink-0" />
                  <div>
                    <h4 class="font-medium">Dispute Details — {d.id}</h4>
                    <p class="mt-1 text-sm text-muted-foreground"><strong>Business:</strong> {d.businessName}</p>
                    <p class="text-sm text-muted-foreground"><strong>Claimant:</strong> {d.claimant}</p>
                    <p class="text-sm text-muted-foreground"><strong>Reason:</strong> {d.reason}</p>
                    <p class="text-sm text-muted-foreground"><strong>Filed:</strong> {d.filedDate}</p>
                  </div>
                </div>
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>
</div>
