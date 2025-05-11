import { FileDropzone } from '@/components/ui/file-dropzone';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import type { FileItem } from '@/components/ui/file-list';

export function Hero() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [files, setFiles] = useState<FileItem[]>([]);

  const handleFilesAdded = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      // Determine the tool to use based on file type
      const firstFile = newFiles[0];
      const extension = firstFile.name.split('.').pop()?.toLowerCase();
      let toolRoute = '';

      if (extension === 'pdf') {
        if (newFiles.length > 1) {
          toolRoute = '/tool/merge-pdf';
        } else {
          toolRoute = '/tool/edit-pdf';
        }
      } else if (['doc', 'docx'].includes(extension || '')) {
        toolRoute = '/tool/word-to-pdf';
      } else if (['xls', 'xlsx'].includes(extension || '')) {
        toolRoute = '/tool/excel-to-pdf';
      } else if (['ppt', 'pptx'].includes(extension || '')) {
        toolRoute = '/tool/powerpoint-to-pdf';
      } else if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
        toolRoute = '/tool/jpg-to-pdf';
      } else {
        toast({
          title: "Unsupported file format",
          description: "Please select a valid file format.",
          variant: "destructive",
        });
        return;
      }

      // Add the files with unique IDs
      const filesWithIds = newFiles.map(file => ({
        id: uuidv4(),
        file
      }));

      setFiles(filesWithIds);
      
      // Store files in session storage for the tool page to use
      sessionStorage.setItem('pdfToolsFiles', JSON.stringify(
        filesWithIds.map(f => ({ id: f.id, name: f.file.name, size: f.file.size, type: f.file.type }))
      ));
      
      // Navigate to the appropriate tool page
      setLocation(toolRoute);
    }
  };

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-400 mb-4">
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="text-lg text-neutral-300 mb-8">
            Every tool you need to use PDFs, at your fingertips. All are 100% free and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>
          <FileDropzone
            onFilesAdded={handleFilesAdded}
            multiple={true}
            acceptedFileTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png']}
            maxFileSize={100 * 1024 * 1024} // 100MB
            className="bg-gray-100"
          />
        </div>
      </div>
    </section>
  );
}
