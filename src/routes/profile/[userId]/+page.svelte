<script lang="ts">
  import { page } from '$app/stores';
  import { User, Calendar, Star, MessageSquare, Award, MapPin, ThumbsUp } from '@lucide/svelte';

  let userId = $derived($page.params.userId);

  // Mock reviewer data
  const reviewer = {
    name: 'Suman Gurung',
    joinDate: '2025-03-12',
    avatar: null,
    location: 'Kathmandu, Nepal',
    bio: 'Honest reviewer sharing my experiences with businesses across Nepal. I believe in transparency and helping others make informed decisions.',
    stats: {
      reviewCount: 24,
      avgRating: 3.8,
      helpfulVotes: 47,
      badgeCount: 3,
    },
    badges: [
      { name: 'First Review', tier: 'bronze' },
      { name: '5 Reviews', tier: 'silver' },
      { name: 'Helpful Reviewer', tier: 'gold' },
    ],
  };

  const reviews = [
    {
      id: '1',
      businessName: 'Everest Trek Adventures',
      businessSlug: 'everest-trek-adventures',
      stars: 5,
      title: 'Unforgettable trekking experience',
      body: 'The guides were knowledgeable and the entire trip was organized perfectly. Would recommend to anyone visiting Nepal.',
      date: '2026-03-28',
      helpfulCount: 12,
    },
    {
      id: '2',
      businessName: 'WorldLink Internet',
      businessSlug: 'worldlink-internet',
      stars: 3,
      title: 'Decent speed but reliability issues',
      body: 'Good speed when it works, but frequent outages during monsoon season. Customer support could be better.',
      date: '2026-03-15',
      helpfulCount: 8,
    },
    {
      id: '3',
      businessName: 'Nepal Education Gateway',
      businessSlug: 'nepal-education-gateway',
      stars: 5,
      title: 'Smooth visa processing',
      body: 'Got my Australian student visa processed without any hassle. The counselors were very helpful and kept me updated throughout.',
      date: '2026-02-20',
      helpfulCount: 15,
    },
    {
      id: '4',
      businessName: 'Grande Hospital',
      businessSlug: 'grande-hospital',
      stars: 4,
      title: 'Professional medical care',
      body: 'Clean facilities and professional staff. Wait times can be long during peak hours but overall a good experience.',
      date: '2026-01-10',
      helpfulCount: 6,
    },
    {
      id: '5',
      businessName: 'Daraz Nepal',
      businessSlug: 'daraz-nepal',
      stars: 2,
      title: 'Delivery took too long',
      body: 'Ordered a phone case and it took 3 weeks to arrive. Product quality was fine but the delivery experience was poor.',
      date: '2025-12-05',
      helpfulCount: 4,
    },
    {
      id: '6',
      businessName: 'Himalayan Java Coffee',
      businessSlug: 'himalayan-java',
      stars: 4,
      title: 'Great coffee, cozy ambiance',
      body: 'Best coffee chain in Nepal. The Thamel branch has a wonderful rooftop with mountain views. Prices are a bit steep though.',
      date: '2025-11-18',
      helpfulCount: 2,
    },
  ];

  const tierColors: Record<string, { bg: string; text: string }> = {
    bronze: { bg: 'bg-orange-100', text: 'text-orange-700' },
    silver: { bg: 'bg-gray-100', text: 'text-gray-600' },
    gold: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  };

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function formatJoinDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  }
</script>

<svelte:head>
  <title>{reviewer.name} — Reviewer Profile — Biswaas</title>
  <meta name="description" content="View {reviewer.name}'s reviews and trust profile on Biswaas, Nepal's review platform." />
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-8">
  <!-- Profile Header -->
  <div class="rounded-xl border bg-gradient-to-r from-primary/5 to-background p-6 md:p-8">
    <div class="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      <!-- Avatar Placeholder -->
      <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10">
        <User class="h-10 w-10 text-primary" />
      </div>

      <div class="flex-1">
        <h1 class="text-2xl font-bold">{reviewer.name}</h1>
        <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span class="flex items-center gap-1">
            <MapPin class="h-3.5 w-3.5" />
            {reviewer.location}
          </span>
          <span class="flex items-center gap-1">
            <Calendar class="h-3.5 w-3.5" />
            Joined {formatJoinDate(reviewer.joinDate)}
          </span>
        </div>
        {#if reviewer.bio}
          <p class="mt-3 text-sm text-muted-foreground">{reviewer.bio}</p>
        {/if}
      </div>
    </div>
  </div>

  <!-- Stats Cards -->
  <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
    <div class="rounded-lg border p-4 text-center">
      <MessageSquare class="mx-auto h-5 w-5 text-muted-foreground" />
      <div class="mt-2 text-2xl font-bold">{reviewer.stats.reviewCount}</div>
      <div class="text-xs text-muted-foreground">Reviews</div>
    </div>

    <div class="rounded-lg border p-4 text-center">
      <Star class="mx-auto h-5 w-5 text-yellow-500" />
      <div class="mt-2 text-2xl font-bold">{reviewer.stats.avgRating}</div>
      <div class="text-xs text-muted-foreground">Avg Rating Given</div>
    </div>

    <div class="rounded-lg border p-4 text-center">
      <Award class="mx-auto h-5 w-5 text-primary" />
      <div class="mt-2 text-2xl font-bold">{reviewer.stats.badgeCount}</div>
      <div class="text-xs text-muted-foreground">Badges</div>
    </div>

    <div class="rounded-lg border p-4 text-center">
      <ThumbsUp class="mx-auto h-5 w-5 text-green-500" />
      <div class="mt-2 text-2xl font-bold">{reviewer.stats.helpfulVotes}</div>
      <div class="text-xs text-muted-foreground">Helpful Votes</div>
    </div>
  </div>

  <!-- Badges -->
  {#if reviewer.badges.length > 0}
    <div class="mt-6">
      <h2 class="text-lg font-semibold">Badges</h2>
      <div class="mt-3 flex flex-wrap gap-2">
        {#each reviewer.badges as badge}
          {@const colors = tierColors[badge.tier]}
          <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium {colors.bg} {colors.text}">
            <Award class="h-3.5 w-3.5" />
            {badge.name}
          </span>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Reviews List -->
  <div class="mt-8">
    <h2 class="text-lg font-semibold">Reviews by {reviewer.name}</h2>
    <p class="mt-1 text-sm text-muted-foreground">
      {reviewer.stats.reviewCount} reviews written
    </p>

    <div class="mt-4 space-y-4">
      {#each reviews as review}
        <div class="rounded-lg border p-5 transition-colors hover:bg-muted/30">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <a
                href="/search?q={review.businessSlug}"
                class="text-sm font-medium text-primary hover:underline"
              >
                {review.businessName}
              </a>
              <div class="mt-1 flex items-center gap-2">
                <div class="flex gap-0.5">
                  {#each starArray(review.stars) as filled}
                    <Star class="h-3.5 w-3.5 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
                  {/each}
                </div>
                <span class="text-xs text-muted-foreground">{formatDate(review.date)}</span>
              </div>
            </div>
          </div>

          <h3 class="mt-2 font-medium">{review.title}</h3>
          <p class="mt-1 text-sm text-muted-foreground">{review.body}</p>

          <div class="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <ThumbsUp class="h-3 w-3" />
            <span>{review.helpfulCount} people found this helpful</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
