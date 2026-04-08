<script lang="ts">
  import { ImagePlus, X, Upload } from '@lucide/svelte';

  interface Props {
    maxPhotos?: number;
  }

  let { maxPhotos = 5 }: Props = $props();

  let photos = $state<{ id: string; file: File; url: string }[]>([]);
  let isDragging = $state(false);
  let uploadStatus = $state<'idle' | 'uploading' | 'done'>('idle');

  function addFiles(files: FileList | null) {
    if (!files) return;
    const remaining = maxPhotos - photos.length;
    const toAdd = Array.from(files).slice(0, remaining);

    for (const file of toAdd) {
      if (!file.type.startsWith('image/')) continue;
      const id = crypto.randomUUID();
      const url = URL.createObjectURL(file);
      photos = [...photos, { id, file, url }];
    }
  }

  function removePhoto(id: string) {
    const photo = photos.find((p) => p.id === id);
    if (photo) URL.revokeObjectURL(photo.url);
    photos = photos.filter((p) => p.id !== id);
    if (photos.length === 0) uploadStatus = 'idle';
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    addFiles(e.dataTransfer?.files ?? null);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function handleInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    addFiles(input.files);
    input.value = '';
  }

  function mockUpload() {
    if (photos.length === 0) return;
    uploadStatus = 'uploading';
    setTimeout(() => {
      uploadStatus = 'done';
    }, 1500);
  }
</script>

<div class="rounded-lg border p-4">
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-semibold">Photos</h3>
    <span class="text-xs text-muted-foreground">{photos.length}/{maxPhotos}</span>
  </div>

  <!-- Drag-and-drop zone -->
  {#if photos.length < maxPhotos}
    <label
      class="mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors {isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}"
      ondrop={handleDrop}
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
    >
      <ImagePlus class="h-8 w-8 text-muted-foreground/50" />
      <span class="text-sm text-muted-foreground">
        {isDragging ? 'Drop photos here' : 'Drag photos here or click to browse'}
      </span>
      <span class="text-xs text-muted-foreground/60">JPG, PNG, WebP up to 5MB each</span>
      <input
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        onchange={handleInputChange}
      />
    </label>
  {/if}

  <!-- Thumbnails -->
  {#if photos.length > 0}
    <div class="mt-3 grid grid-cols-5 gap-2">
      {#each photos as photo (photo.id)}
        <div class="group relative aspect-square overflow-hidden rounded-md border">
          <img src={photo.url} alt="Review photo" class="h-full w-full object-cover" />
          <button
            type="button"
            onclick={() => removePhoto(photo.id)}
            class="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Remove photo"
          >
            <X class="h-3 w-3" />
          </button>
        </div>
      {/each}
    </div>

    <!-- Mock upload button -->
    <button
      type="button"
      onclick={mockUpload}
      disabled={uploadStatus !== 'idle'}
      class="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
    >
      {#if uploadStatus === 'idle'}
        <Upload class="h-4 w-4" /> Upload {photos.length} photo{photos.length !== 1 ? 's' : ''}
      {:else if uploadStatus === 'uploading'}
        <span class="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
        Uploading...
      {:else}
        Uploaded successfully
      {/if}
    </button>
  {/if}
</div>
