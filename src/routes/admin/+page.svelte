<script lang="ts">
  import { Building2, MessageSquare, ShieldCheck, Flag } from '@lucide/svelte';

  const stats = [
    { label: 'Total Businesses', value: 450, icon: Building2, color: 'text-blue-500' },
    { label: 'Total Reviews', value: '8,234', icon: MessageSquare, color: 'text-green-500' },
    { label: 'Pending Claims', value: 12, icon: ShieldCheck, color: 'text-yellow-500' },
    { label: 'Flagged Reviews', value: 7, icon: Flag, color: 'text-red-500' },
  ];
</script>

<svelte:head>
  <title>Admin Dashboard — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold">Admin Dashboard</h1>
  <p class="mt-1 text-sm text-muted-foreground">Overview of platform activity</p>

  <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {#each stats as stat}
      <div class="rounded-lg border p-5">
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">{stat.label}</span>
          <stat.icon class="h-5 w-5 {stat.color}" />
        </div>
        <div class="mt-3 text-3xl font-bold">{stat.value}</div>
      </div>
    {/each}
  </div>

  <div class="mt-8 grid gap-6 lg:grid-cols-2">
    <div class="rounded-lg border p-5">
      <h2 class="font-semibold">Recent Activity</h2>
      <div class="mt-4 space-y-3">
        {#each [
          { text: 'New claim request for "Nepal Intrepid Treks"', time: '2 hours ago' },
          { text: 'Review flagged on "Daraz Nepal"', time: '5 hours ago' },
          { text: 'Business "Foodmandu" approved', time: '1 day ago' },
          { text: 'New business registered: "Hamro Pathshala"', time: '2 days ago' },
          { text: 'Claim approved for "WorldLink Communications"', time: '3 days ago' },
        ] as activity}
          <div class="flex items-start justify-between text-sm">
            <span>{activity.text}</span>
            <span class="shrink-0 text-xs text-muted-foreground">{activity.time}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="rounded-lg border p-5">
      <h2 class="font-semibold">Quick Links</h2>
      <div class="mt-4 space-y-2">
        <a href="/admin/claims" class="block rounded-md border px-4 py-3 text-sm hover:bg-muted">
          <span class="font-medium">Pending Claims</span>
          <span class="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">12</span>
        </a>
        <a href="/admin/reviews" class="block rounded-md border px-4 py-3 text-sm hover:bg-muted">
          <span class="font-medium">Flagged Reviews</span>
          <span class="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">7</span>
        </a>
        <a href="/admin/businesses" class="block rounded-md border px-4 py-3 text-sm hover:bg-muted">
          <span class="font-medium">Manage Businesses</span>
        </a>
      </div>
    </div>
  </div>
</div>
