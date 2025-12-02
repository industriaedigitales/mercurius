import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { TopNavBar } from '../components/TopNavBar';
import { useGallery } from '../../shared/hooks/useGallery';
import { useGalleryNavigation } from '../../shared/hooks/useGalleryNavigation';
import { isImage, isVideo } from '../../shared/utils/fileTypes';

export function GalleryScreen() {
  const { t } = useTranslation();
  const { files, serverIp } = useGallery();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { selectedIndex, fileStatuses, scrollToIndex } = useGalleryNavigation(files, scrollContainerRef);

  const handleFileClick = (index: number) => {
    scrollToIndex(index);
  };

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
            {/* Left Panel: Vertical Scroll Feed */}
            <div className="w-2/3 h-full relative rounded-lg overflow-hidden bg-black/40">
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

            {/* Right Panel: File List */}
            <div className="w-1/3 h-full flex flex-col bg-white/5 rounded-lg overflow-hidden">
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
          </div>
        </main>
      </div>
    </div>
  );
}
