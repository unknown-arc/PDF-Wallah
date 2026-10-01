import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

export default function ErrorState({ errorMessage, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-amber-50 dark:bg-amber-500/10 p-5 rounded-full text-amber-500 mb-6 shadow-sm">
        <AlertTriangle className="w-16 h-16" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Something Went Wrong!
      </h3>
      <p className="text-red-500 dark:text-red-400 font-medium mb-8 max-w-md">
        {errorMessage}
      </p>

      <Button 
        onClick={onRetry}
        className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
      >
        <RotateCcw className="w-5 h-5" /> Try Again
      </Button>
    </div>
  );
}