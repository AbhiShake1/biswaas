<script lang="ts">
  import { Mail, Phone, Globe, CheckCircle, Clock, Circle, Shield } from '@lucide/svelte';

  type VerificationStatus = 'verified' | 'pending' | 'not_started';

  interface VerificationMethod {
    id: string;
    label: string;
    description: string;
    icon: typeof Mail;
    status: VerificationStatus;
  }

  let methods = $state<VerificationMethod[]>([
    { id: 'email', label: 'Email Verification', description: 'Verify your identity by confirming your email address', icon: Mail, status: 'verified' },
    { id: 'phone', label: 'Phone Verification', description: 'Verify via SMS code sent to your mobile number', icon: Phone, status: 'not_started' },
    { id: 'social', label: 'Social Login', description: 'Connect your Google or Facebook account', icon: Globe, status: 'not_started' },
  ]);

  let phoneNumber = $state('');
  let verificationCode = $state('');
  let codeSent = $state(false);
  let activeMethod = $state<string | null>(null);

  function sendEmailCode() {
    activeMethod = 'email';
    alert('Verification email sent! Check your inbox.');
  }

  function sendSmsCode() {
    if (!phoneNumber) return;
    codeSent = true;
    activeMethod = 'phone';
  }

  function verifySmsCode() {
    if (!verificationCode) return;
    methods = methods.map((m) => (m.id === 'phone' ? { ...m, status: 'verified' as const } : m));
    codeSent = false;
    verificationCode = '';
    activeMethod = null;
  }

  function connectSocial(provider: 'google' | 'facebook') {
    methods = methods.map((m) => (m.id === 'social' ? { ...m, status: 'pending' as const } : m));
    setTimeout(() => {
      methods = methods.map((m) => (m.id === 'social' ? { ...m, status: 'verified' as const } : m));
    }, 2000);
  }

  const statusConfig = {
    verified: { icon: CheckCircle, label: 'Verified', class: 'text-green-500' },
    pending: { icon: Clock, label: 'Pending', class: 'text-yellow-500' },
    not_started: { icon: Circle, label: 'Not Started', class: 'text-muted-foreground' },
  };

  let verifiedCount = $derived(methods.filter((m) => m.status === 'verified').length);
</script>

<svelte:head>
  <title>Verify Your Identity — Biswaas</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-12">
  <div class="flex items-center gap-3">
    <Shield class="h-8 w-8 text-primary" />
    <div>
      <h1 class="text-2xl font-bold">Verify Your Identity</h1>
      <p class="text-sm text-muted-foreground">Complete verification to earn the "Verified Reviewer" badge</p>
    </div>
  </div>

  <!-- Progress -->
  <div class="mt-6 rounded-lg border p-4">
    <div class="flex items-center justify-between text-sm">
      <span class="font-medium">Verification Progress</span>
      <span class="text-muted-foreground">{verifiedCount} of {methods.length} completed</span>
    </div>
    <div class="mt-2 h-2 overflow-hidden rounded-full bg-muted">
      <div class="h-full rounded-full bg-primary transition-all" style="width: {(verifiedCount / methods.length) * 100}%"></div>
    </div>
  </div>

  <!-- Methods -->
  <div class="mt-6 space-y-4">
    {#each methods as method}
      {@const config = statusConfig[method.status]}
      <div class="rounded-lg border p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-3">
            <div class="rounded-lg bg-muted p-2">
              <method.icon class="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h3 class="font-semibold">{method.label}</h3>
              <p class="mt-0.5 text-sm text-muted-foreground">{method.description}</p>
            </div>
          </div>
          <span class="flex items-center gap-1 text-sm {config.class}">
            <svelte:component this={config.icon} class="h-4 w-4" />
            {config.label}
          </span>
        </div>

        {#if method.status !== 'verified'}
          <div class="mt-4 border-t pt-4">
            {#if method.id === 'email'}
              <button onclick={sendEmailCode} class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Send Verification Email
              </button>
            {:else if method.id === 'phone'}
              {#if !codeSent}
                <div class="flex gap-2">
                  <input
                    type="tel"
                    bind:value={phoneNumber}
                    placeholder="+977 98XXXXXXXX"
                    class="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button onclick={sendSmsCode} class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Send Code
                  </button>
                </div>
              {:else}
                <div class="flex gap-2">
                  <input
                    type="text"
                    bind:value={verificationCode}
                    placeholder="Enter 6-digit code"
                    maxlength="6"
                    class="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button onclick={verifySmsCode} class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Verify
                  </button>
                </div>
                <p class="mt-2 text-xs text-muted-foreground">Code sent to {phoneNumber}. <button onclick={() => codeSent = false} class="text-primary hover:underline">Change number</button></p>
              {/if}
            {:else if method.id === 'social'}
              <div class="flex gap-2">
                <button onclick={() => connectSocial('google')} class="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
                  <svg class="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button onclick={() => connectSocial('facebook')} class="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
