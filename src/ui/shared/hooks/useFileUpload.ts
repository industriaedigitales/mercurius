import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

export function useFileUpload() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      setStatus('idle');
      setMessage('');
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;

    setUploading(true);
    setStatus('idle');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('multimediaFile', files[i]);
    }

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        setStatus('success');
        setMessage(t('upload.success'));
        setFiles(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setStatus('error');
        setMessage(t('upload.error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('error');
      setMessage(t('upload.error'));
    } finally {
      setUploading(false);
    }
  };

  return {
    files,
    uploading,
    status,
    message,
    fileInputRef,
    handleFileChange,
    handleUpload
  };
}
