<script lang="ts">
  import { onMount } from 'svelte';
  import { Search, BookOpen, Pencil, Award } from '@lucide/svelte';

  let visible = $state(false);
  let step = $state(0);

  const steps = [
    { icon: Search, title: 'Search for businesses', description: 'Find trusted businesses across Nepal — from restaurants and hotels to education consultancies and tech companies.' },
    { icon: BookOpen, title: 'Read reviews', description: 'See what real consumers are saying. Every review is verified to help you make informed decisions.' },
    { icon: Pencil, title: 'Write your first review', description: 'Share your experience and help fellow Nepalis. Your honest feedback makes the community stronger.' },
    { icon: Award, title: 'Earn badges', description: 'Get recognized for your contributions. Earn bronze, silver, and gold badges as you review more businesses.' },
  ];

  const currentStep = $derived(steps[step]);

  onMount(() => {
    const seen = localStorage.getItem('biswaas-onboarding-done');
    if (!seen) {
      visible = true;
    }
  });

  function next() {
    if (step < steps.length - 1) {
      step++;
    } else {
      finish();
    }
  }

  function skip() {
    finish();
  }

  function finish() {
    localStorage.setItem('biswaas-onboarding-done', 'true');
    visible = false;
  }
</script>

{#if visible}
  <div class="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md rounded-xl bg-background p-6 shadow-2xl">
      <!-- Progress dots -->
      <div class="flex justify-center gap-2">
        {#each steps as _, i}
          <div class="h-2 w-2 rounded-full transition-colors {i === step ? 'bg-primary' : i < step ? 'bg-primary/40' : 'bg-muted'}"></div>
        {/each}
      </div>

      <!-- Step content -->
      <div class="mt-6 flex flex-col items-center text-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <currentStep.icon class="h-8 w-8 text-primary" />
        </div>
        <h2 class="mt-4 text-xl font-bold">{currentStep.title}</h2>
        <p class="mt-2 text-sm text-muted-foreground">{currentStep.description}</p>
      </div>

      <!-- Step indicator -->
      <p class="mt-4 text-center text-xs text-muted-foreground">Step {step + 1} of {steps.length}</p>

      <!-- Buttons -->
      <div class="mt-6 flex items-center justify-between">
        <button onclick={skip} class="text-sm text-muted-foreground hover:text-foreground">
          Skip
        </button>
        <button
          onclick={next}
          class="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {step < steps.length - 1 ? 'Next' : 'Done'}
        </button>
      </div>
    </div>
  </div>
{/if}
