<script lang="ts">
  import { CheckCircle, EyeOff, Star, Flag } from '@lucide/svelte';

  const flaggedReviews = [
    { id: '1', author: 'Anonymous', business: 'Daraz Nepal', stars: 1, title: 'Scam company!', body: 'They sent me a fake product and refused to refund. Complete scam operation.', reason: 'Potentially defamatory', createdAt: Date.now() - 86400000 * 1 },
    { id: '2', author: 'User123', business: 'WorldLink Communications', stars: 1, title: 'Worst ISP ever', body: 'Contains inappropriate language and personal attacks against staff members.', reason: 'Inappropriate language', createdAt: Date.now() - 86400000 * 2 },
    { id: '3', author: 'CompetitorX', business: 'IDP Nepal', stars: 1, title: 'Do not go here', body: 'Suspected fake review from a competitor. Multiple similar reviews from same IP.', reason: 'Suspected fake review', createdAt: Date.now() - 86400000 * 3 },
    { id: '4', author: 'RamK', business: 'Nepal Telecom', stars: 1, title: 'Government corruption', body: 'Makes unverified claims about corruption and illegal activities.', reason: 'Unverified claims', createdAt: Date.now() - 86400000 * 5 },
    { id: '5', author: 'Tourist99', business: 'Nepal Intrepid Treks', stars: 2, title: 'Safety concerns', body: 'Guide was unprofessional and put us in danger. Contains specific safety allegations.', reason: 'Safety allegation', createdAt: Date.now() - 86400000 * 7 },
    { id: '6', author: 'SitaM', business: 'Norvic Hospital', stars: 1, title: 'Medical negligence', body: 'Alleges medical malpractice. Needs legal review before publishing.', reason: 'Medical malpractice allegation', createdAt: Date.now() - 86400000 * 8 },
    { id: '7', author: 'BikashT', business: 'Foodmandu', stars: 1, title: 'Food poisoning', body: 'Claims food poisoning from delivery. Health safety allegation.', reason: 'Health safety allegation', createdAt: Date.now() - 86400000 * 10 },
  ];

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function starArray(count: number) {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }
</script>

<svelte:head>
  <title>Flagged Reviews — Admin — Biswaas</title>
</svelte:head>

<div>
  <nav class="mb-4 text-sm text-muted-foreground">
    <a href="/admin" class="hover:text-foreground">Admin</a>
    <span class="mx-1">/</span>
    <span class="text-foreground">Reviews</span>
  </nav>

  <h1 class="text-2xl font-bold">Flagged Reviews</h1>
  <p class="mt-1 text-sm text-muted-foreground">Reviews that have been flagged for moderation</p>

  <div class="mt-6 space-y-4">
    {#each flaggedReviews as review}
      <div class="rounded-lg border p-4">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-medium">{review.author}</span>
              <span class="text-xs text-muted-foreground">on</span>
              <span class="font-medium text-primary">{review.business}</span>
              <span class="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
            </div>
            <div class="mt-1 flex items-center gap-2">
              <div class="flex items-center gap-0.5">
                {#each starArray(review.stars) as filled}
                  <Star class="h-3 w-3 {filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}" />
                {/each}
              </div>
              <span class="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
                <Flag class="h-2.5 w-2.5" /> {review.reason}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100">
              <CheckCircle class="h-3 w-3" /> Approve
            </button>
            <button class="flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">
              <EyeOff class="h-3 w-3" /> Hide
            </button>
          </div>
        </div>

        <h3 class="mt-2 font-medium">{review.title}</h3>
        <p class="mt-1 text-sm text-muted-foreground">{review.body}</p>
      </div>
    {/each}
  </div>
</div>
