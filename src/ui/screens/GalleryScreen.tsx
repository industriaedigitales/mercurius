import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TopNavBar } from '../components/TopNavBar';

export function GalleryScreen() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [serverIp, setServerIp] = useState<string>("");

  useEffect(() => {
    const unsubscribe = window.electron.subscribeFileList((newFiles) => {
      setFiles(newFiles);
    });
    
    window.electron.getServerIp().then(setServerIp);
    window.electron.getFiles().then(setFiles);

    return () => {
      unsubscribe();
    };
  }, []);

  const selectedFile = files[selectedIndex];
  const fileUrl = selectedFile && serverIp ? `http://${serverIp}:3000/uploads/${selectedFile}` : null;

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % files.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  const isImage = (filename: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);
  const isVideo = (filename: string) => /\.(mp4|webm|ogg|mov)$/i.test(filename);

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-hidden font-display">
      <div className="layout-container flex h-full grow flex-col">
        <TopNavBar>
          <Link to="/" className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-white/10 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-10 px-2.5 hover:bg-white/20 transition-colors">
            <span className="material-symbols-outlined text-white text-xl">close</span>
          </Link>
        </TopNavBar>

        <main className="flex-1 h-full pt-[60px] pb-5 px-10">
          <div className="flex h-full w-full gap-8">
            {/* Left Panel: Preview */}
            <div className="w-2/3 h-full flex flex-col justify-center relative">
              {files.length > 0 ? (
                <>
                  <div className="absolute inset-y-0 -left-10 flex items-center z-10">
                    <button 
                      onClick={handlePrev}
                      className="flex shrink-0 items-center justify-center rounded-full size-12 bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-3xl">arrow_back_ios_new</span>
                    </button>
                  </div>
                  <div className="absolute inset-y-0 -right-4 flex items-center z-10">
                    <button 
                      onClick={handleNext}
                      className="flex shrink-0 items-center justify-center rounded-full size-12 bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-3xl">arrow_forward_ios</span>
                    </button>
                  </div>
                  
                  <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden bg-black/40">
                    {selectedFile && fileUrl && (
                      <>
                        {isImage(selectedFile) ? (
                          <img 
                            src={fileUrl} 
                            alt={selectedFile} 
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : isVideo(selectedFile) ? (
                          <video 
                            src={fileUrl} 
                            controls 
                            className="max-w-full max-h-full"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-4 text-white/50">
                            <span className="material-symbols-outlined text-9xl">description</span>
                            <p className="text-xl">{t('common.previewNotAvailable')}</p>
                          </div>
                        )}
                        
                        <div className="absolute inset-x-0 bottom-0 p-6 space-y-4 bg-gradient-to-t from-black/70 to-transparent">
                          <div className="p-4 grid grid-cols-[auto_1fr] gap-x-6 bg-black/30 rounded backdrop-blur-md">
                            <div className="col-span-2 grid grid-cols-subgrid border-b border-b-white/10 py-3">
                              <p className="text-white/70 text-sm font-normal leading-normal">{t('common.filename')}</p>
                              <p className="text-white text-sm font-normal leading-normal text-right truncate">{selectedFile}</p>
                            </div>
                          </div>
                          <div className="flex gap-4 items-stretch pt-2">
                            <button className="flex flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-white/10 text-white/80 text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-white/20 transition-colors group">
                              <span className="material-symbols-outlined mr-2 text-2xl text-red-500/80 group-hover:text-red-500">delete</span>
                              <span className="truncate">{t('common.delete')}</span>
                            </button>
                            <button className="flex flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-blue-500 transition-colors group">
                              <span className="material-symbols-outlined mr-2 text-2xl">download_done</span>
                              <span className="truncate">{t('common.keep')}</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/50">
                  <span className="material-symbols-outlined text-6xl mb-4">folder_open</span>
                  <p className="text-xl">{t('common.noFiles')}</p>
                </div>
              )}
            </div>

            {/* Right Panel: File List */}
            <div className="w-1/3 h-full flex flex-col bg-white/5 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-white text-base font-bold leading-tight">{t('common.allFiles')} ({files.length})</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ul className="divide-y divide-white/10">
                  {files.map((file, index) => (
                    <li 
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition-colors ${
                        index === selectedIndex ? 'bg-primary/20' : 'hover:bg-white/10'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-2xl ${index === selectedIndex ? 'text-primary' : 'text-white/80'}`}>
                        {isImage(file) ? 'image' : isVideo(file) ? 'videocam' : 'description'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{file}</p>
                      </div>
                      {index === selectedIndex && (
                        <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
