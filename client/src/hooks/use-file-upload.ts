import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface UseFileUploadReturn {
  uploadFiles: (files: File[]) => Promise<string[]>;
  isUploading: boolean;
  uploadProgress: number;
}

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) {
      return [];
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      // In a real app, we would track upload progress with XMLHttpRequest
      // For simplicity, we're using fetch here with a simulated progress

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);

      const response = await apiRequest('POST', '/api/upload', formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Caricamento file fallito');
      }

      const result = await response.json();
      return result.fileIds;
    } catch (error) {
      toast({
        title: 'Errore di caricamento',
        description: error instanceof Error ? error.message : 'Impossibile caricare i file',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFiles,
    isUploading,
    uploadProgress,
  };
}
