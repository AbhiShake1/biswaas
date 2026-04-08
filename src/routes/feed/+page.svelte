<script lang="ts">
  import { Star, ArrowRight } from '@lucide/svelte';

  type FeedItem = {
    id: string;
    businessName: string;
    businessSlug: string;
    category: string;
    author: string;
    stars: number;
    title: string;
    snippet: string;
    createdAt: number;
  };

  const feedItems: FeedItem[] = [
    { id: '1', businessName: 'IDP Nepal', businessSlug: 'idp-nepal', category: 'Education Consultancies', author: 'Anish M.', stars: 5, title: 'Smooth application process', snippet: 'IDP made my university application process incredibly smooth. The counselors were knowledgeable and responsive.', createdAt: Date.now() - 1000 * 60 * 15 },
    { id: '2', businessName: 'Daraz Nepal', businessSlug: 'daraz-nepal', category: 'E-Commerce', author: 'Priya S.', stars: 2, title: 'Late delivery again', snippet: 'Ordered a phone case, promised 3-day delivery but took 12 days. Customer service was unhelpful.', createdAt: Date.now() - 1000 * 60 * 45 },
    { id: '3', businessName: 'Nepal Intrepid Treks', businessSlug: 'nepal-intrepid-treks', category: 'Trekking & Tourism', author: 'James W.', stars: 5, title: 'Best trekking experience ever', snippet: 'Our Annapurna Circuit trek was perfectly organized. The guide was experienced and the support team was amazing.', createdAt: Date.now() - 1000 * 60 * 90 },
    { id: '4', businessName: 'WorldLink Communications', businessSlug: 'worldlink', category: 'ISPs & Telecom', author: 'Bikash T.', stars: 3, title: 'Decent speed, poor support', snippet: 'Internet speed is usually fine but when it goes down, getting support takes forever. Waited 3 days for a technician.', createdAt: Date.now() - 1000 * 60 * 180 },
    { id: '5', businessName: 'Grande International Hospital', businessSlug: 'grande-hospital', category: 'Hospitals & Healthcare', author: 'Meena R.', stars: 4, title: 'Professional care', snippet: 'The doctors and nurses were professional and caring. Facility is clean and well-maintained. Billing was a bit confusing though.', createdAt: Date.now() - 1000 * 60 * 300 },
    { id: '6', businessName: 'Foodmandu', businessSlug: 'foodmandu', category: 'E-Commerce', author: 'Roshan K.', stars: 4, title: 'Quick delivery in Kathmandu', snippet: 'Food arrived hot and on time. Good selection of restaurants. Prices are reasonable with regular discounts.', createdAt: Date.now() - 1000 * 60 * 420 },
    { id: '7', businessName: 'AECC Global Nepal', businessSlug: 'aecc-global-nepal', category: 'Education Consultancies', author: 'Sarita G.', stars: 4, title: 'Helpful counselors', snippet: 'They helped me choose the right course in Australia. Documentation support was thorough. Recommended for first-timers.', createdAt: Date.now() - 1000 * 60 * 600 },
    { id: '8', businessName: 'Norvic International Hospital', businessSlug: 'norvic-hospital', category: 'Hospitals & Healthcare', author: 'Dipesh P.', stars: 5, title: 'Excellent emergency care', snippet: 'Had an emergency visit and the staff responded quickly. Treatment was efficient and the follow-up care was great.', createdAt: Date.now() - 1000 * 60 * 720 },
  ];

  function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }
</script>

<svelte:head>
  <title>Review Feed — Biswaas</title>
  <meta name="description" content="Latest reviews from across Nepal. See what people are saying about businesses in real time." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold">Review Feed</h1>
    <p class="mt-2 text-muted-foreground">Latest reviews from across the platform</p>
  </div>

  <div class="mx-auto max-w-2xl space-y-4">
    {#each feedItems as item}
      <div class="rounded-lg border p-4 transition-colors hover:bg-muted/30">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <a href="/review/{item.businessSlug}" class="font-medium hover:text-primary truncate">
                {item.businessName}
              </a>
              <span class="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{item.category}</span>
            </div>

            <div class="mt-1.5 flex items-center gap-1">
              {#each starArray(item.stars) as filled}
                <Star class="h-3.5 w-3.5 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
              {/each}
              <span class="ml-1 text-xs text-muted-foreground">by {item.author}</span>
            </div>

            <h3 class="mt-2 text-sm font-medium">{item.title}</h3>
            <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.snippet}</p>
          </div>

          <span class="shrink-0 text-xs text-muted-foreground">{timeAgo(item.createdAt)}</span>
        </div>

        <div class="mt-3 flex items-center justify-between">
          <a href="/review/{item.businessSlug}" class="flex items-center gap-1 text-xs text-primary hover:underline">
            Read full review <ArrowRight class="h-3 w-3" />
          </a>
        </div>
      </div>
    {/each}
  </div>
</div>
