import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SideNavBar } from '../components/SideNavBar';
import { TopNavBar } from '../components/TopNavBar';
import { Link } from 'react-router-dom';

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
    <div className="flex h-screen w-full flex-col bg-background-dark tech-grid-bg font-display overflow-hidden">
      <TopNavBar>
        <Link to="/" className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-all active:scale-95 no-drag">
          <span className="material-symbols-outlined text-white text-xl">close</span>
        </Link>
      </TopNavBar>
      <div className="flex flex-1 overflow-hidden pt-[72px]">
        <SideNavBar />
        <main className="flex-1 overflow-y-auto p-12">
        <div className="mx-auto max-w-3xl">
          <header className="mb-12 flex flex-col items-start gap-3">
            <h1 className="text-5xl font-black tracking-tight text-accent-gradient">{t('settings.title')}</h1>
            <p className="text-lg font-medium text-text-medium opacity-80">{t('settings.subtitle')}</p>
          </header>
          
          <div className="flex flex-col gap-10">
            <section className="glass-panel p-8 rounded-xl">
              <div className="">
                <div className="flex flex-wrap items-end gap-5">
                  <label className="flex flex-1 flex-col min-w-80">
                    <p className="pb-3 text-sm font-black uppercase tracking-widest text-text-medium opacity-60 text-left">{t('settings.defaultSaveLocation')}</p>
                    <div className="flex w-full flex-1 items-stretch group">
                      <input 
                        className="form-input h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-xl glass-border bg-white/5 p-4 text-base font-bold text-white placeholder:text-white/20 focus:border-primary focus:outline-0 focus:ring-0 group-hover:bg-white/10 transition-colors" 
                        readOnly 
                        value={uploadDirectory}
                      />
                      <div className="flex items-center justify-center border-y border-r glass-border bg-white/5 px-4 rounded-r-xl group-hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-text-medium opacity-60">folder</span>
                      </div>
                    </div>
                  </label>
                  <button 
                    onClick={handleBrowse}
                    className="rounded-xl bg-primary px-8 h-14 text-sm font-black uppercase tracking-widest text-white hover:bg-primary-light transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] active:scale-95 disabled:cursor-not-allowed cursor-pointer disabled:opacity-50"
                  >
                    {t('common.browse')}
                  </button>
                </div>
                <p className="pt-3 text-left text-xs font-medium text-text-medium opacity-60">{t('settings.saveLocationHelp')}</p>
              </div>
            </section>

            {/* Language Section */}
            <section className="glass-panel p-8 rounded-xl">
              <p className="pb-4 text-sm font-black uppercase tracking-widest text-text-medium opacity-60 text-left">{t('settings.selectLanguage')}</p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <select
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    className="flex h-14 w-full max-w-[480px] items-center rounded-xl glass-border bg-white/5 px-4 text-base font-bold text-white focus:border-primary focus:outline-none hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <option value="en" className="bg-background-dark">{t('settings.english')}</option>
                    <option value="it" className="bg-background-dark">{t('settings.italian')}</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
