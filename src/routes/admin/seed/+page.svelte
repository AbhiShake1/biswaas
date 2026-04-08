<script lang="ts">
  let seeding = $state(false);
  let result = $state<{ categories: number; businesses: number } | null>(null);

  async function handleSeed() {
    seeding = true;
    // Mock seed result
    await new Promise((r) => setTimeout(r, 2000));
    result = { categories: 5, businesses: 42 };
    seeding = false;
  }
</script>

<svelte:head>
  <title>Seed Data — Admin — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold">Seed Database</h1>
  <p class="mt-2 text-muted-foreground">Import initial business data and Google reviews</p>

  <div class="mt-8 max-w-md rounded-lg border p-6">
    <h2 class="font-semibold">Nepal Business Data</h2>
    <p class="mt-1 text-sm text-muted-foreground">Seeds 5 categories with 42+ businesses across Nepal</p>

    <div class="mt-4 space-y-2 text-sm">
      <div class="flex justify-between"><span>Education Consultancies</span><span class="text-muted-foreground">10 businesses</span></div>
      <div class="flex justify-between"><span>E-Commerce</span><span class="text-muted-foreground">8 businesses</span></div>
      <div class="flex justify-between"><span>Trekking & Tourism</span><span class="text-muted-foreground">8 businesses</span></div>
      <div class="flex justify-between"><span>ISPs & Telecom</span><span class="text-muted-foreground">8 businesses</span></div>
      <div class="flex justify-between"><span>Hospitals & Healthcare</span><span class="text-muted-foreground">8 businesses</span></div>
    </div>

    <button
      onclick={handleSeed}
      disabled={seeding}
      class="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
    >
      {#if seeding}
        Seeding...
      {:else if result}
        Seeded {result.categories} categories, {result.businesses} businesses
      {:else}
        Seed Database
      {/if}
    </button>
  </div>
</div>
