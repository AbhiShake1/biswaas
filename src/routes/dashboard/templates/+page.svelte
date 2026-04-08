<script lang="ts">
  import { BookTemplate, Copy, Check } from '@lucide/svelte';

  interface Template {
    id: string;
    title: string;
    category: string;
    body: string;
  }

  const templates: Template[] = [
    {
      id: '1',
      title: 'Thank You',
      category: 'Positive',
      body: 'Thank you so much for your kind review! We truly appreciate you taking the time to share your experience. Your feedback motivates our team to continue delivering excellent service. We look forward to welcoming you again!',
    },
    {
      id: '2',
      title: 'Apology',
      category: 'Negative',
      body: 'We sincerely apologize for the experience you had. This is not the standard we strive for, and we take your feedback very seriously. We would love the opportunity to make things right. Please reach out to us directly so we can address your concerns.',
    },
    {
      id: '3',
      title: 'Follow-up',
      category: 'Neutral',
      body: 'Thank you for sharing your thoughts with us. We value all feedback as it helps us improve. We would love to learn more about your experience — could you share any specific details so we can better address your needs?',
    },
    {
      id: '4',
      title: 'Clarification',
      category: 'Inquiry',
      body: 'Thank you for reaching out. We would like to understand your experience better so we can provide the right solution. Could you please provide more details about the issue you faced? Our team is ready to assist you promptly.',
    },
    {
      id: '5',
      title: 'Resolution',
      category: 'Follow-up',
      body: 'We are glad to inform you that we have looked into your concern and taken steps to resolve it. We hope this addresses the issue to your satisfaction. Please do not hesitate to contact us if you need any further assistance.',
    },
  ];

  let copiedId = $state<string | null>(null);

  function useTemplate(template: Template) {
    navigator.clipboard.writeText(template.body);
    copiedId = template.id;
    setTimeout(() => { copiedId = null; }, 2000);
  }

  const categoryColor: Record<string, string> = {
    Positive: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Negative: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    Inquiry: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Follow-up': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };
</script>

<svelte:head>
  <title>Response Templates — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold flex items-center gap-2">
    <BookTemplate class="h-6 w-6" /> Review Response Templates
  </h1>
  <p class="mt-1 text-sm text-muted-foreground">Pre-built response templates to help you reply to reviews quickly and professionally.</p>

  <div class="mt-6 space-y-4">
    {#each templates as template}
      <div class="rounded-lg border p-5">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold">{template.title}</h3>
            <span class="rounded-full px-2 py-0.5 text-xs font-medium {categoryColor[template.category] ?? 'bg-muted'}">{template.category}</span>
          </div>
          <button onclick={() => useTemplate(template)}
            class="flex items-center gap-1 rounded-md {copiedId === template.id ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground'} px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-colors">
            {#if copiedId === template.id}
              <Check class="h-4 w-4" /> Copied!
            {:else}
              <Copy class="h-4 w-4" /> Use Template
            {/if}
          </button>
        </div>
        <p class="mt-3 text-sm text-muted-foreground leading-relaxed">{template.body}</p>
      </div>
    {/each}
  </div>
</div>
