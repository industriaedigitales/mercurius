import { useState, useEffect, RefObject } from 'react';

export type FileStatus = 'keep' | 'reject' | 'neutral';

export function useGalleryNavigation(files: string[], scrollContainerRef: RefObject<HTMLDivElement | null>) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>({});

  // Sync scroll with selectedIndex
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / container.clientHeight);
      if (index !== selectedIndex && index >= 0 && index < files.length) {
        setSelectedIndex(index);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [files.length, selectedIndex, scrollContainerRef]);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: index * scrollContainerRef.current.clientHeight,
        behavior: 'smooth'
      });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (files.length === 0) return;

      const currentFile = files[selectedIndex];

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (selectedIndex > 0) {
            scrollToIndex(selectedIndex - 1);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (selectedIndex < files.length - 1) {
            scrollToIndex(selectedIndex + 1);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFileStatuses(prev => ({ ...prev, [currentFile]: 'keep' }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFileStatuses(prev => ({ ...prev, [currentFile]: 'reject' }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files, selectedIndex]);

  return {
    selectedIndex,
    setSelectedIndex,
    fileStatuses,
    scrollToIndex
  };
}
