import { Loader2 } from 'lucide-react';

export default function ProcessingState({ title = "Processing..." }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-full text-red-600 dark:text-red-500 mb-6 shadow-sm">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 font-medium">
        Please wait, we’re processing your files. This may take a few seconds.
      </p>
    </div>
  );
}