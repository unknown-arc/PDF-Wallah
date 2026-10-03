'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
  ChevronRight, UploadCloud, ShieldCheck, FileText, 
  X, Lock, Minimize2, Settings, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import ProcessingState from '@/components/pdf-tools/ProcessingState';
import SuccessState from '@/components/pdf-tools/SuccessState';
import ErrorState from '@/components/pdf-tools/ErrorState';

type ToolState = 'idle' | 'processing' | 'success' | 'error';
type CompressionMode = 'low' | 'mid' | 'high' | 'custom';

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [toolState, setToolState] = useState<ToolState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const [mode, setMode] = useState<CompressionMode>('mid');
  const [targetMb, setTargetMb] = useState<string>('');

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [compressedUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setOriginalSize(selectedFile.size);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setOriginalSize(droppedFile.size);
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

  const calculateSavings = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    const savings = ((originalSize - compressedSize) / originalSize) * 100;
    return savings > 0 ? savings.toFixed(1) : 0;
  };

  const handleCompressionAction = async () => {
    if (!file) return;

    let parsedTargetMb = 0;
    if (mode === 'custom') {
      parsedTargetMb = parseFloat(targetMb);
      if (isNaN(parsedTargetMb) || parsedTargetMb <= 0) {
        setErrorMessage("Please enter a valid target size greater than 0 MB.");
        setToolState('error');
        return;
      }
    }

    setToolState('processing');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', mode); 
      
      if (mode === 'custom') {
        formData.append('target_mb', parsedTargetMb.toString());
      }

      const response = await axios.post(
        'https://pdf-wallah-rt2y.onrender.com/api/compression', 
        formData, 
        {
          responseType: 'blob', 
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const compressedBlob = response.data;
      const url = URL.createObjectURL(compressedBlob);

      setCompressedSize(compressedBlob.size);
      setCompressedUrl(url);
      setToolState('success');
      
    } catch (err: any) {
      console.error("API Compression Error:", err);
      
      let errorMsg = 'An error occurred while compressing the PDF on the server.';
      if (err.response && err.response.data) {
        if (err.response.data instanceof Blob) {
           const text = await err.response.data.text();
           try {
             const json = JSON.parse(text);
             if (Array.isArray(json.detail)) {
                errorMsg = json.detail[0].msg || errorMsg;
             } else {
                errorMsg = json.detail || errorMsg;
             }
           } catch (e) {
             errorMsg = text || errorMsg;
           }
        } else {
           errorMsg = err.response.data.detail || errorMsg;
        }
      }
      
      setErrorMessage(errorMsg);
      setToolState('error');
    }
  };

  const downloadResult = () => {
    if (!compressedUrl || !file) return;
    const link = document.createElement('a');
    link.href = compressedUrl;
    link.download = `${file.name.replace('.pdf', '')}_compressed.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setFile(null);
    setCompressedUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
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
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
              : 'border-gray-300 dark:border-gray-700 hover:border-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <div className="bg-emerald-100 dark:bg-emerald-500/20 p-4 rounded-full text-emerald-600 mb-6">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select PDF file</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">or drop PDF here</p>
          <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
          <Button onClick={() => fileInputRef.current?.click()} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-md transition-all">
            Select PDF File
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="flex flex-col lg:flex-row gap-6 w-full">

          <div className="w-full lg:w-2/5 min-w-0 overflow-hidden bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex items-start gap-4 h-fit">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-emerald-500 shadow-sm shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden pt-1">
              <p className="text-base font-bold text-gray-900 dark:text-white truncate block w-full" title={file.name}>
                {file.name}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
                {formatSize(originalSize)}
              </p>
            </div>
            <button 
              onClick={() => setFile(null)} 
              className="shrink-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-600 rounded-full p-2 shadow-sm transition-all" 
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full lg:w-3/5 min-w-0 bg-white dark:bg-[#111A2C] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-emerald-500 shrink-0" /> Compression Settings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div onClick={() => setMode('low')} className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${mode === 'low' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-200'}`}>
                <p className="text-[13px] md:text-sm font-bold text-gray-900 dark:text-white">Less Compression</p>
                <p className="text-[11px] md:text-xs text-gray-500 mt-1 leading-tight">High quality, bigger size</p>
              </div>
              
              <div onClick={() => setMode('mid')} className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${mode === 'mid' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-200'}`}>
                <p className="text-[13px] md:text-sm font-bold text-gray-900 dark:text-white">Recommended</p>
                <p className="text-[11px] md:text-xs text-gray-500 mt-1 leading-tight">Good quality, good compression</p>
              </div>

              <div onClick={() => setMode('high')} className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${mode === 'high' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-200'}`}>
                <p className="text-[13px] md:text-sm font-bold text-gray-900 dark:text-white">Extreme Compression</p>
                <p className="text-[11px] md:text-xs text-gray-500 mt-1 leading-tight">Less quality, smaller size</p>
              </div>
              
              <div onClick={() => setMode('custom')} className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${mode === 'custom' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-200'}`}>
                <p className="text-[13px] md:text-sm font-bold text-gray-900 dark:text-white">Custom Size</p>
                <p className="text-[11px] md:text-xs text-gray-500 mt-1 leading-tight">Enter your target size manually</p>
              </div>
            </div>

            {mode === 'custom' && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Target Size
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    min="0.1"
                    placeholder="e.g. 2.5"
                    value={targetMb}
                    onChange={(e) => setTargetMb(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 pr-12 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-2.5 text-gray-500 font-medium">MB</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  Original file size is {(originalSize / (1024 * 1024)).toFixed(2)} MB.
                </p>
              </div>
            )}
          </div>
          
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
          <Button onClick={handleCompressionAction} className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-6 text-lg font-bold rounded-xl shadow-lg transition-all w-full sm:w-auto">
            Compress PDF
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
            <Link href="/" className="hover:text-emerald-500 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100">Compress PDF</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 flex items-center justify-center gap-3">
            <Minimize2 className="w-10 h-10 text-emerald-500 hidden sm:block" />
            Compress PDF file
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Reduce file size while optimizing for maximal PDF quality.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 w-fit mx-auto px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
            <Lock className="w-4 h-4" /> Secure Cloud Processing
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white dark:bg-[#111A2C] rounded-2xl shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 p-6 sm:p-10 min-h-[400px]">
          {toolState === 'idle' && renderWorkspace()}
          {toolState === 'processing' && <ProcessingState title="Compressing PDF..." />}
          {toolState === 'success' && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6 bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <div className="text-center px-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Original</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatSize(originalSize)}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-400" />
                <div className="text-center px-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Compressed</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatSize(compressedSize)}</p>
                </div>
                {calculateSavings() !== 0 && (
                  <div className="ml-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    -{calculateSavings()}%
                  </div>
                )}
              </div>
              <SuccessState 
                onDownload={downloadResult} 
                onReset={resetTool}
                title="PDF Compressed!"
                filename={file ? `${file.name.replace('.pdf', '')}_compressed.pdf` : 'Compressed_PDF.pdf'}
              />
            </div>
          )}
          {toolState === 'error' && <ErrorState errorMessage={errorMessage} onRetry={() => setToolState('idle')} />}
        </div>
      </div>
    </div>
  );
}