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
    name: 'PDF to Word',
    description: 'Convert PDFs to editable Word documents.',
    icon: FileText,
    category: 'convert-from-pdf',
    color: 'primary',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/pdf-to-word',
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Extract PDF tables to Excel spreadsheets.',
    icon: FileSpreadsheet,
    category: 'convert-from-pdf',
    color: 'primary',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/pdf-to-excel',
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    description: 'Turn PDFs into editable presentations.',
    icon: FileType,
    category: 'convert-from-pdf',
    color: 'primary',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/pdf-to-powerpoint',
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert each PDF page to a JPG image.',
    icon: FileImage,
    category: 'convert-from-pdf',
    color: 'primary',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/pdf-to-jpg',
  },

  // Convert to PDF
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert Word documents to PDF format.',
    icon: FileEdit,
    category: 'convert-to-pdf',
    color: 'secondary',
    acceptedFileTypes: ['.doc', '.docx'],
    route: '/tool/word-to-pdf',
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF format.',
    icon: FileEdit,
    category: 'convert-to-pdf',
    color: 'secondary',
    acceptedFileTypes: ['.xls', '.xlsx'],
    route: '/tool/excel-to-pdf',
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    description: 'Convert PowerPoint presentations to PDF.',
    icon: FileEdit,
    category: 'convert-to-pdf',
    color: 'secondary',
    acceptedFileTypes: ['.ppt', '.pptx'],
    route: '/tool/powerpoint-to-pdf',
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert JPG images to PDF format.',
    icon: FileEdit,
    category: 'convert-to-pdf',
    color: 'secondary',
    acceptedFileTypes: ['.jpg', '.jpeg', '.png'],
    route: '/tool/jpg-to-pdf',
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    description: 'Convert web pages to PDF documents.',
    icon: FileEdit,
    category: 'convert-to-pdf',
    color: 'secondary',
    acceptedFileTypes: ['.html', '.htm'],
    route: '/tool/html-to-pdf',
  },

  // Edit PDF
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one document.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/merge-pdf',
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Divide PDF into separate files.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/split-pdf',
  },
  {
    id: 'remove-pages',
    name: 'Remove Pages',
    description: 'Delete specific pages from PDF.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/remove-pages',
  },
  {
    id: 'extract-pages',
    name: 'Extract Pages',
    description: 'Save selected pages as a new PDF.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/extract-pages',
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate PDF pages to correct orientation.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/rotate-pdf',
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/compress-pdf',
  },
  {
    id: 'add-page-numbers',
    name: 'Add Page Numbers',
    description: 'Insert customizable page numbering to PDF.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/add-page-numbers',
  },
  {
    id: 'repair-pdf',
    name: 'Repair PDF',
    description: 'Fix corrupted PDF files.',
    icon: FileEdit,
    category: 'edit-pdf',
    color: 'success',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/repair-pdf',
  },

  // Security
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    description: 'Add password security to your PDF.',
    icon: File,
    category: 'security',
    color: 'warning',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/protect-pdf',
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Remove password protection from PDF.',
    icon: File,
    category: 'security',
    color: 'warning',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/unlock-pdf',
  },
  {
    id: 'add-watermark',
    name: 'Add Watermark',
    description: 'Apply text or image watermarks to PDF.',
    icon: File,
    category: 'security',
    color: 'warning',
    acceptedFileTypes: ['.pdf'],
    route: '/tool/add-watermark',
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    description: 'Add digital signatures to PDF documents.',
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
