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
        <title>Connexa Lab - Strumenti PDF professionali</title>
        <meta name="description" content="Strumenti PDF online gratuiti per unire, dividere, comprimere, convertire e modificare file PDF. Strumenti di manipolazione PDF facili da usare e sicuri." />
        <meta property="og:title" content="Connexa Lab - Strumenti PDF professionali" />
        <meta property="og:description" content="Strumenti PDF online gratuiti per unire, dividere, comprimere, convertire e modificare file PDF. Strumenti di manipolazione PDF facili da usare e sicuri." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://connexalab.com" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Hero />
          <ToolsGrid category={category} />
          <HowItWorks />
          <Features />
        </main>
        <Footer />
      </div>
    </>
  );
}
