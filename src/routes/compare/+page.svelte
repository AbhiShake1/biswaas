<script lang="ts">
  import { Star, MapPin, BarChart3, ArrowRight } from '@lucide/svelte';

  interface Business {
    id: string;
    name: string;
    category: string;
    location: string;
    trustScore: number;
    reviewCount: number;
    ratingDistribution: { five: number; four: number; three: number; two: number; one: number };
  }

  const allBusinesses: Business[] = [
    { id: '1', name: 'Nepal Education Gateway', category: 'Education Consultancies', location: 'Kathmandu', trustScore: 4.5, reviewCount: 89, ratingDistribution: { five: 45, four: 25, three: 12, two: 5, one: 2 } },
    { id: '2', name: 'Himalayan Study Abroad', category: 'Education Consultancies', location: 'Lalitpur', trustScore: 4.2, reviewCount: 67, ratingDistribution: { five: 30, four: 20, three: 10, two: 4, one: 3 } },
    { id: '3', name: 'Everest Trek Adventures', category: 'Trekking & Tourism', location: 'Kathmandu', trustScore: 4.8, reviewCount: 156, ratingDistribution: { five: 100, four: 35, three: 12, two: 6, one: 3 } },
    { id: '4', name: 'WorldLink Internet', category: 'ISPs & Telecom', location: 'Nationwide', trustScore: 3.8, reviewCount: 234, ratingDistribution: { five: 60, four: 70, three: 50, two: 34, one: 20 } },
    { id: '5', name: 'Vianet Communications', category: 'ISPs & Telecom', location: 'Kathmandu', trustScore: 3.6, reviewCount: 189, ratingDistribution: { five: 40, four: 55, three: 45, two: 30, one: 19 } },
    { id: '6', name: 'Grande Hospital', category: 'Hospitals & Healthcare', location: 'Kathmandu', trustScore: 4.3, reviewCount: 112, ratingDistribution: { five: 50, four: 35, three: 15, two: 8, one: 4 } },
    { id: '7', name: 'Daraz Nepal', category: 'E-Commerce', location: 'Nationwide', trustScore: 3.5, reviewCount: 312, ratingDistribution: { five: 80, four: 70, three: 62, two: 55, one: 45 } },
    { id: '8', name: 'SastoDeal', category: 'E-Commerce', location: 'Nationwide', trustScore: 3.2, reviewCount: 198, ratingDistribution: { five: 40, four: 45, three: 43, two: 38, one: 32 } },
  ];

  let selected = $state<(string | null)[]>([null, null, null]);

  function selectBusiness(index: number, id: string) {
    selected = selected.map((s, i) => (i === index ? id : s));
  }

  function getSelectedBusinesses(): (Business | undefined)[] {
    return selected.map((id) => (id ? allBusinesses.find((b) => b.id === id) : undefined));
  }

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(count));
  }

  function ratingBar(count: number, total: number) {
    return total > 0 ? (count / total) * 100 : 0;
  }

  let selectedBusinesses = $derived(getSelectedBusinesses());
  let hasAnySelected = $derived(selected.some((s) => s !== null));
</script>

<svelte:head>
  <title>Compare Businesses — Biswaas</title>
  <meta name="description" content="Compare businesses side-by-side on Biswaas. See trust scores, review counts, and rating distributions." />
</svelte:head>

<div class="container mx-auto px-4 py-12">
  <h1 class="text-3xl font-bold">Compare Businesses</h1>
  <p class="mt-2 text-muted-foreground">Select 2-3 businesses to compare side-by-side</p>

  <!-- Selectors -->
  <div class="mt-8 grid gap-4 sm:grid-cols-3">
    {#each [0, 1, 2] as index}
      <div>
        <label for="business-{index}" class="block text-sm font-medium">Business {index + 1}{index === 2 ? ' (optional)' : ''}</label>
        <select
          id="business-{index}"
          onchange={(e) => selectBusiness(index, (e.target as HTMLSelectElement).value)}
          class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select a business...</option>
          {#each allBusinesses as biz}
            <option value={biz.id} selected={selected[index] === biz.id}>{biz.name} ({biz.category})</option>
          {/each}
        </select>
      </div>
    {/each}
  </div>

  <!-- Comparison Table -->
  {#if hasAnySelected}
    <div class="mt-8 overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b">
            <th class="pb-3 text-left font-medium text-muted-foreground w-40">Metric</th>
            {#each selectedBusinesses as biz}
              {#if biz}
                <th class="pb-3 text-left font-semibold">{biz.name}</th>
              {/if}
            {/each}
          </tr>
        </thead>
        <tbody>
          <!-- Trust Score -->
          <tr class="border-b">
            <td class="py-4 font-medium">Trust Score</td>
            {#each selectedBusinesses as biz}
              {#if biz}
                <td class="py-4">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl font-bold">{biz.trustScore}</span>
                    <div class="flex gap-0.5">
                      {#each starArray(biz.trustScore) as filled}
                        <Star class="h-3.5 w-3.5 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
                      {/each}
                    </div>
                  </div>
                </td>
              {/if}
            {/each}
          </tr>

          <!-- Review Count -->
          <tr class="border-b">
            <td class="py-4 font-medium">Reviews</td>
            {#each selectedBusinesses as biz}
              {#if biz}
                <td class="py-4 text-lg font-semibold">{biz.reviewCount}</td>
              {/if}
            {/each}
          </tr>

          <!-- Category -->
          <tr class="border-b">
            <td class="py-4 font-medium">Category</td>
            {#each selectedBusinesses as biz}
              {#if biz}
                <td class="py-4"><span class="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{biz.category}</span></td>
              {/if}
            {/each}
          </tr>

          <!-- Location -->
          <tr class="border-b">
            <td class="py-4 font-medium">Location</td>
            {#each selectedBusinesses as biz}
              {#if biz}
                <td class="py-4">
                  <span class="flex items-center gap-1"><MapPin class="h-3.5 w-3.5 text-muted-foreground" />{biz.location}</span>
                </td>
              {/if}
            {/each}
          </tr>

          <!-- Rating Distribution -->
          <tr>
            <td class="py-4 font-medium align-top">Ratings</td>
            {#each selectedBusinesses as biz}
              {#if biz}
                {@const total = Object.values(biz.ratingDistribution).reduce((a, b) => a + b, 0)}
                <td class="py-4">
                  <div class="space-y-1.5">
                    {#each [['5', biz.ratingDistribution.five], ['4', biz.ratingDistribution.four], ['3', biz.ratingDistribution.three], ['2', biz.ratingDistribution.two], ['1', biz.ratingDistribution.one]] as [label, count]}
                      <div class="flex items-center gap-2 text-xs">
                        <span class="w-3 text-right">{label}</span>
                        <Star class="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <div class="h-2 w-24 overflow-hidden rounded-full bg-muted">
                          <div class="h-full rounded-full bg-yellow-400" style="width: {ratingBar(Number(count), total)}%"></div>
                        </div>
                        <span class="text-muted-foreground w-6">{count}</span>
                      </div>
                    {/each}
                  </div>
                </td>
              {/if}
            {/each}
          </tr>
        </tbody>
      </table>
    </div>
  {:else}
    <div class="mt-12 text-center">
      <BarChart3 class="mx-auto h-12 w-12 text-muted-foreground/50" />
      <p class="mt-4 text-muted-foreground">Select businesses above to compare them side-by-side</p>
    </div>
  {/if}
</div>
