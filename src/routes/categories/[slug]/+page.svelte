<script lang="ts">
  import { page } from '$app/stores';
  import { Star } from '@lucide/svelte';

  // Static data for now (will be replaced with Convex queries once connected)
  const categoryMap: Record<string, { name: string; description: string; businesses: Array<{ name: string; slug: string; trustScore: number; starRating: number; totalReviews: number; description: string }> }> = {
    'education-consultancies': {
      name: 'Education Consultancies',
      description: 'Study abroad consultancies, language schools, test prep centers',
      businesses: [
        { name: 'AECC Global Nepal', slug: 'aecc-global-nepal', trustScore: 4.2, starRating: 4, totalReviews: 87, description: 'Leading study abroad consultancy for Australia, UK, Canada' },
        { name: 'KIEC', slug: 'kiec', trustScore: 3.8, starRating: 4, totalReviews: 124, description: 'Kathmandu Infosys Educational Consultancy - Japan, Korea specialist' },
        { name: 'IDP Nepal', slug: 'idp-nepal', trustScore: 4.5, starRating: 5, totalReviews: 203, description: 'Official IELTS test center and study abroad services' },
        { name: 'Edwise Foundation', slug: 'edwise-foundation', trustScore: 3.5, starRating: 4, totalReviews: 56, description: 'US, UK, Australia university admissions' },
        { name: 'Global Reach Nepal', slug: 'global-reach-nepal', trustScore: 4.0, starRating: 4, totalReviews: 92, description: 'Comprehensive overseas education consultancy' },
      ],
    },
    'ecommerce': {
      name: 'E-Commerce & Online Shopping',
      description: 'Online marketplaces, food delivery, health & beauty platforms',
      businesses: [
        { name: 'Daraz Nepal', slug: 'daraz-nepal', trustScore: 2.1, starRating: 2, totalReviews: 1543, description: 'Largest online marketplace in Nepal' },
        { name: 'SastoDeal', slug: 'sastodeal', trustScore: 3.2, starRating: 3, totalReviews: 342, description: 'Electronics and gadgets online store' },
        { name: 'Foodmandu', slug: 'foodmandu', trustScore: 3.8, starRating: 4, totalReviews: 567, description: 'Food delivery service in Kathmandu valley' },
        { name: 'HamroBazar', slug: 'hamrobazar', trustScore: 3.0, starRating: 3, totalReviews: 89, description: 'Buy and sell marketplace' },
        { name: 'Jeevee', slug: 'jeevee', trustScore: 4.1, starRating: 4, totalReviews: 178, description: 'Health, beauty and wellness online store' },
      ],
    },
    'trekking-tourism': {
      name: 'Trekking & Tourism',
      description: 'Trekking agencies, travel companies, hotels, adventure sports',
      businesses: [
        { name: 'Nepal Intrepid Treks', slug: 'nepal-intrepid-treks', trustScore: 4.6, starRating: 5, totalReviews: 312, description: 'Premium trekking and expedition company' },
        { name: 'Himalayan Temple Tours', slug: 'himalayan-temple-tours', trustScore: 4.3, starRating: 4, totalReviews: 189, description: 'Cultural tours and trekking in Nepal' },
        { name: 'Real Sherpa Adventures', slug: 'real-sherpa-adventures', trustScore: 4.7, starRating: 5, totalReviews: 245, description: 'Authentic Sherpa-led trekking experiences' },
        { name: 'Adventure Vision Treks', slug: 'adventure-vision-treks', trustScore: 3.9, starRating: 4, totalReviews: 134, description: 'Budget-friendly trekking packages' },
        { name: 'Everest Holiday', slug: 'everest-holiday', trustScore: 4.1, starRating: 4, totalReviews: 98, description: 'Everest region specialist tours' },
      ],
    },
    'isp-telecom': {
      name: 'ISPs & Telecom',
      description: 'Internet service providers, mobile operators, digital TV',
      businesses: [
        { name: 'WorldLink Communications', slug: 'worldlink', trustScore: 3.1, starRating: 3, totalReviews: 892, description: 'Largest ISP in Nepal with fiber internet' },
        { name: 'Vianet Communications', slug: 'vianet', trustScore: 3.4, starRating: 3, totalReviews: 456, description: 'Fiber and wireless internet provider' },
        { name: 'Nepal Telecom', slug: 'nepal-telecom', trustScore: 2.8, starRating: 3, totalReviews: 1204, description: 'State-owned telecom operator' },
        { name: 'Ncell', slug: 'ncell', trustScore: 3.0, starRating: 3, totalReviews: 987, description: 'Private mobile operator' },
        { name: 'Classic Tech', slug: 'classic-tech', trustScore: 3.6, starRating: 4, totalReviews: 234, description: 'FTTH internet and digital TV' },
      ],
    },
    'hospitals-healthcare': {
      name: 'Hospitals & Healthcare',
      description: 'Hospitals, clinics, diagnostic centers, pharmacies',
      businesses: [
        { name: 'Norvic International Hospital', slug: 'norvic-hospital', trustScore: 4.0, starRating: 4, totalReviews: 345, description: 'Multi-specialty international hospital' },
        { name: 'Grande International Hospital', slug: 'grande-hospital', trustScore: 4.2, starRating: 4, totalReviews: 278, description: 'Modern healthcare facility in Kathmandu' },
        { name: 'Nepal Mediciti Hospital', slug: 'nepal-mediciti', trustScore: 3.8, starRating: 4, totalReviews: 456, description: 'State-of-the-art medical center' },
        { name: 'B&B Hospital', slug: 'bb-hospital', trustScore: 3.5, starRating: 4, totalReviews: 567, description: 'Leading private hospital in Lalitpur' },
        { name: 'CIWEC Hospital', slug: 'ciwec-hospital', trustScore: 4.4, starRating: 4, totalReviews: 123, description: 'International clinic and travel medicine' },
      ],
    },
  };

  let slug = $derived($page.params.slug);
  let category = $derived(categoryMap[slug]);
</script>

<svelte:head>
  <title>{category?.name ?? 'Category'} — Biswaas</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  {#if category}
    <div class="mb-8">
      <nav class="mb-4 text-sm text-muted-foreground">
        <a href="/" class="hover:text-foreground">Home</a>
        <span class="mx-1">/</span>
        <a href="/categories" class="hover:text-foreground">Categories</a>
        <span class="mx-1">/</span>
        <span class="text-foreground">{category.name}</span>
      </nav>
      <h1 class="text-3xl font-bold">{category.name}</h1>
      <p class="mt-2 text-muted-foreground">{category.description}</p>
    </div>

    <div class="space-y-4">
      {#each category.businesses as biz}
        <a
          href="/review/{biz.slug}"
          class="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
        >
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-lg font-bold text-muted-foreground">
            {biz.name.charAt(0)}
          </div>
          <div class="flex-1">
            <h3 class="font-semibold">{biz.name}</h3>
            <p class="mt-0.5 text-sm text-muted-foreground">{biz.description}</p>
            <div class="mt-2 flex items-center gap-3 text-sm">
              <span class="flex items-center gap-1 font-medium">
                <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {biz.trustScore}
              </span>
              <span class="text-muted-foreground">·</span>
              <span class="text-muted-foreground">{biz.totalReviews} reviews</span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  {:else}
    <p class="py-12 text-center text-muted-foreground">Category not found</p>
  {/if}
</div>
