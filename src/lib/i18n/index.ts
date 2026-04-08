import en from './en.json';
import ne from './ne.json';

type Translations = typeof en;
const translations: Record<string, Translations> = { en, ne };

let currentLang = 'en';

export function setLanguage(lang: string) {
  currentLang = lang;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('biswaas_lang', lang);
  }
}

export function getLanguage(): string {
  return currentLang;
}

export function t(key: string): string {
  const keys = key.split('.');
  let value: any = translations[currentLang] ?? translations.en;
  for (const k of keys) {
    value = value?.[k];
  }
  return (typeof value === 'string' ? value : key);
}

export function initLanguage() {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('biswaas_lang');
    if (saved && translations[saved]) {
      currentLang = saved;
    }
  }
}
