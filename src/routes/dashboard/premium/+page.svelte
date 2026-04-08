<script lang="ts">
  import { Shield, Zap, TrendingUp, BarChart3, Star, Crown } from '@lucide/svelte';

  const features = [
    {
      icon: Shield,
      title: 'Ad-Free Profile',
      description: 'Remove all third-party advertisements from your business profile. Give your customers a clean, distraction-free experience.',
    },
    {
      icon: Zap,
      title: 'Priority Support',
      description: 'Get help faster with dedicated support. Average response time under 2 hours for premium members.',
    },
    {
      icon: TrendingUp,
      title: 'Promoted Placement',
      description: 'Appear at the top of category and search results. Get up to 3x more visibility for your business.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into your review trends, customer sentiment analysis, competitor benchmarking, and visitor demographics.',
    },
    {
      icon: Star,
      title: 'Review Widgets',
      description: 'Embed your Biswaas reviews on your website. Showcase your reputation with customizable widget designs.',
    },
    {
      icon: Crown,
      title: 'API Access',
      description: 'Integrate Biswaas data into your own systems. Access review data, analytics, and manage your profile programmatically.',
    },
  ];
</script>

<svelte:head>
  <title>Upgrade to Premium — Biswaas</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-8">
  <!-- Hero -->
  <div class="rounded-xl border-2 border-primary/20 bg-primary/5 p-8 text-center">
    <Crown class="mx-auto h-12 w-12 text-primary" />
    <h1 class="mt-4 text-3xl font-bold">Upgrade to Premium</h1>
    <p class="mt-2 text-muted-foreground">Unlock the full power of Biswaas for your business</p>
    <div class="mt-4 flex items-baseline justify-center gap-1">
      <span class="text-sm text-muted-foreground">NPR</span>
      <span class="text-4xl font-bold">2,999</span>
      <span class="text-muted-foreground">/month</span>
    </div>
    <button class="mt-6 rounded-md bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-primary/90">
      Upgrade Now
    </button>
    <p class="mt-2 text-xs text-muted-foreground">14-day free trial. Cancel anytime.</p>
  </div>

  <!-- Features Grid -->
  <div class="mt-12">
    <h2 class="text-center text-xl font-semibold">Everything in Premium</h2>
    <div class="mt-8 grid gap-6 md:grid-cols-2">
      {#each features as feature}
        <div class="rounded-lg border p-5">
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon class="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 class="font-semibold">{feature.title}</h3>
              <p class="mt-1 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- CTA -->
  <div class="mt-12 text-center">
    <p class="text-muted-foreground">Have questions? <a href="/contact" class="text-primary hover:underline">Contact our sales team</a></p>
  </div>
</div>
