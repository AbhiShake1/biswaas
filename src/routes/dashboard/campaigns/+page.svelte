<script lang="ts">
  import { Megaphone, Plus, Calendar, MessageSquare } from '@lucide/svelte';

  type CampaignStatus = 'Active' | 'Completed' | 'Scheduled';

  interface Campaign {
    id: string;
    name: string;
    description: string;
    status: CampaignStatus;
    startDate: string;
    endDate: string;
    reviewsCollected: number;
    goal: number;
  }

  let campaigns = $state<Campaign[]>([
    {
      id: '1',
      name: 'Dashain Review Drive',
      description: 'Encourage customers to share their Dashain festival experience with your business.',
      status: 'Completed',
      startDate: '2025-10-01',
      endDate: '2025-10-20',
      reviewsCollected: 87,
      goal: 100,
    },
    {
      id: '2',
      name: 'Visit Nepal 2025',
      description: 'Collect reviews from tourists visiting Nepal as part of the national tourism campaign.',
      status: 'Active',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      reviewsCollected: 234,
      goal: 500,
    },
    {
      id: '3',
      name: 'Monsoon Feedback',
      description: 'Gather feedback on how your business performs during the monsoon season.',
      status: 'Scheduled',
      startDate: '2025-06-15',
      endDate: '2025-09-15',
      reviewsCollected: 0,
      goal: 150,
    },
  ]);

  let showCreate = $state(false);

  const statusStyle: Record<CampaignStatus, string> = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };
</script>

<svelte:head>
  <title>Seasonal Campaigns — Biswaas</title>
</svelte:head>

<div>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold flex items-center gap-2">
        <Megaphone class="h-6 w-6" /> Seasonal Campaigns
      </h1>
      <p class="mt-1 text-sm text-muted-foreground">Run targeted campaigns to collect more reviews during key periods.</p>
    </div>
    <button onclick={() => showCreate = !showCreate}
      class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
      <Plus class="h-4 w-4" /> Create Campaign
    </button>
  </div>

  {#if showCreate}
    <div class="mt-4 rounded-lg border p-4 space-y-3">
      <h3 class="font-medium">New Campaign</h3>
      <input type="text" placeholder="Campaign name"
        class="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
      <textarea placeholder="Description" rows="2"
        class="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"></textarea>
      <div class="flex gap-3">
        <input type="date" class="rounded-md border px-3 py-2 text-sm outline-none focus:border-primary" />
        <input type="date" class="rounded-md border px-3 py-2 text-sm outline-none focus:border-primary" />
        <input type="number" placeholder="Goal" class="w-24 rounded-md border px-3 py-2 text-sm outline-none focus:border-primary" />
      </div>
      <button onclick={() => showCreate = false}
        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Save Campaign
      </button>
    </div>
  {/if}

  <div class="mt-6 space-y-4">
    {#each campaigns as campaign}
      <div class="rounded-lg border p-5">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-semibold">{campaign.name}</h3>
              <span class="rounded-full px-2 py-0.5 text-xs font-medium {statusStyle[campaign.status]}">{campaign.status}</span>
            </div>
            <p class="mt-1 text-sm text-muted-foreground">{campaign.description}</p>
          </div>
        </div>

        <div class="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
          <span class="flex items-center gap-1"><Calendar class="h-3.5 w-3.5" /> {campaign.startDate} — {campaign.endDate}</span>
          <span class="flex items-center gap-1"><MessageSquare class="h-3.5 w-3.5" /> {campaign.reviewsCollected} / {campaign.goal} reviews</span>
        </div>

        <!-- Progress -->
        <div class="mt-3">
          <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div class="h-full rounded-full bg-primary transition-all" style="width: {Math.min(100, (campaign.reviewsCollected / campaign.goal) * 100)}%"></div>
          </div>
          <p class="mt-1 text-xs text-muted-foreground">{Math.round((campaign.reviewsCollected / campaign.goal) * 100)}% of goal</p>
        </div>
      </div>
    {/each}
  </div>
</div>
