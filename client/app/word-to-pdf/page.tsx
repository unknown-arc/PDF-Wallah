'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
  ChevronRight, UploadCloud, ShieldCheck, FileText, 
  X, Lock, FileUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import ProcessingState from '@/components/pdf-tools/ProcessingState';
import SuccessState from '@/components/pdf-tools/SuccessState';
import ErrorState from '@/components/pdf-tools/ErrorState';

type ToolState = 'idle' | 'processing' | 'success' | 'error';

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [toolState, setToolState] = useState<ToolState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('converted_document.pdf');

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    };
  }, [convertedUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        selectedFile.type === 'application/msword' ||
        selectedFile.type === 'text/plain' ||
        selectedFile.name.endsWith('.docx') ||
        selectedFile.name.endsWith('.doc') ||
        selectedFile.name.endsWith('.txt')
      ) {
        setFile(selectedFile);
      } else {
        alert("Please select a valid Word (.docx, .doc) or Text (.txt) file.");
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        droppedFile.type === 'application/msword' ||
        droppedFile.type === 'text/plain' ||
        droppedFile.name.endsWith('.docx') ||
        droppedFile.name.endsWith('.doc') ||
        droppedFile.name.endsWith('.txt')
      ) {
        setFile(droppedFile);
      } else {
        alert("Please drop a valid Word (.docx, .doc) or Text (.txt) file.");
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

  const handleConversionAction = async () => {
    if (!file) return;
    setToolState('processing');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'https://pdf-wallah-rt2y.onrender.com/api/conversion/to-pdf', 
        formData, 
        {
          responseType: 'blob', 
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const convertedBlob = response.data;
      const url = URL.createObjectURL(convertedBlob);

      const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setDownloadFilename(`${originalName}.pdf`);
      
      setConvertedUrl(url);
      setToolState('success');
      
    } catch (err: any) {
      console.error("API Conversion Error:", err);
      
      let errorMsg = 'An error occurred while converting the file on the server.';
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
    if (!convertedUrl) return;
    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setFile(null);
    setConvertedUrl(null);
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
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/10' 
              : 'border-gray-300 dark:border-gray-700 hover:border-sky-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <div className="bg-sky-100 dark:bg-sky-500/20 p-4 rounded-full text-sky-600 mb-6">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Word file</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">or drop DOC, DOCX, or TXT here</p>
          <input 
            type="file" 
            accept=".doc,.docx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
          />
          <Button onClick={() => fileInputRef.current?.click()} className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-md transition-all">
            Select Word File
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-center">

          <div className="w-full lg:w-1/2 min-w-0 overflow-hidden bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex items-center gap-4 h-fit">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-sky-600 shadow-sm shrink-0">
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

        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
          <Button onClick={handleConversionAction} className="bg-sky-600 hover:bg-sky-700 text-white px-10 py-6 text-lg font-bold rounded-xl shadow-lg transition-all w-full sm:w-auto">
            Convert to PDF
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
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100">Word to PDF</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 flex items-center justify-center gap-3">
            <FileUp className="w-10 h-10 text-sky-600 hidden sm:block" />
            Word to PDF Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Make DOC, DOCX, and TXT files easy to read by converting them to PDF format.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 w-fit mx-auto px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
            <Lock className="w-4 h-4" /> Secure Cloud Processing
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white dark:bg-[#111A2C] rounded-2xl shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 p-6 sm:p-10 min-h-[400px]">
          {toolState === 'idle' && renderWorkspace()}
          {toolState === 'processing' && <ProcessingState title="Converting to PDF..." />}
          {toolState === 'success' && (
            <SuccessState 
              onDownload={downloadResult} 
              onReset={resetTool}
              title="Conversion Successful!"
              filename={downloadFilename}
            />
          )}
          {toolState === 'error' && <ErrorState errorMessage={errorMessage} onRetry={() => setToolState('idle')} />}
        </div>
      </div>
    </div>
  );
}