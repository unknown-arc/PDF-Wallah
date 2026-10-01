'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, UploadCloud, ShieldCheck, FileText, 
  X, Plus, GripVertical, Lock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PDFDocument } from 'pdf-lib';

// Import Reusable Components
import ProcessingState from '@/components/pdf-tools/ProcessingState';
import SuccessState from '@/components/pdf-tools/SuccessState';
import ErrorState from '@/components/pdf-tools/ErrorState';

type ToolState = 'idle' | 'processing' | 'success' | 'error';

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [toolState, setToolState] = useState<ToolState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null); // Store the final blob URL
  
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs to prevent memory leaks when component unmounts
  useEffect(() => {
    return () => {
      if (mergedPdfUrl) URL.revokeObjectURL(mergedPdfUrl);
    };
  }, [mergedPdfUrl]);

  // --- Handlers for File Selection & Drag-Drop ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDropSort = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;
    const newFiles = [...files];
    const [draggedFile] = newFiles.splice(dragIndex, 1);
    newFiles.splice(dropIndex, 0, draggedFile);
    setFiles(newFiles);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // --- Actual PDF-Lib Merge Logic ---
  const handleMergeAction = async () => {
    if (files.length < 2) return;
    
    setToolState('processing');

    try {
      // 1. Create a new empty PDF document
      const mergedPdf = await PDFDocument.create();

      // 2. Loop through all selected files in the current order
      for (const file of files) {
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const pdf = await PDFDocument.load(arrayBuffer);
        
        // Copy all pages from this PDF
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        
        // Add them to our merged document
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // 3. Save the merged PDF as a Uint8Array
      const mergedPdfBytes = await mergedPdf.save();

      // 4. Create a Blob and URL for downloading
      const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setMergedPdfUrl(url);
      setToolState('success');
    } catch (err: any) {
      console.error("PDF Merge Error:", err);
      setErrorMessage(err.message || 'An error occurred while merging the files. Please ensure the PDFs are not corrupted or password-protected.');
      setToolState('error');
    }
  };

  const downloadMergedPDF = () => {
    if (!mergedPdfUrl) return;
    
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = mergedPdfUrl;
    link.download = 'Merged_Document_PDFWallah.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    if (mergedPdfUrl) URL.revokeObjectURL(mergedPdfUrl); // Free up memory
    setFiles([]);
    setMergedPdfUrl(null);
    setErrorMessage('');
    setToolState('idle');
  };

  // --- Render Workspace ---
  const renderWorkspace = () => {
    if (files.length === 0) {
      return (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-3 border-dashed rounded-xl flex flex-col items-center justify-center py-20 px-6 text-center transition-all duration-200 ${
            isDragging 
              ? 'border-red-500 bg-red-50 dark:bg-red-500/10' 
              : 'border-gray-300 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <div className="bg-red-100 dark:bg-red-500/20 p-4 rounded-full text-red-600 dark:text-red-500 mb-6">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Drop PDF files here
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            or click below to browse your device
          </p>
          <input 
            type="file" multiple accept=".pdf" className="hidden" 
            ref={fileInputRef} onChange={handleFileSelect}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-md transition-all"
          >
            Select PDF Files
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Selected Files ({files.length})
          </h3>
          <div className="flex gap-3">
            <input 
              type="file" multiple accept=".pdf" className="hidden" 
              id="add-more" onChange={handleFileSelect}
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('add-more')?.click()}
              className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" /> Add More PDFs
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div 
              key={`${file.name}-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropSort(e, index)}
              className="group relative flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-400 cursor-grab active:cursor-grabbing transition-colors"
            >
              <div className="text-gray-400 group-hover:text-red-500">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg text-red-600 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{file.name}</p>
                <p className="text-xs text-gray-500 font-medium">{formatSize(file.size)}</p>
              </div>
              <button 
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 border border-gray-200 text-gray-500 hover:text-red-600 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
          <Button 
            disabled={files.length < 2}
            onClick={handleMergeAction}
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-6 text-lg font-bold rounded-xl shadow-lg transition-all w-full sm:w-auto"
          >
            Merge PDFs Now
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
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100">Merge PDF</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Merge PDF Files
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Combine multiple PDFs into one unified document. Drag and drop to reorder pages easily.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 w-fit mx-auto px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
            <Lock className="w-4 h-4" /> Your files stay on your device
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white dark:bg-[#111A2C] rounded-2xl shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 p-6 sm:p-10 min-h-[400px]">
          
          {toolState === 'idle' && renderWorkspace()}
          {toolState === 'processing' && <ProcessingState title="Merging PDFs..." />}
          {toolState === 'success' && (
            <SuccessState 
              onDownload={downloadMergedPDF} 
              onReset={resetTool}
              title="PDFs Merged Successfully!"
              filename="Merged_Document_PDFWallah.pdf"
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