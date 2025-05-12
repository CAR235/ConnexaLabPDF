import React from 'react';
import { ExternalLink, FlaskConical } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer bg-gradient-to-r from-transparent via-background/50 to-transparent py-6 border-t border-foreground/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src=" /src/Logo2.png" alt="Connexa Lab" className="h-10 md:h-200" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              
            </a>
            <a 
              href="https://www.connexastudios.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-foreground hover:text-primary transition-colors font-medium"
            >
              Main Site <ExternalLink className="h-3 w-3 ml-1.5" />
            </a>
          </div>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} ConnexaLab. A Connexa Studios Tech Lab.
        </div>
      </div>
    </footer>
  );
}