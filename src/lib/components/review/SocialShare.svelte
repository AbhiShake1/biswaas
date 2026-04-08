<script lang="ts">
  import { Share2, ExternalLink, Globe, MessageCircle, Link, Check } from '@lucide/svelte';

  let { url = '', title = '' }: { url: string; title: string } = $props();

  let copied = $state(false);

  function shareFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    );
  }

  function shareTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      '_blank',
      'width=600,height=400'
    );
  }

  function shareWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      '_blank',
      'width=600,height=400'
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    }
  }
</script>

<div class="space-y-3">
  <div class="flex items-center gap-2">
    <Share2 class="h-4 w-4 text-primary" />
    <h3 class="text-sm font-semibold">Share this review</h3>
  </div>

  <div class="flex flex-wrap gap-2">
    <button
      onclick={shareFacebook}
      class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
      aria-label="Share on Facebook"
    >
      <Globe class="h-3.5 w-3.5" />
      Facebook
    </button>

    <button
      onclick={shareTwitter}
      class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:border-sky-500 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/30 dark:hover:text-sky-400"
      aria-label="Share on X (Twitter)"
    >
      <ExternalLink class="h-3.5 w-3.5" />
      X / Twitter
    </button>

    <button
      onclick={shareWhatsApp}
      class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:border-green-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/30 dark:hover:text-green-400"
      aria-label="Share on WhatsApp"
    >
      <MessageCircle class="h-3.5 w-3.5" />
      WhatsApp
    </button>

    <button
      onclick={copyLink}
      class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors
        {copied
          ? 'border-primary bg-primary/10 text-primary'
          : 'hover:border-primary/50 hover:bg-muted hover:text-foreground'}"
      aria-label={copied ? 'Link copied' : 'Copy link'}
    >
      {#if copied}
        <Check class="h-3.5 w-3.5" />
        Copied!
      {:else}
        <Link class="h-3.5 w-3.5" />
        Copy Link
      {/if}
    </button>
  </div>
</div>
