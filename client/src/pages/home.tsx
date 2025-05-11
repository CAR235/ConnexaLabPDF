import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ToolsGrid } from '@/components/ToolsGrid';
import { HowItWorks } from '@/components/HowItWorks';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';

export default function Home() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const category = params.get('category') || undefined;

  return (
    <>
      <Helmet>
        <title>PDF Tools - All-in-one PDF solution</title>
        <meta name="description" content="Free online PDF tools to merge, split, compress, convert, and edit PDF files. Easy to use and secure PDF manipulation tools." />
        <meta property="og:title" content="PDF Tools - All-in-one PDF solution" />
        <meta property="og:description" content="Free online PDF tools to merge, split, compress, convert, and edit PDF files. Easy to use and secure PDF manipulation tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pdftools.example.com" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Hero />
          <ToolsGrid category={category} />
          <HowItWorks />
          <Features />
        </main>
      </div>
    </>
  );
}
