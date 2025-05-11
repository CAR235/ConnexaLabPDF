import { pdfTools, Tool } from '@/lib/pdfTools';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
}

function ToolCard({ tool }: ToolCardProps) {
  const colorClasses = {
    primary: 'bg-primary text-primary',
    secondary: 'bg-secondary text-secondary',
    success: 'bg-success text-success',
    warning: 'bg-warning text-warning',
  };

  const IconComponent = tool.icon;

  return (
    <div className="tool-card bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className={cn("w-10 h-10 rounded-lg bg-opacity-10 flex items-center justify-center mr-3", colorClasses[tool.color])}>
            <IconComponent className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-neutral-400">{tool.name}</h3>
        </div>
        <p className="text-sm text-neutral-300">{tool.description}</p>
        <Link href={tool.route}>
          <a className="mt-4 w-full inline-block text-center bg-gray-100 hover:bg-gray-200 text-neutral-400 font-medium py-2 rounded-lg transition-colors text-sm">
            {tool.name}
          </a>
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

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-neutral-400 mb-2 text-center">All PDF Tools</h2>
        <p className="text-neutral-300 mb-8 text-center max-w-3xl mx-auto">
          Easily convert, compress, merge, split, rotate and unlock PDFs with our free online PDF tools.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
