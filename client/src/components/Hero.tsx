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
          title: "Formato file non supportato",
          description: "Seleziona un formato di file valido.",
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
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-800 mb-4 leading-tight">
            <span className="accent-gradient font-bold">Tools creativi. Codice puro.</span>
            <br />
            <span className="font-light mt-2 block">Benvenuto nel laboratorio digitale di Connexa</span>
          </h1>
          <p className="text-xl text-neutral-600 mb-10 leading-relaxed">
            Unisci, dividi, comprimi, converti, ruota, sblocca e aggiungi filigrane ai tuoi PDF con pochi semplici clic. Tutti gli strumenti sono 100% gratuiti e facili da usare!
          </p>
          <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-gray-100 hover:border-[#dadb00] transition-all duration-300">
            <FileDropzone
              onFilesAdded={handleFilesAdded}
              multiple={true}
              acceptedFileTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png']}
              maxFileSize={100 * 1024 * 1024} // 100MB
              className="bg-gray-50 border-2 border-dashed border-[#dadb00] transition-colors"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
