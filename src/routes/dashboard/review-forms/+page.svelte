<script lang="ts">
  import { ClipboardList, ToggleLeft, ToggleRight } from '@lucide/svelte';

  interface Template {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    questions: { label: string; type: string }[];
  }

  let templates = $state<Template[]>([
    {
      id: 'restaurant',
      name: 'Restaurant',
      description: 'Collect feedback on food quality, service, and ambiance.',
      enabled: true,
      questions: [
        { label: 'How was the food quality?', type: 'rating' },
        { label: 'Rate the service speed', type: 'rating' },
        { label: 'Ambiance & cleanliness', type: 'rating' },
        { label: 'Would you recommend us to friends?', type: 'yes_no' },
        { label: 'Any dish you particularly enjoyed?', type: 'text' },
      ],
    },
    {
      id: 'education',
      name: 'Education',
      description: 'Gather student and parent feedback on courses and staff.',
      enabled: false,
      questions: [
        { label: 'Quality of instruction', type: 'rating' },
        { label: 'Course material relevance', type: 'rating' },
        { label: 'Support from staff', type: 'rating' },
        { label: 'Would you enroll again?', type: 'yes_no' },
        { label: 'Suggestions for improvement', type: 'text' },
      ],
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'Patient experience feedback for clinics and hospitals.',
      enabled: false,
      questions: [
        { label: 'Wait time experience', type: 'rating' },
        { label: 'Doctor communication', type: 'rating' },
        { label: 'Facility cleanliness', type: 'rating' },
        { label: 'Was your issue resolved?', type: 'yes_no' },
        { label: 'Additional comments', type: 'text' },
      ],
    },
  ]);

  function toggleTemplate(id: string) {
    templates = templates.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t);
  }

  const typeLabel: Record<string, string> = {
    rating: 'Star Rating',
    yes_no: 'Yes / No',
    text: 'Free Text',
  };
</script>

<svelte:head>
  <title>Custom Review Forms — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold flex items-center gap-2">
    <ClipboardList class="h-6 w-6" /> Custom Review Forms
  </h1>
  <p class="mt-1 text-sm text-muted-foreground">Choose a template or customize review questions for your business.</p>

  <div class="mt-6 space-y-6">
    {#each templates as template}
      <div class="rounded-lg border {template.enabled ? 'border-primary/50 bg-primary/5' : ''}">
        <div class="flex items-center justify-between p-4">
          <div>
            <h3 class="font-semibold">{template.name} Template</h3>
            <p class="mt-0.5 text-sm text-muted-foreground">{template.description}</p>
          </div>
          <button onclick={() => toggleTemplate(template.id)}
            class="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors {template.enabled ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}">
            {#if template.enabled}
              <ToggleRight class="h-6 w-6" /> Enabled
            {:else}
              <ToggleLeft class="h-6 w-6" /> Disabled
            {/if}
          </button>
        </div>

        <div class="border-t px-4 py-3">
          <h4 class="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Questions</h4>
          <div class="space-y-2">
            {#each template.questions as q, i}
              <div class="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
                <span>{i + 1}. {q.label}</span>
                <span class="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{typeLabel[q.type] ?? q.type}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
