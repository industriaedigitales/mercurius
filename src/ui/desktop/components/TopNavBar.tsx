import React from 'react';
import desktopIcon from '../../shared/assets/desktopIcon.png';
import { useTranslation } from 'react-i18next';

interface TopNavBarProps {
  children?: React.ReactNode;
}

export function TopNavBar({ children }: TopNavBarProps) {
  const { t } = useTranslation();
  
  return (
    <header className="flex flex-none items-center justify-between whitespace-nowrap border-b border-solid border-primary/30 px-6 py-3 bg-background-dark/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-20 h-[60px] drag-region shadow-lg">
      <div className="flex items-center gap-4 text-white">
        <div className="size-8 rounded-full overflow-hidden bg-primary/20 p-1 border border-primary/50">
          <img src={desktopIcon} alt="Mercurius Logo" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-gold-gradient text-xl font-bold leading-tight tracking-widest uppercase" style={{ fontFamily: 'var(--font-imperial)' }}>{t('common.appName')}</h2>
      </div>
      <div className="flex gap-2 no-drag">
        {children}
      </div>
    </header>
  );
}
