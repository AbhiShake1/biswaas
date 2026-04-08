<script lang="ts">
  import { page } from '$app/stores';
  import { Star } from '@lucide/svelte';
  let id = $derived($page.params.businessId);
</script>

<svelte:head>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
  </style>
</svelte:head>

<a href="https://biswaas.pages.dev/review/{id}" target="_blank" rel="noopener" class="flex items-center gap-2 rounded border bg-white px-3 py-2 no-underline shadow-sm hover:shadow" style="font-family: system-ui, sans-serif; text-decoration: none; color: inherit; display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; background: white;">
  <span style="font-weight: 700; font-size: 18px;">4.2</span>
  <span style="display: flex; gap: 1px;">
    {#each [1,2,3,4] as _}
      <Star style="width: 14px; height: 14px; fill: #facc15; color: #facc15;" />
    {/each}
    <Star style="width: 14px; height: 14px; fill: none; color: #d1d5db;" />
  </span>
  <span style="font-size: 11px; color: #6b7280;">156 reviews</span>
  <span style="font-size: 10px; color: #9ca3af; margin-left: 4px;">विश्वास</span>
</a>
