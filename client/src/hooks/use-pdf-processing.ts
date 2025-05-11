import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface UsePdfProcessingReturn {
  processPdf: (toolId: string, fileIds: string[]) => Promise<string>;
  isProcessing: boolean;
  processingProgress: number;
}

export function usePdfProcessing(): UsePdfProcessingReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  const processPdf = async (toolId: string, fileIds: string[]): Promise<string> => {
    if (fileIds.length === 0) {
      throw new Error('No files to process');
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);

      const response = await apiRequest('POST', `/api/process/${toolId}`, {
        fileIds,
      });

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (!response.ok) {
        throw new Error('PDF processing failed');
      }

      const result = await response.json();
      return result.resultFileId;
    } catch (error) {
      toast({
        title: 'Processing Error',
        description: error instanceof Error ? error.message : 'Failed to process PDF',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPdf,
    isProcessing,
    processingProgress,
  };
}
