<script lang="ts">
  import { Pencil, Trash2, X, Star } from '@lucide/svelte';

  interface Props {
    reviewId: string;
    isOwner?: boolean;
    initialTitle?: string;
    initialBody?: string;
    initialStars?: number;
    ondelete?: (reviewId: string) => void;
    onedit?: (reviewId: string, data: { title: string; body: string; stars: number }) => void;
  }

  let {
    reviewId,
    isOwner = false,
    initialTitle = '',
    initialBody = '',
    initialStars = 5,
    ondelete,
    onedit,
  }: Props = $props();

  let editing = $state(false);
  let confirmingDelete = $state(false);

  let editTitle = $state('');
  let editBody = $state('');
  let editStars = $state(0);
  let saving = $state(false);
  let hoverStar = $state(0);

  function startEdit() {
    editTitle = initialTitle;
    editBody = initialBody;
    editStars = initialStars;
    editing = true;
    confirmingDelete = false;
  }

  function cancelEdit() {
    editing = false;
  }

  function handleSave(e: Event) {
    e.preventDefault();
    if (!editTitle.trim() || !editBody.trim()) return;
    saving = true;
    // Mock save — would call API
    console.log('Review updated:', { reviewId, title: editTitle, body: editBody, stars: editStars });
    onedit?.(reviewId, { title: editTitle, body: editBody, stars: editStars });
    setTimeout(() => {
      saving = false;
      editing = false;
    }, 500);
  }

  function showDeleteConfirm() {
    confirmingDelete = true;
    editing = false;
  }

  function cancelDelete() {
    confirmingDelete = false;
  }

  function handleDelete() {
    // Mock delete — would call API
    console.log('Review deleted:', reviewId);
    ondelete?.(reviewId);
    confirmingDelete = false;
  }

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }
</script>

{#if isOwner}
  <!-- Action buttons -->
  {#if !editing && !confirmingDelete}
    <div class="flex items-center gap-1">
      <button
        onclick={startEdit}
        class="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Edit your review"
      >
        <Pencil class="h-3.5 w-3.5" />
        Edit
      </button>
      <button
        onclick={showDeleteConfirm}
        class="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        aria-label="Delete your review"
      >
        <Trash2 class="h-3.5 w-3.5" />
        Delete
      </button>
    </div>
  {/if}

  <!-- Delete confirmation -->
  {#if confirmingDelete}
    <div class="mt-3 rounded-md border border-destructive/20 bg-destructive/5 p-4">
      <p class="text-sm font-medium text-destructive">Delete this review?</p>
      <p class="mt-1 text-xs text-muted-foreground">This action cannot be undone. Your review will be permanently removed.</p>
      <div class="mt-3 flex items-center gap-2">
        <button
          onclick={handleDelete}
          class="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
        >
          Yes, delete
        </button>
        <button
          onclick={cancelDelete}
          class="rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </div>
  {/if}

  <!-- Inline edit form -->
  {#if editing}
    <form onsubmit={handleSave} class="mt-3 space-y-3 rounded-md border p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">Edit Review</span>
        <button
          type="button"
          onclick={cancelEdit}
          class="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Cancel editing"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Star rating -->
      <div>
        <p class="mb-1 text-xs font-medium text-muted-foreground">Rating</p>
        <div class="flex items-center gap-0.5" role="radiogroup" aria-label="Star rating">
          {#each [1, 2, 3, 4, 5] as star}
            <button
              type="button"
              onclick={() => (editStars = star)}
              onmouseenter={() => (hoverStar = star)}
              onmouseleave={() => (hoverStar = 0)}
              class="rounded p-0.5 transition-transform hover:scale-110"
              aria-label="{star} star{star !== 1 ? 's' : ''}"
              aria-pressed={editStars === star}
            >
              <Star
                class="h-5 w-5 {(hoverStar ? star <= hoverStar : star <= editStars)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground/30'}"
              />
            </button>
          {/each}
        </div>
      </div>

      <!-- Title -->
      <div>
        <label for="edit-title-{reviewId}" class="mb-1 block text-xs font-medium text-muted-foreground">Title</label>
        <input
          id="edit-title-{reviewId}"
          type="text"
          bind:value={editTitle}
          required
          class="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Review title"
        />
      </div>

      <!-- Body -->
      <div>
        <label for="edit-body-{reviewId}" class="mb-1 block text-xs font-medium text-muted-foreground">Review</label>
        <textarea
          id="edit-body-{reviewId}"
          bind:value={editBody}
          required
          rows="4"
          class="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Write your review..."
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2">
        <button
          type="button"
          onclick={cancelEdit}
          class="rounded-md border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || !editTitle.trim() || !editBody.trim()}
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  {/if}
{/if}
