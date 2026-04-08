<script lang="ts">
  import { ArrowRight } from '@lucide/svelte';

  const categories = [
    { name: 'Education Consultancies', slug: 'education-consultancies', count: 100, description: 'Study abroad, language schools, test prep, vocational training' },
    { name: 'E-Commerce', slug: 'ecommerce', count: 80, description: 'Online marketplaces, food delivery, health & beauty, electronics' },
    { name: 'Trekking & Tourism', slug: 'trekking-tourism', count: 100, description: 'Trekking agencies, travel, hotels, rafting & adventure' },
    { name: 'ISPs & Telecom', slug: 'isp-telecom', count: 70, description: 'Broadband ISPs, mobile operators, digital TV, satellite' },
    { name: 'Hospitals & Healthcare', slug: 'hospitals-healthcare', count: 100, description: 'Hospitals, clinics, diagnostic centers, pharmacies' },
  ];
</script>

<svelte:head>
  <title>Categories — Biswaas</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold">All Categories</h1>
  <p class="mt-2 text-muted-foreground">Browse businesses by category across Nepal</p>

  <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each categories as cat}
      <a href="/categories/{cat.slug}" class="group rounded-lg border p-6 transition-all hover:border-primary/50 hover:shadow-md">
        <h2 class="text-lg font-semibold group-hover:text-primary">{cat.name}</h2>
        <p class="mt-2 text-sm text-muted-foreground">{cat.description}</p>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-sm text-muted-foreground">{cat.count} businesses</span>
          <ArrowRight class="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </a>
    {/each}
  </div>
</div>
