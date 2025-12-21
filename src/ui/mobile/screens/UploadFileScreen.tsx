import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFileUpload } from '../../shared/hooks/useFileUpload';

export function UploadFileScreen() {
  const { t, i18n } = useTranslation();
  const { 
    files, 
    uploading, 
    status, 
    message, 
    fileInputRef, 
    handleFileChange, 
    handleUpload 
  } = useFileUpload();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen w-full bg-background-dark text-white font-display flex flex-col items-center justify-center p-6 relative tech-grid-bg">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 flex items-center bg-white/5 backdrop-blur-xl rounded-xl p-1 border border-white/10">
        <button 
          onClick={() => changeLanguage('en')}
          className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${i18n.language === 'en' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-medium hover:text-white'}`}
        >
          EN
        </button>
        <button 
          onClick={() => changeLanguage('it')}
          className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${i18n.language === 'it' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-medium hover:text-white'}`}
        >
          IT
        </button>
      </div>

      <div className="w-full max-w-md flex flex-col gap-8 glass-panel p-8 rounded-2xl shadow-2xl">
        <header className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <span className="material-symbols-outlined text-4xl">cloud_upload</span>
          </div>
          <h1 className="text-3xl font-black text-accent-gradient tracking-tight leading-tight">Mercurius</h1>
          <p className="mt-2 text-text-medium text-sm font-medium opacity-80">{t('upload.title')}</p>
        </header>

        <form onSubmit={handleUpload} className="flex flex-col gap-8">
          <div 
            className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/5 p-10 transition-all hover:bg-white/10 cursor-pointer hover:border-primary/50 group"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              name="multimediaFile" 
              multiple 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            {files && files.length > 0 ? (
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-5xl text-accent animate-in zoom-in">check_circle</span>
                <p className="font-bold text-white text-sm">{files.length} file(s) selected</p>
                <div className="flex flex-col gap-1 w-full max-h-32 overflow-y-auto mt-2 no-scrollbar">
                  {Array.from(files).map((file, index) => (
                    <p key={index} className="text-[10px] font-medium text-text-medium truncate text-center leading-relaxed">{(file as File).name}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-5xl text-text-medium opacity-30">add_circle</span>
                <p className="font-bold text-white text-sm tracking-tight">{t('upload.selectFiles')}</p>
                <p className="text-[11px] text-text-medium font-medium opacity-60 tracking-wide uppercase">{t('upload.dragDrop')}</p>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={!files || uploading}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-primary-light disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-xl shadow-primary/20"
          >
            {uploading ? (
              <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
            ) : (
              t('upload.title')
            )}
          </button>
        </form>

        {status === 'success' && (
          <div className="rounded-xl bg-accent/10 p-4 text-center text-accent border border-accent/20 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-xs font-black uppercase tracking-widest">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-xl bg-red-500/10 p-4 text-center text-red-500 border border-red-500/20 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-xs font-black uppercase tracking-widest">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
