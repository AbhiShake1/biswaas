<script lang="ts">
  import { Search, Star, Shield, ArrowRight } from '@lucide/svelte';

  const categories = [
    { name: 'Education Consultancies', slug: 'education-consultancies', count: 100, description: 'Study abroad, language schools, test prep' },
    { name: 'E-Commerce', slug: 'ecommerce', count: 80, description: 'Online marketplaces, food delivery, shopping' },
    { name: 'Trekking & Tourism', slug: 'trekking-tourism', count: 100, description: 'Trekking agencies, travel, hotels, adventure' },
    { name: 'ISPs & Telecom', slug: 'isp-telecom', count: 70, description: 'Broadband, mobile operators, digital TV' },
    { name: 'Hospitals & Healthcare', slug: 'hospitals-healthcare', count: 100, description: 'Hospitals, clinics, diagnostics, pharmacies' },
  ];
</script>

<svelte:head>
  <title>Biswaas — Nepal's Trust & Review Platform</title>
  <meta name="description" content="Read and write reviews for businesses in Nepal. Find trusted education consultancies, e-commerce platforms, trekking agencies, ISPs, and hospitals." />
</svelte:head>

<section class="border-b bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
  <div class="container mx-auto px-4 text-center">
    <h1 class="text-4xl font-bold tracking-tight md:text-5xl">
      विश्वास <span class="text-primary">Biswaas</span>
    </h1>
    <p class="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
      Nepal's trusted review platform. Find honest reviews for businesses across Nepal — from education consultancies to hospitals.
    </p>

    <form action="/search" method="GET" class="mx-auto mt-8 max-w-lg">
      <div class="relative">
        <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          name="q"
          placeholder="Search for a business, category, or service..."
          class="w-full rounded-full border bg-background py-3 pl-12 pr-4 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </form>

    <div class="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
      <span class="flex items-center gap-1"><Star class="h-4 w-4 text-yellow-500" /> 450+ Businesses</span>
      <span class="flex items-center gap-1"><Shield class="h-4 w-4 text-green-500" /> Verified Reviews</span>
    </div>
  </div>
</section>

<section class="py-12">
  <div class="container mx-auto px-4">
    <h2 class="mb-8 text-2xl font-bold">Browse Categories</h2>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each categories as cat}
        <a
          href="/categories/{cat.slug}"
          class="group rounded-lg border p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
        >
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-semibold group-hover:text-primary">{cat.name}</h3>
              <p class="mt-1 text-sm text-muted-foreground">{cat.description}</p>
            </div>
            <ArrowRight class="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </div>
          <p class="mt-3 text-xs text-muted-foreground">{cat.count} businesses</p>
        </a>
      {/each}
    </div>
  </div>
</section>

<section class="border-t bg-muted/30 py-12">
  <div class="container mx-auto px-4 text-center">
    <h2 class="text-2xl font-bold">Own a Business in Nepal?</h2>
    <p class="mt-2 text-muted-foreground">Claim your profile, respond to reviews, and build trust with customers.</p>
    <a href="/auth/login" class="mt-4 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
      Claim Your Business
    </a>
  </div>
</section>
