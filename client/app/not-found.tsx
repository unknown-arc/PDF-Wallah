import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-white">
      <div className="bg-rose-50 p-5 rounded-full mb-6 text-red-500 shadow-sm">
        <FileQuestion className="w-16 h-16 sm:w-20 sm:h-20" strokeWidth={1.5} />
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1221] mb-4 tracking-tight">
        404 - Page Not Found
      </h1>

      <p className="text-lg text-gray-500 max-w-md mb-8 font-medium">
        Oops! Jis page ko aap dhundh rahe hain, wo exist nahi karta ya move kar diya gaya hai.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  );
}