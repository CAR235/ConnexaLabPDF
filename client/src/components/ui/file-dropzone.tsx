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
        'drop-area p-8 rounded-xl text-center cursor-pointer transition-all duration-300',
        isDragActive && 'active bg-[#dadb00] bg-opacity-10 border-[#dadb00]',
        isDragReject && 'border-red-500 bg-red-50',
        className
      )}
    >
      <input {...getInputProps()} />
      
      {children || (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#dadb00] bg-opacity-10 rounded-full mb-6">
            <Upload className="h-10 w-10 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-800 mb-3">Trascina qui i tuoi file</h3>
          <p className="text-neutral-600 mb-5 text-lg">oppure</p>
          <Button className="bg-[#dadb00] hover:bg-[#c0c100] text-black px-8 py-3 rounded-lg font-semibold text-lg shadow-md">
            Seleziona File
          </Button>
          <p className="mt-6 text-sm text-neutral-500">
            <span className="block sm:inline">Dimensione massima: {Math.floor(maxFileSize / (1024 * 1024))}MB</span>
            {acceptedFileTypes.length > 0 && (
              <span className="block sm:inline sm:ml-3">• Formati supportati: {acceptedFileTypes.join(', ')}</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
