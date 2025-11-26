import React from 'react';
import { SideNavBar } from '../components/SideNavBar';

export function SettingsScreen() {
  return (
    <div className="flex min-h-full w-full bg-background-light dark:bg-background-dark font-display">
      <SideNavBar />
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-3xl">
          <header className="mb-10 flex flex-col items-start gap-2">
            <h1 className="text-4xl font-black tracking-[-0.033em] text-black dark:text-white">Settings</h1>
            <p className="text-base font-normal text-black/60 dark:text-white/60">Manage your application preferences</p>
          </header>
          
          <div className="flex flex-col gap-8">
            <section>
              <div className="pt-6">
                <div className="flex flex-wrap items-end gap-4">
                  <label className="flex flex-1 flex-col min-w-80">
                    <p className="pb-2 text-base font-medium text-black dark:text-white text-left">Default Save Location</p>
                    <div className="flex w-full flex-1 items-stretch">
                      <input className="form-input h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l border border-black/20 bg-black/5 p-4 text-base font-normal text-black placeholder:text-black/50 focus:border-primary focus:outline-0 focus:ring-0 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/50" readOnly value="/Users/alexgreen/Downloads/FileDrop"/>
                      <div className="flex items-center justify-center border border-l-0 border-black/20 bg-black/5 pr-4 dark:border-white/20 dark:bg-white/5">
                        <span className="material-symbols-outlined text-black/60 dark:text-white/60">folder_open</span>
                      </div>
                    </div>
                  </label>
                  <button className="h-14 rounded border border-black/20 bg-black/5 px-6 text-sm font-medium text-black hover:bg-black/10 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                    Browse
                  </button>
                </div>
                <p className="pt-2 text-left text-sm font-normal text-black/60 dark:text-white/60">This is where all your received files will be saved.</p>
              </div>
            </section>
          </div>
          
          <div className="mt-12 flex justify-end gap-4 border-t border-black/10 pt-6 dark:border-white/10">
            <button className="rounded bg-black/5 px-6 py-3 text-sm font-medium text-black hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">Cancel</button>
            <button className="rounded bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50" disabled>Save Changes</button>
          </div>
        </div>
      </main>
    </div>
  );
}
