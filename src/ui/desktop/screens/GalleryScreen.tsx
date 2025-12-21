import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { TopNavBar } from '../components/TopNavBar';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useGallery } from '../../shared/hooks/useGallery';
import { useGalleryNavigation } from '../../shared/hooks/useGalleryNavigation';
import { isImage, isVideo, isPdf } from '../../shared/utils/fileTypes';

export function GalleryScreen() {
  const { t } = useTranslation();
  const { files, serverIp } = useGallery();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { selectedIndex, fileStatuses, scrollToIndex } = useGalleryNavigation(files, scrollContainerRef);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleFileClick = (index: number) => {
    scrollToIndex(index);
  };

  const getRejectedFiles = () => {
    return files.filter(file => fileStatuses[file] === 'reject');
  };

  const rejectedCount = getRejectedFiles().length;

  const handleDeleteClick = () => {
    if (rejectedCount > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    const rejectedFiles = getRejectedFiles();
    if (rejectedFiles.length > 0) {
      await window.electron.deleteFiles(rejectedFiles);
    }
    setIsDeleteModalOpen(false);
  };
  const handlePrintClick = async () => {
    // If we have a selected index, print that one. otherwise print the first one or handle appropriately.
    // The UI implies printing the *current* view or selected file.
    // The hooks provide `selectedIndex` which corresponds to the current scroll file in the preview.
    
    if (files.length > 0 && selectedIndex >= 0 && selectedIndex < files.length) {
      const file = files[selectedIndex];
      await window.electron.printFile(file);
    }
  };

  const selectedFile = (files.length > 0 && selectedIndex >= 0 && selectedIndex < files.length) ? files[selectedIndex] : null;
  const isPrintable = selectedFile ? (isImage(selectedFile) || isPdf(selectedFile)) : false;

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark tech-grid-bg group/design-root overflow-hidden font-display">
      <div className="layout-container flex h-full grow flex-col">
        <TopNavBar>
          <Link to="/" className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-all active:scale-95 no-drag">
            <span className="material-symbols-outlined text-white text-xl">close</span>
          </Link>
        </TopNavBar>

        <main className="flex-1 h-full pt-[72px] pb-5 px-10">
          <div className="flex h-full w-full gap-6">
            {/* Left Panel: Vertical Scroll Feed (Preview) */}
            <div className="w-[50%] h-full relative rounded-xl overflow-hidden glass-panel">
              {files.length > 0 ? (
                <div 
                  ref={scrollContainerRef}
                  className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {files.map((file) => {
                    const fileUrl = serverIp ? `http://${serverIp}:3000/uploads/${file}` : null;
                    return (
                      <div key={file} className="h-full w-full snap-start flex items-center justify-center relative">
                        {fileUrl && (
                          <>
                            {isImage(file) ? (
                              <img 
                                src={fileUrl} 
                                alt={file} 
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : isVideo(file) ? (
                              <video 
                                src={fileUrl} 
                                controls 
                                className="max-w-full max-h-full"
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-4 text-white/20">
                                <span className="material-symbols-outlined text-9xl">description</span>
                                <p className="text-xl font-bold tracking-tight">{t('common.previewNotAvailable')}</p>
                              </div>
                            )}
                            
                            {/* Filename Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                              <div className="px-4 py-2 bg-black/40 border border-white/5 rounded-lg backdrop-blur-xl inline-block">
                                <p className="text-white text-xs font-bold tracking-tight">{file}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/20">
                  <span className="material-symbols-outlined text-6xl mb-4">folder_open</span>
                  <p className="text-xl font-bold tracking-tight">{t('common.noFiles')}</p>
                </div>
              )}
            </div>

            {/* Middle Panel: File List */}
            <div className="w-[25%] h-full flex flex-col bg-white/5 border border-white/5 rounded-xl overflow-hidden backdrop-blur-md">
              <div className="px-6 py-5 border-b border-white/5">
                <h3 className="text-white text-sm font-black uppercase tracking-widest opacity-80">{t('common.allFiles')} ({files.length})</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ul className="divide-y divide-white/5">
                  {files.map((file, index) => {
                    const status = fileStatuses[file] || 'neutral';
                    let statusColor = '';
                    let statusIcon = '';

                    if (status === 'keep') {
                      statusColor = 'bg-accent/10 border-l-4 border-l-accent';
                      statusIcon = 'check_circle';
                    } else if (status === 'reject') {
                      statusColor = 'bg-red-500/10 border-l-4 border-l-red-500';
                      statusIcon = 'cancel';
                    }

                    return (
                      <li 
                        key={index}
                        onClick={() => handleFileClick(index)}
                        className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all ${
                          index === selectedIndex ? 'bg-primary/20 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-l-primary' : 'hover:bg-white/5'
                        } ${statusColor}`}
                      >
                        <span className={`material-symbols-outlined text-2xl ${status === 'neutral' ? (index === selectedIndex ? 'text-primary' : 'text-white/40') : ''}`}>
                          {status !== 'neutral' ? statusIcon : (isImage(file) ? 'image' : isVideo(file) ? 'videocam' : 'description')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold truncate ${status !== 'neutral' ? '' : index === selectedIndex ? 'text-white' : 'text-white/60'}`}>{file}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Right Panel: Actions */}
            <div className="w-[25%] h-full flex flex-col bg-white/5 border border-white/5 rounded-xl overflow-hidden backdrop-blur-md">
               <div className="px-6 py-5 border-b border-white/5">
                <h3 className="text-white text-sm font-black uppercase tracking-widest opacity-80">{t('common.actions')}</h3>
              </div>
              <div className="flex-1 p-5 flex flex-col gap-4">
                <button
                  onClick={handleDeleteClick}
                  disabled={rejectedCount === 0}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border ${
                    rejectedCount > 0 
                      ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)] cursor-pointer active:scale-95' 
                      : 'bg-white/5 border-transparent text-white/20 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                  <span>{t('common.deleteSelected')} ({rejectedCount})</span>
                </button>

                <div className="h-px bg-white/5 my-2"></div>
                
                <button
                  onClick={handlePrintClick}
                  disabled={!isPrintable}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border ${
                    isPrintable
                      ? 'bg-primary/10 border-primary/30 text-primary-light hover:bg-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] cursor-pointer active:scale-95' 
                      : 'bg-white/5 border-transparent text-white/20 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">print</span>
                  <span>{t('common.print')}</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title={t('common.confirmDeleteTitle')}
        message={t('common.confirmDeleteMessage', { count: rejectedCount })}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        isDestructive
      />
    </div>
  );
}
