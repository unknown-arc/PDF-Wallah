import {
  FilePlus2,
  Split,
  Minimize2,
  FileText,
  FileUp,
  FileImage,
  ImagePlus,
  FileSpreadsheet,
  FileEdit,
  ScanText,
  LucideIcon
} from 'lucide-react';

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export const PDF_TOOLS: ToolItem[] = [
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDFs into one unified document',
    href: '/merge-pdf',
    icon: FilePlus2,
    iconColor: 'text-rose-600 dark:text-rose-500',
    iconBg: 'bg-rose-50',
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    description: 'Separate one page or a whole set for easy conversion',
    href: '/split-pdf',
    icon: Split,
    iconColor: 'text-blue-600 dark:text-blue-500',
    iconBg: 'bg-blue-50',
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality',
    href: '/compress-pdf',
    icon: Minimize2,
    iconColor: 'text-emerald-600 dark:text-emerald-500',
    iconBg: 'bg-emerald-50',
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Easily convert your PDF files into easy to edit DOC and DOCX',
    href: '/pdf-to-word',
    icon: FileText,
    iconColor: 'text-indigo-600 dark:text-indigo-500',
    iconBg: 'bg-indigo-50',
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Make DOC and DOCX files easy to read by converting them to PDF',
    href: '/word-to-pdf',
    icon: FileUp,
    iconColor: 'text-sky-600 dark:text-sky-500',
    iconBg: 'bg-sky-50',
  },
  {
    id: 'pdf-to-excel',
    title: 'PDF to Excel',
    description: 'Pull data straight from PDFs into Excel spreadsheets',
    href: '/pdf-to-excel',
    icon: FileSpreadsheet,
    iconColor: 'text-green-600 dark:text-green-500',
    iconBg: 'bg-green-50',
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG',
    description: 'Convert each PDF page into a JPG or extract all images',
    href: '/pdf-to-jpg',
    icon: FileImage,
    iconColor: 'text-amber-600 dark:text-amber-500',
    iconBg: 'bg-amber-50',
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Convert JPG, PNG, and TIFF images to PDF',
    href: '/image-to-pdf',
    icon: ImagePlus,
    iconColor: 'text-orange-600 dark:text-orange-500',
    iconBg: 'bg-orange-50',
  },
  {
    id: 'pdf-editor',
    title: 'PDF Editor',
    description: 'Add text, shapes, images and freehand annotations to your PDF',
    href: '/pdf-editor',
    icon: FileEdit,
    iconColor: 'text-purple-600 dark:text-purple-500',
    iconBg: 'bg-purple-50',
  },
  {
    id: 'ocr-pdf',
    title: 'OCR PDF',
    description: 'Convert scanned PDFs into searchable and selectable text',
    href: '/ocr-pdf',
    icon: ScanText,
    iconColor: 'text-pink-600 dark:text-pink-500',
    iconBg: 'bg-pink-50',
  }
];