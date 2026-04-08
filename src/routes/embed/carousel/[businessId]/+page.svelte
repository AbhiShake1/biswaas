<script lang="ts">
  import { page } from '$app/stores';
  import { Star, ChevronLeft, ChevronRight } from '@lucide/svelte';
  let id = $derived($page.params.businessId);

  const reviews = [
    { author: 'Ram B.', stars: 5, title: 'Excellent service', body: 'Very professional and helped me get admission to my dream university.' },
    { author: 'Sita K.', stars: 4, title: 'Good but expensive', body: 'Good guidance but consultation fee was a bit high.' },
    { author: 'Gita S.', stars: 5, title: 'Best in Kathmandu', body: 'They walked me through every step. Got my visa first attempt!' },
  ];

  let currentIndex = $state(0);
  function next() { currentIndex = (currentIndex + 1) % reviews.length; }
  function prev() { currentIndex = (currentIndex - 1 + reviews.length) % reviews.length; }
  let review = $derived(reviews[currentIndex]);
</script>

<svelte:head>
  <style>body { margin: 0; font-family: system-ui, sans-serif; }</style>
</svelte:head>

<div style="padding: 16px; font-family: system-ui, sans-serif; max-width: 100%; box-sizing: border-box;">
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-weight: 700; font-size: 20px;">4.2</span>
      <div style="display: flex; gap: 1px;">
        {#each [1,2,3,4] as _}
          <Star style="width: 16px; height: 16px; fill: #facc15; color: #facc15;" />
        {/each}
        <Star style="width: 16px; height: 16px; fill: none; color: #d1d5db;" />
      </div>
      <span style="font-size: 12px; color: #6b7280;">156 reviews</span>
    </div>
    <a href="https://biswaas.pages.dev/review/{id}" target="_blank" rel="noopener" style="font-size: 11px; color: #3b82f6; text-decoration: none;">View all →</a>
  </div>

  <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; min-height: 120px; position: relative;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
      <strong style="font-size: 14px;">{review.author}</strong>
      <div style="display: flex; gap: 1px;">
        {#each Array(review.stars) as _}
          <Star style="width: 12px; height: 12px; fill: #facc15; color: #facc15;" />
        {/each}
      </div>
    </div>
    <p style="font-size: 14px; font-weight: 600; margin: 0 0 4px;">{review.title}</p>
    <p style="font-size: 13px; color: #6b7280; margin: 0; line-height: 1.4;">{review.body}</p>

    <div style="display: flex; gap: 8px; margin-top: 12px;">
      <button onclick={prev} style="border: 1px solid #e5e7eb; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: white;">
        <ChevronLeft style="width: 14px; height: 14px;" />
      </button>
      <button onclick={next} style="border: 1px solid #e5e7eb; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: white;">
        <ChevronRight style="width: 14px; height: 14px;" />
      </button>
    </div>
  </div>

  <div style="text-align: center; margin-top: 8px;">
    <span style="font-size: 10px; color: #9ca3af;">Powered by <strong>विश्वास Biswaas</strong></span>
  </div>
</div>
