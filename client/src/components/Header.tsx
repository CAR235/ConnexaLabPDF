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
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-primary font-bold text-2xl">PDF<span className="text-secondary">Tools</span></a>
          </Link>
          <nav className="hidden md:flex ml-8 space-x-6">
            <Link href="/">
              <a className="text-neutral-400 hover:text-primary px-1 py-2 text-sm font-medium">All Tools</a>
            </Link>
            <Link href="/?category=convert-from-pdf">
              <a className="text-neutral-400 hover:text-primary px-1 py-2 text-sm font-medium">Convert from PDF</a>
            </Link>
            <Link href="/?category=convert-to-pdf">
              <a className="text-neutral-400 hover:text-primary px-1 py-2 text-sm font-medium">Convert to PDF</a>
            </Link>
            <Link href="/">
              <a className="text-neutral-400 hover:text-primary px-1 py-2 text-sm font-medium">Pricing</a>
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="hidden md:inline-flex text-neutral-400 hover:text-primary text-sm font-medium">
            Sign In
          </button>
          <Button className="bg-primary hover:bg-red-600 text-white">
            Sign Up
          </Button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/">
                  <a onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-primary px-1 py-2 text-sm font-medium">
                    All Tools
                  </a>
                </Link>
                <Link href="/?category=convert-from-pdf">
                  <a onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-primary px-1 py-2 text-sm font-medium">
                    Convert from PDF
                  </a>
                </Link>
                <Link href="/?category=convert-to-pdf">
                  <a onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-primary px-1 py-2 text-sm font-medium">
                    Convert to PDF
                  </a>
                </Link>
                <Link href="/">
                  <a onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-primary px-1 py-2 text-sm font-medium">
                    Pricing
                  </a>
                </Link>
                <div className="pt-4 border-t border-gray-200">
                  <Button className="w-full" variant="outline">Sign In</Button>
                </div>
                <Button className="w-full bg-primary hover:bg-red-600 text-white">
                  Sign Up
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
