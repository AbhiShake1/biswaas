<script lang="ts">
  let { address = '', lat = 27.7172, lng = 85.3240 }: { address: string; lat: number; lng: number } = $props();
</script>

<div class="rounded-lg border bg-muted/30 p-4">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm font-medium">Location</p>
      <p class="text-xs text-muted-foreground">{address}</p>
    </div>
    <a
      href="https://www.google.com/maps?q={lat},{lng}"
      target="_blank"
      rel="noopener"
      class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
    >
      View on Map
    </a>
  </div>
  <div class="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
    <span>{lat.toFixed(4)}°N, {lng.toFixed(4)}°E</span>
  </div>
</div>
