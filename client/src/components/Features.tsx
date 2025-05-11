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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-neutral-400 mb-8 text-center">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <Cloud className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-400 mb-2">Cloud Processing</h3>
            <p className="text-neutral-300">All PDF operations are processed in the cloud, saving your computer's resources and ensuring fast performance.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-400 mb-2">100% Secure</h3>
            <p className="text-neutral-300">Your files are encrypted during transfer and automatically deleted after processing to ensure your data stays private.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-400 mb-2">High Quality</h3>
            <p className="text-neutral-300">Our advanced algorithms ensure that your converted and processed PDFs maintain the highest quality possible.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-400 mb-2">Fast Processing</h3>
            <p className="text-neutral-300">Experience quick processing times for all your PDF tasks, even for large files or complex operations.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-400 mb-2">Easy to Use</h3>
            <p className="text-neutral-300">Intuitive drag-and-drop interface makes it simple to upload, edit, and download your PDF files without any technical knowledge.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <Monitor className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-400 mb-2">Cross-Platform</h3>
            <p className="text-neutral-300">Works on any device with a web browser, including desktops, laptops, tablets, and smartphones with responsive design.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
