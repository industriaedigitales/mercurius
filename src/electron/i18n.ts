import i18next from 'i18next';
import { app } from 'electron';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getLanguage } from './store.js';

export async function initI18n() {
  const lang = getLanguage();
  
  // Load locales using absolute paths to avoid issues with transpiled relative paths
  const localesDir = join(app.getAppPath(), 'src/ui/shared/locales');
  const en = JSON.parse(readFileSync(join(localesDir, 'en.json'), 'utf-8'));
  const it = JSON.parse(readFileSync(join(localesDir, 'it.json'), 'utf-8'));

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
