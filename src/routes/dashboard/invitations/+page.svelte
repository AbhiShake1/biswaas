<script lang="ts">
  import { Mail, Link2, Copy, Check, QrCode, Send, Trash2 } from '@lucide/svelte';

  let emailInput = $state('');
  let customMessage = $state('');
  let copied = $state(false);
  let showQr = $state(false);

  const shareableLink = 'https://biswaas.com/review/my-business-abc123';

  type Invitation = {
    id: string;
    email: string;
    sentAt: number;
    status: 'pending' | 'opened' | 'completed';
  };

  let invitations = $state<Invitation[]>([
    { id: '1', email: 'ram.bahadur@gmail.com', sentAt: Date.now() - 86400000 * 1, status: 'completed' },
    { id: '2', email: 'sita.kumari@outlook.com', sentAt: Date.now() - 86400000 * 2, status: 'opened' },
    { id: '3', email: 'hari.prasad@yahoo.com', sentAt: Date.now() - 86400000 * 3, status: 'pending' },
    { id: '4', email: 'gita.sharma@gmail.com', sentAt: Date.now() - 86400000 * 5, status: 'pending' },
    { id: '5', email: 'bikash.manandhar@gmail.com', sentAt: Date.now() - 86400000 * 7, status: 'completed' },
  ]);

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function sendInvitation() {
    if (!emailInput.trim()) return;
    const emails = emailInput.split(',').map(e => e.trim()).filter(Boolean);
    for (const email of emails) {
      invitations = [
        { id: crypto.randomUUID(), email, sentAt: Date.now(), status: 'pending' },
        ...invitations,
      ];
    }
    emailInput = '';
    customMessage = '';
  }

  function removeInvitation(id: string) {
    invitations = invitations.filter(i => i.id !== id);
  }

  function resendInvitation(id: string) {
    invitations = invitations.map(i =>
      i.id === id ? { ...i, sentAt: Date.now(), status: 'pending' as const } : i
    );
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shareableLink);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    opened: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };

  const stats = $derived({
    total: invitations.length,
    pending: invitations.filter(i => i.status === 'pending').length,
    opened: invitations.filter(i => i.status === 'opened').length,
    completed: invitations.filter(i => i.status === 'completed').length,
  });
</script>

<svelte:head>
  <title>Invitations — Dashboard — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold">Review Invitations</h1>
  <p class="mt-1 text-sm text-muted-foreground">Invite customers to leave reviews for your business</p>

  <!-- Stats -->
  <div class="mt-6 grid gap-4 sm:grid-cols-4">
    <div class="rounded-lg border p-4">
      <p class="text-sm text-muted-foreground">Total Sent</p>
      <p class="mt-1 text-2xl font-bold">{stats.total}</p>
    </div>
    <div class="rounded-lg border p-4">
      <p class="text-sm text-muted-foreground">Pending</p>
      <p class="mt-1 text-2xl font-bold text-yellow-600">{stats.pending}</p>
    </div>
    <div class="rounded-lg border p-4">
      <p class="text-sm text-muted-foreground">Opened</p>
      <p class="mt-1 text-2xl font-bold text-blue-600">{stats.opened}</p>
    </div>
    <div class="rounded-lg border p-4">
      <p class="text-sm text-muted-foreground">Completed</p>
      <p class="mt-1 text-2xl font-bold text-green-600">{stats.completed}</p>
    </div>
  </div>

  <!-- Send Invitation -->
  <div class="mt-6 rounded-lg border p-6">
    <h2 class="flex items-center gap-2 text-lg font-semibold">
      <Mail class="h-5 w-5" /> Send Invitation
    </h2>
    <p class="mt-1 text-sm text-muted-foreground">Enter email addresses separated by commas to send multiple invitations at once.</p>

    <div class="mt-4 space-y-3">
      <div>
        <label for="email-input" class="text-sm font-medium">Email addresses</label>
        <input
          id="email-input"
          type="text"
          bind:value={emailInput}
          placeholder="customer@example.com, another@example.com"
          class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label for="custom-message" class="text-sm font-medium">Custom message (optional)</label>
        <textarea
          id="custom-message"
          bind:value={customMessage}
          placeholder="We'd love to hear about your experience..."
          rows="3"
          class="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        ></textarea>
      </div>

      <button
        onclick={sendInvitation}
        disabled={!emailInput.trim()}
        class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send class="h-4 w-4" /> Send Invitation
      </button>
    </div>
  </div>

  <!-- Shareable Link & QR -->
  <div class="mt-6 rounded-lg border p-6">
    <h2 class="flex items-center gap-2 text-lg font-semibold">
      <Link2 class="h-5 w-5" /> Shareable Review Link
    </h2>
    <p class="mt-1 text-sm text-muted-foreground">Share this link with customers to collect reviews directly.</p>

    <div class="mt-4 flex items-center gap-2">
      <div class="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm font-mono truncate">
        {shareableLink}
      </div>
      <button
        onclick={copyLink}
        class="flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        {#if copied}
          <Check class="h-4 w-4 text-green-600" /> Copied
        {:else}
          <Copy class="h-4 w-4" /> Copy
        {/if}
      </button>
    </div>

    <div class="mt-4">
      <button
        onclick={() => showQr = !showQr}
        class="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        <QrCode class="h-4 w-4" /> {showQr ? 'Hide' : 'Show'} QR Code
      </button>

      {#if showQr}
        <div class="mt-4 inline-flex flex-col items-center rounded-lg border bg-white p-6">
          <div class="grid grid-cols-7 gap-0.5">
            {#each Array(49) as _, i}
              {@const isCorner = (i < 21 && (i % 7 < 3)) || (i < 21 && (i % 7 > 3)) || (i > 27 && i < 49 && (i % 7 < 3))}
              {@const isFilled = isCorner || Math.random() > 0.5}
              <div class="h-3 w-3 rounded-[1px] {isFilled ? 'bg-foreground' : 'bg-transparent'}"></div>
            {/each}
          </div>
          <p class="mt-3 text-xs text-muted-foreground">Scan to leave a review</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Sent Invitations Table -->
  <div class="mt-6">
    <h2 class="text-lg font-semibold">Sent Invitations</h2>

    <div class="mt-4 overflow-x-auto rounded-lg border">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="px-4 py-3 text-left font-medium">Email</th>
            <th class="px-4 py-3 text-left font-medium">Sent</th>
            <th class="px-4 py-3 text-left font-medium">Status</th>
            <th class="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each invitations as invitation}
            <tr class="border-b last:border-0 hover:bg-muted/30">
              <td class="px-4 py-3 font-medium">{invitation.email}</td>
              <td class="px-4 py-3 text-muted-foreground">{formatDate(invitation.sentAt)}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {statusColors[invitation.status]}">
                  {invitation.status}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  {#if invitation.status === 'pending'}
                    <button
                      onclick={() => resendInvitation(invitation.id)}
                      class="rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted"
                    >
                      Resend
                    </button>
                  {/if}
                  <button
                    onclick={() => removeInvitation(invitation.id)}
                    class="rounded-md border px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <Trash2 class="h-3 w-3" />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if invitations.length === 0}
      <div class="mt-4 rounded-lg border border-dashed p-8 text-center">
        <Mail class="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p class="mt-2 text-sm text-muted-foreground">No invitations sent yet. Start inviting customers above.</p>
      </div>
    {/if}
  </div>
</div>
