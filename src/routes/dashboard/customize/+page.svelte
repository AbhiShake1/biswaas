<script lang="ts">
  import { Upload, Save, Plus, X, Award, Sparkles, Image } from '@lucide/svelte';

  // Mock data — pre-populated
  let logoPreview = $state<string | null>(null);
  let bannerPreview = $state<string | null>(null);
  let tagline = $state('Your trusted consultancy partner in Nepal');
  let guarantees = $state<string[]>(['Money-back guarantee', 'Verified consultants']);
  let certifications = $state<string[]>(['ISO 9001:2015', 'AIRC Certified']);
  let highlights = $state<string[]>(['10+ years experience', '5000+ students placed', '20+ university partners']);

  let newGuarantee = $state('');
  let newCertification = $state('');
  let newHighlight = $state('');
  let saved = $state(false);

  function handleLogoUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => (logoPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleBannerUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => (bannerPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  function addItem(list: string[], value: string, clear: () => void) {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      list.push(trimmed);
      clear();
    }
  }

  function removeItem(list: string[], index: number) {
    list.splice(index, 1);
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    // Mock save
    saved = true;
    setTimeout(() => (saved = false), 3000);
  }
</script>

<svelte:head>
  <title>Customize Profile — Dashboard — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold">Customize Profile</h1>
  <p class="mt-1 text-sm text-muted-foreground">Personalize your business presence with branding and highlights</p>

  <form onsubmit={handleSubmit} class="mt-6 max-w-2xl space-y-8">
    <!-- Logo Upload -->
    <section class="space-y-3">
      <h2 class="flex items-center gap-2 text-base font-semibold">
        <Image class="h-4 w-4" /> Business Logo
      </h2>
      <div class="flex items-center gap-4">
        <div class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted/30">
          {#if logoPreview}
            <img src={logoPreview} alt="Logo preview" class="h-full w-full object-cover" />
          {:else}
            <Upload class="h-8 w-8 text-muted-foreground/50" />
          {/if}
        </div>
        <div>
          <label
            class="inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Upload class="h-4 w-4" /> Upload Logo
            <input type="file" accept="image/*" class="hidden" onchange={handleLogoUpload} />
          </label>
          <p class="mt-1 text-xs text-muted-foreground">PNG or JPG, max 2MB. Recommended 256x256px.</p>
        </div>
      </div>
    </section>

    <!-- Banner Upload -->
    <section class="space-y-3">
      <h2 class="flex items-center gap-2 text-base font-semibold">
        <Image class="h-4 w-4" /> Profile Banner
      </h2>
      <div class="space-y-2">
        <div class="flex h-36 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted/30">
          {#if bannerPreview}
            <img src={bannerPreview} alt="Banner preview" class="h-full w-full object-cover" />
          {:else}
            <div class="flex flex-col items-center gap-1 text-muted-foreground/50">
              <Upload class="h-8 w-8" />
              <span class="text-xs">1200 x 300 recommended</span>
            </div>
          {/if}
        </div>
        <label
          class="inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Upload class="h-4 w-4" /> Upload Banner
          <input type="file" accept="image/*" class="hidden" onchange={handleBannerUpload} />
        </label>
      </div>
    </section>

    <!-- Tagline -->
    <section class="space-y-3">
      <h2 class="flex items-center gap-2 text-base font-semibold">
        <Sparkles class="h-4 w-4" /> Tagline
      </h2>
      <div>
        <input
          type="text"
          bind:value={tagline}
          maxlength="120"
          placeholder="A short tagline for your business..."
          class="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <p class="mt-1 text-xs text-muted-foreground">{tagline.length}/120 characters</p>
      </div>
    </section>

    <!-- Guarantees -->
    <section class="space-y-3">
      <h2 class="flex items-center gap-2 text-base font-semibold">
        <Award class="h-4 w-4" /> Guarantees
      </h2>
      <div class="flex flex-wrap gap-2">
        {#each guarantees as item, i}
          <span class="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-950/30 dark:text-green-400">
            {item}
            <button type="button" onclick={() => removeItem(guarantees, i)} class="ml-1 hover:text-red-600" aria-label="Remove {item}">
              <X class="h-3 w-3" />
            </button>
          </span>
        {/each}
      </div>
      <div class="flex gap-2">
        <input
          type="text"
          bind:value={newGuarantee}
          placeholder="Add a guarantee..."
          class="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); addItem(guarantees, newGuarantee, () => (newGuarantee = '')); } }}
        />
        <button
          type="button"
          onclick={() => addItem(guarantees, newGuarantee, () => (newGuarantee = ''))}
          class="flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <Plus class="h-4 w-4" /> Add
        </button>
      </div>
    </section>

    <!-- Certifications -->
    <section class="space-y-3">
      <h2 class="flex items-center gap-2 text-base font-semibold">
        <Award class="h-4 w-4" /> Certifications
      </h2>
      <div class="flex flex-wrap gap-2">
        {#each certifications as item, i}
          <span class="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-950/30 dark:text-blue-400">
            {item}
            <button type="button" onclick={() => removeItem(certifications, i)} class="ml-1 hover:text-red-600" aria-label="Remove {item}">
              <X class="h-3 w-3" />
            </button>
          </span>
        {/each}
      </div>
      <div class="flex gap-2">
        <input
          type="text"
          bind:value={newCertification}
          placeholder="Add a certification..."
          class="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); addItem(certifications, newCertification, () => (newCertification = '')); } }}
        />
        <button
          type="button"
          onclick={() => addItem(certifications, newCertification, () => (newCertification = ''))}
          class="flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <Plus class="h-4 w-4" /> Add
        </button>
      </div>
    </section>

    <!-- Business Highlights -->
    <section class="space-y-3">
      <h2 class="flex items-center gap-2 text-base font-semibold">
        <Sparkles class="h-4 w-4" /> Business Highlights
      </h2>
      <div class="flex flex-wrap gap-2">
        {#each highlights as item, i}
          <span class="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-950/30 dark:text-purple-400">
            {item}
            <button type="button" onclick={() => removeItem(highlights, i)} class="ml-1 hover:text-red-600" aria-label="Remove {item}">
              <X class="h-3 w-3" />
            </button>
          </span>
        {/each}
      </div>
      <div class="flex gap-2">
        <input
          type="text"
          bind:value={newHighlight}
          placeholder="Add a highlight..."
          class="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); addItem(highlights, newHighlight, () => (newHighlight = '')); } }}
        />
        <button
          type="button"
          onclick={() => addItem(highlights, newHighlight, () => (newHighlight = ''))}
          class="flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <Plus class="h-4 w-4" /> Add
        </button>
      </div>
    </section>

    <!-- Save -->
    <div class="flex items-center gap-3 border-t pt-6">
      <button
        type="submit"
        class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Save class="h-4 w-4" /> Save Customization
      </button>
      {#if saved}
        <span class="text-sm text-green-600">Customization saved successfully!</span>
      {/if}
    </div>
  </form>
</div>
