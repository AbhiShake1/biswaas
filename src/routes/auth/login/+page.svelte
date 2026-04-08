<script lang="ts">
  import { goto } from '$app/navigation';

  function handleDevLogin() {
    goto('/auth/callback?code=dev_code');
  }
</script>

<div class="flex min-h-screen items-center justify-center">
  <div class="w-full max-w-sm space-y-6 rounded-lg border p-8 shadow-sm">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Sign in to Biswaas</h1>
      <p class="mt-2 text-sm text-muted-foreground">Nepal's Trust & Review Platform</p>
    </div>

    <button
      onclick={handleDevLogin}
      class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      Continue with WorkOS
    </button>

    <p class="text-center text-xs text-muted-foreground">
      Development mode — auto-login enabled
    </p>
  </div>
</div>
