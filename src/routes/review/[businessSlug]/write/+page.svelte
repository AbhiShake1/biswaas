<script lang="ts">
  import { Star } from '@lucide/svelte';
  let { data, form }: import('./$types').PageProps = $props();

  let business = $derived(data.business);
  let businessName = $derived(business?.name ?? 'Business');

  let stars = $state(0);
  let hoverStars = $state(0);
  let title = $state('');
  let body = $state('');
</script>

<svelte:head>
  <title>Write Review for {businessName} — Biswaas</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-8">
  <nav class="mb-6 text-sm text-muted-foreground">
    <a href="/" class="hover:text-foreground">Home</a>
    <span class="mx-1">/</span>
    <a href="/review/{business.slug}" class="hover:text-foreground">{businessName}</a>
    <span class="mx-1">/</span>
    <span class="text-foreground">Write Review</span>
  </nav>

  {#if form?.success}
    <div class="rounded-lg border p-8 text-center">
      <h1 class="text-2xl font-bold">Thank you!</h1>
      <p class="mt-2 text-muted-foreground">Your review for {businessName} has been submitted.</p>
      <a href="/review/{business.slug}" class="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Back to {businessName}
      </a>
    </div>
  {:else if !data.user}
    <div class="rounded-lg border p-8 text-center">
      <h1 class="text-2xl font-bold">Sign in to write a review</h1>
      <p class="mt-2 text-muted-foreground">Reviews are now saved to the live database, so we need your account attached to the submission.</p>
      <a href="/auth/login" class="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Sign in
      </a>
    </div>
  {:else}
    <h1 class="text-2xl font-bold">Review {businessName}</h1>
    <p class="mt-1 text-muted-foreground">Share your experience with others.</p>

    <form method="POST" class="mt-8 space-y-6">
      <input type="hidden" name="stars" value={stars} />
      <div>
        <span class="text-sm font-medium">Your Rating</span>
        <div class="mt-2 flex gap-1">
          {#each [1, 2, 3, 4, 5] as value}
            <button
              type="button"
              onclick={() => (stars = value)}
              onmouseenter={() => (hoverStars = value)}
              onmouseleave={() => (hoverStars = 0)}
              class="p-0.5"
              aria-label="{value} star{value !== 1 ? 's' : ''}"
            >
              <Star class="h-8 w-8 transition-colors {(hoverStars || stars) >= value ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
            </button>
          {/each}
          {#if stars > 0}
            <span class="ml-2 self-center text-sm text-muted-foreground">{stars}/5</span>
          {/if}
        </div>
      </div>

      <div>
        <label for="review-title" class="text-sm font-medium">Review Title</label>
        <input
          id="review-title"
          type="text"
          bind:value={title}
          name="title"
          placeholder="Summarize your experience"
          required
          class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label for="review-body" class="text-sm font-medium">Your Comment</label>
        <textarea
          id="review-body"
          bind:value={body}
          name="body"
          placeholder="Tell others about your experience..."
          rows="6"
          required
          class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={stars === 0 || !title.trim() || !body.trim()}
        class="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        Submit Comment
      </button>
      {#if form?.error}
        <p class="text-sm text-destructive">{form.error}</p>
      {/if}
    </form>
  {/if}
</div>
