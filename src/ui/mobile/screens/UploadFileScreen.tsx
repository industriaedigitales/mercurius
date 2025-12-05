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
    <div className="min-h-screen w-full bg-background-dark text-text-light font-display flex flex-col items-center justify-center p-6 relative marble-bg">
      {/* Language Switcher */}
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 flex items-center bg-container-dark rounded-lg p-1 imperial-border">
        <button 
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${i18n.language === 'en' ? 'bg-primary text-background-dark' : 'text-text-medium hover:text-text-light'}`}
        >
          EN
        </button>
        <button 
          onClick={() => changeLanguage('it')}
          className={`px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${i18n.language === 'it' ? 'bg-primary text-background-dark' : 'text-text-medium hover:text-text-light'}`}
        >
          IT
        </button>
      </div>

      <div className="w-full max-w-md flex flex-col gap-8 bg-container-dark p-6 rounded-lg imperial-border shadow-2xl">
        <header className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/30">
            <span className="material-symbols-outlined text-4xl">cloud_upload</span>
          </div>
          <h1 className="text-3xl font-bold text-gold-gradient font-imperial tracking-wider">Mercurius Upload</h1>
          <p className="mt-2 text-text-medium">{t('upload.title')}</p>
        </header>

        <form onSubmit={handleUpload} className="flex flex-col gap-6">
          <div 
            className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-background-dark/50 p-8 transition-colors hover:bg-background-dark/80 cursor-pointer hover:border-primary/60"
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
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-accent-green">check_circle</span>
                <p className="font-medium text-white">{files.length} file(s) selected</p>
                <div className="flex flex-col gap-1 w-full max-h-32 overflow-y-auto mt-2">
                  {Array.from(files).map((file, index) => (
                    <p key={index} className="text-xs text-text-medium truncate text-center">{(file as File).name}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-text-medium">add_circle</span>
                <p className="font-medium text-white">{t('upload.selectFiles')}</p>
                <p className="text-sm text-text-medium">{t('upload.dragDrop')}</p>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={!files || uploading}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-lg font-bold text-background-dark transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            {uploading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              t('upload.title')
            )}
          </button>
        </form>

        {status === 'success' && (
          <div className="rounded-lg bg-accent-green/20 p-4 text-center text-accent-green border border-accent-green/30">
            <p className="font-bold">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-lg bg-red-500/20 p-4 text-center text-red-400 border border-red-500/30">
            <p className="font-bold">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
