<script lang="ts">
  import { Star, Building2, User } from '@lucide/svelte';

  interface Reply {
    author: string;
    role: 'business' | 'consumer';
    text: string;
    date: string;
  }

  interface Props {
    reviewAuthor?: string;
    reviewStars?: number;
    reviewTitle?: string;
    reviewBody?: string;
    reviewDate?: string;
    replies?: Reply[];
  }

  let {
    reviewAuthor = 'Sita K.',
    reviewStars = 4,
    reviewTitle = 'Good but could improve',
    reviewBody = 'The food was great and the ambiance was nice. However, the service was slow during peak hours and our order took over 45 minutes.',
    reviewDate = '2026-02-15',
    replies = [
      {
        author: 'Himalayan Kitchen',
        role: 'business',
        text: 'Thank you for your feedback, Sita! We apologize for the wait. We have since added more staff during peak hours to reduce wait times. We hope you will give us another chance!',
        date: '2026-02-16',
      },
      {
        author: 'Sita K.',
        role: 'consumer',
        text: 'Thank you for the quick response. I visited again last weekend and the service was much faster. Great improvement!',
        date: '2026-02-22',
      },
      {
        author: 'Himalayan Kitchen',
        role: 'business',
        text: 'We are so glad to hear that! Looking forward to serving you again soon.',
        date: '2026-02-23',
      },
    ],
  }: Props = $props();

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }
</script>

<div class="rounded-lg border">
  <!-- Original Review -->
  <div class="p-5">
    <div class="flex items-center gap-2">
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
        <User class="h-4 w-4 text-primary" />
      </div>
      <div>
        <span class="font-medium">{reviewAuthor}</span>
        <div class="flex items-center gap-1">
          {#each starArray(reviewStars) as filled}
            <Star class="h-3 w-3 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
          {/each}
          <span class="ml-2 text-xs text-muted-foreground">{reviewDate}</span>
        </div>
      </div>
    </div>
    <h3 class="mt-3 font-semibold">{reviewTitle}</h3>
    <p class="mt-1 text-sm text-muted-foreground">{reviewBody}</p>
  </div>

  <!-- Reply Thread -->
  {#if replies.length > 0}
    <div class="border-t bg-muted/30">
      {#each replies as reply, i}
        {@const indent = Math.min(i + 1, 3)}
        <div class="border-t px-5 py-4" style="padding-left: {1.25 + indent * 1.25}rem">
          <div class="flex items-center gap-2">
            <div class="flex h-7 w-7 items-center justify-center rounded-full {reply.role === 'business' ? 'bg-blue-100' : 'bg-primary/10'}">
              {#if reply.role === 'business'}
                <Building2 class="h-3.5 w-3.5 text-blue-600" />
              {:else}
                <User class="h-3.5 w-3.5 text-primary" />
              {/if}
            </div>
            <span class="text-sm font-medium">{reply.author}</span>
            {#if reply.role === 'business'}
              <span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Business</span>
            {/if}
            <span class="text-xs text-muted-foreground">{reply.date}</span>
          </div>
          <p class="mt-2 text-sm text-muted-foreground" style="margin-left: 2.25rem">{reply.text}</p>
        </div>
      {/each}
    </div>
  {/if}
</div>
