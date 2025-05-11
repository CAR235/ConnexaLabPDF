import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HowItWorks() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 7;

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <section className="py-12 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">
          <span className="accent-gradient">Come Funziona</span>
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#dadb00] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-neutral-700 mb-2">Seleziona i tuoi file</h3>
              <p className="text-sm text-neutral-600">Scegli i file PDF che desideri modificare o convertire dal tuo dispositivo.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#dadb00] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-neutral-700 mb-2">Scegli lo strumento</h3>
              <p className="text-sm text-neutral-600">Seleziona tra la nostra ampia varietà di strumenti PDF per eseguire l'azione desiderata.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#dadb00] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-neutral-700 mb-2">Scarica il risultato</h3>
              <p className="text-sm text-neutral-600">Attendi che il PDF venga elaborato e scarica il file risultante.</p>
            </div>
          </div>
          
          {/* Tool preview interface */}
          <div className="mt-12 border border-gray-200 rounded-xl overflow-hidden shadow-md">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-neutral-700">Esempio: Unisci PDF</h3>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* File selection area */}
                <div className="flex-1">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start p-3 bg-white rounded border border-gray-200 mb-3">
                      {/* PDF icon */}
                      <div className="flex-shrink-0 w-10 h-10 bg-[#dadb00] bg-opacity-10 rounded flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      {/* File details */}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-neutral-700">Documento_1.pdf</h4>
                        <p className="text-xs text-neutral-500 mt-1">2 pagine • 1.2 MB</p>
                      </div>
                      {/* Remove button */}
                      <button className="text-neutral-500 hover:text-red-500">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-start p-3 bg-white rounded border border-gray-200 mb-3">
                      {/* PDF icon */}
                      <div className="flex-shrink-0 w-10 h-10 bg-[#dadb00] bg-opacity-10 rounded flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      {/* File details */}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-neutral-700">Documento_2.pdf</h4>
                        <p className="text-xs text-neutral-500 mt-1">5 pagine • 3.4 MB</p>
                      </div>
                      {/* Remove button */}
                      <button className="text-neutral-500 hover:text-red-500">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-center p-3 border border-dashed border-[#dadb00] rounded bg-gray-50 text-center">
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm text-neutral-500">Aggiungi altri file</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-[#dadb00] hover:bg-[#c0c100] text-black py-3 px-4 rounded-lg font-medium transition-colors">
                    Unisci File PDF
                  </Button>
                </div>
                
                {/* File preview area */}
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-center">
                    <h4 className="font-medium text-neutral-700 mb-3">Anteprima</h4>
                    <div className="relative bg-white border border-gray-200 rounded mx-auto mb-4" style={{ width: '160px', height: '220px' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-neutral-500">Pagina {currentPage}</span>
                      </div>
                    </div>
                    <div className="flex justify-center items-center space-x-2 text-neutral-600 text-sm">
                      <button onClick={handlePrevPage} disabled={currentPage === 1} className="disabled:opacity-50">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span>{currentPage} di {totalPages} pagine</span>
                      <button onClick={handleNextPage} disabled={currentPage === totalPages} className="disabled:opacity-50">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
