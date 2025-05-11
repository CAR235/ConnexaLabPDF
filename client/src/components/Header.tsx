import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <a className="flex items-center">
              <span className="accent-gradient font-bold text-2xl md:text-3xl">Connexa</span>
              <span className="font-light text-2xl md:text-3xl ml-1">Lab</span>
            </a>
          </Link>
          <nav className="hidden md:flex ml-10 space-x-8">
            <Link href="/">
              <a className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium transition-colors">Tutti gli Strumenti</a>
            </Link>
            <Link href="/?category=convert-from-pdf">
              <a className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium transition-colors">Converti da PDF</a>
            </Link>
            <Link href="/?category=convert-to-pdf">
              <a className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium transition-colors">Converti in PDF</a>
            </Link>
            <Link href="/?category=edit-pdf">
              <a className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium transition-colors">Modifica PDF</a>
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="hidden md:inline-flex text-neutral-800 hover:text-[#dadb00] text-base font-medium transition-colors">
            Accedi
          </button>
          <Button className="bg-[#dadb00] hover:bg-[#c0c100] text-black px-6 py-2 text-base font-semibold shadow-md">
            Registrati
          </Button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="mb-4">
                  <span className="accent-gradient font-bold text-2xl">Connexa</span>
                  <span className="font-light text-2xl ml-1">Lab</span>
                </div>
                <Link href="/">
                  <a onClick={() => setIsOpen(false)} className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium">
                    Tutti gli Strumenti
                  </a>
                </Link>
                <Link href="/?category=convert-from-pdf">
                  <a onClick={() => setIsOpen(false)} className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium">
                    Converti da PDF
                  </a>
                </Link>
                <Link href="/?category=convert-to-pdf">
                  <a onClick={() => setIsOpen(false)} className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium">
                    Converti in PDF
                  </a>
                </Link>
                <Link href="/?category=edit-pdf">
                  <a onClick={() => setIsOpen(false)} className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium">
                    Modifica PDF
                  </a>
                </Link>
                <div className="pt-4 border-t border-gray-200">
                  <Button className="w-full" variant="outline">Accedi</Button>
                </div>
                <Button className="w-full bg-[#dadb00] hover:bg-[#c0c100] text-black font-semibold">
                  Registrati
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
