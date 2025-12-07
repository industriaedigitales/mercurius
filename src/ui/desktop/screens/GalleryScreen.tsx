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
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-hidden font-display">
      <div className="layout-container flex h-full grow flex-col">
        <TopNavBar>
          <Link to="/" className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-white/10 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-10 px-2.5 hover:bg-white/20 transition-colors">
            <span className="material-symbols-outlined text-white text-xl">close</span>
          </Link>
        </TopNavBar>

        <main className="flex-1 h-full pt-[60px] pb-5 px-10">
          <div className="flex h-full w-full gap-6">
            {/* Left Panel: Vertical Scroll Feed (Preview) */}
            <div className="w-[50%] h-full relative rounded-lg overflow-hidden bg-black/40">
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
                              <div className="flex flex-col items-center gap-4 text-white/50">
                                <span className="material-symbols-outlined text-9xl">description</span>
                                <p className="text-xl">{t('common.previewNotAvailable')}</p>
                              </div>
                            )}
                            
                            {/* Filename Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                              <div className="p-4 bg-black/30 rounded backdrop-blur-md inline-block">
                                <p className="text-white text-sm font-medium truncate">{file}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/50">
                  <span className="material-symbols-outlined text-6xl mb-4">folder_open</span>
                  <p className="text-xl">{t('common.noFiles')}</p>
                </div>
              )}
            </div>

            {/* Middle Panel: File List */}
            <div className="w-[25%] h-full flex flex-col bg-white/5 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-white text-base font-bold leading-tight">{t('common.allFiles')} ({files.length})</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ul className="divide-y divide-white/10">
                  {files.map((file, index) => {
                    const status = fileStatuses[file] || 'neutral';
                    let statusColor = '';
                    let statusIcon = '';

                    if (status === 'keep') {
                      statusColor = 'bg-green-500/20 text-green-500';
                      statusIcon = 'check_circle';
                    } else if (status === 'reject') {
                      statusColor = 'bg-red-500/20 text-red-500';
                      statusIcon = 'cancel';
                    }

                    return (
                      <li 
                        key={index}
                        onClick={() => handleFileClick(index)}
                        className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition-colors ${
                          index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'
                        } ${statusColor}`}
                      >
                        <span className={`material-symbols-outlined text-2xl ${status === 'neutral' ? (index === selectedIndex ? 'text-primary' : 'text-white/80') : ''}`}>
                          {status !== 'neutral' ? statusIcon : (isImage(file) ? 'image' : isVideo(file) ? 'videocam' : 'description')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${status !== 'neutral' ? '' : 'text-white'}`}>{file}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Right Panel: Actions */}
            <div className="w-[25%] h-full flex flex-col bg-white/5 rounded-lg overflow-hidden">
               <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-white text-base font-bold leading-tight">{t('common.actions')}</h3>
              </div>
              <div className="flex-1 p-4 flex flex-col gap-4">
                <button
                  onClick={handleDeleteClick}
                  disabled={rejectedCount === 0}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg font-bold transition-all border ${
                    rejectedCount > 0 
                      ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20 shadow-lg shadow-red-500/10 cursor-pointer' 
                      : 'bg-white/5 border-transparent text-white/30 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined">delete</span>
                  <span>{t('common.deleteSelected')} ({rejectedCount})</span>
                </button>

                <div className="h-px bg-white/10 my-2"></div>
                
                <button
                  onClick={handlePrintClick}
                  disabled={!isPrintable}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg font-bold transition-all border ${
                    isPrintable
                      ? 'bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 shadow-lg shadow-primary/10 cursor-pointer' 
                      : 'bg-white/5 border-transparent text-white/30 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined">print</span>
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
