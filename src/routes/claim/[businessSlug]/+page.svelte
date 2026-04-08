<script lang="ts">
  import { page } from '$app/stores';
  import { Upload, CheckCircle, Shield } from '@lucide/svelte';

  let slug = $derived($page.params.businessSlug);
  let businessName = $derived(
    slug?.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') ?? 'Business'
  );

  let proofFile = $state<File | null>(null);
  let submitted = $state(false);
  let submitting = $state(false);

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
      proofFile = input.files[0];
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    submitting = true;
    // Mock submit delay
    await new Promise((r) => setTimeout(r, 1200));
    submitting = false;
    submitted = true;
  }
</script>

<svelte:head>
  <title>Claim {businessName} — Biswaas</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <nav class="mb-6 text-sm text-muted-foreground">
    <a href="/" class="hover:text-foreground">Home</a>
    <span class="mx-1">/</span>
    <a href="/review/{slug}" class="hover:text-foreground">{businessName}</a>
    <span class="mx-1">/</span>
    <span class="text-foreground">Claim</span>
  </nav>

  <div class="mx-auto max-w-lg">
    {#if submitted}
      <div class="rounded-lg border p-8 text-center">
        <CheckCircle class="mx-auto h-12 w-12 text-green-500" />
        <h1 class="mt-4 text-2xl font-bold">Claim Submitted</h1>
        <p class="mt-2 text-muted-foreground">
          Your claim for <strong>{businessName}</strong> has been submitted for review.
          We'll verify your ownership and notify you within 2-3 business days.
        </p>
        <a
          href="/review/{slug}"
          class="mt-6 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to Business Page
        </a>
      </div>
    {:else}
      <div class="rounded-lg border p-6">
        <div class="flex items-center gap-3">
          <Shield class="h-8 w-8 text-primary" />
          <div>
            <h1 class="text-2xl font-bold">Claim {businessName}</h1>
            <p class="text-sm text-muted-foreground">Verify your ownership to manage this business profile</p>
          </div>
        </div>

        <form onsubmit={handleSubmit} class="mt-6 space-y-5">
          <div>
            <label for="businessName" class="block text-sm font-medium">Business Name</label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              disabled
              class="mt-1 w-full rounded-md border bg-muted px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label for="fullName" class="block text-sm font-medium">Your Full Name</label>
            <input
              id="fullName"
              type="text"
              required
              placeholder="e.g. Ram Bahadur Thapa"
              class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label for="role" class="block text-sm font-medium">Your Role</label>
            <input
              id="role"
              type="text"
              required
              placeholder="e.g. Owner, Manager, Director"
              class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label for="proof" class="block text-sm font-medium">Proof of Ownership</label>
            <p class="mt-0.5 text-xs text-muted-foreground">
              Upload a document proving you own or manage this business (e.g. PAN certificate, registration document, utility bill)
            </p>
            <label
              for="proof"
              class="mt-2 flex cursor-pointer items-center gap-3 rounded-md border border-dashed px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-muted/50"
            >
              <Upload class="h-5 w-5" />
              {#if proofFile}
                <span class="text-foreground">{proofFile.name}</span>
              {:else}
                <span>Click to upload a file</span>
              {/if}
            </label>
            <input
              id="proof"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              class="hidden"
              onchange={handleFileChange}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            class="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Claim'}
          </button>
        </form>
      </div>
    {/if}
  </div>
</div>
