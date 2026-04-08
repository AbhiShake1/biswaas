<script lang="ts">
  import { page } from '$app/stores';
  import { Star } from '@lucide/svelte';
  let id = $derived($page.params.businessId);
</script>

<svelte:head>
  <style>body { margin: 0; font-family: system-ui, sans-serif; }</style>
</svelte:head>

<a href="https://biswaas.pages.dev/review/{id}" target="_blank" rel="noopener" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center; padding: 12px 16px; font-family: system-ui, sans-serif;">
  <div style="display: flex; align-items: center; gap: 6px;">
    <span style="font-size: 24px; font-weight: 700;">4.2</span>
    <div style="display: flex; gap: 2px;">
      {#each [1,2,3,4] as _}
        <Star style="width: 18px; height: 18px; fill: #facc15; color: #facc15;" />
      {/each}
      <Star style="width: 18px; height: 18px; fill: none; color: #d1d5db;" />
    </div>
  </div>
  <span style="font-size: 12px; color: #6b7280; margin-top: 4px;">Based on 156 reviews on <strong>Biswaas</strong></span>
</a>
