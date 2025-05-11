import React from 'react';
import { X, FileText, FileImage, FileSpreadsheet, File, FilePen } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileItem {
  id: string;
  file: File;
  preview?: string;
}

interface FileListProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  className?: string;
}

export function FileList({ files, onRemove, className }: FileListProps) {
  if (files.length === 0) {
    return null;
  }

  // Helper function to get the right icon for file type
  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') {
      return <FilePen className="h-5 w-5 text-primary" />;
    } else if (['doc', 'docx'].includes(extension || '')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (['xls', 'xlsx'].includes(extension || '')) {
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    } else if (['ppt', 'pptx'].includes(extension || '')) {
      return <File className="h-5 w-5 text-orange-500" />;
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <FileImage className="h-5 w-5 text-purple-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {files.map((item) => (
        <div key={item.id} className="flex items-start p-3 bg-white rounded border border-gray-200">
          <div className="flex-shrink-0 w-10 h-10 bg-primary bg-opacity-10 rounded flex items-center justify-center mr-3">
            {getFileIcon(item.file)}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-neutral-400">{item.file.name}</h4>
            <p className="text-xs text-neutral-300 mt-1">
              {formatFileSize(item.file.size)}
            </p>
          </div>
          <button 
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-neutral-300 hover:text-error"
            aria-label="Remove file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
}
