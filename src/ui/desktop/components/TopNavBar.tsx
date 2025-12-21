import { Link } from 'react-router-dom';
import desktopIcon from '../../shared/assets/desktopIcon.png';
import { useTranslation } from 'react-i18next';

interface TopNavBarProps {
  children?: React.ReactNode;
}

export function TopNavBar({ children }: TopNavBarProps) {
  const { t } = useTranslation();
  
  return (
    <header className="flex flex-none items-center justify-between whitespace-nowrap border-b border-white/5 px-8 py-4 bg-background-dark/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-20 h-[72px] drag-region">
      <Link to="/" className="flex items-center gap-4 text-white no-drag hover:opacity-80 transition-opacity">
        <div className="size-9 rounded-xl overflow-hidden bg-primary/10 p-1.5 border border-primary/30 flex items-center justify-center">
          <img src={desktopIcon} alt="Mercurius Logo" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-accent-gradient text-2xl font-black leading-tight tracking-tight">{t('common.appName')}</h2>
      </Link>
      <div className="flex items-center gap-3 no-drag">
        {children}
      </div>
    </header>
  );
}
