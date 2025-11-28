import { useState, useEffect } from 'react';

export function useGallery() {
  const [files, setFiles] = useState<string[]>([]);
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

  return { files, serverIp };
}
