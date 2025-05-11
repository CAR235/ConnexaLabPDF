import { 
  Database, 
  Lock, 
  CheckCircle, 
  Clock, 
  Cloud, 
  Monitor 
} from 'lucide-react';

export function Features() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">
          <span className="accent-gradient">Caratteristiche Principali</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-100 hover:border-[#dadb00] transition-all duration-300">
            <div className="w-12 h-12 bg-[#dadb00] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <Cloud className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">Elaborazione Cloud</h3>
            <p className="text-neutral-600">Tutte le operazioni PDF vengono elaborate nel cloud, risparmiando le risorse del computer e garantendo prestazioni elevate.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-100 hover:border-[#dadb00] transition-all duration-300">
            <div className="w-12 h-12 bg-[#dadb00] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">100% Sicuro</h3>
            <p className="text-neutral-600">I tuoi file sono criptati durante il trasferimento e automaticamente eliminati dopo l'elaborazione per garantire la tua privacy.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-100 hover:border-[#dadb00] transition-all duration-300">
            <div className="w-12 h-12 bg-[#dadb00] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">Alta Qualità</h3>
            <p className="text-neutral-600">I nostri algoritmi avanzati garantiscono che i tuoi PDF convertiti ed elaborati mantengano la massima qualità possibile.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-100 hover:border-[#dadb00] transition-all duration-300">
            <div className="w-12 h-12 bg-[#dadb00] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">Elaborazione Rapida</h3>
            <p className="text-neutral-600">Tempi di elaborazione rapidi per tutte le tue attività PDF, anche per file di grandi dimensioni o operazioni complesse.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-100 hover:border-[#dadb00] transition-all duration-300">
            <div className="w-12 h-12 bg-[#dadb00] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <Database className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">Facile da Usare</h3>
            <p className="text-neutral-600">L'interfaccia intuitiva drag-and-drop rende semplice caricare, modificare e scaricare i tuoi file PDF senza conoscenze tecniche.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-100 hover:border-[#dadb00] transition-all duration-300">
            <div className="w-12 h-12 bg-[#dadb00] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <Monitor className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">Multi-Piattaforma</h3>
            <p className="text-neutral-600">Funziona su qualsiasi dispositivo con un browser web, inclusi desktop, laptop, tablet e smartphone con design responsive.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
