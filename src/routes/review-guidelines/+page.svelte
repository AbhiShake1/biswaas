<script lang="ts">
  import { CheckCircle, XCircle, Shield, AlertTriangle, Scale, Eye } from '@lucide/svelte';
</script>

<svelte:head>
  <title>Review Guidelines — Biswaas</title>
  <meta name="description" content="Biswaas review guidelines. Learn what makes a helpful review, what content is prohibited, and how our verification process works." />
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-12">
  <h1 class="text-3xl font-bold">Review Guidelines</h1>
  <p class="mt-2 text-muted-foreground">Our guidelines help ensure reviews on Biswaas are honest, helpful, and fair. Please read these before writing a review.</p>

  <!-- What to Include -->
  <section class="mt-10">
    <div class="flex items-center gap-2">
      <CheckCircle class="h-5 w-5 text-green-500" />
      <h2 class="text-xl font-semibold">What Makes a Helpful Review</h2>
    </div>
    <ul class="mt-4 space-y-3 text-sm text-muted-foreground">
      <li class="flex gap-2"><span class="shrink-0 text-green-500">+</span> Describe your specific experience with the business (what service you used, when you visited)</li>
      <li class="flex gap-2"><span class="shrink-0 text-green-500">+</span> Be honest about both positives and negatives</li>
      <li class="flex gap-2"><span class="shrink-0 text-green-500">+</span> Include relevant details like pricing, wait times, quality of service</li>
      <li class="flex gap-2"><span class="shrink-0 text-green-500">+</span> Mention specific staff members who were helpful (first names only)</li>
      <li class="flex gap-2"><span class="shrink-0 text-green-500">+</span> Update your review if your experience changes over time</li>
      <li class="flex gap-2"><span class="shrink-0 text-green-500">+</span> Compare with similar businesses to give context</li>
    </ul>
  </section>

  <!-- Prohibited Content -->
  <section class="mt-10">
    <div class="flex items-center gap-2">
      <XCircle class="h-5 w-5 text-red-500" />
      <h2 class="text-xl font-semibold">Prohibited Content</h2>
    </div>
    <p class="mt-2 text-sm text-muted-foreground">Reviews containing the following will be removed:</p>
    <ul class="mt-4 space-y-3 text-sm text-muted-foreground">
      <li class="flex gap-2"><span class="shrink-0 text-red-500">x</span> Fake or incentivized reviews (paid reviews, reviews in exchange for discounts)</li>
      <li class="flex gap-2"><span class="shrink-0 text-red-500">x</span> Reviews from competitors or business owners reviewing themselves</li>
      <li class="flex gap-2"><span class="shrink-0 text-red-500">x</span> Hate speech, discrimination, or personal attacks</li>
      <li class="flex gap-2"><span class="shrink-0 text-red-500">x</span> Personal information (full names, phone numbers, addresses)</li>
      <li class="flex gap-2"><span class="shrink-0 text-red-500">x</span> Spam, promotional content, or irrelevant information</li>
      <li class="flex gap-2"><span class="shrink-0 text-red-500">x</span> Threats, blackmail, or extortion attempts</li>
      <li class="flex gap-2"><span class="shrink-0 text-red-500">x</span> Reviews for experiences that did not happen</li>
      <li class="flex gap-2"><span class="shrink-0 text-red-500">x</span> Obscene or sexually explicit content</li>
    </ul>
  </section>

  <!-- Verification Process -->
  <section class="mt-10">
    <div class="flex items-center gap-2">
      <Shield class="h-5 w-5 text-blue-500" />
      <h2 class="text-xl font-semibold">Verification Process</h2>
    </div>
    <div class="mt-4 space-y-4 text-sm text-muted-foreground">
      <p>Biswaas uses a multi-step verification process to ensure review authenticity:</p>
      <div class="rounded-lg border p-4 space-y-3">
        <div>
          <p class="font-medium text-foreground">1. Account Verification</p>
          <p>Reviewers must have a verified email address. Phone or social verification earns a "Verified Reviewer" badge.</p>
        </div>
        <div>
          <p class="font-medium text-foreground">2. Automated Screening</p>
          <p>Reviews are checked for spam patterns, duplicate content, and suspicious activity.</p>
        </div>
        <div>
          <p class="font-medium text-foreground">3. Community Reporting</p>
          <p>Users can flag reviews they believe violate guidelines. Flagged reviews are prioritized for manual review.</p>
        </div>
        <div>
          <p class="font-medium text-foreground">4. Manual Moderation</p>
          <p>Our team reviews flagged content and makes final decisions within 48 hours.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Dispute Process -->
  <section class="mt-10">
    <div class="flex items-center gap-2">
      <AlertTriangle class="h-5 w-5 text-yellow-500" />
      <h2 class="text-xl font-semibold">Dispute Process</h2>
    </div>
    <div class="mt-4 space-y-3 text-sm text-muted-foreground">
      <p>If you believe a review violates our guidelines, you can dispute it:</p>
      <ol class="list-decimal list-inside space-y-2 pl-2">
        <li><strong class="text-foreground">Flag the review</strong> — Click the flag icon on any review to report it.</li>
        <li><strong class="text-foreground">Provide context</strong> — Explain why you believe the review should be removed.</li>
        <li><strong class="text-foreground">Wait for review</strong> — Our moderation team will investigate within 48 hours.</li>
        <li><strong class="text-foreground">Receive outcome</strong> — You'll be notified of the decision via email.</li>
      </ol>
      <p>Business owners can also respond publicly to reviews they disagree with. This is often more effective than removal.</p>
    </div>
  </section>

  <!-- Transparency -->
  <section class="mt-10">
    <div class="flex items-center gap-2">
      <Eye class="h-5 w-5 text-primary" />
      <h2 class="text-xl font-semibold">Our Transparency Commitment</h2>
    </div>
    <div class="mt-4 space-y-3 text-sm text-muted-foreground">
      <p>Biswaas is committed to maintaining trust through transparency:</p>
      <ul class="space-y-2">
        <li>We never sell placement or allow businesses to pay for positive reviews</li>
        <li>Trust scores are calculated using a transparent algorithm based on review volume, recency, and rating distribution</li>
        <li>We publish monthly transparency reports on review removals</li>
        <li>Businesses cannot selectively hide negative reviews</li>
        <li>All review edits and deletions are logged and auditable</li>
      </ul>
    </div>
  </section>

  <!-- Contact -->
  <section class="mt-10 rounded-lg border bg-muted/30 p-6 text-center">
    <Scale class="mx-auto h-6 w-6 text-muted-foreground" />
    <h2 class="mt-2 text-lg font-semibold">Questions?</h2>
    <p class="mt-1 text-sm text-muted-foreground">If you have questions about our review guidelines, contact us at <a href="mailto:guidelines@biswaas.com" class="text-primary hover:underline">guidelines@biswaas.com</a></p>
  </section>
</div>
