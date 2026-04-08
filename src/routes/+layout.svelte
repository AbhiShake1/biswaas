<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import MobileNav from '$lib/components/layout/MobileNav.svelte';
  import CategoryNav from '$lib/components/layout/CategoryNav.svelte';
  import CookieConsent from '$lib/components/CookieConsent.svelte';
  import OnboardingTour from '$lib/components/OnboardingTour.svelte';

  let { children, data } = $props();
  let mobileOpen = $state(false);
</script>

<svelte:head>
  <link rel="icon" href="/favicon.svg" />
</svelte:head>

<div class="flex min-h-screen flex-col">
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
    Skip to content
  </a>
  <Header user={data.user} onToggleMobile={() => (mobileOpen = !mobileOpen)} />
  <CategoryNav />
  <MobileNav open={mobileOpen} onClose={() => (mobileOpen = false)} />

  <main id="main-content" class="flex-1">
    {@render children()}
  </main>

  <Footer />
  <CookieConsent />
  <OnboardingTour />
</div>
