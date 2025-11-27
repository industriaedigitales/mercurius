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
        return { icon: 'check_circle', color: 'bg-accent-green text-background-dark' };
      case 'info':
        return { icon: 'smartphone', color: 'bg-accent-blue text-white' };
      case 'error':
        return { icon: 'error', color: 'bg-red-500 text-white' };
    }
  };

  const { icon, color } = getIcon();

  return (
    <div className="pointer-events-auto flex items-start gap-4 rounded-lg bg-[#2A2A2A] p-4 text-text-light shadow-lg ring-1 ring-white/10 animate-in slide-in-from-right fade-in duration-300">
      <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${color}`}>
        <span className="material-symbols-outlined text-lg">{icon}</span>
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-sm text-text-medium">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-auto flex h-6 w-6 items-center justify-center rounded-full text-text-medium transition-colors hover:bg-white/10 hover:text-text-light"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}
