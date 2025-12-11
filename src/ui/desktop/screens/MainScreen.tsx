import React, { useState, useEffect } from 'react';
import { TopNavBar } from '../components/TopNavBar';
import { Link } from 'react-router-dom';
import QRCode from "react-qr-code";
import { useTranslation } from 'react-i18next';
import { Toast, ToastType } from '../../components/Toast';

interface ToastMessage {
  id: number;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

export function MainScreen() {
  const { t } = useTranslation();
  const [serverEnabled, setServerEnabled] = useState(true);
  const [serverIp, setServerIp] = useState<string>("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [tunnelUrl, setTunnelUrl] = useState<string | null>(null);
  const [publicIp, setPublicIp] = useState<string | null>(null);

  useEffect(() => {
    // Get initial IP
    window.electron.getServerIp().then((ip) => {
      setServerIp(ip);
    });
    
    // Check if tunnel is already running
    window.electron.getTunnelUrl().then((url) => {
      if (url) {
        setTunnelUrl(url);
        setIsPublic(true);
      }
    });

    // Subscribe to device connections
    const unsubscribeDevice = window.electron.subscribeDeviceConnected((deviceInfo) => {
      addToast({
        type: 'info',
        title: t('main.newConnection'),
        message: t('main.deviceConnected', { device: deviceInfo.deviceName }),
        duration: 10000
      });
    });

    const unsubscribeFile = window.electron.subscribeFileUploaded((uploadInfo) => {
      addToast({
        type: 'success',
        title: t('main.filesReceived'),
        message: t('main.filesUploaded', { count: uploadInfo.count }),
        duration: 10000
      });
    });

    return () => {
      unsubscribeDevice();
      unsubscribeFile();
    };
  }, [t]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleServer = async (checked: boolean) => {
    setServerEnabled(checked);
    await window.electron.toggleServer(checked);
  };

  const handleTogglePublic = async (checked: boolean) => {
    setIsPublic(checked);
    if (checked) {
       try {
         const [url, ip] = await Promise.all([
           window.electron.startTunnel(),
           window.electron.getPublicIp() // Fetch IP in parallel
         ]);
         
         if (url) {
           setTunnelUrl(url);
           setPublicIp(ip);
           addToast({
             type: 'success',
             title: t('main.publicModeEnabled'),
             message: t('main.publicUrlGenerated'),
             duration: 5000
           });
         }
       } catch (error) {
         console.error("Failed to start tunnel", error);
         setIsPublic(false);
         addToast({
            type: 'error',
            title: t('common.error'),
            message: t('main.tunnelError'),
            duration: 5000
         });
       }
    } else {
      await window.electron.stopTunnel();
      setTunnelUrl(null);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-background-dark group/design-root overflow-hidden p-4 marble-bg my-16">
      <div className="flex flex-col w-full max-w-4xl rounded-lg bg-container-dark shadow-2xl imperial-border my-8 overflow-hidden my-10">
        <TopNavBar />
        
        <main className="flex flex-1 flex-col md:flex-row items-center md:items-stretch justify-center gap-8 p-6 md:p-10">
          
          {/* Left Column - QR Code */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <div className="text-center">
              <h1 className="text-gold-gradient tracking-light text-[32px] font-bold leading-tight">{t('main.scanQr')}</h1>
              <p className="text-text-medium text-base font-normal leading-normal pt-2 max-w-xs mx-auto">{t('main.openBrowser')}</p>
            </div>
            
            <div className="flex w-full max-w-64 grow-0 bg-container-dark @container">
              <div className="w-full gap-1 overflow-hidden rounded-lg bg-white p-4 @[480px]:gap-2 flex items-center justify-center imperial-border">
                {serverIp ? (
                   <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                    <QRCode
                      size={256}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      value={isPublic && tunnelUrl ? tunnelUrl : `http://${serverIp}:3000`}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                ) : (
                  <div className="aspect-square w-full bg-gray-200 animate-pulse"></div>
                )}
              </div>
            </div>
          </div>

          <div className="w-px bg-white/10 hidden md:block"></div>
          
          {/* Right Column - Controls */}
          <div className="flex flex-1 flex-col justify-center items-center w-full max-w-md gap-6">
            <div className="w-full @container flex flex-col gap-4">
              
              {/* Server Control */}
              <div className="flex flex-1 flex-col items-center justify-between gap-4 rounded-lg border border-white/10 bg-container-dark p-5 @[480px]:flex-row imperial-border">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-bold leading-tight text-text-light">{serverEnabled ? t('main.serverRunning') : t('main.serverStopped')}</p>
                    <p className="text-sm font-normal leading-normal text-text-medium">{t('main.readyToReceive')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${serverEnabled ? 'bg-accent-green' : 'bg-red-500'}`}></div>
                  <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-accent-green p-0.5 has-[:checked]:justify-end has-[:checked]:bg-accent-green has-[:not(:checked)]:bg-white/10">
                    <div className="h-full w-[27px] rounded-full bg-white transition-transform" style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px' }}></div>
                    <input 
                      checked={serverEnabled} 
                      onChange={(e) => handleToggleServer(e.target.checked)} 
                      className="invisible absolute" 
                      type="checkbox"
                    />
                  </label>
                </div>
              </div>

              {/* Public Mode Control */}
              <div className="flex flex-1 flex-col items-center justify-between gap-4 rounded-lg border border-white/10 bg-container-dark p-5 @[480px]:flex-row imperial-border">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-bold leading-tight text-text-light">{isPublic ? t('main.publicModeOn') : t('main.publicModeOff')}</p>
                    <p className="text-sm font-normal leading-normal text-text-medium">{t('main.publicModeDesc')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className={`h-2.5 w-2.5 rounded-full ${isPublic ? 'bg-accent-green' : 'bg-red-500'}`}></div>
                  <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-accent-green p-0.5 has-[:checked]:justify-end has-[:checked]:bg-orange-500 has-[:not(:checked)]:bg-white/10">
                    <div className="h-full w-[27px] rounded-full bg-white transition-transform" style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px' }}></div>
                    <input 
                      checked={isPublic} 
                      onChange={(e) => handleTogglePublic(e.target.checked)} 
                      className="invisible absolute" 
                      type="checkbox"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Password Display */}
            {isPublic && publicIp && (
              <div className="w-full flex flex-col items-center justify-center rounded-lg border border-white/10 bg-container-dark p-4 imperial-border">
                <p className="text-sm font-bold text-text-light uppercase tracking-wider">{t('main.tunnelPassword')}</p>
                <div className="mt-2 flex items-center gap-2 rounded bg-black/30 px-4 py-2 w-full justify-center">
                   <p className="text-xl font-mono text-gold-gradient tracking-widest">{publicIp}</p>
                   <button 
                    onClick={() => { navigator.clipboard.writeText(publicIp); addToast({type: 'info', title: 'Copied', message: 'Password copied to clipboard'})}}
                    className="ml-2 text-text-medium hover:text-white"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                   </button>
                </div>
                <p className="mt-2 text-center text-xs text-text-medium max-w-xs">{t('main.tunnelPasswordDesc')}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
             <Link to="/settings" className="text-primary hover:text-primary/80 hover:underline font-bold uppercase tracking-wider text-sm">{t('sidebar.settings')}</Link>
             <Link to="/gallery" className="text-primary hover:text-primary/80 hover:underline font-bold uppercase tracking-wider text-sm">{t('sidebar.gallery')}</Link>
          </div>
        </main>
      </div>

      {/* Toast Notifications Area */}
      <div className="pointer-events-none absolute right-4 top-4 flex w-full max-w-sm flex-col items-end gap-3 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
