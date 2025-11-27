import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SideNavBar } from '../components/SideNavBar';

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [uploadDirectory, setUploadDirectory] = useState<string>("");

  useEffect(() => {
    window.electron.getUploadDirectory().then(setUploadDirectory);
  }, []);

  const handleBrowse = async () => {
    const dir = await window.electron.selectDirectory();
    if (dir) {
      setUploadDirectory(dir);
    }
  };

  return (
    <div className="flex min-h-full w-full bg-background-light dark:bg-background-dark font-display">
      <SideNavBar />
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-3xl">
          <header className="mb-10 flex flex-col items-start gap-2">
            <h1 className="text-4xl font-black tracking-[-0.033em] text-black dark:text-white">{t('settings.title')}</h1>
            <p className="text-base font-normal text-black/60 dark:text-white/60">{t('settings.subtitle')}</p>
          </header>
          
          <div className="flex flex-col gap-8">
            <section>
              <div className="pt-6">
                <div className="flex flex-wrap items-end gap-4">
                  <label className="flex flex-1 flex-col min-w-80">
                    <p className="pb-2 text-base font-medium text-black dark:text-white text-left">{t('settings.defaultSaveLocation')}</p>
                    <div className="flex w-full flex-1 items-stretch">
                      <input 
                        className="form-input h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l border border-black/20 bg-black/5 p-4 text-base font-normal text-black placeholder:text-black/50 focus:border-primary focus:outline-0 focus:ring-0 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/50" 
                        readOnly 
                        value={uploadDirectory}
                      />
                      <div className="flex items-center justify-center border border-l-0 border-black/20 bg-black/5 pr-4 dark:border-white/20 dark:bg-white/5">
                        <span className="material-symbols-outlined text-black/60 dark:text-white/60">folder</span>
                      </div>
                    </div>
                  </label>
                  <button 
                    onClick={handleBrowse}
                    className="rounded bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed cursor-pointer disabled:opacity-50"
                  >
                    {t('common.browse')}
                  </button>
                </div>
                <p className="pt-2 text-left text-sm font-normal text-black/60 dark:text-white/60">{t('settings.saveLocationHelp')}</p>
              </div>
            </section>

            {/* Language Section */}
            <section>
              <h2 className="text-xl font-bold leading-tight text-black dark:text-white">{t('settings.language')}</h2>
              <p className="pb-2 text-base font-medium text-black dark:text-white text-left">{t('settings.selectLanguage')}</p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <select
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    className="flex h-14 w-full max-w-[480px] items-center rounded-xl border border-black/10 bg-white px-4 text-base font-medium text-black focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    <option value="en">{t('settings.english')}</option>
                    <option value="it">{t('settings.italian')}</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
