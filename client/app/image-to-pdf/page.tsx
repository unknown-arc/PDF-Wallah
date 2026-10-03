'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, UploadCloud, ShieldCheck, 
  X, Lock, Plus, GripVertical, ImagePlus, Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PDFDocument } from 'pdf-lib';

import ProcessingState from '@/components/pdf-tools/ProcessingState';
import SuccessState from '@/components/pdf-tools/SuccessState';
import ErrorState from '@/components/pdf-tools/ErrorState';

type ToolState = 'idle' | 'processing' | 'success' | 'error';
type PageSize = 'fit' | 'a4' | 'letter';
type Margin = 'none' | 'small' | 'big';
type Orientation = 'portrait' | 'landscape';

interface ImageFile {
  file: File;
  previewUrl: string;
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [toolState, setToolState] = useState<ToolState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [pageSize, setPageSize] = useState<PageSize>('fit');
  const [margin, setMargin] = useState<Margin>('none');
  const [orientation, setOrientation] = useState<Orientation>('portrait');

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.previewUrl));
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [images, pdfUrl]);

  const processFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(
      file => file.type === 'image/jpeg' || file.type === 'image/png'
    );
    const newImages = validFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) processFiles(Array.from(e.dataTransfer.files));
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[indexToRemove].previewUrl);
      newImages.splice(indexToRemove, 1);
      return newImages;
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDropSort = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;
    
    const newImages = [...images];
    const [draggedImg] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImg);
    setImages(newImages);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleConversionAction = async () => {
    if (images.length === 0) return;
    setToolState('processing');

    try {
      const pdfDoc = await PDFDocument.create();

      const A4 = [595.28, 841.89];
      const LETTER = [612, 792];

      const margins = {
        none: 0,
        small: 20,
        big: 50
      };
      
      const m = margins[margin];

      for (const imgObj of images) {
        const imageBytes = await imgObj.file.arrayBuffer();
        let pdfImage;

        if (imgObj.file.type === 'image/jpeg') {
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else if (imgObj.file.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
          continue;
        }

        let pageWidth, pageHeight;
        const imgWidth = pdfImage.width;
        const imgHeight = pdfImage.height;

        if (pageSize === 'fit') {
          pageWidth = imgWidth + (m * 2);
          pageHeight = imgHeight + (m * 2);
        } else {
          const baseSize = pageSize === 'a4' ? A4 : LETTER;
          if (orientation === 'landscape') {
            pageWidth = baseSize[1];
            pageHeight = baseSize[0];
          } else {
            pageWidth = baseSize[0];
            pageHeight = baseSize[1];
          }
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        const availWidth = pageWidth - (m * 2);
        const availHeight = pageHeight - (m * 2);

        const scaleFactor = Math.min(availWidth / imgWidth, availHeight / imgHeight);

        const drawWidth = imgWidth * scaleFactor;
        const drawHeight = imgHeight * scaleFactor;

        const x = m + (availWidth - drawWidth) / 2;
        const y = m + (availHeight - drawHeight) / 2;

        page.drawImage(pdfImage, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setToolState('success');
    } catch (err: any) {
      console.error("Image to PDF Error:", err);
      setErrorMessage(err.message || 'An error occurred while creating the PDF.');
      setToolState('error');
    }
  };

  const downloadResult = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = images.length === 1 
      ? `${images[0].file.name.split('.')[0]}_converted.pdf` 
      : 'Images_Converted_PDFWallah.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setPdfUrl(null);
    setErrorMessage('');
    setToolState('idle');
  };

  const renderWorkspace = () => {
    if (images.length === 0) {
      return (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-3 border-dashed rounded-xl flex flex-col items-center justify-center py-20 px-6 text-center transition-all duration-200 ${
            isDragging 
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10' 
              : 'border-gray-300 dark:border-gray-700 hover:border-orange-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <div className="bg-orange-100 dark:bg-orange-500/20 p-4 rounded-full text-orange-600 mb-6">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Drop JPG or PNG images here</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Merge multiple images into a single PDF document</p>
          <input type="file" multiple accept="image/jpeg, image/png" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
          <Button onClick={() => fileInputRef.current?.click()} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-md transition-all">
            Select Images
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Selected Images ({images.length})</h3>
          <div className="flex gap-3">
            <input type="file" multiple accept="image/jpeg, image/png" className="hidden" id="add-more" onChange={handleFileSelect} />
            <Button variant="outline" onClick={() => document.getElementById('add-more')?.click()} className="border-gray-200 dark:border-gray-700 font-semibold rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Add More
            </Button>
          </div>
        </div>

        <div className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Page Size</label>
            <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
              {(['fit', 'a4', 'letter'] as PageSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setPageSize(s)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                    pageSize === s ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {s === 'fit' ? 'Fit Image' : s}
                </button>
              ))}
            </div>
          </div>

          <div className={pageSize === 'fit' ? 'opacity-50 pointer-events-none' : ''}>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Orientation</label>
            <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
              {(['portrait', 'landscape'] as Orientation[]).map((o) => (
                <button
                  key={o}
                  onClick={() => setOrientation(o)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                    orientation === o ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Margin</label>
            <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
              {(['none', 'small', 'big'] as Margin[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMargin(m)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                    margin === m ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((imgObj, index) => (
            <div 
              key={`${imgObj.file.name}-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropSort(e, index)}
              className="group relative flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-orange-400 cursor-grab active:cursor-grabbing transition-colors overflow-hidden shadow-sm"
            >
              <div className="relative h-32 w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                <img src={imgObj.previewUrl} alt={imgObj.file.name} className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 left-2 bg-black/40 p-1 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-3.5 h-3.5" />
                </div>
                <button onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate" title={imgObj.file.name}>{imgObj.file.name}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">{formatSize(imgObj.file.size)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
          <Button onClick={handleConversionAction} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-6 text-lg font-bold rounded-xl shadow-lg transition-all w-full sm:w-auto">
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
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100">Image to PDF</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 flex items-center justify-center gap-3">
            <ImagePlus className="w-10 h-10 text-orange-500 hidden sm:block" />
            Image to PDF
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Convert JPG and PNG images to PDF in seconds. Customize margins, orientation, and size.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 w-fit mx-auto px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
            <Lock className="w-4 h-4" /> Your files stay on your device
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white dark:bg-[#111A2C] rounded-2xl shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 p-6 sm:p-10 min-h-[400px]">
          
          {toolState === 'idle' && renderWorkspace()}
          {toolState === 'processing' && <ProcessingState title="Generating PDF..." />}
          {toolState === 'success' && (
            <SuccessState 
              onDownload={downloadResult} 
              onReset={resetTool}
              title="PDF Created Successfully!"
              filename={images.length === 1 ? `${images[0].file.name.split('.')[0]}_converted.pdf` : 'Images_Converted_PDFWallah.pdf'}
            />
          )}
          {toolState === 'error' && (
            <ErrorState errorMessage={errorMessage} onRetry={() => setToolState('idle')} />
          )}

        </div>
        
        {toolState === 'idle' && (
          <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Images are processed locally in your browser. They never leave your device.
          </div>
        )}
      </div>
    </div>
  );
}