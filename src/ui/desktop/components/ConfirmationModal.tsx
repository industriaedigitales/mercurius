import { useTranslation } from 'react-i18next';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  isDestructive = false,
}: ConfirmationModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div className="glass-panel rounded-2xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center gap-6">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center border shadow-sm ${isDestructive ? 'bg-red-500/10 border-red-500/20' : 'bg-primary/10 border-primary/20'}`}>
            <span className={`material-symbols-outlined text-3xl ${isDestructive ? 'text-red-500' : 'text-primary'}`}>
              {isDestructive ? 'warning' : 'info'}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight text-white leading-tight">{title}</h3>
            <p className="text-text-medium text-sm font-medium leading-relaxed opacity-80">
              {message}
            </p>
          </div>
          <div className="flex gap-4 w-full mt-2">
            <button 
              onClick={onCancel}
              className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] transition-all cursor-pointer active:scale-95"
            >
              {cancelLabel || t('common.cancel')}
            </button>
            <button 
              onClick={onConfirm}
              className={`flex-1 px-4 py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all cursor-pointer active:scale-95 shadow-lg ${
                isDestructive 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                  : 'bg-primary hover:bg-primary-light text-white shadow-primary/20'
              }`}
            >
              {confirmLabel || t('common.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
