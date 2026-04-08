<script lang="ts">
  let { attributes = [] }: { attributes: { name: string; score: number; max?: number }[] } = $props();
</script>

{#if attributes.length > 0}
  <div class="rounded-lg border p-4">
    <h3 class="text-sm font-semibold">Category Ratings</h3>
    <div class="mt-3 space-y-2.5">
      {#each attributes as attr}
        {@const max = attr.max ?? 5}
        <div class="flex items-center justify-between gap-3">
          <span class="text-sm text-muted-foreground">{attr.name}</span>
          <div class="flex items-center gap-2">
            <div class="h-2 w-24 overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full bg-primary"
                style="width: {(attr.score / max) * 100}%"
              ></div>
            </div>
            <span class="text-xs font-medium">{attr.score}/{max}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
