<script lang="ts">
  import { FlaskConical, Plus, BarChart3, Play, Pause, Trash2 } from '@lucide/svelte';

  type TestStatus = 'draft' | 'running' | 'completed' | 'paused';

  interface ABTest {
    id: string;
    name: string;
    status: TestStatus;
    variantA: { subject: string; openRate: number; clickRate: number; completionRate: number };
    variantB: { subject: string; openRate: number; clickRate: number; completionRate: number };
    trafficSplit: number; // percentage to variant A
    totalSent: number;
    createdAt: string;
    winner: 'A' | 'B' | null;
  }

  let tests = $state<ABTest[]>([
    {
      id: 'test_1',
      name: 'Review Invitation Subject Line',
      status: 'completed',
      variantA: { subject: 'How was your experience?', openRate: 42.3, clickRate: 18.5, completionRate: 8.2 },
      variantB: { subject: 'We value your feedback!', openRate: 38.1, clickRate: 15.2, completionRate: 6.8 },
      trafficSplit: 50,
      totalSent: 1200,
      createdAt: '2026-03-20',
      winner: 'A',
    },
    {
      id: 'test_2',
      name: 'Follow-up Reminder Tone',
      status: 'running',
      variantA: { subject: 'Quick reminder: share your review', openRate: 35.7, clickRate: 12.1, completionRate: 5.4 },
      variantB: { subject: 'Your opinion matters to us', openRate: 37.2, clickRate: 13.8, completionRate: 6.1 },
      trafficSplit: 50,
      totalSent: 450,
      createdAt: '2026-04-01',
      winner: null,
    },
  ]);

  let showCreateForm = $state(false);
  let newTestName = $state('');
  let newSubjectA = $state('');
  let newSubjectB = $state('');
  let newSplit = $state(50);

  const statusColors: Record<TestStatus, string> = {
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    running: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    paused: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  function createTest() {
    if (!newTestName || !newSubjectA || !newSubjectB) return;
    tests = [
      {
        id: `test_${Date.now()}`,
        name: newTestName,
        status: 'draft',
        variantA: { subject: newSubjectA, openRate: 0, clickRate: 0, completionRate: 0 },
        variantB: { subject: newSubjectB, openRate: 0, clickRate: 0, completionRate: 0 },
        trafficSplit: newSplit,
        totalSent: 0,
        createdAt: new Date().toISOString().split('T')[0],
        winner: null,
      },
      ...tests,
    ];
    newTestName = '';
    newSubjectA = '';
    newSubjectB = '';
    newSplit = 50;
    showCreateForm = false;
  }

  function toggleTestStatus(id: string) {
    tests = tests.map((t) => {
      if (t.id !== id) return t;
      if (t.status === 'draft' || t.status === 'paused') return { ...t, status: 'running' as const };
      if (t.status === 'running') return { ...t, status: 'paused' as const };
      return t;
    });
  }

  function deleteTest(id: string) {
    tests = tests.filter((t) => t.id !== id);
  }
</script>

<svelte:head>
  <title>A/B Testing — Biswaas Dashboard</title>
</svelte:head>

<div>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold">A/B Testing</h1>
      <p class="mt-1 text-sm text-muted-foreground">Test different invitation email subjects to optimize review collection</p>
    </div>
    <button
      onclick={() => showCreateForm = !showCreateForm}
      class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      <Plus class="h-4 w-4" /> New Test
    </button>
  </div>

  <!-- Create Form -->
  {#if showCreateForm}
    <div class="mt-6 rounded-lg border p-6">
      <h2 class="font-semibold">Create A/B Test</h2>
      <div class="mt-4 space-y-4">
        <div>
          <label for="test-name" class="block text-sm font-medium">Test Name</label>
          <input
            id="test-name"
            type="text"
            bind:value={newTestName}
            placeholder="e.g., Holiday Season Subject Test"
            class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="subject-a" class="block text-sm font-medium">Variant A — Subject Line</label>
            <input
              id="subject-a"
              type="text"
              bind:value={newSubjectA}
              placeholder="e.g., How was your experience?"
              class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label for="subject-b" class="block text-sm font-medium">Variant B — Subject Line</label>
            <input
              id="subject-b"
              type="text"
              bind:value={newSubjectB}
              placeholder="e.g., We value your feedback!"
              class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div>
          <label for="traffic-split" class="block text-sm font-medium">Traffic Split (% to Variant A)</label>
          <div class="mt-1 flex items-center gap-3">
            <input
              id="traffic-split"
              type="range"
              min={10}
              max={90}
              step={10}
              bind:value={newSplit}
              class="flex-1"
            />
            <span class="w-24 text-sm text-muted-foreground">A: {newSplit}% / B: {100 - newSplit}%</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick={createTest} class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Create Test
          </button>
          <button onclick={() => showCreateForm = false} class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Tests List -->
  <div class="mt-8 space-y-6">
    {#each tests as test}
      <div class="rounded-lg border p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-3">
            <FlaskConical class="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-semibold">{test.name}</h3>
                <span class="rounded-full px-2 py-0.5 text-xs font-medium {statusColors[test.status]}">{test.status}</span>
              </div>
              <p class="mt-1 text-xs text-muted-foreground">Created {test.createdAt} &middot; {test.totalSent} emails sent &middot; Split: {test.trafficSplit}/{100 - test.trafficSplit}</p>
            </div>
          </div>
          <div class="flex gap-1">
            {#if test.status !== 'completed'}
              <button onclick={() => toggleTestStatus(test.id)} class="rounded-md border p-1.5 hover:bg-muted" title={test.status === 'running' ? 'Pause' : 'Start'}>
                {#if test.status === 'running'}
                  <Pause class="h-4 w-4" />
                {:else}
                  <Play class="h-4 w-4" />
                {/if}
              </button>
            {/if}
            <button onclick={() => deleteTest(test.id)} class="rounded-md border p-1.5 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20" title="Delete">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Results Grid -->
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          {#each [{ label: 'A', variant: test.variantA, isWinner: test.winner === 'A' }, { label: 'B', variant: test.variantB, isWinner: test.winner === 'B' }] as { label, variant, isWinner }}
            <div class="rounded-md border p-4 {isWinner ? 'border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10' : ''}">
              <div class="flex items-center gap-2">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{label}</span>
                <p class="text-sm font-medium truncate">{variant.subject}</p>
                {#if isWinner}
                  <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">Winner</span>
                {/if}
              </div>
              <div class="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p class="text-lg font-bold">{variant.openRate}%</p>
                  <p class="text-xs text-muted-foreground">Open Rate</p>
                </div>
                <div>
                  <p class="text-lg font-bold">{variant.clickRate}%</p>
                  <p class="text-xs text-muted-foreground">Click Rate</p>
                </div>
                <div>
                  <p class="text-lg font-bold">{variant.completionRate}%</p>
                  <p class="text-xs text-muted-foreground">Review Done</p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}

    {#if tests.length === 0}
      <div class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <BarChart3 class="h-10 w-10 text-muted-foreground" />
        <h3 class="mt-3 font-medium">No A/B Tests Yet</h3>
        <p class="mt-1 text-sm text-muted-foreground">Create your first test to start optimizing invitation emails</p>
      </div>
    {/if}
  </div>
</div>
