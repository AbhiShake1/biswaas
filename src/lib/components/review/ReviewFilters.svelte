<script lang="ts">
  import { Star, Search, Filter, X } from '@lucide/svelte';

  type DateRange = 'week' | 'month' | 'year' | 'all';

  let {
    onfilter = () => {},
  }: {
    onfilter?: (filters: {
      rating: number | null;
      dateRange: DateRange;
      verifiedOnly: boolean;
      keyword: string;
      withReplies: boolean;
    }) => void;
  } = $props();

  let selectedRating = $state<number | null>(null);
  let dateRange = $state<DateRange>('all');
  let verifiedOnly = $state(false);
  let keyword = $state('');
  let withReplies = $state(false);

  const dateRangeOptions: { value: DateRange; label: string }[] = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ];

  function applyFilters() {
    onfilter({
      rating: selectedRating,
      dateRange,
      verifiedOnly,
      keyword,
      withReplies,
    });
  }

  function clearFilters() {
    selectedRating = null;
    dateRange = 'all';
    verifiedOnly = false;
    keyword = '';
    withReplies = false;
    applyFilters();
  }

  const hasActiveFilters = $derived(
    selectedRating !== null || dateRange !== 'all' || verifiedOnly || keyword !== '' || withReplies
  );

  function selectRating(star: number) {
    selectedRating = selectedRating === star ? null : star;
    applyFilters();
  }
</script>

<div class="rounded-lg border p-4">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2 text-sm font-medium">
      <Filter class="h-4 w-4" /> Filter Reviews
    </div>
    {#if hasActiveFilters}
      <button
        onclick={clearFilters}
        class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <X class="h-3 w-3" /> Clear all
      </button>
    {/if}
  </div>

  <div class="mt-4 flex flex-wrap items-center gap-4">
    <!-- Star Rating Filter -->
    <div class="space-y-1.5">
      <p class="text-xs font-medium text-muted-foreground">Rating</p>
      <div class="flex items-center gap-1">
        {#each [1, 2, 3, 4, 5] as star}
          <button
            onclick={() => selectRating(star)}
            class="flex items-center gap-0.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors {selectedRating === star
              ? 'border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'hover:bg-muted'}"
          >
            <Star class="h-3 w-3 {selectedRating === star ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}" />
            {star}
          </button>
        {/each}
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="space-y-1.5">
      <p class="text-xs font-medium text-muted-foreground">Date Range</p>
      <div class="flex items-center gap-1">
        {#each dateRangeOptions as option}
          <button
            onclick={() => { dateRange = option.value; applyFilters(); }}
            class="rounded-md border px-2 py-1 text-xs font-medium transition-colors {dateRange === option.value
              ? 'border-primary bg-primary text-primary-foreground'
              : 'hover:bg-muted'}"
          >
            {option.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- Verified Only Toggle -->
    <div class="space-y-1.5">
      <p class="text-xs font-medium text-muted-foreground">Verified</p>
      <button
        onclick={() => { verifiedOnly = !verifiedOnly; applyFilters(); }}
        class="rounded-md border px-3 py-1 text-xs font-medium transition-colors {verifiedOnly
          ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'hover:bg-muted'}"
      >
        Verified Only
      </button>
    </div>

    <!-- With Replies Toggle -->
    <div class="space-y-1.5">
      <p class="text-xs font-medium text-muted-foreground">Replies</p>
      <button
        onclick={() => { withReplies = !withReplies; applyFilters(); }}
        class="rounded-md border px-3 py-1 text-xs font-medium transition-colors {withReplies
          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          : 'hover:bg-muted'}"
      >
        With Replies
      </button>
    </div>

    <!-- Keyword Search -->
    <div class="space-y-1.5">
      <p class="text-xs font-medium text-muted-foreground">Search</p>
      <div class="relative">
        <Search class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          bind:value={keyword}
          oninput={applyFilters}
          placeholder="Search keywords..."
          class="w-48 rounded-md border py-1 pl-8 pr-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  </div>
</div>
