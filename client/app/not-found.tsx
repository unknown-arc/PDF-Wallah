import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-white dark:bg-[#0B1221] transition-colors duration-200">
      <div className="bg-rose-50 dark:bg-rose-500/10 p-5 rounded-full mb-6 text-red-600 dark:text-red-500 shadow-sm animate-in zoom-in duration-500">
        <FileQuestion className="w-16 h-16 sm:w-20 sm:h-20" strokeWidth={1.5} />
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1221] dark:text-white mb-4 tracking-tight">
        404 - Page Not Found
      </h1>

      <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-md mb-8 font-medium leading-relaxed">
        Oops! Jis page ko aap dhundh rahe hain, wo exist nahi karta ya move kar diya gaya hai.
      </p>

      <Link
        href="/"
        className="group inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
        Back to Home
      </Link>
    </div>
  );
}