import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function OnboardingModal() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    window.electron.getOnboarded().then((onboarded) => {
      if (!onboarded) {
        setIsVisible(true);
      }
    });
  }, []);

  const handleClose = async () => {
    await window.electron.setOnboarded(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const steps = [
    {
      title: t('onboarding.welcome.title', 'Welcome to Mercurius'),
      description: t('onboarding.welcome.desc', 'The fastest way to transfer files between your desktop and mobile devices on the same network.'),
      icon: 'rocket_launch'
    },
    {
      title: t('onboarding.qr.title', 'Scan to Connect'),
      description: t('onboarding.qr.desc', 'Just scan the QR code with your phone\'s camera to start sending files instantly. No cables, no accounts.'),
      icon: 'qr_code_scanner'
    },
    {
      title: t('onboarding.privacy.title', 'Local & Private'),
      description: t('onboarding.privacy.desc', 'Your files are transferred directly over your local Wi-Fi. They never touch the cloud.'),
      icon: 'security'
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl glass-panel shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
        <div className="p-8 flex flex-col items-center text-center gap-6">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
            <span className="material-symbols-outlined !text-4xl">{currentStep.icon}</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">{currentStep.title}</h2>
            <p className="text-text-medium text-lg font-medium leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 === step ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}
              />
            ))}
          </div>

          <div className="flex w-full gap-4 mt-4">
            {step < steps.length ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 rounded-xl bg-primary py-4 text-base font-bold text-white shadow-lg hover:bg-primary-light transition-all active:scale-[0.98]"
              >
                {t('common.next', 'Next')}
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="flex-1 rounded-xl bg-accent py-4 text-base font-bold text-white shadow-lg hover:bg-cyan-500 transition-all active:scale-[0.98]"
              >
                {t('onboarding.getStarted', 'Get Started')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
