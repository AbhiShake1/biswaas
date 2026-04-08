<script lang="ts">
  import { page } from '$app/stores';
  import '../app.css';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import MobileNav from '$lib/components/layout/MobileNav.svelte';
  import CategoryNav from '$lib/components/layout/CategoryNav.svelte';

  let { children, data } = $props();
  let mobileOpen = $state(false);
  let isEmbedRoute = $derived($page.url.pathname.startsWith('/embed/'));
</script>

<svelte:head>
  <link rel="icon" href="/favicon.svg" />
</svelte:head>

<div class="app-shell flex min-h-screen flex-col">
  {#if !isEmbedRoute}
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
    >
      Skip to content
    </a>
    <Header user={data.user} onToggleMobile={() => (mobileOpen = !mobileOpen)} />
    <CategoryNav categories={data.categories} />
    <MobileNav categories={data.categories} open={mobileOpen} onClose={() => (mobileOpen = false)} />
  {/if}

  <main id="main-content" class="relative flex-1">
    {@render children()}
  </main>

  {#if !isEmbedRoute}
    <Footer />
  {/if}
</div>
