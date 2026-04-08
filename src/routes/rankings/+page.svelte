<script lang="ts">
  import { Star, Trophy, Medal } from '@lucide/svelte';

  type Business = {
    name: string;
    slug: string;
    trustScore: number;
    totalReviews: number;
  };

  type CategoryRanking = {
    category: string;
    slug: string;
    businesses: Business[];
  };

  const rankings: CategoryRanking[] = [
    {
      category: 'Education Consultancies',
      slug: 'education-consultancies',
      businesses: [
        { name: 'IDP Nepal', slug: 'idp-nepal', trustScore: 4.5, totalReviews: 203 },
        { name: 'AECC Global Nepal', slug: 'aecc-global-nepal', trustScore: 4.2, totalReviews: 87 },
        { name: 'Kathmandu Infosys', slug: 'kathmandu-infosys', trustScore: 4.1, totalReviews: 145 },
        { name: 'Global Reach Nepal', slug: 'global-reach-nepal', trustScore: 3.9, totalReviews: 98 },
        { name: 'Alfa Beta Institute', slug: 'alfa-beta-institute', trustScore: 3.7, totalReviews: 64 },
      ],
    },
    {
      category: 'E-Commerce',
      slug: 'ecommerce',
      businesses: [
        { name: 'Foodmandu', slug: 'foodmandu', trustScore: 3.8, totalReviews: 567 },
        { name: 'Hamro Bazar', slug: 'hamro-bazar', trustScore: 3.5, totalReviews: 312 },
        { name: 'SastoDeal', slug: 'sasto-deal', trustScore: 3.2, totalReviews: 890 },
        { name: 'Gyapu Marketplace', slug: 'gyapu-marketplace', trustScore: 2.9, totalReviews: 445 },
        { name: 'Daraz Nepal', slug: 'daraz-nepal', trustScore: 2.1, totalReviews: 1543 },
      ],
    },
    {
      category: 'Trekking & Tourism',
      slug: 'trekking-tourism',
      businesses: [
        { name: 'Nepal Intrepid Treks', slug: 'nepal-intrepid-treks', trustScore: 4.6, totalReviews: 312 },
        { name: 'Adventure Great Himalaya', slug: 'adventure-great-himalaya', trustScore: 4.4, totalReviews: 198 },
        { name: 'Himalayan Glacier', slug: 'himalayan-glacier', trustScore: 4.3, totalReviews: 256 },
        { name: 'Nepal Hiking Team', slug: 'nepal-hiking-team', trustScore: 4.1, totalReviews: 178 },
        { name: 'Ace the Himalaya', slug: 'ace-the-himalaya', trustScore: 4.0, totalReviews: 223 },
      ],
    },
    {
      category: 'ISPs & Telecom',
      slug: 'isp-telecom',
      businesses: [
        { name: 'Vianet Communications', slug: 'vianet', trustScore: 3.6, totalReviews: 678 },
        { name: 'WorldLink Communications', slug: 'worldlink', trustScore: 3.1, totalReviews: 892 },
        { name: 'Subisu Cablenet', slug: 'subisu', trustScore: 3.0, totalReviews: 534 },
        { name: 'Nepal Telecom', slug: 'nepal-telecom', trustScore: 2.8, totalReviews: 1204 },
        { name: 'Ncell', slug: 'ncell', trustScore: 2.6, totalReviews: 1567 },
      ],
    },
    {
      category: 'Hospitals & Healthcare',
      slug: 'hospitals-healthcare',
      businesses: [
        { name: 'Grande International Hospital', slug: 'grande-hospital', trustScore: 4.3, totalReviews: 412 },
        { name: 'Norvic International Hospital', slug: 'norvic-hospital', trustScore: 4.0, totalReviews: 345 },
        { name: 'Nepal Mediciti Hospital', slug: 'nepal-mediciti', trustScore: 3.8, totalReviews: 289 },
        { name: 'B&B Hospital', slug: 'bb-hospital', trustScore: 3.6, totalReviews: 367 },
        { name: 'Star Hospital', slug: 'star-hospital', trustScore: 3.4, totalReviews: 198 },
      ],
    },
  ];

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(count));
  }

  function getRankIcon(index: number) {
    return index;
  }
</script>

<svelte:head>
  <title>Best-in-Category Rankings — Biswaas</title>
  <meta name="description" content="Top-rated businesses in Nepal across all categories. See who ranks #1 in education, e-commerce, trekking, telecom, and healthcare." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold">Best-in-Category Rankings</h1>
    <p class="mt-2 text-muted-foreground">Top 5 businesses per category, sorted by trust score</p>
  </div>

  <div class="space-y-10">
    {#each rankings as category}
      <section>
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold">{category.category}</h2>
          <a href="/categories/{category.slug}" class="text-sm text-primary hover:underline">
            View all
          </a>
        </div>

        <div class="overflow-hidden rounded-lg border">
          {#each category.businesses as biz, i}
            <a
              href="/review/{biz.slug}"
              class="flex items-center gap-4 border-b p-4 last:border-b-0 transition-colors hover:bg-muted/50"
            >
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full {i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-muted text-muted-foreground'} text-sm font-bold">
                {#if i === 0}
                  <Trophy class="h-4 w-4" />
                {:else if i <= 2}
                  <Medal class="h-4 w-4" />
                {:else}
                  {i + 1}
                {/if}
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="font-medium truncate">{biz.name}</h3>
                <span class="text-xs text-muted-foreground">{biz.totalReviews} reviews</span>
              </div>

              <div class="flex items-center gap-1.5">
                <div class="flex items-center gap-0.5">
                  {#each starArray(biz.trustScore) as filled}
                    <Star class="h-3.5 w-3.5 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
                  {/each}
                </div>
                <span class="text-sm font-semibold">{biz.trustScore}</span>
              </div>
            </a>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</div>
