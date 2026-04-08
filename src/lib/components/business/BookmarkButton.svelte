<script lang="ts">
  import { Bookmark } from '@lucide/svelte';

  let { businessSlug = '' }: { businessSlug: string } = $props();

  const STORAGE_KEY = 'biswaas-bookmarks';

  function getBookmarks(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  function saveBookmarks(bookmarks: string[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }

  let isBookmarked = $state(false);

  $effect(() => {
    isBookmarked = getBookmarks().includes(businessSlug);
  });

  function toggle() {
    const bookmarks = getBookmarks();
    if (isBookmarked) {
      saveBookmarks(bookmarks.filter((s) => s !== businessSlug));
      isBookmarked = false;
    } else {
      bookmarks.push(businessSlug);
      saveBookmarks(bookmarks);
      isBookmarked = true;
    }
  }
</script>

<button
  onclick={toggle}
  class="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors {isBookmarked ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted'}"
  aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this business'}
>
  <Bookmark class="h-3.5 w-3.5 {isBookmarked ? 'fill-primary' : ''}" />
  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
</button>
