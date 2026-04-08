<script lang="ts">
  import { ThumbsUp, ThumbsDown } from '@lucide/svelte';

  let { reviewId = '' }: { reviewId: string } = $props();

  type VoteState = { up: number; down: number; userVote: 'up' | 'down' | null };

  function loadVotes(): VoteState {
    if (typeof window === 'undefined') return { up: 0, down: 0, userVote: null };
    try {
      const stored = localStorage.getItem(`biswaas-votes-${reviewId}`);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return { up: 0, down: 0, userVote: null };
  }

  function saveVotes(state: VoteState) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`biswaas-votes-${reviewId}`, JSON.stringify(state));
  }

  let votes = $state<VoteState>(loadVotes());

  function vote(direction: 'up' | 'down') {
    const prev = votes.userVote;

    if (prev === direction) {
      // Un-vote
      votes = {
        up: votes.up - (direction === 'up' ? 1 : 0),
        down: votes.down - (direction === 'down' ? 1 : 0),
        userVote: null,
      };
    } else {
      // Switch or new vote
      votes = {
        up: votes.up + (direction === 'up' ? 1 : 0) - (prev === 'up' ? 1 : 0),
        down: votes.down + (direction === 'down' ? 1 : 0) - (prev === 'down' ? 1 : 0),
        userVote: direction,
      };
    }

    saveVotes(votes);
  }
</script>

<div class="flex items-center gap-3 text-sm">
  <span class="text-xs text-muted-foreground">Helpful?</span>

  <button
    onclick={() => vote('up')}
    class="flex items-center gap-1 rounded-md px-2 py-1 transition-colors {votes.userVote === 'up'
      ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
    aria-label="Mark review as helpful"
    aria-pressed={votes.userVote === 'up'}
  >
    <ThumbsUp class="h-3.5 w-3.5" />
    <span class="text-xs font-medium">{votes.up}</span>
  </button>

  <button
    onclick={() => vote('down')}
    class="flex items-center gap-1 rounded-md px-2 py-1 transition-colors {votes.userVote === 'down'
      ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
    aria-label="Mark review as not helpful"
    aria-pressed={votes.userVote === 'down'}
  >
    <ThumbsDown class="h-3.5 w-3.5" />
    <span class="text-xs font-medium">{votes.down}</span>
  </button>
</div>
