<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import MobileNav from '$lib/components/layout/MobileNav.svelte';
  import CategoryNav from '$lib/components/layout/CategoryNav.svelte';

  let { children, data } = $props();
  let mobileOpen = $state(false);
</script>

<svelte:head>
  <link rel="icon" href="/favicon.svg" />
</svelte:head>

<div class="flex min-h-screen flex-col">
  <Header user={data.user} onToggleMobile={() => (mobileOpen = !mobileOpen)} />
  <CategoryNav />
  <MobileNav open={mobileOpen} onClose={() => (mobileOpen = false)} />

  <main class="flex-1">
    {@render children()}
  </main>

  <Footer />
</div>
