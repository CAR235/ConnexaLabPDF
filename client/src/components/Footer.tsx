import React from 'react';
import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container mx-auto text-center">
        <a 
          href="https://www.connexastudios.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Made by <span className="font-semibold ml-1 mr-1">Connexa Studios</span>
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </footer>
  );
}