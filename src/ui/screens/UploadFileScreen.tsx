import React, { useState, useRef } from 'react';

export function UploadFileScreen() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      setStatus('idle');
      setMessage('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
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
        setMessage('Files uploaded successfully!');
        setFiles(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setStatus('error');
        setMessage('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background-dark text-text-light font-display flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-8">
        <header className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
            <span className="material-symbols-outlined text-4xl">cloud_upload</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Mercurius Upload</h1>
          <p className="mt-2 text-text-medium">Select files to send to your computer</p>
        </header>

        <form onSubmit={handleUpload} className="flex flex-col gap-6">
          <div 
            className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-8 transition-colors hover:bg-white/10 cursor-pointer"
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
                    <p key={index} className="text-xs text-text-medium truncate text-center">{file.name}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-text-medium">add_circle</span>
                <p className="font-medium text-white">Tap to select files</p>
                <p className="text-sm text-text-medium">Images, Videos, Audio</p>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={!files || uploading}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-lg font-bold text-white transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {uploading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              'Send Files'
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
