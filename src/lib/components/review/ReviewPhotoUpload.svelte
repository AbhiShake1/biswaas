<script lang="ts">
  import { Upload, X, ImagePlus } from '@lucide/svelte';

  interface Props {
    maxPhotos?: number;
    onchange?: (files: File[]) => void;
  }

  let { maxPhotos = 5, onchange }: Props = $props();

  interface PhotoItem {
    file: File;
    url: string;
  }

  let photos = $state<PhotoItem[]>([]);
  let dragOver = $state(false);
  let error = $state('');

  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE_MB = 5;

  function validate(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `${file.name}: Only JPG, PNG, and WebP images are allowed.`;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `${file.name}: File exceeds ${MAX_SIZE_MB}MB limit.`;
    }
    return null;
  }

  function addFiles(fileList: FileList | File[]) {
    error = '';
    const incoming = Array.from(fileList);
    const remaining = maxPhotos - photos.length;

    if (remaining <= 0) {
      error = `Maximum ${maxPhotos} photos allowed.`;
      return;
    }

    const toAdd: PhotoItem[] = [];

    for (const file of incoming.slice(0, remaining)) {
      const err = validate(file);
      if (err) {
        error = err;
        continue;
      }
      toAdd.push({ file, url: URL.createObjectURL(file) });
    }

    if (incoming.length > remaining) {
      error = `Only ${remaining} more photo${remaining === 1 ? '' : 's'} can be added (max ${maxPhotos}).`;
    }

    if (toAdd.length > 0) {
      photos = [...photos, ...toAdd];
      onchange?.(photos.map((p) => p.file));
    }
  }

  function removePhoto(index: number) {
    error = '';
    URL.revokeObjectURL(photos[index].url);
    photos = photos.filter((_, i) => i !== index);
    onchange?.(photos.map((p) => p.file));
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    if (e.dataTransfer?.files) {
      addFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function handleFileInput(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      addFiles(input.files);
      input.value = '';
    }
  }

  let fileInputId = $state(`photo-upload-${Math.random().toString(36).slice(2, 8)}`);
</script>

<div class="space-y-3">
  <p class="text-sm font-medium">
    Photos <span class="text-muted-foreground">({photos.length}/{maxPhotos})</span>
  </p>

  <!-- Drop zone -->
  {#if photos.length < maxPhotos}
    <div
      class="relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors
        {dragOver
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'}"
      role="button"
      tabindex="0"
      aria-label="Upload photos by dragging or clicking"
      ondrop={handleDrop}
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
      onclick={() => document.getElementById(fileInputId)?.click()}
      onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById(fileInputId)?.click(); } }}
    >
      {#if dragOver}
        <ImagePlus class="mb-2 h-8 w-8 text-primary" />
        <span class="text-sm font-medium text-primary">Drop photos here</span>
      {:else}
        <Upload class="mb-2 h-8 w-8 text-muted-foreground" />
        <span class="text-sm font-medium">Drag and drop photos here</span>
        <span class="mt-1 text-xs text-muted-foreground">or click to browse &middot; JPG, PNG, WebP &middot; Max {MAX_SIZE_MB}MB each</span>
      {/if}
    </div>

    <input
      id={fileInputId}
      type="file"
      accept={ACCEPTED_TYPES.join(',')}
      multiple
      class="hidden"
      onchange={handleFileInput}
    />
  {/if}

  <!-- Error -->
  {#if error}
    <p class="text-sm text-destructive" role="alert">{error}</p>
  {/if}

  <!-- Thumbnail grid -->
  {#if photos.length > 0}
    <div class="grid grid-cols-3 gap-3 sm:grid-cols-5">
      {#each photos as photo, i}
        <div class="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
          <img
            src={photo.url}
            alt="Upload preview {i + 1}"
            class="h-full w-full object-cover"
          />
          <button
            type="button"
            onclick={() => removePhoto(i)}
            class="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
            aria-label="Remove photo {i + 1}"
          >
            <X class="h-3.5 w-3.5" />
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>
