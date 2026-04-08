<script lang="ts">
  import { Copy, Check, Mail, Eye } from '@lucide/svelte';

  let copied = $state(false);
  let showPreview = $state(false);

  const trustBadgeHtml = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
  <tr>
    <td style="padding: 12px 20px; background-color: #1a1a2e; border-radius: 8px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr>
          <td style="padding-right: 14px; vertical-align: middle;">
            <div style="width: 40px; height: 40px; background-color: #4f46e5; border-radius: 8px; text-align: center; line-height: 40px; color: #ffffff; font-size: 18px; font-weight: 700;">B</div>
          </td>
          <td style="vertical-align: middle;">
            <div style="color: #ffffff; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 2px;">Biswaas Verified</div>
            <div style="color: #fbbf24; font-size: 18px; line-height: 1;">&#9733;&#9733;&#9733;&#9733;&#9734;</div>
            <div style="color: #d1d5db; font-size: 12px; margin-top: 2px;">
              <strong style="color: #ffffff; font-size: 14px;">4.2</strong>
              <span style="color: #9ca3af;"> / 5</span>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="text-align: center; padding-top: 6px;">
      <a href="https://biswaas.com" style="color: #6b7280; font-size: 10px; text-decoration: none;">Powered by Biswaas — Nepal's Trust Platform</a>
    </td>
  </tr>
</table>`;

  async function copyHtml() {
    await navigator.clipboard.writeText(trustBadgeHtml);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<svelte:head>
  <title>Email Widgets — Dashboard — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold">Email Widgets</h1>
  <p class="mt-1 text-sm text-muted-foreground">
    Copy-paste HTML trust badges for your email signatures and newsletters
  </p>

  <div class="mt-6 rounded-lg border p-5">
    <div class="flex items-start gap-3">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Mail class="h-5 w-5 text-primary" />
      </div>
      <div class="flex-1">
        <h2 class="font-semibold">Trust Badge for Email</h2>
        <p class="mt-0.5 text-sm text-muted-foreground">
          Works in Gmail, Outlook, Apple Mail, and Yahoo Mail. Uses inline styles for maximum compatibility.
        </p>
      </div>
    </div>

    <!-- Preview -->
    <div class="mt-4">
      <button
        onclick={() => (showPreview = !showPreview)}
        class="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <Eye class="h-4 w-4" />
        {showPreview ? 'Hide Preview' : 'Show Preview'}
      </button>

      {#if showPreview}
        <div class="mt-3 rounded-md border bg-white p-6">
          {@html trustBadgeHtml}
        </div>
      {/if}
    </div>

    <!-- Code block -->
    <div class="mt-4">
      <div class="flex items-center justify-between rounded-t-md border border-b-0 bg-muted/50 px-3 py-2">
        <span class="text-xs font-medium text-muted-foreground">HTML Code</span>
        <button
          onclick={copyHtml}
          class="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium hover:bg-muted"
        >
          {#if copied}
            <Check class="h-3 w-3 text-green-500" /> Copied!
          {:else}
            <Copy class="h-3 w-3" /> Copy
          {/if}
        </button>
      </div>
      <pre class="overflow-x-auto rounded-b-md border bg-muted/30 p-3 text-xs"><code>{trustBadgeHtml}</code></pre>
    </div>

    <div class="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
      <strong>Tip:</strong> Paste this HTML into your email signature settings or directly into a newsletter template.
      The badge uses only inline styles and table-based layout for reliable rendering across all email clients.
    </div>
  </div>
</div>
