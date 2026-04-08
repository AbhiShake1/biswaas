<script lang="ts">
  let { data } = $props();
</script>

<div class="flex min-h-screen items-center justify-center">
  <div class="w-full max-w-sm space-y-6 rounded-lg border p-8 shadow-sm">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Sign in to Biswaas</h1>
      <p class="mt-2 text-sm text-muted-foreground">Nepal's Trust & Review Platform</p>
    </div>

    <a
      href={data.signInUrl}
      data-testid="workos-sign-in"
      class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      Continue with WorkOS
    </a>

    {#if data.isDevMode}
      <p class="text-center text-xs text-muted-foreground">
        Demo mode is active. This will sign you in with a local WorkOS test user for verification.
      </p>
    {/if}
  </div>
</div>
