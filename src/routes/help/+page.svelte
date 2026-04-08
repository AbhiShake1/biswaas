<script lang="ts">
  import { ChevronDown } from '@lucide/svelte';

  const faqs = [
    {
      question: 'What is Biswaas?',
      answer: 'Biswaas (विश्वास) is Nepal\'s trust and review platform. It helps consumers share authentic experiences with local businesses and make informed decisions based on real reviews.',
    },
    {
      question: 'How do I write a review?',
      answer: 'Sign in to your account, search for the business you want to review, and click "Write a Review". Rate the business from 1-5 stars and share your experience. Make sure to follow our review guidelines.',
    },
    {
      question: 'Is it free to use Biswaas?',
      answer: 'Yes! Biswaas is completely free for consumers. You can browse businesses, read reviews, and write your own reviews at no cost.',
    },
    {
      question: 'How do trust scores work?',
      answer: 'Trust scores are calculated based on the overall rating, number of reviews, recency of reviews, and reviewer credibility. The score ranges from 1 to 5 and is updated in real-time.',
    },
    {
      question: 'Can businesses respond to reviews?',
      answer: 'Yes! Business owners who have claimed their profile can respond to reviews directly on the platform. This helps maintain a fair dialogue between businesses and customers.',
    },
    {
      question: 'How do I claim my business profile?',
      answer: 'Visit the business page and click "Claim this Business". You will need to verify your ownership through email or phone verification. Once verified, you can manage your profile and respond to reviews.',
    },
    {
      question: 'What if I see a fake review?',
      answer: 'Click the "Report" button on the review. Our moderation team reviews all reports and removes content that violates our guidelines. We take fake reviews very seriously.',
    },
    {
      question: 'How do I delete my account?',
      answer: 'Go to your account settings and select "Delete Account". You can also email us at privacy@biswaas.com. Note that your published reviews may be anonymized but retained on the platform.',
    },
    {
      question: 'What categories of businesses are covered?',
      answer: 'We cover a wide range including education consultancies, e-commerce, trekking & tourism, ISPs & telecom, hospitals & healthcare, restaurants, banks, and many more Nepali business sectors.',
    },
    {
      question: 'How can I contact Biswaas support?',
      answer: 'Visit our contact page or email hello@biswaas.com. We typically respond within 24 hours on business days.',
    },
  ];

  let openIndex = $state<number | null>(null);

  function toggle(index: number) {
    openIndex = openIndex === index ? null : index;
  }
</script>

<svelte:head>
  <title>Help Center | Biswaas</title>
  <meta name="description" content="Frequently asked questions about Biswaas, Nepal's trust and review platform." />
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-12">
  <h1 class="text-3xl font-bold">Help Center</h1>
  <p class="mt-4 text-muted-foreground">
    Find answers to commonly asked questions about Biswaas.
  </p>

  <div class="mt-8 divide-y rounded-lg border">
    {#each faqs as faq, i}
      <div>
        <button
          onclick={() => toggle(i)}
          class="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium hover:bg-muted/50"
          aria-expanded={openIndex === i}
        >
          {faq.question}
          <ChevronDown class="h-4 w-4 shrink-0 text-muted-foreground transition-transform {openIndex === i ? 'rotate-180' : ''}" />
        </button>
        {#if openIndex === i}
          <div class="px-6 pb-4 text-sm text-muted-foreground">
            {faq.answer}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
