import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  multiple?: boolean;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  className?: string;
  children?: React.ReactNode;
}

export function FileDropzone({
  onFilesAdded,
  multiple = false,
  acceptedFileTypes = [],
  maxFileSize = 100 * 1024 * 1024, // 100MB default
  className,
  children,
}: FileDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAdded(acceptedFiles);
      }
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    multiple,
    maxSize: maxFileSize,
    accept: acceptedFileTypes.length
      ? acceptedFileTypes.reduce((acc, type) => {
          if (type.startsWith('.')) {
            // Handle file extensions
            const mimeType = 
              type === '.pdf' ? { 'application/pdf': [] } :
              type === '.doc' || type === '.docx' ? { 'application/msword': [], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [] } :
              type === '.xls' || type === '.xlsx' ? { 'application/vnd.ms-excel': [], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [] } :
              type === '.ppt' || type === '.pptx' ? { 'application/vnd.ms-powerpoint': [], 'application/vnd.openxmlformats-officedocument.presentationml.presentation': [] } :
              type === '.jpg' || type === '.jpeg' ? { 'image/jpeg': [] } :
              type === '.png' ? { 'image/png': [] } :
              type === '.html' || type === '.htm' ? { 'text/html': [] } :
              {};
            return { ...acc, ...mimeType };
          }
          return acc;
        }, {})
      : undefined,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'drop-area p-8 rounded-xl text-center cursor-pointer',
        isDragActive && 'active',
        isDragReject && 'border-red-500 bg-red-50',
        className
      )}
    >
      <input {...getInputProps()} />
      
      {children || (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary bg-opacity-10 rounded-full mb-4">
            <Upload className="h-8 w-8 text-secondary" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-400 mb-2">Drop your files here</h3>
          <p className="text-neutral-300 mb-4">or</p>
          <Button className="bg-secondary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Select Files
          </Button>
          <p className="mt-4 text-sm text-neutral-300">
            <span className="block sm:inline">Maximum file size: {Math.floor(maxFileSize / (1024 * 1024))}MB</span>
          </p>
        </div>
      )}
    </div>
  );
}
