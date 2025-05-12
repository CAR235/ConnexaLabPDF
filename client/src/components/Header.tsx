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
            <div className="flex items-center cursor-pointer">
              <img src="/Risorsa 13.svg" alt="Connexa Lab" className="h-8 md:h-10" />
            </div>
          </Link>
          <nav className="hidden md:flex ml-10 space-x-8">
            <Link href="/">
              <div className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium transition-colors cursor-pointer">Tutti gli Strumenti</div>
            </Link>
            <Link href="/?category=convert-from-pdf">
              <div className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium transition-colors cursor-pointer">Converti da PDF</div>
            </Link>
            <Link href="/?category=convert-to-pdf">
              <div className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium transition-colors cursor-pointer">Converti in PDF</div>
            </Link>
            <Link href="/?category=edit-pdf">
              <div className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium transition-colors cursor-pointer">Modifica PDF</div>
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
                  <div onClick={() => setIsOpen(false)} className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium cursor-pointer">
                    Tutti gli Strumenti
                  </div>
                </Link>
                <Link href="/?category=convert-from-pdf">
                  <div onClick={() => setIsOpen(false)} className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium cursor-pointer">
                    Converti da PDF
                  </div>
                </Link>
                <Link href="/?category=convert-to-pdf">
                  <div onClick={() => setIsOpen(false)} className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium cursor-pointer">
                    Converti in PDF
                  </div>
                </Link>
                <Link href="/?category=edit-pdf">
                  <div onClick={() => setIsOpen(false)} className="text-neutral-800 hover:text-[#dadb00] px-2 py-2 text-base font-medium cursor-pointer">
                    Modifica PDF
                  </div>
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
