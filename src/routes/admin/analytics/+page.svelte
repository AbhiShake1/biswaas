<script lang="ts">
  import { Users, MessageSquare, Star, TrendingUp, BarChart3 } from '@lucide/svelte';

  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-500', change: '+12%' },
    { label: 'New This Month', value: '89', icon: TrendingUp, color: 'text-green-500', change: '+8%' },
    { label: 'Total Reviews', value: '5,678', icon: MessageSquare, color: 'text-purple-500', change: '+15%' },
    { label: 'Avg Rating', value: '3.8', icon: Star, color: 'text-yellow-500', change: '+0.1' },
  ];

  const topCategories = [
    { name: 'Restaurants & Cafes', businesses: 145, reviews: 1890 },
    { name: 'Education Consultancy', businesses: 98, reviews: 1245 },
    { name: 'Hotels & Travel', businesses: 76, reviews: 980 },
    { name: 'Technology', businesses: 62, reviews: 567 },
    { name: 'Healthcare', businesses: 54, reviews: 432 },
  ];

  const topBusinesses = [
    { name: 'Bhat-Bhateni Supermarket', rating: 4.5, reviews: 342 },
    { name: 'Daraz Nepal', rating: 3.9, reviews: 289 },
    { name: 'Foodmandu', rating: 4.2, reviews: 256 },
    { name: 'Nepal Intrepid Treks', rating: 4.7, reviews: 198 },
    { name: 'WorldLink Communications', rating: 3.6, reviews: 187 },
  ];

  const topReviewers = [
    { name: 'Ram B.', reviews: 47, helpful: 312 },
    { name: 'Sita K.', reviews: 38, helpful: 245 },
    { name: 'Hari P.', reviews: 32, helpful: 189 },
    { name: 'Gita S.', reviews: 28, helpful: 156 },
    { name: 'Bikash T.', reviews: 25, helpful: 134 },
  ];
</script>

<svelte:head>
  <title>Analytics — Admin — Biswaas</title>
</svelte:head>

<div>
  <div class="flex items-center gap-3">
    <BarChart3 class="h-6 w-6 text-primary" />
    <div>
      <h1 class="text-2xl font-bold">Analytics</h1>
      <p class="text-sm text-muted-foreground">Platform performance and insights</p>
    </div>
  </div>

  <!-- Stat Cards -->
  <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {#each stats as stat}
      <div class="rounded-lg border p-5">
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">{stat.label}</span>
          <stat.icon class="h-5 w-5 {stat.color}" />
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-3xl font-bold">{stat.value}</span>
          <span class="text-sm font-medium text-green-600">{stat.change}</span>
        </div>
      </div>
    {/each}
  </div>

  <!-- Tables -->
  <div class="mt-8 grid gap-6 lg:grid-cols-2">
    <!-- Top Categories -->
    <div class="rounded-lg border">
      <div class="border-b px-5 py-4">
        <h2 class="font-semibold">Top Categories</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-muted/50">
              <th class="px-5 py-2.5 text-left font-medium">Category</th>
              <th class="px-5 py-2.5 text-right font-medium">Businesses</th>
              <th class="px-5 py-2.5 text-right font-medium">Reviews</th>
            </tr>
          </thead>
          <tbody>
            {#each topCategories as cat}
              <tr class="border-b last:border-0">
                <td class="px-5 py-2.5">{cat.name}</td>
                <td class="px-5 py-2.5 text-right">{cat.businesses}</td>
                <td class="px-5 py-2.5 text-right font-medium">{cat.reviews}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Top Businesses -->
    <div class="rounded-lg border">
      <div class="border-b px-5 py-4">
        <h2 class="font-semibold">Top Businesses</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-muted/50">
              <th class="px-5 py-2.5 text-left font-medium">Business</th>
              <th class="px-5 py-2.5 text-right font-medium">Rating</th>
              <th class="px-5 py-2.5 text-right font-medium">Reviews</th>
            </tr>
          </thead>
          <tbody>
            {#each topBusinesses as biz}
              <tr class="border-b last:border-0">
                <td class="px-5 py-2.5">{biz.name}</td>
                <td class="px-5 py-2.5 text-right">
                  <span class="inline-flex items-center gap-1">
                    <Star class="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {biz.rating}
                  </span>
                </td>
                <td class="px-5 py-2.5 text-right font-medium">{biz.reviews}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Most Active Reviewers -->
  <div class="mt-6 rounded-lg border">
    <div class="border-b px-5 py-4">
      <h2 class="font-semibold">Most Active Reviewers</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="px-5 py-2.5 text-left font-medium">#</th>
            <th class="px-5 py-2.5 text-left font-medium">Reviewer</th>
            <th class="px-5 py-2.5 text-right font-medium">Reviews</th>
            <th class="px-5 py-2.5 text-right font-medium">Helpful Votes</th>
          </tr>
        </thead>
        <tbody>
          {#each topReviewers as reviewer, i}
            <tr class="border-b last:border-0">
              <td class="px-5 py-2.5 text-muted-foreground">{i + 1}</td>
              <td class="px-5 py-2.5 font-medium">{reviewer.name}</td>
              <td class="px-5 py-2.5 text-right">{reviewer.reviews}</td>
              <td class="px-5 py-2.5 text-right">{reviewer.helpful}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
