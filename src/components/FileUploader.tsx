import React, { useRef, useState } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { uploadService } from '../lib/api';

interface FileUploaderProps {
  onUploadSuccess: (url: string) => void;
  currentUrl?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess, currentUrl }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const { url } = await uploadService.uploadFile(file);
      setPreview(url);
      onUploadSuccess(url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Ошибка при загрузке файла.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full aspect-video bg-[#111] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6
          ${loading ? 'border-accent' : preview ? 'border-green-500/30' : 'border-border/50 hover:border-accent'}`}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept="image/*"
        />

        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-accent mb-4" size={32} />
            <p className="text-[10px] uppercase tracking-widest font-bold text-accent">Загрузка протокола...</p>
          </div>
        ) : preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload size={24} className="text-white" />
            </div>
            <div className="absolute top-4 right-4 bg-green-500 p-1 rounded-full">
              <Check size={12} className="text-white" />
            </div>
          </>
        ) : (
          <>
            <Upload size={32} className="text-[#333] mb-4" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#666]">Перетащите файл или нажмите для выбора</p>
            <p className="text-[8px] uppercase tracking-[0.2em] text-[#444] mt-2">JPG, PNG, WebP // Макс. 10МБ</p>
          </>
        )}
      </div>
      
      {preview && (
        <div className="flex items-center justify-between p-3 bg-[#080808] border border-border">
          <span className="text-[9px] font-mono text-[#666] truncate max-w-[200px]">{preview}</span>
          <button 
            onClick={() => { setPreview(''); onUploadSuccess(''); }}
            className="text-[#666] hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
