interface Review {
  userId: string;
  businessId: string;
  text: string;
  rating: number;
  createdAt: Date | string;
}

interface AnalysisResult {
  score: number; // 0-1 suspicion score (higher = more suspicious)
  flags: string[];
}

/**
 * Analyze a set of reviews from a single user to detect fake review patterns.
 * Returns a suspicion score (0-1) and list of flags.
 */
export function analyzeReviewPattern(reviews: Review[]): AnalysisResult {
  const flags: string[] = [];
  let score = 0;

  if (reviews.length < 2) {
    return { score: 0, flags: [] };
  }

  // 1. Posting frequency — many reviews in short period
  const frequencyScore = analyzeFrequency(reviews);
  if (frequencyScore > 0.5) {
    flags.push('High posting frequency detected');
  }
  score += frequencyScore * 0.3;

  // 2. Rating distribution deviation — all 5s or all 1s
  const ratingScore = analyzeRatingDistribution(reviews);
  if (ratingScore > 0.5) {
    flags.push('Extreme rating distribution');
  }
  score += ratingScore * 0.25;

  // 3. Text length consistency — all reviews suspiciously similar length
  const lengthScore = analyzeTextLengthConsistency(reviews);
  if (lengthScore > 0.5) {
    flags.push('Suspiciously consistent review lengths');
  }
  score += lengthScore * 0.2;

  // 4. Time-of-day patterns — all reviews posted at same time
  const timeScore = analyzeTimeOfDay(reviews);
  if (timeScore > 0.5) {
    flags.push('Unusual time-of-day pattern');
  }
  score += timeScore * 0.25;

  return { score: Math.min(1, score), flags };
}

function analyzeFrequency(reviews: Review[]): number {
  const timestamps = reviews
    .map((r) => new Date(r.createdAt).getTime())
    .sort((a, b) => a - b);

  const gaps: number[] = [];
  for (let i = 1; i < timestamps.length; i++) {
    gaps.push(timestamps[i] - timestamps[i - 1]);
  }

  if (gaps.length === 0) return 0;

  const avgGapHours = gaps.reduce((a, b) => a + b, 0) / gaps.length / (1000 * 60 * 60);

  // Less than 1 hour average between reviews is very suspicious
  if (avgGapHours < 1) return 1;
  if (avgGapHours < 6) return 0.7;
  if (avgGapHours < 24) return 0.3;
  return 0;
}

function analyzeRatingDistribution(reviews: Review[]): number {
  const ratings = reviews.map((r) => r.rating);
  const uniqueRatings = new Set(ratings);

  // All same rating
  if (uniqueRatings.size === 1 && reviews.length >= 3) {
    const rating = ratings[0];
    // All 5s or all 1s is more suspicious than all 3s
    if (rating === 5 || rating === 1) return 1;
    return 0.5;
  }

  // Calculate standard deviation
  const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  const variance = ratings.reduce((sum, r) => sum + (r - avg) ** 2, 0) / ratings.length;
  const stddev = Math.sqrt(variance);

  // Very low standard deviation with many reviews is suspicious
  if (stddev < 0.5 && reviews.length >= 5) return 0.7;
  return 0;
}

function analyzeTextLengthConsistency(reviews: Review[]): number {
  const lengths = reviews.map((r) => r.text.length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;

  if (avg === 0) return 0;

  const variance = lengths.reduce((sum, l) => sum + (l - avg) ** 2, 0) / lengths.length;
  const coeffOfVariation = Math.sqrt(variance) / avg;

  // Very low variation in text length is suspicious
  if (coeffOfVariation < 0.1 && reviews.length >= 3) return 0.8;
  if (coeffOfVariation < 0.2 && reviews.length >= 5) return 0.5;
  return 0;
}

function analyzeTimeOfDay(reviews: Review[]): number {
  const hours = reviews.map((r) => new Date(r.createdAt).getHours());
  const uniqueHours = new Set(hours);

  // All reviews at the exact same hour
  if (uniqueHours.size === 1 && reviews.length >= 3) return 0.8;

  // Reviews within a 2-hour window
  const sorted = [...hours].sort((a, b) => a - b);
  const range = sorted[sorted.length - 1] - sorted[0];
  if (range <= 2 && reviews.length >= 4) return 0.6;

  return 0;
}
