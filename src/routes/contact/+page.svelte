<script lang="ts">
  let name = $state('');
  let email = $state('');
  let message = $state('');
  let submitted = $state(false);

  function handleSubmit(e: Event) {
    e.preventDefault();
    submitted = true;
  }
</script>

<svelte:head>
  <title>Contact Us | Biswaas</title>
</svelte:head>

<div class="container mx-auto max-w-xl px-4 py-12">
  <h1 class="text-3xl font-bold">Contact Us</h1>
  <p class="mt-4 text-muted-foreground">
    Have a question, suggestion, or need help? Reach out and we'll get back to you.
  </p>

  {#if submitted}
    <div class="mt-8 rounded-md border bg-muted/50 p-6 text-center">
      <p class="text-lg font-medium">Thank you for reaching out!</p>
      <p class="mt-2 text-sm text-muted-foreground">We'll get back to you as soon as possible.</p>
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="mt-8 space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium">Name</label>
        <input
          id="name"
          type="text"
          bind:value={name}
          required
          class="mt-1 w-full rounded-md border bg-muted/50 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Your name"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          class="mt-1 w-full rounded-md border bg-muted/50 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label for="message" class="block text-sm font-medium">Message</label>
        <textarea
          id="message"
          bind:value={message}
          required
          rows={5}
          class="mt-1 w-full rounded-md border bg-muted/50 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="How can we help?"
        ></textarea>
      </div>

      <button type="submit" class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Send Message
      </button>
    </form>
  {/if}
</div>
