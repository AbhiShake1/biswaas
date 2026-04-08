<script lang="ts">
  import { Clock } from '@lucide/svelte';

  interface DayHours {
    day: string;
    open: string;
    close: string;
    closed?: boolean;
  }

  let { hours = [] }: { hours: DayHours[] } = $props();

  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  const todayName = dayOrder[todayIndex];

  const defaultHours: DayHours[] = [
    { day: 'Sunday', open: '10:00 AM', close: '6:00 PM' },
    { day: 'Monday', open: '9:00 AM', close: '8:00 PM' },
    { day: 'Tuesday', open: '9:00 AM', close: '8:00 PM' },
    { day: 'Wednesday', open: '9:00 AM', close: '8:00 PM' },
    { day: 'Thursday', open: '9:00 AM', close: '8:00 PM' },
    { day: 'Friday', open: '9:00 AM', close: '9:00 PM' },
    { day: 'Saturday', open: '10:00 AM', close: '9:00 PM', closed: true },
  ];

  const displayHours = hours.length > 0 ? hours : defaultHours;
</script>

<div class="rounded-lg border">
  <div class="flex items-center gap-2 border-b px-4 py-3">
    <Clock class="h-4 w-4 text-muted-foreground" />
    <h3 class="font-semibold text-sm">Business Hours</h3>
  </div>
  <div class="divide-y">
    {#each displayHours as h}
      {@const isToday = h.day === todayName}
      <div class="flex items-center justify-between px-4 py-2.5 text-sm {isToday ? 'bg-primary/5 font-medium' : ''}">
        <span class="flex items-center gap-2">
          {#if isToday}
            <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
          {/if}
          {h.day}
          {#if isToday}
            <span class="text-xs text-primary">(Today)</span>
          {/if}
        </span>
        <span class="{h.closed ? 'text-red-500' : 'text-muted-foreground'}">
          {#if h.closed}
            Closed
          {:else}
            {h.open} — {h.close}
          {/if}
        </span>
      </div>
    {/each}
  </div>
</div>
