import { Link } from 'wouter';
import { 
  Twitter, 
  Facebook, 
  Instagram,
  Github
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-400 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PDF<span className="text-primary">Tools</span></h3>
            <p className="text-gray-300 text-sm">The complete PDF solution for all your document needs. Easy to use, secure, and available on any device.</p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/tool/merge-pdf"><a className="hover:text-white">Merge PDF</a></Link></li>
              <li><Link href="/tool/split-pdf"><a className="hover:text-white">Split PDF</a></Link></li>
              <li><Link href="/tool/compress-pdf"><a className="hover:text-white">Compress PDF</a></Link></li>
              <li><Link href="/?category=convert-to-pdf"><a className="hover:text-white">Convert to PDF</a></Link></li>
              <li><Link href="/?category=convert-from-pdf"><a className="hover:text-white">Convert from PDF</a></Link></li>
              <li><Link href="/tool/edit-pdf"><a className="hover:text-white">Edit PDF</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">API Documentation</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Affiliate Program</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} PDFTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
