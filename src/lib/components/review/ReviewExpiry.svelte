<script lang="ts">
  import { Clock } from '@lucide/svelte';

  interface Props {
    reviewDate: string;
    thresholdYears?: number;
  }

  let { reviewDate, thresholdYears = 2 }: Props = $props();

  const isExpired = $derived(() => {
    const review = new Date(reviewDate);
    const threshold = new Date();
    threshold.setFullYear(threshold.getFullYear() - thresholdYears);
    return review < threshold;
  });
</script>

{#if isExpired()}
  <div class="flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
    <Clock class="h-4 w-4 shrink-0" />
    <p>This review is over {thresholdYears} years old. It may no longer reflect the current experience.</p>
  </div>
{/if}
