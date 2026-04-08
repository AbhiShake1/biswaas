<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>Error {page.status} | Biswaas</title>
</svelte:head>

<div class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
  <h1 class="text-6xl font-bold text-primary">{page.status}</h1>
  <p class="mt-4 text-xl text-muted-foreground">
    {#if page.status === 404}
      The page you're looking for doesn't exist.
    {:else}
      Something went wrong.
    {/if}
  </p>
  {#if page.error?.message}
    <p class="mt-2 text-sm text-muted-foreground">{page.error.message}</p>
  {/if}
  <a href="/" class="mt-8 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
    Back to Home
  </a>
</div>
