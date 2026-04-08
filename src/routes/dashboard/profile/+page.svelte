<script lang="ts">
  import { Save } from '@lucide/svelte';

  let name = $state('AECC Global Nepal');
  let description = $state('Leading study abroad consultancy for Australia, UK, Canada');
  let phone = $state('+977-1-4XXXXXX');
  let website = $state('https://example.com');
  let address = $state('Putalisadak, Kathmandu');
  let province = $state('Bagmati');
  let district = $state('Kathmandu');
  let saved = $state(false);

  const provinces = ['Province 1', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'];
  const districts: Record<string, string[]> = {
    'Bagmati': ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kavrepalanchok', 'Sindhupalchok'],
    'Gandaki': ['Kaski', 'Lamjung', 'Tanahun', 'Gorkha'],
    'Province 1': ['Jhapa', 'Morang', 'Sunsari', 'Ilam'],
    'Madhesh': ['Parsa', 'Bara', 'Rautahat', 'Sarlahi'],
    'Lumbini': ['Rupandehi', 'Kapilvastu', 'Palpa', 'Gulmi'],
    'Karnali': ['Surkhet', 'Dailekh', 'Jajarkot', 'Jumla'],
    'Sudurpashchim': ['Kailali', 'Kanchanpur', 'Dadeldhura', 'Baitadi'],
  };

  let availableDistricts = $derived(districts[province] ?? []);

  function handleSubmit(e: Event) {
    e.preventDefault();
    saved = true;
    setTimeout(() => (saved = false), 3000);
  }
</script>

<svelte:head>
  <title>Edit Profile — Dashboard — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold">Edit Profile</h1>
  <p class="mt-1 text-sm text-muted-foreground">Update your business information</p>

  <form onsubmit={handleSubmit} class="mt-6 max-w-xl space-y-5">
    <div>
      <label for="name" class="block text-sm font-medium">Business Name</label>
      <input
        id="name"
        type="text"
        bind:value={name}
        required
        class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium">Description</label>
      <textarea
        id="description"
        bind:value={description}
        rows="3"
        class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      ></textarea>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label for="phone" class="block text-sm font-medium">Phone</label>
        <input
          id="phone"
          type="tel"
          bind:value={phone}
          class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div>
        <label for="website" class="block text-sm font-medium">Website</label>
        <input
          id="website"
          type="url"
          bind:value={website}
          class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>

    <div>
      <label for="address" class="block text-sm font-medium">Address</label>
      <input
        id="address"
        type="text"
        bind:value={address}
        class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label for="province" class="block text-sm font-medium">Province</label>
        <select
          id="province"
          bind:value={province}
          class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {#each provinces as p}
            <option value={p}>{p}</option>
          {/each}
        </select>
      </div>
      <div>
        <label for="district" class="block text-sm font-medium">District</label>
        <select
          id="district"
          bind:value={district}
          class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {#each availableDistricts as d}
            <option value={d}>{d}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button
        type="submit"
        class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Save class="h-4 w-4" /> Save Changes
      </button>
      {#if saved}
        <span class="text-sm text-green-600">Profile saved successfully!</span>
      {/if}
    </div>
  </form>
</div>
