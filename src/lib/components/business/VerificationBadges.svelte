<script lang="ts">
  import { ShieldCheck, Clock, CreditCard, Globe, Phone, Mail } from '@lucide/svelte';

  interface VerificationStatus {
    panRegistered: boolean;
    domainVerified: boolean;
    contactVerified: boolean;
    emailVerified: boolean;
  }

  let { status = {
    panRegistered: false,
    domainVerified: false,
    contactVerified: false,
    emailVerified: false,
  } }: { status: VerificationStatus } = $props();

  const badges = $derived([
    {
      label: 'PAN Registered',
      verified: status.panRegistered,
      icon: CreditCard,
    },
    {
      label: 'Domain Verified',
      verified: status.domainVerified,
      icon: Globe,
    },
    {
      label: 'Contact Verified',
      verified: status.contactVerified,
      icon: Phone,
    },
    {
      label: 'Email Verified',
      verified: status.emailVerified,
      icon: Mail,
    },
  ]);

  const verifiedCount = $derived(badges.filter((b) => b.verified).length);
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <ShieldCheck class="h-5 w-5 text-primary" />
      <h3 class="text-sm font-semibold">Verification Status</h3>
    </div>
    <span class="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
      {verifiedCount}/{badges.length} verified
    </span>
  </div>

  <div class="grid gap-3 sm:grid-cols-2">
    {#each badges as badge}
      <div
        class="flex items-center gap-3 rounded-lg border p-3 transition-colors
          {badge.verified
            ? 'border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20'
            : 'border-border bg-muted/30'}"
      >
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full
            {badge.verified
              ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
              : 'bg-muted text-muted-foreground'}"
        >
          {#if badge.verified}
            <ShieldCheck class="h-4 w-4" />
          {:else}
            <Clock class="h-4 w-4" />
          {/if}
        </div>

        <div class="flex-1">
          <p class="text-sm font-medium {badge.verified ? 'text-foreground' : 'text-muted-foreground'}">
            {badge.label}
          </p>
          <p class="text-[11px] {badge.verified ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}">
            {badge.verified ? 'Verified' : 'Pending'}
          </p>
        </div>

        <badge.icon class="h-4 w-4 {badge.verified ? 'text-green-500 dark:text-green-400' : 'text-muted-foreground/50'}" />
      </div>
    {/each}
  </div>
</div>
