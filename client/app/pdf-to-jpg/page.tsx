"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  UploadCloud,
  ShieldCheck,
  FileText,
  X,
  Lock,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";

import ProcessingState from "@/components/pdf-tools/ProcessingState";
import SuccessState from "@/components/pdf-tools/SuccessState";
import ErrorState from "@/components/pdf-tools/ErrorState";

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

type ToolState = "idle" | "processing" | "success" | "error";
type Quality = "0.5" | "0.8" | "1.0";

export default function PdfToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [quality, setQuality] = useState<Quality>("0.8");

  const [toolState, setToolState] = useState<ToolState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isZip, setIsZip] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const processSelectedFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setTotalPages(0);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdf.numPages);
    } catch (error) {
      console.error("Error reading PDF pages:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        processSelectedFile(selectedFile);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        processSelectedFile(droppedFile);
      }
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleConversionAction = async () => {
    if (!file) return;
    setToolState("processing");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const zip = new JSZip();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx)
        throw new Error("Canvas context is not supported in this browser.");

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);

        const viewport = page.getViewport({ scale: 2.0 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext: any = {
          canvasContext: ctx,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), "image/jpeg", parseFloat(quality));
        });

        if (blob) {
          if (numPages === 1) {
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            setIsZip(false);
            setToolState("success");
            return;
          }

          const pageNumString = i
            .toString()
            .padStart(numPages.toString().length, "0");
          zip.file(`page_${pageNumString}.jpg`, blob);
        }
      }

      if (numPages > 1) {
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        setDownloadUrl(url);
        setIsZip(true);
        setToolState("success");
      }
    } catch (err: any) {
      console.error("PDF to JPG Error:", err);
      setErrorMessage(
        err.message || "An error occurred while converting the PDF to images.",
      );
      setToolState("error");
    }
  };

  const downloadResult = () => {
    if (!downloadUrl || !file) return;
    const link = document.createElement("a");
    link.href = downloadUrl;

    const originalName = file.name.replace(".pdf", "");
    link.download = isZip
      ? `${originalName}_images.zip`
      : `${originalName}_image.jpg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setTotalPages(0);
    setDownloadUrl(null);
    setErrorMessage("");
    setToolState("idle");
  };

  const renderWorkspace = () => {
    if (!file) {
      return (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-3 border-dashed rounded-xl flex flex-col items-center justify-center py-20 px-6 text-center transition-all duration-200 ${
            isDragging
              ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10"
              : "border-gray-300 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          }`}
        >
          <div className="bg-amber-100 dark:bg-amber-500/20 p-4 rounded-full text-amber-600 dark:text-amber-500 mb-6">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Drop your PDF here
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            Convert every page into a JPG image
          </p>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-md transition-all"
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
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-amber-500 dark:text-amber-500 shadow-sm shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p
                className="text-base font-bold text-gray-900 dark:text-white truncate"
                title={file.name}
              >
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
              onClick={() => {
                setFile(null);
                setTotalPages(0);
              }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-600 rounded-full p-2 shadow-sm transition-all"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 bg-white dark:bg-[#111A2C] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-amber-500" /> Image Quality
            </h4>

            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {(["0.5", "0.8", "1.0"] as Quality[]).map((q, idx) => {
                const labels = ["Normal", "High", "Maximum"];
                return (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                      quality === q
                        ? "bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    {labels[idx]}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 font-medium flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> All pages will be extracted
              as JPGs.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
          <Button
            onClick={handleConversionAction}
            className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-6 text-lg font-bold rounded-xl shadow-lg transition-all w-full sm:w-auto"
          >
            Convert to JPG
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
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100">PDF to JPG</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            PDF to JPG Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Convert every page of your PDF document into high-quality JPG images
            instantly.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 w-fit mx-auto px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
            <Lock className="w-4 h-4" /> Your files stay on your device
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white dark:bg-[#111A2C] rounded-2xl shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 p-6 sm:p-10 min-h-[400px]">
          {toolState === "idle" && renderWorkspace()}

          {toolState === "processing" && (
            <ProcessingState title="Converting to Images..." />
          )}

          {toolState === "success" && (
            <SuccessState
              onDownload={downloadResult}
              onReset={resetTool}
              title={
                isZip
                  ? "Images Extracted Successfully!"
                  : "Image Converted Successfully!"
              }
              filename={
                file
                  ? isZip
                    ? `${file.name.replace(".pdf", "")}_images.zip`
                    : `${file.name.replace(".pdf", "")}.jpg`
                  : "Document_Images.zip"
              }
            />
          )}

          {toolState === "error" && (
            <ErrorState
              errorMessage={errorMessage}
              onRetry={() => setToolState("idle")}
            />
          )}
        </div>

        {toolState === "idle" && (
          <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            PDF files are processed locally in your browser. They never leave
            your device.
          </div>
        )}
      </div>
    </div>
  );
}
