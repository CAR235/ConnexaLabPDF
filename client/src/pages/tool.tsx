import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FileList, FileItem } from '@/components/ui/file-list';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getToolById } from '@/lib/pdfTools';
import { useToast } from '@/hooks/use-toast';
import { usePdfProcessing } from '@/hooks/use-pdf-processing';
import { useFileUpload } from '@/hooks/use-file-upload';
import { Helmet } from 'react-helmet';
import { ChevronLeft, Download, Loader2, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function Tool() {
  const params = useParams<{ tool: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const tool = getToolById(params.tool);
  
  const [files, setFiles] = useState<FileItem[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const { uploadFiles, isUploading } = useFileUpload();
  const { processPdf, isProcessing } = usePdfProcessing();

  useEffect(() => {
    // Try to load files from session storage (if coming from homepage)
    const storedFiles = sessionStorage.getItem('pdfToolsFiles');
    if (storedFiles) {
      try {
        // This is just the metadata, we can't restore the actual files
        // We'll show a prompt to re-upload instead
        const filesData = JSON.parse(storedFiles);
        if (filesData.length > 0) {
          toast({
            title: "Ricarica i tuoi file",
            description: "I file non possono essere conservati tra le pagine per motivi di sicurezza."
          });
        }
        // Clear the stored files since we've acknowledged them
        sessionStorage.removeItem('pdfToolsFiles');
      } catch (e) {
        console.error("Error parsing stored files", e);
      }
    }
  }, [toast]);

  // Handle adding files
  const handleFilesAdded = (newFiles: File[]) => {
    // Validate file types against tool's accepted types
    if (tool && tool.acceptedFileTypes.length > 0) {
      const invalidFiles = newFiles.filter(file => {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        return !tool.acceptedFileTypes.includes(extension);
      });
      
      if (invalidFiles.length > 0) {
        toast({
          title: "Formato file non supportato",
          description: `Questo strumento accetta solo file ${tool.acceptedFileTypes.join(', ')}.`,
          variant: "destructive",
        });
        return;
      }
    }
    
    // Add files with unique IDs
    const filesWithIds = newFiles.map(file => ({
      id: uuidv4(),
      file
    }));
    
    setFiles(prev => [...prev, ...filesWithIds]);
  };

  // Handle removing a file
  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  // Handle processing the files
  const handleProcessFiles = async () => {
    if (!tool) return;
    if (files.length === 0) {
      toast({
        title: "Nessun file selezionato",
        description: "Seleziona almeno un file da elaborare.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setProgress(0);
    
    try {
      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);

      // Upload files first
      const uploadedFiles = await uploadFiles(files.map(f => f.file));
      
      // Then process them with the selected tool
      const result = await processPdf(tool.id, uploadedFiles);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // In a real app, this would be a download URL or blob
      setResult(result);
      
      toast({
        title: "Processing complete",
        description: "Your files have been successfully processed.",
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Handle downloading the result
  const handleDownload = () => {
    if (!result) return;
    
    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = `/api/download/${result}`; // Assuming result contains the file ID
    link.download = 'processed-document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download avviato",
      description: "Il tuo file verrà scaricato a breve.",
    });
    
    // Don't reset the UI state after download
    // setResult(null);
    // setFiles([]);
  };

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <h1 className="text-2xl font-bold text-neutral-400 mb-4">Tool not found</h1>
            <p className="text-neutral-300 mb-6">The requested tool does not exist.</p>
            <Link href="/">
              <div className="inline-flex items-center text-secondary hover:underline cursor-pointer">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Torna alla home
              </div>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{tool.name} - PDF Tools</title>
        <meta name="description" content={tool.description} />
        <meta property="og:title" content={`${tool.name} - PDF Tools`} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-4">
            <Link href="/">
              <div className="inline-flex items-center text-[#dadb00] hover:underline cursor-pointer">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Torna a tutti gli strumenti
              </div>
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center mb-6">
              <div className={`w-12 h-12 rounded-lg bg-${tool.color} bg-opacity-10 flex items-center justify-center mr-4`}>
                <tool.icon className={`h-6 w-6 text-${tool.color}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-800">{tool.name}</h1>
                <p className="text-neutral-600">{tool.description}</p>
              </div>
            </div>
            
            {!result ? (
              <>
                <div className="mb-6">
                  <h2 className="font-semibold text-neutral-800 mb-2">Carica File</h2>
                  <FileDropzone
                    onFilesAdded={handleFilesAdded}
                    multiple={tool.id === 'merge-pdf'}
                    acceptedFileTypes={tool.acceptedFileTypes}
                    className="bg-gray-50 mb-4"
                  />
                </div>
                
                {files.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-semibold text-neutral-800 mb-2">File da elaborare</h2>
                    <FileList 
                      files={files} 
                      onRemove={handleRemoveFile} 
                      className="mb-4"
                    />
                  </div>
                )}
                
                <div className="mt-8">
                  {processing ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-600">Elaborazione in corso</span>
                        <span className="text-sm font-medium text-neutral-600">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  ) : (
                    <Button 
                      onClick={handleProcessFiles}
                      disabled={files.length === 0 || isUploading || isProcessing}
                      className="w-full bg-[#dadb00] hover:bg-[#c0c100] text-black font-medium text-lg py-3"
                    >
                      {isUploading || isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Elaborazione...
                        </>
                      ) : (
                        `Elabora con ${tool.name}`
                      )}
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center p-8 border border-dashed border-green-300 bg-green-50 rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">Elaborazione Completata!</h3>
                <p className="text-neutral-600 mb-6">Il tuo file è pronto per il download</p>
                
                <Button 
                  onClick={handleDownload}
                  className="bg-[#dadb00] hover:bg-[#c0c100] text-black font-medium text-lg py-3 px-6"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Scarica File
                </Button>
                
                <div className="mt-6">
                  <button 
                    onClick={() => {
                      setFiles([]);
                      setResult(null);
                    }}
                    className="text-[#dadb00] hover:underline text-sm"
                  >
                    Elabora un altro file
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
