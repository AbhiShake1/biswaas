<script lang="ts">
  import { Sun, Moon } from '@lucide/svelte';
  import { browser } from '$app/environment';

  let dark = $state(false);

  if (browser) {
    dark = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyTheme();
  }

  function applyTheme() {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function toggle() {
    dark = !dark;
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    applyTheme();
  }
</script>

<button onclick={toggle} class="rounded-md p-2 text-muted-foreground hover:bg-muted" aria-label="Toggle dark mode">
  {#if dark}
    <Sun class="h-4 w-4" />
  {:else}
    <Moon class="h-4 w-4" />
  {/if}
</button>
