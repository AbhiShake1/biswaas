<script lang="ts">
  import { Sparkles, Copy, Check } from '@lucide/svelte';

  type Sentiment = 'positive' | 'negative' | 'neutral';

  let { sentiment = 'neutral' as Sentiment, onuse }: { sentiment: Sentiment; onuse?: (text: string) => void } = $props();

  let copiedIdx = $state<number | null>(null);

  const templates: Record<Sentiment, { label: string; responses: string[] }> = {
    positive: {
      label: 'Positive Review',
      responses: [
        "Thank you so much for your kind words! We're thrilled to hear you had a great experience. Your support means the world to us and motivates our team to keep delivering the best service possible.",
        "We really appreciate you taking the time to share this wonderful feedback! It's customers like you who make what we do worthwhile. We look forward to serving you again soon!",
        "What a lovely review - thank you! We're glad everything met your expectations. Please don't hesitate to reach out if there's anything else we can do for you.",
      ],
    },
    negative: {
      label: 'Negative Review',
      responses: [
        "We sincerely apologize for your experience. This is not the standard we strive for. We'd love the opportunity to make things right - could you please contact us directly so we can resolve this?",
        "Thank you for bringing this to our attention. We take all feedback seriously and are looking into the issues you've raised. We'd appreciate the chance to discuss this further and find a solution.",
        "We're sorry to hear about your disappointing experience. Your feedback helps us improve. Please reach out to our support team at your earliest convenience so we can address your concerns properly.",
      ],
    },
    neutral: {
      label: 'Mixed Review',
      responses: [
        "Thank you for your balanced feedback! We're glad some aspects of your experience were positive. We'll certainly work on the areas you've mentioned for improvement. Your input helps us grow.",
        "We appreciate your honest review. It's great to hear what worked well, and we're taking note of where we can do better. Thank you for helping us improve our services.",
        "Thanks for sharing your experience with us! We value your perspective and will use your suggestions to enhance our offerings. We hope to exceed your expectations next time.",
      ],
    },
  };

  const current = $derived(templates[sentiment]);

  function handleUse(text: string, idx: number) {
    copiedIdx = idx;
    onuse?.(text);

    // Also copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }

    setTimeout(() => {
      copiedIdx = null;
    }, 2000);
  }
</script>

<div class="space-y-3">
  <div class="flex items-center gap-2">
    <Sparkles class="h-4 w-4 text-primary" />
    <h3 class="text-sm font-semibold">AI Response Suggestions</h3>
    <span class="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
      {current.label}
    </span>
  </div>

  <div class="space-y-2">
    {#each current.responses as response, idx}
      <div class="group rounded-lg border bg-card p-3 transition-colors hover:border-primary/30">
        <p class="text-xs leading-relaxed text-muted-foreground">
          {response}
        </p>
        <div class="mt-2 flex justify-end">
          <button
            onclick={() => handleUse(response, idx)}
            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors
              {copiedIdx === idx
                ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                : 'bg-primary/10 text-primary hover:bg-primary/20'}"
          >
            {#if copiedIdx === idx}
              <Check class="h-3 w-3" />
              Copied!
            {:else}
              <Copy class="h-3 w-3" />
              Use this response
            {/if}
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>
