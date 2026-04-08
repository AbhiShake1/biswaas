/**
 * Simple keyword-based sentiment analysis for review text.
 * No AI API needed — uses curated positive/negative keyword lists.
 */

const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome',
  'love', 'loved', 'best', 'perfect', 'happy', 'satisfied', 'recommend',
  'professional', 'friendly', 'helpful', 'reliable', 'quality', 'outstanding',
  'superb', 'exceptional', 'brilliant', 'impressive', 'delightful', 'pleasant',
  'clean', 'fast', 'quick', 'efficient', 'beautiful', 'nice', 'polite',
  'trustworthy', 'honest', 'genuine', 'worth', 'affordable', 'convenient',
  // Nepali transliterations
  'ramro', 'dherai', 'mitho', 'sahi', 'babal', 'jhyap', 'sundar',
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'horrible', 'awful', 'worst', 'poor', 'disappointing',
  'disappointed', 'rude', 'slow', 'expensive', 'overpriced', 'dirty', 'broken',
  'scam', 'fraud', 'fake', 'waste', 'never', 'avoid', 'unprofessional',
  'unreliable', 'dishonest', 'terrible', 'pathetic', 'useless', 'mediocre',
  'delayed', 'cold', 'stale', 'rotten', 'damaged', 'defective', 'unfriendly',
  'disrespectful', 'overcharged', 'ignored', 'unresponsive', 'complaint',
  // Nepali transliterations
  'kharab', 'naramro', 'bekkar', 'testo', 'namilne',
]);

const NEGATION_WORDS = new Set([
  'not', 'no', 'never', 'neither', 'nor', "don't", "doesn't", "didn't",
  "won't", "wouldn't", "couldn't", "shouldn't", "isn't", "aren't", "wasn't",
]);

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0.0 - 1.0
  positiveCount: number;
  negativeCount: number;
}

/**
 * Analyze sentiment of text using keyword matching.
 *
 * @param text - The review text to analyze
 * @returns SentimentResult with sentiment label and confidence score
 */
export function analyzeSentiment(text: string): SentimentResult {
  const words = text.toLowerCase().replace(/[^a-z'\s-]/g, '').split(/\s+/).filter(Boolean);

  let positiveCount = 0;
  let negativeCount = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = i > 0 ? words[i - 1] : '';
    const isNegated = NEGATION_WORDS.has(prevWord);

    if (POSITIVE_WORDS.has(word)) {
      if (isNegated) {
        negativeCount++;
      } else {
        positiveCount++;
      }
    } else if (NEGATIVE_WORDS.has(word)) {
      if (isNegated) {
        positiveCount++;
      } else {
        negativeCount++;
      }
    }
  }

  const total = positiveCount + negativeCount;

  if (total === 0) {
    return { sentiment: 'neutral', confidence: 0.5, positiveCount: 0, negativeCount: 0 };
  }

  const positiveRatio = positiveCount / total;
  const negativeRatio = negativeCount / total;

  let sentiment: 'positive' | 'negative' | 'neutral';
  let confidence: number;

  if (positiveRatio > 0.6) {
    sentiment = 'positive';
    confidence = Math.min(0.5 + (positiveRatio - 0.5) * (total / 5), 1.0);
  } else if (negativeRatio > 0.6) {
    sentiment = 'negative';
    confidence = Math.min(0.5 + (negativeRatio - 0.5) * (total / 5), 1.0);
  } else {
    sentiment = 'neutral';
    confidence = 0.5 - Math.abs(positiveRatio - negativeRatio) * 0.3;
  }

  // Clamp confidence
  confidence = Math.max(0, Math.min(1, Number(confidence.toFixed(2))));

  return { sentiment, confidence, positiveCount, negativeCount };
}
