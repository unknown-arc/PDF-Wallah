import { CheckCircle2, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessStateProps {
  onDownload: () => void;
  onReset: () => void;
  title?: string;
  filename?: string;
}

export default function SuccessState({ 
  onDownload, 
  onReset, 
  title = "PDF Merged Successfully!",
  filename = "merged_document.pdf" 
}: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-emerald-50 dark:bg-emerald-500/10 p-5 rounded-full text-emerald-500 mb-6 shadow-sm">
        <CheckCircle2 className="w-16 h-16" />
      </div>
      
      <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
        Your file <b>{filename}</b> is ready. Click the button below to download it.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button 
          onClick={onDownload}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Download className="w-5 h-5" /> Download PDF
        </Button>
        
        <Button 
          variant="outline"
          onClick={onReset}
          className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 px-8 py-6 text-lg font-semibold rounded-xl flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Start Over
        </Button>
      </div>
    </div>
  );
}