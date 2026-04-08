<script lang="ts">
  import { CheckCircle, XCircle, FileText, User } from '@lucide/svelte';

  const claims = [
    { id: '1', businessName: 'Nepal Intrepid Treks', businessSlug: 'nepal-intrepid-treks', claimantName: 'Pemba Sherpa', role: 'Owner', submittedAt: Date.now() - 86400000 * 1, proofType: 'PAN Certificate' },
    { id: '2', businessName: 'KIEC', businessSlug: 'kiec', claimantName: 'Binod Sharma', role: 'Director', submittedAt: Date.now() - 86400000 * 2, proofType: 'Registration Document' },
    { id: '3', businessName: 'SastoDeal', businessSlug: 'sastodeal', claimantName: 'Anil Chitrakar', role: 'CEO', submittedAt: Date.now() - 86400000 * 3, proofType: 'Company Letterhead' },
    { id: '4', businessName: 'Vianet Communications', businessSlug: 'vianet', claimantName: 'Rajan Bajracharya', role: 'Manager', submittedAt: Date.now() - 86400000 * 4, proofType: 'Utility Bill' },
    { id: '5', businessName: 'Grande International Hospital', businessSlug: 'grande-hospital', claimantName: 'Dr. Sanjeev Uprety', role: 'Medical Director', submittedAt: Date.now() - 86400000 * 5, proofType: 'Hospital ID' },
    { id: '6', businessName: 'Ncell', businessSlug: 'ncell', claimantName: 'Pratima Rana', role: 'PR Manager', submittedAt: Date.now() - 86400000 * 6, proofType: 'Employment Letter' },
    { id: '7', businessName: 'Adventure Vision Treks', businessSlug: 'adventure-vision-treks', claimantName: 'Dawa Tamang', role: 'Owner', submittedAt: Date.now() - 86400000 * 7, proofType: 'PAN Certificate' },
    { id: '8', businessName: 'Classic Tech', businessSlug: 'classic-tech', claimantName: 'Suresh Regmi', role: 'General Manager', submittedAt: Date.now() - 86400000 * 8, proofType: 'Registration Document' },
    { id: '9', businessName: 'Edwise Foundation', businessSlug: 'edwise-foundation', claimantName: 'Meena Gurung', role: 'Branch Manager', submittedAt: Date.now() - 86400000 * 9, proofType: 'Company ID' },
    { id: '10', businessName: 'HamroBazar', businessSlug: 'hamrobazar', claimantName: 'Rajesh Hamal', role: 'Co-founder', submittedAt: Date.now() - 86400000 * 10, proofType: 'MOA Document' },
    { id: '11', businessName: 'B&B Hospital', businessSlug: 'bb-hospital', claimantName: 'Dr. Basu Pandey', role: 'Administrator', submittedAt: Date.now() - 86400000 * 12, proofType: 'Hospital Registration' },
    { id: '12', businessName: 'Everest Holiday', businessSlug: 'everest-holiday', claimantName: 'Kaji Lama', role: 'Owner', submittedAt: Date.now() - 86400000 * 14, proofType: 'Tourism License' },
  ];

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
</script>

<svelte:head>
  <title>Claims — Admin — Biswaas</title>
</svelte:head>

<div>
  <nav class="mb-4 text-sm text-muted-foreground">
    <a href="/admin" class="hover:text-foreground">Admin</a>
    <span class="mx-1">/</span>
    <span class="text-foreground">Claims</span>
  </nav>

  <h1 class="text-2xl font-bold">Pending Claims</h1>
  <p class="mt-1 text-sm text-muted-foreground">{claims.length} claim requests awaiting review</p>

  <div class="mt-6 space-y-4">
    {#each claims as claim}
      <div class="rounded-lg border p-4">
        <div class="flex items-start justify-between">
          <div>
            <a href="/review/{claim.businessSlug}" class="text-lg font-semibold hover:text-primary">{claim.businessName}</a>
            <div class="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span class="flex items-center gap-1">
                <User class="h-3 w-3" /> {claim.claimantName}
              </span>
              <span>{claim.role}</span>
              <span class="flex items-center gap-1">
                <FileText class="h-3 w-3" /> {claim.proofType}
              </span>
              <span>{formatDate(claim.submittedAt)}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100">
              <CheckCircle class="h-3 w-3" /> Approve
            </button>
            <button class="flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">
              <XCircle class="h-3 w-3" /> Reject
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
