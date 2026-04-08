<script lang="ts">
  import { Star, Download, Share2, Facebook, Twitter } from '@lucide/svelte';

  const mockReview = {
    author: 'Ram B.',
    text: '"Very professional and helped me get admission to my dream university. Highly recommended!"',
    stars: 5,
  };

  const businessName = 'Nepal Education Gateway';
  const trustScore = 4.5;

  function downloadImage() {
    alert('Image download would be generated here using html2canvas or a server-side renderer.');
  }

  function shareToFacebook() {
    const url = encodeURIComponent('https://biswaas.com/business/nepal-education-gateway');
    const text = encodeURIComponent(`${businessName} has a ${trustScore}/5 trust score on Biswaas!`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
  }

  function shareToTwitter() {
    const url = encodeURIComponent('https://biswaas.com/business/nepal-education-gateway');
    const text = encodeURIComponent(`${businessName} has a ${trustScore}/5 trust score on Biswaas! Check out their reviews:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  }

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }
</script>

<svelte:head>
  <title>Social Media Tools — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold">Social Media Tools</h1>
  <p class="mt-1 text-sm text-muted-foreground">Generate shareable review images and promote your trust score on social media</p>

  <!-- Review Card Preview -->
  <div class="mt-8">
    <h2 class="text-lg font-semibold">Review Image Generator</h2>
    <p class="mt-1 text-sm text-muted-foreground">Preview how your review card will look when shared</p>

    <div class="mt-4 max-w-md">
      <div class="rounded-xl border-2 bg-gradient-to-br from-background to-muted/50 p-6 shadow-lg">
        <div class="flex items-center gap-2">
          <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span class="text-sm font-bold text-primary">B</span>
          </div>
          <div>
            <p class="font-semibold text-sm">{businessName}</p>
            <p class="text-xs text-muted-foreground">on Biswaas</p>
          </div>
        </div>

        <div class="mt-4 flex items-center gap-3">
          <span class="text-3xl font-bold">{trustScore}</span>
          <div>
            <div class="flex gap-0.5">
              {#each starArray(Math.round(trustScore)) as filled}
                <Star class="h-4 w-4 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
              {/each}
            </div>
            <p class="text-xs text-muted-foreground mt-0.5">Trust Score</p>
          </div>
        </div>

        <div class="mt-4 border-t pt-4">
          <p class="text-sm italic text-muted-foreground">{mockReview.text}</p>
          <p class="mt-2 text-xs font-medium">-- {mockReview.author}</p>
        </div>

        <div class="mt-4 border-t pt-3 text-center">
          <p class="text-xs text-muted-foreground">biswaas.com</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Actions -->
  <div class="mt-6 flex flex-wrap gap-3">
    <button
      onclick={downloadImage}
      class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      <Download class="h-4 w-4" /> Download as Image
    </button>
  </div>

  <!-- Share Buttons -->
  <div class="mt-8">
    <h2 class="text-lg font-semibold">Share on Social Media</h2>
    <p class="mt-1 text-sm text-muted-foreground">Promote your trust score and reviews</p>

    <div class="mt-4 flex flex-wrap gap-3">
      <button
        onclick={shareToFacebook}
        class="flex items-center gap-2 rounded-md bg-[#1877F2] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1877F2]/90"
      >
        <Facebook class="h-4 w-4" /> Share on Facebook
      </button>
      <button
        onclick={shareToTwitter}
        class="flex items-center gap-2 rounded-md bg-[#1DA1F2] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1DA1F2]/90"
      >
        <Twitter class="h-4 w-4" /> Share on X (Twitter)
      </button>
      <button
        onclick={() => {
          navigator.clipboard.writeText('https://biswaas.com/business/nepal-education-gateway');
          alert('Link copied!');
        }}
        class="flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-muted"
      >
        <Share2 class="h-4 w-4" /> Copy Link
      </button>
    </div>
  </div>
</div>
