'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
  ChevronRight, UploadCloud, FileText, 
  X, Lock, ScanText, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import ProcessingState from '@/components/pdf-tools/ProcessingState';
import SuccessState from '@/components/pdf-tools/SuccessState';
import ErrorState from '@/components/pdf-tools/ErrorState';

type ToolState = 'idle' | 'processing' | 'success' | 'error';
type OcrLevel = 'low' | 'mid' | 'high';

export default function OcrPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [toolState, setToolState] = useState<ToolState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [level, setLevel] = useState<OcrLevel>('mid');

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        alert("Please select a valid PDF file.");
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
      } else {
        alert("Please drop a valid PDF file.");
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

  const handleOcrAction = async () => {
    if (!file) return;
    setToolState('processing');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('level', level);

      const response = await axios.post(
        'https://pdf-wallah-rt2y.onrender.com/api/ocr',
        formData,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const blob = response.data;
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setToolState('success');

    } catch (err: any) {
      console.error("API OCR Error:", err);

      let errorMsg = 'An error occurred while running OCR on the server.';
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
    if (!resultUrl || !file) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    link.download = `${baseName}_ocr.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setResultUrl(null);
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
              ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10' 
              : 'border-gray-300 dark:border-gray-700 hover:border-violet-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <div className="bg-violet-100 dark:bg-violet-500/20 p-4 rounded-full text-violet-600 mb-6">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select PDF file</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">or drop PDF here to make it searchable</p>
          <input 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
          />
          <Button onClick={() => fileInputRef.current?.click()} className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-md transition-all">
            Select PDF File
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          
          <div className="w-full lg:w-2/5 min-w-0 overflow-hidden bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex items-center gap-4 h-fit">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-violet-600 shadow-sm shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden pt-1">
              <p className="text-base font-bold text-gray-900 dark:text-white truncate block w-full" title={file.name}>
                {file.name}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
                {formatSize(file.size)}
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
              <Settings className="w-5 h-5 text-violet-500 shrink-0" /> OCR Accuracy Level
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div onClick={() => setLevel('low')} className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${level === 'low' ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-violet-200'}`}>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Fast</p>
                <p className="text-xs text-gray-500 mt-1 leading-tight">Quicker results, standard accuracy</p>
              </div>
              
              <div onClick={() => setLevel('mid')} className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${level === 'mid' ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-violet-200'}`}>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Balanced</p>
                <p className="text-xs text-gray-500 mt-1 leading-tight">Good speed and accuracy</p>
              </div>

              <div onClick={() => setLevel('high')} className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${level === 'high' ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-violet-200'}`}>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Accurate</p>
                <p className="text-xs text-gray-500 mt-1 leading-tight">Deep scan, highest precision</p>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
          <Button onClick={handleOcrAction} className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-6 text-lg font-bold rounded-xl shadow-lg transition-all w-full sm:w-auto">
            Run OCR
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
            <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100">OCR PDF</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 flex items-center justify-center gap-3">
            <ScanText className="w-10 h-10 text-violet-600 hidden sm:block" />
            OCR PDF Tool
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Convert scanned PDFs into searchable, selectable text with AI-powered OCR.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 w-fit mx-auto px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
            <Lock className="w-4 h-4" /> Secure Cloud Processing
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white dark:bg-[#111A2C] rounded-2xl shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 p-6 sm:p-10 min-h-[400px]">
          {toolState === 'idle' && renderWorkspace()}
          {toolState === 'processing' && <ProcessingState title="Running OCR..." />}
          {toolState === 'success' && (
            <SuccessState
              onDownload={downloadResult}
              onReset={resetTool}
              title="OCR Complete!"
              filename={file ? `${file.name.substring(0, file.name.lastIndexOf('.')) || file.name}_ocr.pdf` : 'ocr_result.pdf'}
            />
          )}
          {toolState === 'error' && <ErrorState errorMessage={errorMessage} onRetry={() => setToolState('idle')} />}
        </div>
      </div>
    </div>
  );
}