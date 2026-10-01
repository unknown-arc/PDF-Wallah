import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PDF_TOOLS } from '@/constants/tools';

export default function ToolsGrid() {
  return (
    <section id="tools" className="py-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Popular <span className="text-red-500">PDF Tools</span></h2>
            <p className="text-sm text-gray-500 mt-1">Everything you need to work with PDF files in one place.</p>
          </div>
          <Link href="/tools" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-red-500 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            View All Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {PDF_TOOLS.map((tool) => (
            <Link key={tool.id} href={tool.href} className="group bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${tool.iconBg} ${tool.iconColor} shrink-0 group-hover:scale-105 transition-transform`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <div className="pr-4">
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-red-600 transition-colors">{tool.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}