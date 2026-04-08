interface Review {
  userId: string;
  businessId: string;
  text: string;
  rating: number;
  createdAt: Date | string;
}

/**
 * Check if a new review is too similar to existing reviews by the same user.
 * Returns true if the review is likely a duplicate.
 */
export function isDuplicateReview(reviews: Review[], newReview: Review): boolean {
  const userReviews = reviews.filter((r) => r.userId === newReview.userId);

  for (const existing of userReviews) {
    // Same business = duplicate
    if (existing.businessId === newReview.businessId) return true;

    // High text similarity
    const similarity = textSimilarity(existing.text, newReview.text);
    if (similarity > 0.8) return true;
  }

  return false;
}

/**
 * Check if text content looks like spam based on common spam patterns.
 */
export function isSpamContent(text: string): boolean {
  // Contains URLs
  const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+/i;
  if (urlPattern.test(text)) return true;

  // Mostly all-caps (over 70% of alphabetic chars)
  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 10) {
    const upperCount = (text.match(/[A-Z]/g) || []).length;
    if (upperCount / letters.length > 0.7) return true;
  }

  // Repeated characters (e.g., "aaaaaa" or "!!!!!!")
  if (/(.)\1{5,}/.test(text)) return true;

  // Very short text (less than 10 characters)
  if (text.trim().length < 10) return true;

  return false;
}

/**
 * Calculate how long a user must wait before posting another review.
 * Returns remaining cooldown in milliseconds, or 0 if allowed.
 */
export function getReviewCooldown(
  userId: string,
  lastReviewAt: Date | string | null,
  cooldownMs: number = 60 * 60 * 1000 // 1 hour default
): number {
  if (!lastReviewAt) return 0;

  const lastTime = new Date(lastReviewAt).getTime();
  const elapsed = Date.now() - lastTime;
  const remaining = cooldownMs - elapsed;

  return remaining > 0 ? remaining : 0;
}

/**
 * Simple text similarity using Jaccard index on word sets.
 */
function textSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(Boolean));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(Boolean));

  if (wordsA.size === 0 && wordsB.size === 0) return 1;
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) intersection++;
  }

  const union = wordsA.size + wordsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}
