<script lang="ts">
  import { Download, FileSpreadsheet, Calendar } from '@lucide/svelte';

  let dateFrom = $state('2025-01-01');
  let dateTo = $state('2025-12-31');

  function downloadCsv(filename: string, headers: string[], rows: string[][]) {
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportReviews() {
    downloadCsv('biswaas-reviews.csv',
      ['Review ID', 'Author', 'Rating', 'Title', 'Body', 'Date'],
      [
        ['REV001', 'Ram Bahadur', '5', 'Excellent service', 'Very professional team', '2025-03-15'],
        ['REV002', 'Sita Kumari', '4', 'Good experience', 'Helped with university admission', '2025-03-10'],
        ['REV003', 'Hari Prasad', '3', 'Average', 'Could improve response time', '2025-02-28'],
        ['REV004', 'Gita Sharma', '5', 'Highly recommend', 'Best consultancy in Kathmandu', '2025-02-20'],
        ['REV005', 'Krishna Oli', '2', 'Disappointing', 'Delayed processing of my documents', '2025-01-15'],
      ]
    );
  }

  function exportBusinessData() {
    downloadCsv('biswaas-business-data.csv',
      ['Metric', 'Value', 'Period'],
      [
        ['Total Reviews', '156', dateFrom + ' to ' + dateTo],
        ['Average Rating', '4.2', dateFrom + ' to ' + dateTo],
        ['Response Rate', '78%', dateFrom + ' to ' + dateTo],
        ['Profile Views', '2340', dateFrom + ' to ' + dateTo],
        ['Trust Score', '4.2/5', dateFrom + ' to ' + dateTo],
      ]
    );
  }
</script>

<svelte:head>
  <title>Export Data — Biswaas</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold flex items-center gap-2">
    <FileSpreadsheet class="h-6 w-6" /> Export Data
  </h1>
  <p class="mt-1 text-sm text-muted-foreground">Download your business data and reviews as CSV files.</p>

  <!-- Date Range -->
  <div class="mt-6 rounded-lg border p-4">
    <div class="flex items-center gap-2 mb-3">
      <Calendar class="h-4 w-4 text-muted-foreground" />
      <h3 class="font-medium">Date Range</h3>
    </div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div>
        <label for="date-from" class="block text-xs text-muted-foreground mb-1">From</label>
        <input id="date-from" type="date" bind:value={dateFrom}
          class="rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
      </div>
      <div>
        <label for="date-to" class="block text-xs text-muted-foreground mb-1">To</label>
        <input id="date-to" type="date" bind:value={dateTo}
          class="rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
      </div>
    </div>
  </div>

  <!-- Export Buttons -->
  <div class="mt-6 grid gap-4 sm:grid-cols-2">
    <div class="rounded-lg border p-6 text-center">
      <Download class="mx-auto h-10 w-10 text-primary" />
      <h3 class="mt-3 font-semibold">Export Reviews</h3>
      <p class="mt-1 text-sm text-muted-foreground">Download all reviews with ratings, authors, and dates.</p>
      <button onclick={exportReviews}
        class="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        <FileSpreadsheet class="h-4 w-4" /> Export Reviews (CSV)
      </button>
    </div>

    <div class="rounded-lg border p-6 text-center">
      <Download class="mx-auto h-10 w-10 text-primary" />
      <h3 class="mt-3 font-semibold">Export Business Data</h3>
      <p class="mt-1 text-sm text-muted-foreground">Download business metrics, trust score, and analytics.</p>
      <button onclick={exportBusinessData}
        class="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        <FileSpreadsheet class="h-4 w-4" /> Export Business Data (CSV)
      </button>
    </div>
  </div>
</div>
