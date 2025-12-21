import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'info' | 'error';

interface ToastProps {
  type: ToastType;
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ type, title, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return { icon: 'check_circle', color: 'bg-accent/20 text-accent border border-accent/30' };
      case 'info':
        return { icon: 'smartphone', color: 'bg-primary/20 text-primary-light border border-primary/30' };
      case 'error':
        return { icon: 'error', color: 'bg-red-500/20 text-red-500 border border-red-500/30' };
    }
  };

  const { icon, color } = getIcon();

  return (
    <div className="pointer-events-auto flex items-start gap-4 rounded-xl glass-panel p-5 text-white shadow-2xl animate-in slide-in-from-right fade-in duration-300 min-w-80">
      <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${color}`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-black uppercase tracking-widest">{title}</p>
        <p className="text-xs font-medium text-text-medium leading-relaxed">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-auto flex h-6 w-6 items-center justify-center rounded-xl text-text-medium transition-all hover:bg-white/10 hover:text-white active:scale-90"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}
