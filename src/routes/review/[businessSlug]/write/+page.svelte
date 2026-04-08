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

<section class="relative overflow-hidden px-4 py-10 md:py-14">
  <div class="absolute left-[8%] top-[-3rem] h-32 w-32 rounded-full bg-[var(--theme-orange)]/90"></div>
  <div class="absolute bottom-0 right-[-2rem] h-24 w-56 rounded-tl-[3rem] bg-[var(--theme-green)]"></div>

  <div class="relative mx-auto max-w-3xl">
    <nav class="mb-6 text-sm text-muted-foreground">
      <a href="/" class="hover:text-foreground">Home</a>
      <span class="mx-1">/</span>
      <a href="/review/{business.slug}" class="hover:text-foreground">{businessName}</a>
      <span class="mx-1">/</span>
      <span class="text-foreground">Write Review</span>
    </nav>

    {#if form?.success}
      <div class="surface-panel rounded-[2rem] p-8 text-center">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--theme-green)] text-lg font-bold text-[var(--theme-ink)]">✓</div>
        <h1 class="mt-5 text-3xl font-extrabold tracking-[-0.05em] text-foreground">Thank you!</h1>
        <p class="mt-3 text-sm text-muted-foreground">Your review for {businessName} has been submitted.</p>
        <a
          href="/review/{business.slug}"
          class="mt-6 inline-flex rounded-full bg-[var(--theme-blue)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_-20px_rgba(75,97,209,0.72)]"
        >
          Back to {businessName}
        </a>
      </div>
    {:else if !data.user}
      <div class="surface-panel rounded-[2rem] p-8 text-center">
        <h1 class="text-3xl font-extrabold tracking-[-0.05em] text-foreground">Sign in to write a review</h1>
        <p class="mt-3 text-sm leading-6 text-muted-foreground">
          Reviews are now saved to the live database, so we need your account attached to the submission.
        </p>
        <a
          href="/auth/login"
          class="mt-6 inline-flex rounded-full bg-[var(--theme-blue)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_-20px_rgba(75,97,209,0.72)]"
        >
          Sign in
        </a>
      </div>
    {:else}
      <div class="surface-panel rounded-[2rem] p-6 md:p-8">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--theme-blue)]">Review submission</p>
        <h1 class="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-foreground md:text-4xl">Review {businessName}</h1>
        <p class="mt-3 text-sm leading-6 text-muted-foreground">Share your experience with others.</p>

        <form method="POST" class="mt-8 space-y-6">
          <input type="hidden" name="stars" value={stars} />
          <div>
            <span class="text-sm font-semibold text-foreground">Your Rating</span>
            <div class="mt-3 flex gap-1">
              {#each [1, 2, 3, 4, 5] as value}
                <button
                  type="button"
                  onclick={() => (stars = value)}
                  onmouseenter={() => (hoverStars = value)}
                  onmouseleave={() => (hoverStars = 0)}
                  class="rounded-full p-1"
                  aria-label="{value} star{value !== 1 ? 's' : ''}"
                >
                  <Star class="h-9 w-9 transition-colors {(hoverStars || stars) >= value ? 'fill-[var(--theme-green)] text-[var(--theme-green)]' : 'text-muted-foreground/30'}" />
                </button>
              {/each}
              {#if stars > 0}
                <span class="ml-2 self-center rounded-full bg-[var(--theme-blue)]/10 px-3 py-1 text-sm font-semibold text-[var(--theme-blue)]">{stars}/5</span>
              {/if}
            </div>
          </div>

          <div>
            <label for="review-title" class="text-sm font-semibold text-foreground">Review Title</label>
            <input
              id="review-title"
              type="text"
              bind:value={title}
              name="title"
              placeholder="Summarize your experience"
              required
              class="mt-2 w-full rounded-[1.2rem] border bg-white px-4 py-3 text-sm outline-none focus:border-[var(--theme-blue)] focus:ring-1 focus:ring-[var(--theme-blue)]"
            />
          </div>

          <div>
            <label for="review-body" class="text-sm font-semibold text-foreground">Your Comment</label>
            <textarea
              id="review-body"
              bind:value={body}
              name="body"
              placeholder="Tell others about your experience..."
              rows="7"
              required
              class="mt-2 w-full rounded-[1.2rem] border bg-white px-4 py-3 text-sm outline-none focus:border-[var(--theme-blue)] focus:ring-1 focus:ring-[var(--theme-blue)]"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={stars === 0 || !title.trim() || !body.trim()}
            class="w-full rounded-full bg-[var(--theme-blue)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_-20px_rgba(75,97,209,0.72)] disabled:opacity-50"
          >
            Submit Comment
          </button>
          {#if form?.error}
            <p class="text-sm text-destructive">{form.error}</p>
          {/if}
        </form>
      </div>
    {/if}
  </div>
</section>
