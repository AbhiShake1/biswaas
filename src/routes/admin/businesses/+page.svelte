<script lang="ts">
  import { CheckCircle, XCircle, Star } from '@lucide/svelte';

  const businesses = [
    { id: '1', name: 'AECC Global Nepal', slug: 'aecc-global-nepal', category: 'Education Consultancies', status: 'active', trustScore: 4.2, totalReviews: 87 },
    { id: '2', name: 'Daraz Nepal', slug: 'daraz-nepal', category: 'E-Commerce', status: 'active', trustScore: 2.1, totalReviews: 1543 },
    { id: '3', name: 'WorldLink Communications', slug: 'worldlink', category: 'ISPs & Telecom', status: 'active', trustScore: 3.1, totalReviews: 892 },
    { id: '4', name: 'Nepal Intrepid Treks', slug: 'nepal-intrepid-treks', category: 'Trekking & Tourism', status: 'pending', trustScore: 4.6, totalReviews: 312 },
    { id: '5', name: 'Norvic International Hospital', slug: 'norvic-hospital', category: 'Hospitals & Healthcare', status: 'active', trustScore: 4.0, totalReviews: 345 },
    { id: '6', name: 'Hamro Pathshala', slug: 'hamro-pathshala', category: 'Education Consultancies', status: 'suspended', trustScore: 1.8, totalReviews: 45 },
    { id: '7', name: 'Foodmandu', slug: 'foodmandu', category: 'E-Commerce', status: 'active', trustScore: 3.8, totalReviews: 567 },
    { id: '8', name: 'Nepal Telecom', slug: 'nepal-telecom', category: 'ISPs & Telecom', status: 'active', trustScore: 2.8, totalReviews: 1204 },
  ];

  function statusBadge(status: string) {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-muted text-muted-foreground';
    }
  }
</script>

<svelte:head>
  <title>Businesses — Admin — Biswaas</title>
</svelte:head>

<div>
  <nav class="mb-4 text-sm text-muted-foreground">
    <a href="/admin" class="hover:text-foreground">Admin</a>
    <span class="mx-1">/</span>
    <span class="text-foreground">Businesses</span>
  </nav>

  <h1 class="text-2xl font-bold">Businesses</h1>
  <p class="mt-1 text-sm text-muted-foreground">Manage all registered businesses on the platform</p>

  <div class="mt-6 overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b text-left">
          <th class="pb-3 font-medium text-muted-foreground">Business</th>
          <th class="pb-3 font-medium text-muted-foreground">Category</th>
          <th class="pb-3 font-medium text-muted-foreground">Status</th>
          <th class="pb-3 font-medium text-muted-foreground">Trust Score</th>
          <th class="pb-3 font-medium text-muted-foreground">Reviews</th>
          <th class="pb-3 font-medium text-muted-foreground">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each businesses as biz}
          <tr class="border-b">
            <td class="py-3">
              <a href="/review/{biz.slug}" class="font-medium hover:text-primary">{biz.name}</a>
            </td>
            <td class="py-3 text-muted-foreground">{biz.category}</td>
            <td class="py-3">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium {statusBadge(biz.status)}">{biz.status}</span>
            </td>
            <td class="py-3">
              <span class="flex items-center gap-1">
                <Star class="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {biz.trustScore}
              </span>
            </td>
            <td class="py-3 text-muted-foreground">{biz.totalReviews}</td>
            <td class="py-3">
              <div class="flex items-center gap-2">
                {#if biz.status !== 'active'}
                  <button class="flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100">
                    <CheckCircle class="h-3 w-3" /> Approve
                  </button>
                {/if}
                {#if biz.status !== 'suspended'}
                  <button class="flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100">
                    <XCircle class="h-3 w-3" /> Suspend
                  </button>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
