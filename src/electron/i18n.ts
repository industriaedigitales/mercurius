import i18next from 'i18next';
import { app } from 'electron';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getLanguage } from './store.js';

export async function initI18n() {
  const lang = getLanguage();
  
  // Load locales using absolute paths
  const localesDir = join(app.getAppPath(), 'src', 'ui', 'shared', 'locales');
  let en = {};
  let it = {};

  try {
    const enPath = join(localesDir, 'en.json');
    if (existsSync(enPath)) {
      en = JSON.parse(readFileSync(enPath, 'utf-8'));
    }
  } catch (err) {
    console.error('Failed to load en.json locale:', err);
  }

  try {
    const itPath = join(localesDir, 'it.json');
    if (existsSync(itPath)) {
      it = JSON.parse(readFileSync(itPath, 'utf-8'));
    }
  } catch (err) {
    console.error('Failed to load it.json locale:', err);
  }

  await i18next.init({
    lng: lang,
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      it: { translation: it }
    },
    interpolation: {
      escapeValue: false
    }
  });

  return i18next;
}

export function t(key: string, options?: any) {
  return i18next.t(key, options);
}

export async function changeLanguage(lang: string) {
  await i18next.changeLanguage(lang);
}
