<script lang="ts">
  import { Flag, X } from '@lucide/svelte';

  let { reviewId = '' }: { reviewId: string } = $props();

  let open = $state(false);
  let selectedReason = $state('');
  let details = $state('');
  let submitted = $state(false);

  const reasons = [
    { value: 'spam', label: 'Spam', description: 'Promotional content or repetitive posts' },
    { value: 'fake', label: 'Fake Review', description: 'Not based on a genuine experience' },
    { value: 'inappropriate', label: 'Inappropriate', description: 'Offensive, abusive, or hateful content' },
    { value: 'conflict', label: 'Conflict of Interest', description: 'Written by the business owner or competitor' },
    { value: 'other', label: 'Other', description: 'Another reason not listed above' },
  ];

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!selectedReason) return;
    // Mock — would POST to API
    console.log('Report submitted:', { reviewId, reason: selectedReason, details });
    submitted = true;
    setTimeout(() => {
      open = false;
      submitted = false;
      selectedReason = '';
      details = '';
    }, 2000);
  }

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      open = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') open = false;
  }
</script>

<button
  onclick={() => (open = true)}
  class="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
  aria-label="Report this review"
>
  <Flag class="h-3.5 w-3.5" />
  Report
</button>

{#if open}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions a11y_interactive_supports_focus -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    role="dialog"
    aria-modal="true"
    aria-label="Report review"
    onclick={handleBackdrop}
    onkeydown={handleKeydown}
  >
    <div class="mx-4 w-full max-w-md rounded-lg border bg-card p-6 shadow-xl">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Report Review</h2>
        <button
          onclick={() => (open = false)}
          class="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      {#if submitted}
        <div class="mt-4 rounded-md bg-green-50 p-4 text-center text-sm text-green-700 dark:bg-green-950/20 dark:text-green-400">
          Thank you. Your report has been submitted and will be reviewed by our team.
        </div>
      {:else}
        <p class="mt-2 text-sm text-muted-foreground">
          Why are you reporting this review? Select a reason below.
        </p>

        <form onsubmit={handleSubmit} class="mt-4 space-y-3">
          {#each reasons as reason}
            <label
              class="flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors {selectedReason === reason.value
                ? 'border-primary bg-primary/5'
                : 'hover:bg-muted/50'}"
            >
              <input
                type="radio"
                name="reason"
                value={reason.value}
                bind:group={selectedReason}
                class="mt-0.5 accent-primary"
              />
              <div>
                <span class="text-sm font-medium">{reason.label}</span>
                <p class="text-xs text-muted-foreground">{reason.description}</p>
              </div>
            </label>
          {/each}

          {#if selectedReason === 'other'}
            <div>
              <label for="report-details" class="block text-sm font-medium">Additional details</label>
              <textarea
                id="report-details"
                bind:value={details}
                rows="3"
                placeholder="Please describe the issue..."
                class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              ></textarea>
            </div>
          {/if}

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onclick={() => (open = false)}
              class="rounded-md border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedReason}
              class="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
            >
              Submit Report
            </button>
          </div>
        </form>
      {/if}
    </div>
  </div>
{/if}
