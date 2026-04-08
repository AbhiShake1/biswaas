<script lang="ts">
  import { Copy, Gift, Users, Check, Star } from '@lucide/svelte';

  const referralCode = 'BISWAAS-RAMB-2X9K';
  const referralLink = `https://biswaas.com/join?ref=${referralCode}`;

  let copied = $state(false);

  const stats = [
    { label: 'Invited', value: 3, icon: Users, color: 'text-blue-500' },
    { label: 'Joined', value: 1, icon: Check, color: 'text-green-500' },
    { label: 'Reviews Written', value: 0, icon: Star, color: 'text-yellow-500' },
  ];

  const rewards = [
    { milestone: 'First friend joins', reward: 'Bronze Referrer badge', status: 'earned' },
    { milestone: '3 friends join', reward: 'Silver Referrer badge + 50 points', status: 'in-progress' },
    { milestone: '10 friends join', reward: 'Gold Referrer badge + 200 points', status: 'locked' },
    { milestone: '5 friends write reviews', reward: 'Community Builder badge', status: 'locked' },
  ];

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<svelte:head>
  <title>Referral Program — Biswaas</title>
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-8">
  <div class="flex items-center gap-3">
    <Gift class="h-7 w-7 text-primary" />
    <div>
      <h1 class="text-2xl font-bold">Referral Program</h1>
      <p class="text-sm text-muted-foreground">Invite friends to Biswaas and earn rewards together</p>
    </div>
  </div>

  <!-- Referral Link -->
  <div class="mt-8 rounded-lg border p-5">
    <h2 class="font-semibold">Your Referral Link</h2>
    <p class="mt-1 text-sm text-muted-foreground">Share this link with friends to invite them to Biswaas</p>
    <div class="mt-3 flex gap-2">
      <input
        type="text"
        readonly
        value={referralLink}
        class="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm"
      />
      <button
        onclick={copyLink}
        class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {#if copied}
          <Check class="h-4 w-4" /> Copied!
        {:else}
          <Copy class="h-4 w-4" /> Copy Link
        {/if}
      </button>
    </div>
    <p class="mt-2 text-xs text-muted-foreground">Code: {referralCode}</p>
  </div>

  <!-- Stats -->
  <div class="mt-6 grid gap-4 sm:grid-cols-3">
    {#each stats as stat}
      <div class="rounded-lg border p-4 text-center">
        <stat.icon class="mx-auto h-6 w-6 {stat.color}" />
        <div class="mt-2 text-2xl font-bold">{stat.value}</div>
        <div class="text-sm text-muted-foreground">{stat.label}</div>
      </div>
    {/each}
  </div>

  <!-- Rewards Table -->
  <div class="mt-8">
    <h2 class="text-lg font-semibold">Rewards</h2>
    <div class="mt-4 overflow-hidden rounded-lg border">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="px-4 py-3 text-left font-medium">Milestone</th>
            <th class="px-4 py-3 text-left font-medium">Reward</th>
            <th class="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {#each rewards as row}
            <tr class="border-b last:border-0">
              <td class="px-4 py-3">{row.milestone}</td>
              <td class="px-4 py-3">{row.reward}</td>
              <td class="px-4 py-3">
                {#if row.status === 'earned'}
                  <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Earned</span>
                {:else if row.status === 'in-progress'}
                  <span class="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">In Progress</span>
                {:else}
                  <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">Locked</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
