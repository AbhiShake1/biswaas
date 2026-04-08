/**
 * Simple dictionary-based translation utility for common review phrases.
 * Supports English (EN) <-> Nepali (NE) translations.
 * No AI API needed — uses a curated phrase dictionary.
 */

type Lang = 'en' | 'ne';

interface DictionaryEntry {
  en: string;
  ne: string;
}

const PHRASE_DICTIONARY: DictionaryEntry[] = [
  // Greetings & common phrases
  { en: 'thank you', ne: 'dhanyabad' },
  { en: 'welcome', ne: 'swagat' },
  { en: 'please', ne: 'kripaya' },

  // Review-specific phrases
  { en: 'great service', ne: 'ramro sewa' },
  { en: 'bad service', ne: 'kharab sewa' },
  { en: 'highly recommended', ne: 'dherai sifaris gariyeko' },
  { en: 'not recommended', ne: 'sifaris gardina' },
  { en: 'excellent quality', ne: 'uttam gunasthara' },
  { en: 'poor quality', ne: 'kamjor gunasthara' },
  { en: 'good food', ne: 'ramro khana' },
  { en: 'bad food', ne: 'kharab khana' },
  { en: 'friendly staff', ne: 'milansar karmachari' },
  { en: 'rude staff', ne: 'ashistha karmachari' },
  { en: 'clean place', ne: 'safa thau' },
  { en: 'dirty place', ne: 'phohor thau' },
  { en: 'good value', ne: 'ramro mulya' },
  { en: 'overpriced', ne: 'mahango' },
  { en: 'fast delivery', ne: 'chhito delivery' },
  { en: 'slow delivery', ne: 'dhilo delivery' },
  { en: 'will visit again', ne: 'pheri aaunechhu' },
  { en: 'never coming back', ne: 'pheri aaudina' },
  { en: 'best in town', ne: 'saharko sabai bhanda ramro' },
  { en: 'worst experience', ne: 'sabai bhanda naramro anubhav' },
  { en: 'on time', ne: 'samayma' },
  { en: 'late', ne: 'dhilo' },
  { en: 'professional', ne: 'byabasayik' },
  { en: 'unprofessional', ne: 'abyabasayik' },
  { en: 'very helpful', ne: 'dherai sahayogi' },
  { en: 'not helpful', ne: 'sahayogi chaina' },
  { en: 'fresh food', ne: 'taja khana' },
  { en: 'stale food', ne: 'basi khana' },
  { en: 'comfortable', ne: 'aaram dayak' },
  { en: 'uncomfortable', ne: 'aaram dayak chaina' },
  { en: 'trustworthy', ne: 'biswasaniya' },
  { en: 'honest', ne: 'imandar' },
  { en: 'affordable', ne: 'sasto' },
  { en: 'beautiful', ne: 'sundar' },

  // Rating phrases
  { en: 'five stars', ne: 'paanch tara' },
  { en: 'four stars', ne: 'char tara' },
  { en: 'three stars', ne: 'tin tara' },
  { en: 'two stars', ne: 'dui tara' },
  { en: 'one star', ne: 'ek tara' },

  // Common review words
  { en: 'good', ne: 'ramro' },
  { en: 'bad', ne: 'kharab' },
  { en: 'excellent', ne: 'uttam' },
  { en: 'terrible', ne: 'bhayankar' },
  { en: 'amazing', ne: 'adbhut' },
  { en: 'love', ne: 'maya' },
  { en: 'happy', ne: 'khushi' },
  { en: 'satisfied', ne: 'santushta' },
  { en: 'disappointed', ne: 'nirash' },
  { en: 'recommend', ne: 'sifaris' },
  { en: 'experience', ne: 'anubhav' },
  { en: 'service', ne: 'sewa' },
  { en: 'food', ne: 'khana' },
  { en: 'price', ne: 'mulya' },
  { en: 'staff', ne: 'karmachari' },
  { en: 'place', ne: 'thau' },
  { en: 'delivery', ne: 'delivery' },
  { en: 'review', ne: 'samikhya' },
  { en: 'business', ne: 'byapar' },
  { en: 'customer', ne: 'grahak' },
];

export interface TranslationResult {
  original: string;
  translated: string;
  sourceLang: Lang;
  targetLang: Lang;
  matchedPhrases: number;
  totalPhrases: number;
}

/**
 * Translate common review phrases between English and Nepali.
 * Uses longest-match-first strategy to find phrases in the dictionary.
 *
 * @param text - The text to translate
 * @param targetLang - Target language ('en' or 'ne')
 * @returns TranslationResult with the translated text and match info
 */
export function translatePhrase(text: string, targetLang: Lang): TranslationResult {
  const sourceLang: Lang = targetLang === 'en' ? 'ne' : 'en';
  let result = text.toLowerCase();
  let matchedPhrases = 0;

  // Sort dictionary by source phrase length (longest first) for greedy matching
  const sorted = [...PHRASE_DICTIONARY].sort((a, b) => b[sourceLang].length - a[sourceLang].length);

  for (const entry of sorted) {
    const sourcePhrase = entry[sourceLang].toLowerCase();
    const targetPhrase = entry[targetLang];

    if (result.includes(sourcePhrase)) {
      result = result.replaceAll(sourcePhrase, targetPhrase);
      matchedPhrases++;
    }
  }

  return {
    original: text,
    translated: result,
    sourceLang,
    targetLang,
    matchedPhrases,
    totalPhrases: PHRASE_DICTIONARY.length,
  };
}

/**
 * Get all available dictionary entries.
 */
export function getDictionary(): DictionaryEntry[] {
  return [...PHRASE_DICTIONARY];
}

/**
 * Look up a single phrase in the dictionary.
 */
export function lookupPhrase(phrase: string, sourceLang: Lang): string | null {
  const targetLang: Lang = sourceLang === 'en' ? 'ne' : 'en';
  const lower = phrase.toLowerCase();
  const entry = PHRASE_DICTIONARY.find((e) => e[sourceLang].toLowerCase() === lower);
  return entry ? entry[targetLang] : null;
}
