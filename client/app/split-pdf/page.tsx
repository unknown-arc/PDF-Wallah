'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, UploadCloud, ShieldCheck, FileText, 
  X, Lock, Scissors 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PDFDocument } from 'pdf-lib';

import ProcessingState from '@/components/pdf-tools/ProcessingState';
import SuccessState from '@/components/pdf-tools/SuccessState';
import ErrorState from '@/components/pdf-tools/ErrorState';

type ToolState = 'idle' | 'processing' | 'success' | 'error';

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageRange, setPageRange] = useState<string>('');
  
  const [toolState, setToolState] = useState<ToolState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (splitPdfUrl) URL.revokeObjectURL(splitPdfUrl);
    };
  }, [splitPdfUrl]);

  const processSelectedFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setPageRange('');
    setTotalPages(0);
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdf.getPageCount());
    } catch (error) {
      console.error("Error reading PDF pages:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        processSelectedFile(selectedFile);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        processSelectedFile(droppedFile);
      }
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const parseRange = (rangeStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(',');
    
    for (const part of parts) {
      const p = part.trim();
      if (!p) continue;
      
      if (p.includes('-')) {
        const [startStr, endStr] = p.split('-');
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        
        if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
          const actualEnd = maxPages > 0 ? Math.min(end, maxPages) : end;
          for (let i = start; i <= actualEnd; i++) {
            pages.add(i - 1);
          }
        }
      } else {
        const num = parseInt(p);
        if (!isNaN(num) && num > 0 && (maxPages === 0 || num <= maxPages)) {
          pages.add(num - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplitAction = async () => {
    if (!file) return;
    if (!pageRange.trim()) {
      alert("Please enter a page range to extract (e.g., 1-5).");
      return;
    }
    
    setToolState('processing');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const actualMaxPages = originalPdf.getPageCount();

      const pagesToExtract = parseRange(pageRange, actualMaxPages);
      
      if (pagesToExtract.length === 0) {
        throw new Error("No valid pages found in the given range. Please check your input.");
      }

      const validPages = pagesToExtract.filter(p => p < actualMaxPages);

      if (validPages.length === 0) {
        throw new Error(`The document only has ${actualMaxPages} pages. Please enter a valid range.`);
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(originalPdf, validPages);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const splitPdfBytes = await newPdf.save();
      const blob = new Blob([splitPdfBytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setSplitPdfUrl(url);
      setToolState('success');
    } catch (err: any) {
      console.error("PDF Split Error:", err);
      setErrorMessage(err.message || 'An error occurred while splitting the file. Please ensure it is a valid, unencrypted PDF.');
      setToolState('error');
    }
  };

  const downloadSplitPDF = () => {
    if (!splitPdfUrl || !file) return;
    const link = document.createElement('a');
    link.href = splitPdfUrl;
    const originalName = file.name.replace('.pdf', '');
    link.download = `${originalName}_extracted.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    if (splitPdfUrl) URL.revokeObjectURL(splitPdfUrl);
    setFile(null);
    setPageRange('');
    setTotalPages(0);
    setSplitPdfUrl(null);
    setErrorMessage('');
    setToolState('idle');
  };

  const renderWorkspace = () => {
    if (!file) {
      return (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-3 border-dashed rounded-xl flex flex-col items-center justify-center py-20 px-6 text-center transition-all duration-200 ${
            isDragging 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' 
              : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <div className="bg-blue-100 dark:bg-blue-500/20 p-4 rounded-full text-blue-600 dark:text-blue-500 mb-6">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Drop your PDF file here
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            or click below to browse your device
          </p>
          <input 
            type="file" accept=".pdf" className="hidden" 
            ref={fileInputRef} onChange={handleFileSelect}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-md transition-all"
          >
            Select PDF File
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex items-start gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-blue-600 dark:text-blue-500 shadow-sm shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-base font-bold text-gray-900 dark:text-white truncate" title={file.name}>
                {file.name}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <span>{formatSize(file.size)}</span>
                {totalPages > 0 && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                    <span>{totalPages} Pages</span>
                  </>
                )}
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setTotalPages(0); setPageRange(''); }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-600 rounded-full p-2 shadow-sm transition-all"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 bg-white dark:bg-[#111A2C] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Scissors className="w-5 h-5 text-blue-500" /> Extraction Settings
            </h4>
            
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Pages to Extract
            </label>
            <Input 
              type="text" 
              placeholder="e.g., 1-5, 8, 11-13" 
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 h-12 text-base rounded-lg focus-visible:ring-blue-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Enter page numbers and/or page ranges separated by commas.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
          <Button 
            disabled={!pageRange.trim()}
            onClick={handleSplitAction}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg font-bold rounded-xl shadow-lg transition-all w-full sm:w-auto disabled:opacity-50"
          >
            Split PDF Now
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0B1221] pb-20 transition-colors duration-200">
      
      <div className="bg-white dark:bg-[#111A2C] border-b border-gray-200 dark:border-gray-800 pt-8 pb-12 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="flex justify-center items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100">Split PDF</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Split PDF File
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Extract specific pages or page ranges from your PDF quickly and easily.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 w-fit mx-auto px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
            <Lock className="w-4 h-4" /> Your files stay on your device
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white dark:bg-[#111A2C] rounded-2xl shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 p-6 sm:p-10 min-h-[400px]">
          
          {toolState === 'idle' && renderWorkspace()}
          
          {toolState === 'processing' && <ProcessingState title="Splitting PDF..." />}
          
          {toolState === 'success' && (
            <SuccessState 
              onDownload={downloadSplitPDF} 
              onReset={resetTool}
              title="PDF Split Successfully!"
              filename={file ? `${file.name.replace('.pdf', '')}_extracted.pdf` : 'Extracted_Pages.pdf'}
            />
          )}

          {toolState === 'error' && (
            <ErrorState 
              errorMessage={errorMessage}
              onRetry={() => setToolState('idle')}
            />
          )}

        </div>
        
        {toolState === 'idle' && (
          <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            PDF files are processed locally in your browser. They never leave your device.
          </div>
        )}
      </div>
    </div>
  );
}