<script lang="ts">
  import { browser } from '$app/environment';

  let visible = $state(false);

  if (browser) {
    visible = !localStorage.getItem('cookie-consent');
  }

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted');
    visible = false;
  }

  function decline() {
    localStorage.setItem('cookie-consent', 'declined');
    visible = false;
  }
</script>

{#if visible}
  <div class="fixed bottom-0 left-0 right-0 z-[60] border-t bg-background p-4 shadow-lg">
    <div class="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p class="text-sm text-muted-foreground">
        We use cookies to improve your experience on Biswaas. By continuing to browse, you agree to our
        <a href="/privacy" class="underline hover:text-foreground">Privacy Policy</a>.
      </p>
      <div class="flex gap-2">
        <button onclick={decline} class="rounded-md border px-4 py-2 text-sm hover:bg-muted">Decline</button>
        <button onclick={accept} class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Accept</button>
      </div>
    </div>
  </div>
{/if}
