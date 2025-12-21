import React from 'react';
import { useTranslation } from 'react-i18next';

interface SectionCardProps {
  title: string;
  description?: string;
  icon: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function SectionCard({ title, description, icon, onClick, disabled = false }: SectionCardProps) {
  const { t } = useTranslation();

  const handleInteraction = () => {
    if (disabled) return;
    onClick?.();
  };

  // Base styles for the card
  const baseClasses = "relative flex flex-col items-center justify-center p-8 rounded-xl border transition-all duration-300 group imperial-border";
  
  // Interactive vs Disabled styles
  const stateClasses = disabled 
    ? "border-white/5 bg-white/5 cursor-not-allowed grayscale" 
    : "border-primary/30 bg-container-dark hover:border-primary hover:shadow-2xl hover:shadow-primary/20 cursor-pointer active:scale-95";

  // Icon container styles
  const iconContainerClasses = `mb-4 p-4 rounded-full transition-colors ${
    disabled ? "bg-white/5" : "bg-primary/10 group-hover:bg-primary/20"
  }`;

  // Icon styles
  const iconClasses = `material-symbols-outlined text-4xl ${
    disabled ? "text-text-medium" : "text-primary"
  }`;

  // Title styles
  const titleClasses = `text-xl font-bold mb-2 tracking-widest ${
    disabled ? "text-text-medium" : "text-gold-gradient"
  }`;

  return (
    <div 
      onClick={handleInteraction}
      className={`${baseClasses} ${stateClasses}`}
    >
      <div className={iconContainerClasses}>
        <span className={iconClasses}>
          {icon}
        </span>
      </div>
      
      <h3 className={titleClasses}>
        {title}
      </h3>
      
      {description && (
        <p className="text-text-medium text-sm text-center">
          {description}
        </p>
      )}

      {disabled && (
        <div className="absolute top-4 right-4 bg-primary px-2 py-0.5 rounded text-[10px] font-bold text-background-dark uppercase tracking-tighter">
          {t('home.comingSoon')}
        </div>
      )}
    </div>
  );
}
