<script lang="ts">
  let { data } = $props();
</script>

<section class="relative overflow-hidden px-4 py-16 md:py-24">
  <div class="absolute left-[10%] top-[-4rem] h-40 w-40 rounded-full bg-[var(--theme-orange)]"></div>
  <div class="absolute bottom-8 left-[-2rem] h-24 w-40 rounded-tr-[2rem] rounded-br-[4rem] rounded-tl-[4rem] bg-[var(--theme-yellow)]"></div>
  <div class="absolute bottom-10 right-[-3rem] h-24 w-64 rounded-tl-[3rem] bg-[var(--theme-green)]"></div>

  <div class="relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_26rem]">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--theme-blue)]">Access your trust workspace</p>
      <h1 class="mt-4 max-w-2xl text-5xl font-extrabold tracking-[-0.07em] text-foreground md:text-6xl">
        Sign in to keep writing
        <br />
        trusted local reviews.
      </h1>
      <p class="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
        Continue into Biswaas to reply to comments, submit reviews, and carry your identity through the live trust flow.
      </p>
    </div>

    <div class="surface-panel w-full rounded-[2rem] p-8 shadow-[0_22px_50px_-28px_rgba(23,23,23,0.3)]">
      <div class="text-center">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--theme-green)] text-lg font-bold text-[var(--theme-ink)]">
          बि
        </div>
        <h2 class="mt-5 text-2xl font-bold text-foreground">Sign in to Biswaas</h2>
        <p class="mt-2 text-sm text-muted-foreground">Nepal’s trust and review platform.</p>
      </div>

      <a
        href={data.signInUrl}
        data-testid="workos-sign-in"
        class="mt-8 flex w-full items-center justify-center rounded-full bg-[var(--theme-blue)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_-20px_rgba(75,97,209,0.68)] hover:-translate-y-0.5"
      >
        Continue with WorkOS
      </a>

      {#if data.isDevMode}
        <p class="mt-4 text-center text-xs leading-5 text-muted-foreground">
          Demo mode is active. This signs you in with the repository’s local WorkOS test user for verification.
        </p>
      {/if}
    </div>
  </div>
</section>
