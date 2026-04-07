// TrustScore algorithm — Bayesian average with recency weighting
const PHANTOM_COUNT = 7;
const PHANTOM_RATING = 3.5;
const HALF_LIFE_MS = 180 * 24 * 60 * 60 * 1000; // 180 days

interface ReviewInput {
  stars: number;
  createdAt: number;
}

export function calculateTrustScore(reviews: ReviewInput[]): {
  trustScore: number;
  starRating: number;
  ratingDistribution: { one: number; two: number; three: number; four: number; five: number };
} {
  const now = Date.now();
  let weightedSum = PHANTOM_COUNT * PHANTOM_RATING;
  let totalWeight = PHANTOM_COUNT;
  const dist = { one: 0, two: 0, three: 0, four: 0, five: 0 };
  const distKeys = ["one", "two", "three", "four", "five"] as const;

  for (const review of reviews) {
    const ageMs = now - review.createdAt;
    const recencyWeight = Math.pow(0.5, ageMs / HALF_LIFE_MS);
    weightedSum += review.stars * recencyWeight;
    totalWeight += recencyWeight;
    dist[distKeys[review.stars - 1]]++;
  }

  const trustScore = Math.round((weightedSum / totalWeight) * 10) / 10;
  const starRating = Math.round(trustScore);

  return { trustScore, starRating, ratingDistribution: dist };
}
