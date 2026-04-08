<script lang="ts">
  import { Building2, Phone, FileCheck, ChevronRight, ChevronLeft, Upload } from '@lucide/svelte';

  let currentStep = $state(1);
  const totalSteps = 3;

  // Step 1: Business details
  let businessName = $state('');
  let businessDescription = $state('');
  let businessCategory = $state('');

  // Step 2: Contact info
  let phone = $state('');
  let email = $state('');
  let address = $state('');

  // Step 3: Verification
  let uploadedFile = $state<string | null>(null);

  const categories = [
    'Restaurant & Cafe',
    'Education & Training',
    'Healthcare',
    'Travel & Tourism',
    'Technology',
    'Retail & Shopping',
    'Finance & Banking',
    'Construction & Real Estate',
  ];

  function next() {
    if (currentStep < totalSteps) currentStep++;
  }

  function prev() {
    if (currentStep > 1) currentStep--;
  }

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
      uploadedFile = input.files[0].name;
    }
  }

  function submit() {
    alert('Business onboarding submitted! We will review your application shortly.');
  }

  const stepLabels = ['Business Details', 'Contact Info', 'Verification'];
  const stepIcons = [Building2, Phone, FileCheck];
</script>

<svelte:head>
  <title>Business Onboarding — Biswaas</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-12">
  <h1 class="text-2xl font-bold">Register Your Business</h1>
  <p class="mt-1 text-sm text-muted-foreground">Complete the steps below to claim and manage your business on Biswaas.</p>

  <!-- Progress Bar -->
  <div class="mt-8">
    <div class="flex items-center justify-between">
      {#each stepLabels as label, i}
        {@const stepNum = i + 1}
        {@const Icon = stepIcons[i]}
        <div class="flex items-center gap-2 {stepNum <= currentStep ? 'text-primary' : 'text-muted-foreground'}">
          <div class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold {stepNum <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'}">
            {stepNum}
          </div>
          <span class="hidden text-sm font-medium sm:inline">{label}</span>
        </div>
        {#if i < stepLabels.length - 1}
          <div class="mx-2 h-0.5 flex-1 {stepNum < currentStep ? 'bg-primary' : 'bg-muted'}"></div>
        {/if}
      {/each}
    </div>
  </div>

  <!-- Step Content -->
  <div class="mt-8 rounded-lg border p-6">
    {#if currentStep === 1}
      <div class="flex items-center gap-2 mb-4">
        <Building2 class="h-5 w-5 text-primary" />
        <h2 class="text-lg font-semibold">Business Details</h2>
      </div>
      <div class="space-y-4">
        <div>
          <label for="biz-name" class="block text-sm font-medium mb-1">Business Name</label>
          <input id="biz-name" type="text" bind:value={businessName} placeholder="e.g. Himalayan Coffee House"
            class="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label for="biz-desc" class="block text-sm font-medium mb-1">Description</label>
          <textarea id="biz-desc" bind:value={businessDescription} rows="3" placeholder="Tell customers what your business does..."
            class="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"></textarea>
        </div>
        <div>
          <label for="biz-cat" class="block text-sm font-medium mb-1">Category</label>
          <select id="biz-cat" bind:value={businessCategory}
            class="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
            <option value="">Select a category</option>
            {#each categories as cat}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
        </div>
      </div>

    {:else if currentStep === 2}
      <div class="flex items-center gap-2 mb-4">
        <Phone class="h-5 w-5 text-primary" />
        <h2 class="text-lg font-semibold">Contact Information</h2>
      </div>
      <div class="space-y-4">
        <div>
          <label for="phone" class="block text-sm font-medium mb-1">Phone Number</label>
          <input id="phone" type="tel" bind:value={phone} placeholder="+977 98XXXXXXXX"
            class="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium mb-1">Email Address</label>
          <input id="email" type="email" bind:value={email} placeholder="info@yourbusiness.com"
            class="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label for="address" class="block text-sm font-medium mb-1">Address</label>
          <input id="address" type="text" bind:value={address} placeholder="Thamel, Kathmandu"
            class="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
      </div>

    {:else}
      <div class="flex items-center gap-2 mb-4">
        <FileCheck class="h-5 w-5 text-primary" />
        <h2 class="text-lg font-semibold">Verification Documents</h2>
      </div>
      <p class="text-sm text-muted-foreground mb-4">Upload a business registration document (PAN certificate, company registration, etc.) to verify ownership.</p>
      <div class="rounded-lg border-2 border-dashed p-8 text-center">
        <Upload class="mx-auto h-10 w-10 text-muted-foreground" />
        <p class="mt-2 text-sm font-medium">
          {#if uploadedFile}
            {uploadedFile}
          {:else}
            Drop your file here or click to browse
          {/if}
        </p>
        <p class="mt-1 text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onchange={handleFileSelect} class="absolute inset-0 cursor-pointer opacity-0" style="position:relative;" />
      </div>
    {/if}
  </div>

  <!-- Navigation -->
  <div class="mt-6 flex justify-between">
    <button onclick={prev} disabled={currentStep === 1}
      class="flex items-center gap-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed">
      <ChevronLeft class="h-4 w-4" /> Back
    </button>
    {#if currentStep < totalSteps}
      <button onclick={next}
        class="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Next <ChevronRight class="h-4 w-4" />
      </button>
    {:else}
      <button onclick={submit}
        class="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Submit Application
      </button>
    {/if}
  </div>
</div>
