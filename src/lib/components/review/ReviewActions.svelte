<script lang="ts">
  import { Pencil, Trash2, X, Star } from '@lucide/svelte';

  interface Props {
    reviewId: string;
    reviewTitle?: string;
    reviewBody?: string;
    reviewStars?: number;
    isOwner?: boolean;
  }

  let {
    reviewId,
    reviewTitle = '',
    reviewBody = '',
    reviewStars = 5,
    isOwner = true,
  }: Props = $props();

  let mode = $state<'view' | 'edit' | 'confirm-delete'>('view');
  let editTitle = $state(reviewTitle);
  let editBody = $state(reviewBody);
  let editStars = $state(reviewStars);
  let hoverStars = $state(0);
  let saving = $state(false);
  let deleted = $state(false);

  function openEdit() {
    editTitle = reviewTitle;
    editBody = reviewBody;
    editStars = reviewStars;
    mode = 'edit';
  }

  function cancelEdit() {
    mode = 'view';
  }

  function saveEdit() {
    if (!editTitle.trim() || !editBody.trim() || editStars === 0) return;
    saving = true;
    // Mock save
    setTimeout(() => {
      saving = false;
      mode = 'view';
    }, 800);
  }

  function confirmDelete() {
    mode = 'confirm-delete';
  }

  function cancelDelete() {
    mode = 'view';
  }

  function executeDelete() {
    // Mock delete
    deleted = true;
    mode = 'view';
  }

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }
</script>

{#if !isOwner}
  <!-- Nothing rendered for non-owners -->
{:else if deleted}
  <div class="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
    <p class="text-sm text-muted-foreground">This review has been deleted.</p>
  </div>
{:else if mode === 'view'}
  <div class="flex items-center gap-2">
    <button
      type="button"
      onclick={() => openEdit()}
      class="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
    >
      <Pencil class="h-3.5 w-3.5" /> Edit
    </button>
    <button
      type="button"
      onclick={() => confirmDelete()}
      class="flex items-center gap-1.5 rounded-md border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
    >
      <Trash2 class="h-3.5 w-3.5" /> Delete
    </button>
  </div>

{:else if mode === 'edit'}
  <div class="rounded-lg border p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-semibold">Edit Review</h4>
      <button type="button" onclick={cancelEdit} class="text-muted-foreground hover:text-foreground" aria-label="Cancel edit">
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Star Rating -->
    <div>
      <span class="text-xs font-medium text-muted-foreground">Rating</span>
      <div class="mt-1 flex gap-0.5">
        {#each [1, 2, 3, 4, 5] as n}
          <button
            type="button"
            onclick={() => editStars = n}
            onmouseenter={() => hoverStars = n}
            onmouseleave={() => hoverStars = 0}
            class="p-0.5"
            aria-label="{n} star{n !== 1 ? 's' : ''}"
          >
            <Star class="h-5 w-5 transition-colors {(hoverStars || editStars) >= n ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
          </button>
        {/each}
      </div>
    </div>

    <!-- Title -->
    <div>
      <label for="edit-title-{reviewId}" class="text-xs font-medium text-muted-foreground">Title</label>
      <input
        id="edit-title-{reviewId}"
        type="text"
        bind:value={editTitle}
        class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>

    <!-- Body -->
    <div>
      <label for="edit-body-{reviewId}" class="text-xs font-medium text-muted-foreground">Review</label>
      <textarea
        id="edit-body-{reviewId}"
        bind:value={editBody}
        rows="4"
        class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      ></textarea>
    </div>

    <div class="flex justify-end gap-2">
      <button
        type="button"
        onclick={cancelEdit}
        class="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
      >
        Cancel
      </button>
      <button
        type="button"
        onclick={saveEdit}
        disabled={saving || !editTitle.trim() || !editBody.trim()}
        class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  </div>

{:else if mode === 'confirm-delete'}
  <div class="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
    <h4 class="text-sm font-semibold text-destructive">Delete this review?</h4>
    <p class="mt-1 text-xs text-muted-foreground">This action cannot be undone. Your review will be permanently removed.</p>
    <div class="mt-3 flex gap-2">
      <button
        type="button"
        onclick={cancelDelete}
        class="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
      >
        Cancel
      </button>
      <button
        type="button"
        onclick={executeDelete}
        class="rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-white hover:bg-destructive/90"
      >
        Delete Review
      </button>
    </div>
  </div>
{/if}
