/**
 * Biswaas Browser Extension — Content Script
 *
 * Injects Biswaas trust scores next to Google search results.
 * This is a standalone file, not part of the SvelteKit build.
 *
 * How it works:
 * 1. Scans Google search result links for business names
 * 2. Queries the Biswaas API for trust scores
 * 3. Injects a small badge next to matching results
 */

const BISWAAS_API_BASE = 'https://biswaas.com/api';
const CACHE_KEY = 'biswaas_trust_cache';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Get cached trust scores from session storage.
 */
function getCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const now = Date.now();
    // Purge expired entries
    for (const key of Object.keys(parsed)) {
      if (now - parsed[key].timestamp > CACHE_TTL_MS) {
        delete parsed[key];
      }
    }
    return parsed;
  } catch {
    return {};
  }
}

/**
 * Save trust score to cache.
 */
function setCache(businessName, data) {
  try {
    const cache = getCache();
    cache[businessName] = { ...data, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Session storage full or unavailable — ignore
  }
}

/**
 * Fetch trust score from Biswaas API.
 * Returns null if business not found.
 */
async function fetchTrustScore(businessName) {
  const cache = getCache();
  if (cache[businessName]) {
    return cache[businessName];
  }

  try {
    const url = `${BISWAAS_API_BASE}/trust-score?q=${encodeURIComponent(businessName)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data && typeof data.score === 'number') {
      setCache(businessName, data);
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Create the trust score badge element.
 */
function createBadge(score, reviewCount) {
  const badge = document.createElement('span');
  badge.className = 'biswaas-trust-badge';

  // Determine color based on score
  let color;
  let label;
  if (score >= 80) {
    color = '#16a34a'; // green
    label = 'Highly Trusted';
  } else if (score >= 60) {
    color = '#ca8a04'; // yellow
    label = 'Trusted';
  } else if (score >= 40) {
    color = '#ea580c'; // orange
    label = 'Mixed';
  } else {
    color = '#dc2626'; // red
    label = 'Low Trust';
  }

  badge.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: ${color}15;
    color: ${color};
    border: 1px solid ${color}30;
    margin-left: 8px;
    cursor: pointer;
    text-decoration: none;
    vertical-align: middle;
  `;

  // Shield icon (SVG inline)
  const icon = document.createElement('span');
  icon.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
  icon.style.display = 'inline-flex';

  const text = document.createElement('span');
  text.textContent = `${score}/100`;

  const reviews = document.createElement('span');
  reviews.textContent = `(${reviewCount} reviews)`;
  reviews.style.cssText = 'font-weight: 400; opacity: 0.8; font-size: 11px;';

  badge.appendChild(icon);
  badge.appendChild(text);
  badge.appendChild(reviews);
  badge.title = `Biswaas Trust Score: ${score}/100 — ${label}`;

  return badge;
}

/**
 * Extract business name from a search result element.
 */
function extractBusinessName(resultElement) {
  const heading = resultElement.querySelector('h3');
  if (!heading) return null;

  let name = heading.textContent || '';
  // Remove common suffixes like " - Google Maps", " | Facebook", etc.
  name = name.replace(/\s*[-|]\s*(Google Maps|Facebook|TripAdvisor|Yelp|Wikipedia).*$/i, '');
  name = name.trim();

  return name.length > 2 ? name : null;
}

/**
 * Process all search results on the page.
 */
async function processSearchResults() {
  // Google search result containers
  const results = document.querySelectorAll('#search .g, #rso .g');

  for (const result of results) {
    // Skip if already processed
    if (result.querySelector('.biswaas-trust-badge')) continue;

    const businessName = extractBusinessName(result);
    if (!businessName) continue;

    const data = await fetchTrustScore(businessName);
    if (!data) continue;

    const heading = result.querySelector('h3');
    if (heading && heading.parentElement) {
      const badge = createBadge(data.score, data.reviewCount || 0);
      badge.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(`https://biswaas.com/business/${data.slug || ''}`, '_blank');
      });
      heading.parentElement.appendChild(badge);
    }
  }
}

// Run on page load
processSearchResults();

// Re-run when Google loads more results (infinite scroll / pagination)
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      processSearchResults();
      break;
    }
  }
});

const searchContainer = document.querySelector('#search') || document.querySelector('#rso');
if (searchContainer) {
  observer.observe(searchContainer, { childList: true, subtree: true });
}
