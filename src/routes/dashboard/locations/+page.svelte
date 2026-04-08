<script lang="ts">
  import { MapPin, Plus, Star, MessageSquare, TrendingUp, MoreVertical } from '@lucide/svelte';

  interface Location {
    id: string;
    name: string;
    address: string;
    district: string;
    trustScore: number;
    reviewCount: number;
    status: 'active' | 'pending';
  }

  let locations = $state<Location[]>([
    {
      id: '1',
      name: 'Kathmandu Main',
      address: 'Putalisadak, Kathmandu',
      district: 'Kathmandu',
      trustScore: 4.5,
      reviewCount: 128,
      status: 'active',
    },
    {
      id: '2',
      name: 'Pokhara Branch',
      address: 'Lakeside, Pokhara',
      district: 'Kaski',
      trustScore: 4.2,
      reviewCount: 64,
      status: 'active',
    },
    {
      id: '3',
      name: 'Biratnagar Branch',
      address: 'Main Road, Biratnagar',
      district: 'Morang',
      trustScore: 3.9,
      reviewCount: 31,
      status: 'pending',
    },
  ]);

  let showAddModal = $state(false);
  let newName = $state('');
  let newAddress = $state('');
  let newDistrict = $state('');

  function addLocation() {
    if (!newName.trim() || !newAddress.trim()) return;
    locations = [
      ...locations,
      {
        id: String(Date.now()),
        name: newName,
        address: newAddress,
        district: newDistrict || 'Unknown',
        trustScore: 0,
        reviewCount: 0,
        status: 'pending',
      },
    ];
    newName = '';
    newAddress = '';
    newDistrict = '';
    showAddModal = false;
  }

  function scoreColor(score: number): string {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-emerald-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-orange-600';
  }
</script>

<svelte:head>
  <title>Locations — Dashboard — Biswaas</title>
</svelte:head>

<div>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold">Locations</h1>
      <p class="mt-1 text-sm text-muted-foreground">Manage your business branches across Nepal</p>
    </div>
    <button
      onclick={() => (showAddModal = true)}
      class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      <Plus class="h-4 w-4" /> Add Location
    </button>
  </div>

  <!-- Summary Stats -->
  <div class="mt-6 grid gap-4 sm:grid-cols-3">
    <div class="rounded-lg border p-4">
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin class="h-4 w-4" />
        Total Locations
      </div>
      <p class="mt-1 text-2xl font-bold">{locations.length}</p>
    </div>
    <div class="rounded-lg border p-4">
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <Star class="h-4 w-4" />
        Avg Trust Score
      </div>
      <p class="mt-1 text-2xl font-bold">
        {locations.length > 0
          ? (locations.reduce((s, l) => s + l.trustScore, 0) / locations.length).toFixed(1)
          : '—'}
      </p>
    </div>
    <div class="rounded-lg border p-4">
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <MessageSquare class="h-4 w-4" />
        Total Reviews
      </div>
      <p class="mt-1 text-2xl font-bold">{locations.reduce((s, l) => s + l.reviewCount, 0)}</p>
    </div>
  </div>

  <!-- Location Cards -->
  <div class="mt-6 space-y-4">
    {#each locations as location}
      <div class="rounded-lg border p-5 transition-colors hover:bg-muted/30">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MapPin class="h-5 w-5 text-primary" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-semibold">{location.name}</h2>
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-medium {location.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'}"
                >
                  {location.status === 'active' ? 'Active' : 'Pending'}
                </span>
              </div>
              <p class="mt-0.5 text-sm text-muted-foreground">{location.address}</p>
              <p class="text-xs text-muted-foreground">District: {location.district}</p>
            </div>
          </div>
          <button class="rounded p-1 hover:bg-muted">
            <MoreVertical class="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div class="mt-4 flex items-center gap-6 text-sm">
          <div class="flex items-center gap-1.5">
            <TrendingUp class="h-4 w-4 {scoreColor(location.trustScore)}" />
            <span class="font-semibold {scoreColor(location.trustScore)}">{location.trustScore.toFixed(1)}</span>
            <span class="text-muted-foreground">Trust Score</span>
          </div>
          <div class="flex items-center gap-1.5">
            <MessageSquare class="h-4 w-4 text-muted-foreground" />
            <span class="font-semibold">{location.reviewCount}</span>
            <span class="text-muted-foreground">Reviews</span>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Add Location Modal -->
  {#if showAddModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog">
      <div class="mx-4 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 class="text-lg font-semibold">Add New Location</h2>
        <p class="mt-1 text-sm text-muted-foreground">Add a new branch for your business</p>

        <form
          onsubmit={(e) => {
            e.preventDefault();
            addLocation();
          }}
          class="mt-4 space-y-4"
        >
          <div>
            <label for="loc-name" class="block text-sm font-medium">Branch Name</label>
            <input
              id="loc-name"
              type="text"
              bind:value={newName}
              required
              placeholder="e.g. Lalitpur Branch"
              class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label for="loc-address" class="block text-sm font-medium">Address</label>
            <input
              id="loc-address"
              type="text"
              bind:value={newAddress}
              required
              placeholder="e.g. Kupondole, Lalitpur"
              class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label for="loc-district" class="block text-sm font-medium">District</label>
            <input
              id="loc-district"
              type="text"
              bind:value={newDistrict}
              placeholder="e.g. Lalitpur"
              class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              onclick={() => (showAddModal = false)}
              class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Add Location
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>
