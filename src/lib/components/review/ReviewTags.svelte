<script lang="ts">
  import { Tag, Plus, X } from '@lucide/svelte';

  let { selected = $bindable<string[]>([]) }: { selected: string[] } = $props();

  const predefined = ['Service', 'Quality', 'Price', 'Location', 'Staff'];

  let customInput = $state('');
  let showCustomInput = $state(false);

  function toggle(tag: string) {
    if (selected.includes(tag)) {
      selected = selected.filter((t) => t !== tag);
    } else {
      selected = [...selected, tag];
    }
  }

  function addCustomTag() {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (allTags.includes(trimmed)) {
      // If it exists already, just select it
      if (!selected.includes(trimmed)) {
        selected = [...selected, trimmed];
      }
    } else {
      customTags = [...customTags, trimmed];
      selected = [...selected, trimmed];
    }
    customInput = '';
    showCustomInput = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
    if (e.key === 'Escape') {
      showCustomInput = false;
      customInput = '';
    }
  }

  function removeCustomTag(tag: string) {
    customTags = customTags.filter((t) => t !== tag);
    selected = selected.filter((t) => t !== tag);
  }

  let customTags = $state<string[]>([]);
  let customInputEl = $state<HTMLInputElement | null>(null);
  const allTags = $derived([...predefined, ...customTags]);

  $effect(() => {
    if (showCustomInput && customInputEl) {
      customInputEl.focus();
    }
  });
</script>

<div class="space-y-3">
  <div class="flex items-center gap-2">
    <Tag class="h-4 w-4 text-primary" />
    <h3 class="text-sm font-semibold">Review Tags</h3>
    {#if selected.length > 0}
      <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
        {selected.length} selected
      </span>
    {/if}
  </div>

  <div class="flex flex-wrap gap-2">
    {#each allTags as tag}
      {@const isSelected = selected.includes(tag)}
      {@const isCustom = customTags.includes(tag)}
      <div class="flex items-center gap-0.5">
        <button
          onclick={() => toggle(tag)}
          class="rounded-full border px-3 py-1.5 text-xs font-medium transition-all
            {isSelected
              ? 'border-primary bg-primary text-primary-foreground shadow-sm'
              : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'}"
          aria-pressed={isSelected}
        >
          {tag}
        </button>
        {#if isCustom}
          <button
            onclick={() => removeCustomTag(tag)}
            class="rounded-full p-1 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
            aria-label="Remove {tag} tag"
          >
            <X class="h-3 w-3" />
          </button>
        {/if}
      </div>
    {/each}

    {#if showCustomInput}
      <div class="flex items-center gap-1">
        <input
          type="text"
          bind:value={customInput}
          onkeydown={handleKeydown}
          placeholder="Tag name..."
          class="h-8 w-28 rounded-full border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          bind:this={customInputEl}
        />
        <button
          onclick={addCustomTag}
          class="rounded-full bg-primary p-1.5 text-primary-foreground hover:bg-primary/90"
          aria-label="Add tag"
        >
          <Plus class="h-3 w-3" />
        </button>
        <button
          onclick={() => { showCustomInput = false; customInput = ''; }}
          class="rounded-full bg-muted p-1.5 text-muted-foreground hover:bg-muted/80"
          aria-label="Cancel"
        >
          <X class="h-3 w-3" />
        </button>
      </div>
    {:else}
      <button
        onclick={() => (showCustomInput = true)}
        class="flex items-center gap-1 rounded-full border border-dashed border-muted-foreground/30 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
      >
        <Plus class="h-3 w-3" />
        Custom tag
      </button>
    {/if}
  </div>
</div>
