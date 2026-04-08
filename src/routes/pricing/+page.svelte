<script lang="ts">
  import { Check, X } from '@lucide/svelte';

  const plans = [
    {
      name: 'Free',
      price: '0',
      period: '',
      description: 'Get started with a basic business listing',
      cta: 'Get Started',
      highlight: false,
      features: [
        { name: 'Basic business listing', included: true },
        { name: 'Collect reviews', included: true },
        { name: 'Business profile page', included: true },
        { name: 'Reply to reviews', included: false },
        { name: 'Analytics dashboard', included: false },
        { name: 'Review widgets', included: false },
        { name: 'API access', included: false },
        { name: 'Priority support', included: false },
      ],
    },
    {
      name: 'Starter',
      price: '999',
      period: '/mo',
      description: 'Engage with customers and track performance',
      cta: 'Start Free Trial',
      highlight: true,
      features: [
        { name: 'Basic business listing', included: true },
        { name: 'Collect reviews', included: true },
        { name: 'Business profile page', included: true },
        { name: 'Reply to reviews', included: true },
        { name: 'Analytics dashboard', included: true },
        { name: 'Review widgets', included: false },
        { name: 'API access', included: false },
        { name: 'Priority support', included: false },
      ],
    },
    {
      name: 'Premium',
      price: '2,999',
      period: '/mo',
      description: 'Full platform access with premium tools',
      cta: 'Start Free Trial',
      highlight: false,
      features: [
        { name: 'Basic business listing', included: true },
        { name: 'Collect reviews', included: true },
        { name: 'Business profile page', included: true },
        { name: 'Reply to reviews', included: true },
        { name: 'Analytics dashboard', included: true },
        { name: 'Review widgets', included: true },
        { name: 'API access', included: true },
        { name: 'Priority support', included: true },
      ],
    },
  ];
</script>

<svelte:head>
  <title>Pricing — Biswaas</title>
</svelte:head>

<div class="container mx-auto max-w-5xl px-4 py-12">
  <div class="text-center">
    <h1 class="text-3xl font-bold">Simple, transparent pricing</h1>
    <p class="mt-2 text-muted-foreground">Choose the plan that works for your business. All prices in NPR.</p>
  </div>

  <!-- Pricing Cards -->
  <div class="mt-10 grid gap-6 md:grid-cols-3">
    {#each plans as plan}
      <div class="flex flex-col rounded-xl border-2 p-6 {plan.highlight ? 'border-primary shadow-lg' : 'border-border'}">
        {#if plan.highlight}
          <div class="-mt-9 mb-4 self-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            Most Popular
          </div>
        {/if}
        <h2 class="text-xl font-bold">{plan.name}</h2>
        <div class="mt-2 flex items-baseline gap-1">
          <span class="text-sm text-muted-foreground">NPR</span>
          <span class="text-4xl font-bold">{plan.price}</span>
          {#if plan.period}
            <span class="text-muted-foreground">{plan.period}</span>
          {/if}
        </div>
        <p class="mt-2 text-sm text-muted-foreground">{plan.description}</p>

        <button class="mt-6 rounded-md px-4 py-2.5 text-sm font-medium {plan.highlight ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border hover:bg-muted'}">
          {plan.cta}
        </button>

        <div class="mt-6 flex-1 space-y-3 border-t pt-6">
          {#each plan.features as feature}
            <div class="flex items-center gap-2 text-sm">
              {#if feature.included}
                <Check class="h-4 w-4 shrink-0 text-green-500" />
                <span>{feature.name}</span>
              {:else}
                <X class="h-4 w-4 shrink-0 text-muted-foreground/40" />
                <span class="text-muted-foreground">{feature.name}</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <!-- Feature Comparison Table -->
  <div class="mt-16">
    <h2 class="text-center text-2xl font-bold">Feature Comparison</h2>
    <div class="mt-8 overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b">
            <th class="px-4 py-3 text-left font-medium">Feature</th>
            <th class="px-4 py-3 text-center font-medium">Free</th>
            <th class="px-4 py-3 text-center font-medium">Starter</th>
            <th class="px-4 py-3 text-center font-medium">Premium</th>
          </tr>
        </thead>
        <tbody>
          {#each plans[0].features as feature, i}
            <tr class="border-b">
              <td class="px-4 py-3">{feature.name}</td>
              {#each plans as plan}
                <td class="px-4 py-3 text-center">
                  {#if plan.features[i].included}
                    <Check class="mx-auto h-4 w-4 text-green-500" />
                  {:else}
                    <X class="mx-auto h-4 w-4 text-muted-foreground/40" />
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
