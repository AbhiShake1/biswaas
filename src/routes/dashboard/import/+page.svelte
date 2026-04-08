<script lang="ts">
  import { Upload, FileText, Download, CheckCircle, AlertCircle } from '@lucide/svelte';

  let file = $state<File | null>(null);
  let isDragOver = $state(false);
  let importProgress = $state(0);
  let importing = $state(false);
  let importDone = $state(false);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragOver = false;
    const droppedFile = e.dataTransfer?.files[0];
    if (droppedFile?.name.endsWith('.csv')) {
      file = droppedFile;
    }
  }

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
      file = input.files[0];
    }
  }

  function startImport() {
    if (!file) return;
    importing = true;
    importProgress = 0;
    importDone = false;

    const interval = setInterval(() => {
      importProgress += Math.random() * 15 + 5;
      if (importProgress >= 100) {
        importProgress = 100;
        importing = false;
        importDone = true;
        clearInterval(interval);
      }
    }, 300);
  }

  function downloadSample() {
    const csv = 'reviewer_name,rating,title,body,date\nRam B.,5,Great service,Very professional,2025-03-15\nSita K.,4,Good experience,Helpful staff,2025-03-10\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'biswaas-import-sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    file = null;
    importProgress = 0;
    importing = false;
    importDone = false;
  }
</script>

<svelte:head>
  <title>Bulk Review Import — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold flex items-center gap-2">
    <Upload class="h-6 w-6" /> Bulk Review Import
  </h1>
  <p class="mt-1 text-sm text-muted-foreground">Import reviews from a CSV file into your business listing.</p>

  <!-- Instructions -->
  <div class="mt-6 rounded-lg border p-4">
    <h3 class="font-medium flex items-center gap-2">
      <FileText class="h-4 w-4 text-muted-foreground" /> File Format Requirements
    </h3>
    <ul class="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
      <li>CSV file with headers: <code class="rounded bg-muted px-1 py-0.5 text-xs">reviewer_name, rating, title, body, date</code></li>
      <li>Rating must be between 1 and 5</li>
      <li>Date format: YYYY-MM-DD</li>
      <li>Maximum 1,000 reviews per import</li>
    </ul>
    <button onclick={downloadSample}
      class="mt-3 flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted">
      <Download class="h-4 w-4" /> Download Sample CSV
    </button>
  </div>

  <!-- Drop Zone -->
  <div
    class="mt-6 rounded-lg border-2 border-dashed p-10 text-center transition-colors {isDragOver ? 'border-primary bg-primary/5' : ''}"
    ondragover={(e) => { e.preventDefault(); isDragOver = true; }}
    ondragleave={() => isDragOver = false}
    ondrop={handleDrop}
    role="region"
    aria-label="File drop zone"
  >
    {#if file}
      <FileText class="mx-auto h-10 w-10 text-primary" />
      <p class="mt-2 font-medium">{file.name}</p>
      <p class="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
      <div class="mt-3 flex justify-center gap-2">
        <button onclick={startImport} disabled={importing}
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {importing ? 'Importing...' : 'Start Import'}
        </button>
        <button onclick={reset}
          class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
          Remove
        </button>
      </div>
    {:else}
      <Upload class="mx-auto h-10 w-10 text-muted-foreground" />
      <p class="mt-2 font-medium">Drag and drop your CSV file here</p>
      <p class="text-sm text-muted-foreground">or click to browse</p>
      <label class="mt-3 inline-block cursor-pointer rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
        Choose File
        <input type="file" accept=".csv" onchange={handleFileSelect} class="hidden" />
      </label>
    {/if}
  </div>

  <!-- Progress -->
  {#if importing || importDone}
    <div class="mt-6 rounded-lg border p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium">Import Progress</span>
        <span class="text-sm text-muted-foreground">{Math.round(importProgress)}%</span>
      </div>
      <div class="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div class="h-full rounded-full bg-primary transition-all" style="width: {importProgress}%"></div>
      </div>
      {#if importDone}
        <div class="mt-3 flex items-center gap-2 text-sm text-green-600">
          <CheckCircle class="h-4 w-4" />
          <span>Import completed successfully! Reviews are now visible on your listing.</span>
        </div>
      {/if}
    </div>
  {/if}
</div>
