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
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-500/20' : 'bg-white/10'}`}>
            <span className={`material-symbols-outlined text-2xl ${isDestructive ? 'text-red-500' : 'text-white'}`}>
              {isDestructive ? 'warning' : 'info'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2 font-display">{title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {message}
            </p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button 
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors text-sm cursor-pointer"
            >
              {cancelLabel || t('common.cancel')}
            </button>
            <button 
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm cursor-pointer ${
                isDestructive 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' 
                  : 'bg-primary hover:bg-primary-hover text-white'
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
