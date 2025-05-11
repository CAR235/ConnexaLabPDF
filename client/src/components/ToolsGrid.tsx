import { pdfTools, Tool } from '@/lib/pdfTools';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
}

function ToolCard({ tool }: ToolCardProps) {
  const colorClasses = {
    primary: 'bg-[#dadb00] bg-opacity-10 text-black',
    secondary: 'bg-[#dadb00] bg-opacity-10 text-black',
    success: 'bg-[#dadb00] bg-opacity-10 text-black',
    warning: 'bg-[#dadb00] bg-opacity-10 text-black',
  };

  const IconComponent = tool.icon;

  const categoryNames: Record<string, string> = {
    'convert-from-pdf': 'Converti da PDF',
    'convert-to-pdf': 'Converti in PDF',
    'edit-pdf': 'Modifica PDF',
    'security': 'Sicurezza'
  };

  return (
    <div className="tool-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={cn("w-12 h-12 rounded-lg bg-opacity-10 flex items-center justify-center mr-4", colorClasses[tool.color])}>
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{categoryNames[tool.category]}</span>
            <h3 className="font-bold text-lg text-neutral-800">{tool.name}</h3>
          </div>
        </div>
        <p className="text-base text-neutral-600 mb-5">{tool.description}</p>
        <Link href={tool.route}>
          <div className="w-full inline-block text-center bg-white hover:bg-[#dadb00] text-neutral-800 font-medium py-3 rounded-lg transition-colors border-2 border-[#dadb00] bg-opacity-10 hover:text-black cursor-pointer">
            Usa {tool.name}
          </div>
        </Link>
      </div>
    </div>
  );
}

interface ToolsGridProps {
  category?: string;
}

export function ToolsGrid({ category }: ToolsGridProps) {
  const filteredTools = category 
    ? pdfTools.filter(tool => tool.category === category)
    : pdfTools;

  const categoryTitles: Record<string, string> = {
    'convert-from-pdf': 'Converti da PDF',
    'convert-to-pdf': 'Converti in PDF',
    'edit-pdf': 'Modifica PDF',
    'security': 'Strumenti di Sicurezza'
  };

  const title = category ? categoryTitles[category] : 'Tutti gli Strumenti PDF';

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-neutral-800 mb-3 text-center">
          <span className="accent-gradient">{title}</span>
        </h2>
        <p className="text-neutral-600 mb-12 text-center max-w-3xl mx-auto text-lg">
          Converti, comprimi, unisci, dividi, ruota e sblocca PDF con i nostri strumenti online gratuiti.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
