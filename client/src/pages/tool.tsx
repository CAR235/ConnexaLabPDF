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
            title: "Please re-upload your files",
            description: "Files can't be stored between pages for security reasons."
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
          title: "Unsupported file format",
          description: `This tool only accepts ${tool.acceptedFileTypes.join(', ')} files.`,
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
        title: "No files selected",
        description: "Please select at least one file to process.",
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
    
    // In a real app, this would trigger the actual download
    toast({
      title: "Download started",
      description: "Your file will be downloaded shortly.",
    });
    
    // Reset for a new operation
    setResult(null);
    setFiles([]);
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
              <a className="inline-flex items-center text-secondary hover:underline">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to home
              </a>
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
              <a className="inline-flex items-center text-secondary hover:underline">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to all tools
              </a>
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="flex items-center mb-6">
              <div className={`w-12 h-12 rounded-lg bg-${tool.color} bg-opacity-10 flex items-center justify-center mr-4`}>
                <tool.icon className={`h-6 w-6 text-${tool.color}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-400">{tool.name}</h1>
                <p className="text-neutral-300">{tool.description}</p>
              </div>
            </div>
            
            {!result ? (
              <>
                <div className="mb-6">
                  <h2 className="font-semibold text-neutral-400 mb-2">Upload Files</h2>
                  <FileDropzone
                    onFilesAdded={handleFilesAdded}
                    multiple={tool.id === 'merge-pdf'}
                    acceptedFileTypes={tool.acceptedFileTypes}
                    className="bg-gray-50 mb-4"
                  />
                </div>
                
                {files.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-semibold text-neutral-400 mb-2">Files to process</h2>
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
                        <span className="text-sm font-medium text-neutral-300">Processing</span>
                        <span className="text-sm font-medium text-neutral-300">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  ) : (
                    <Button 
                      onClick={handleProcessFiles}
                      disabled={files.length === 0 || isUploading || isProcessing}
                      className="w-full bg-primary hover:bg-red-600 text-white"
                    >
                      {isUploading || isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Process with ${tool.name}`
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
                <h3 className="text-xl font-semibold text-neutral-400 mb-2">Processing Complete!</h3>
                <p className="text-neutral-300 mb-6">Your file is ready to download</p>
                
                <Button 
                  onClick={handleDownload}
                  className="bg-secondary hover:bg-blue-600 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download File
                </Button>
                
                <div className="mt-6">
                  <button 
                    onClick={() => {
                      setFiles([]);
                      setResult(null);
                    }}
                    className="text-secondary hover:underline text-sm"
                  >
                    Process another file
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
