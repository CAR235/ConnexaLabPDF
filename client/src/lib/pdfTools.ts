import { File, FileEdit, FileImage, FileSpreadsheet, FileText, FileType } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'convert-from-pdf' | 'convert-to-pdf' | 'edit-pdf' | 'security';
  color: 'primary' | 'secondary' | 'success' | 'warning';
  acceptedFileTypes: string[];
  route: string;
}

export const pdfTools: Tool[] = [
  // Convert from PDF
  {
    id: 'pdf-to-word',
    name: 'PDF a Word',
    description: 'Converti PDF in documenti Word modificabili.',
    icon: FileText,
    category: 'convert-from-pdf',
    color: 'primary',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/pdf-to-word',
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF a Excel',
    description: 'Estrai tabelle PDF in fogli di calcolo Excel.',
    icon: FileSpreadsheet,
    category: 'convert-from-pdf',
    color: 'primary',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/pdf-to-excel',
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF a PowerPoint',
    description: 'Trasforma PDF in presentazioni modificabili.',
    icon: FileType,
    category: 'convert-from-pdf',
    color: 'primary',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/pdf-to-powerpoint',
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF a JPG',
    description: 'Converti ogni pagina PDF in un\'immagine JPG.',
    icon: FileImage,
    category: 'convert-from-pdf',
    color: 'primary',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/pdf-to-jpg',
  },

  // Convert to PDF
  {
    id: 'word-to-pdf',
    name: 'Word a PDF',
    description: 'Converti documenti Word in formato PDF.',
    icon: FileEdit,
    category: 'convert-to-pdf',
    color: 'secondary',
    acceptedFileTypes: ['.doc', '.docx'],
    route: '/tool/word-to-pdf',
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel a PDF',
    description: 'Converti fogli di calcolo Excel in formato PDF.',
    icon: FileEdit,
    category: 'convert-to-pdf',
    color: 'secondary',
    acceptedFileTypes: ['.xls', '.xlsx'],
    route: '/tool/excel-to-pdf',
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'PowerPoint a PDF',
    description: 'Converti presentazioni PowerPoint in PDF.',
    icon: FileEdit,
    category: 'convert-to-pdf',
    color: 'secondary',
    acceptedFileTypes: ['.ppt', '.pptx'],
    route: '/tool/powerpoint-to-pdf',
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG a PDF',
    description: 'Converti immagini JPG in formato PDF.',
    icon: FileEdit,
    category: 'convert-to-pdf',
    color: 'secondary',
    acceptedFileTypes: ['.jpg', '.jpeg', '.png'],
    route: '/tool/jpg-to-pdf',
  },
  {
    id: 'html-to-pdf',
    name: 'HTML a PDF',
    description: 'Converti pagine web in documenti PDF.',
    icon: FileEdit,
    category: 'convert-to-pdf',
    color: 'secondary',
    acceptedFileTypes: ['.html', '.htm'],
    route: '/tool/html-to-pdf',
  },

  // Edit PDF
  {
    id: 'merge-pdf',
    name: 'Unisci PDF',
    description: 'Combina più PDF in un unico documento.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/merge-pdf',
  },
  {
    id: 'split-pdf',
    name: 'Dividi PDF',
    description: 'Dividi un PDF in file separati.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/split-pdf',
  },
  {
    id: 'remove-pages',
    name: 'Rimuovi Pagine',
    description: 'Elimina pagine specifiche dal PDF.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/remove-pages',
  },
  {
    id: 'extract-pages',
    name: 'Estrai Pagine',
    description: 'Salva pagine selezionate come nuovo PDF.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/extract-pages',
  },
  {
    id: 'rotate-pdf',
    name: 'Ruota PDF',
    description: 'Ruota le pagine PDF per correggere l\'orientamento.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/rotate-pdf',
  },
  {
    id: 'compress-pdf',
    name: 'Comprimi PDF',
    description: 'Riduci la dimensione del file PDF mantenendo la qualità.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/compress-pdf',
  },
  {
    id: 'add-page-numbers',
    name: 'Numera Pagine',
    description: 'Inserisci numerazione personalizzabile nel PDF.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/add-page-numbers',
  },
  {
    id: 'repair-pdf',
    name: 'Ripara PDF',
    description: 'Ripara file PDF danneggiati.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/repair-pdf',
  },

  // Security
  {
    id: 'protect-pdf',
    name: 'Proteggi PDF',
    description: 'Aggiungi protezione con password al tuo PDF.',
    icon: File,
    category: 'security',
    color: 'warning',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/protect-pdf',
  },
  {
    id: 'unlock-pdf',
    name: 'Sblocca PDF',
    description: 'Rimuovi la protezione con password dal PDF.',
    icon: File,
    category: 'security',
    color: 'warning',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/unlock-pdf',
  },
  {
    id: 'add-watermark',
    name: 'Aggiungi Filigrana',
    description: 'Applica filigrane di testo o immagini al PDF.',
    icon: File,
    category: 'security',
    color: 'warning',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/add-watermark',
  },
  {
    id: 'sign-pdf',
    name: 'Firma PDF',
    description: 'Aggiungi firme digitali ai documenti PDF.',
    icon: File,
    category: 'security',
    color: 'warning',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/sign-pdf',
  },
];

export function getToolById(id: string): Tool | undefined {
  return pdfTools.find(tool => tool.id === id);
}

export function getToolsByCategory(category: Tool['category']): Tool[] {
  return pdfTools.filter(tool => tool.category === category);
}

export function getAllTools(): Tool[] {
  return pdfTools;
}
