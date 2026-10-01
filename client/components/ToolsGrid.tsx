import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PDF_TOOLS } from '@/constants/tools';

export default function ToolsGrid() {
  return (
    <section id="tools" className="py-16 lg:py-24 bg-gray-50/50 dark:bg-[#0B1221] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-5">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Popular <span className="text-red-600">PDF Tools</span>
            </h2>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400 font-medium">
              Everything you need to work with PDF files in one place.
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:border-gray-300 dark:hover:border-gray-700 hover:text-red-600 dark:hover:text-red-500 transition-all duration-200 active:scale-95 sm:w-auto"
          >
            View All Tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {PDF_TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group flex flex-col justify-between rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#111A2C] p-5 shadow-sm hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-gray-200 dark:hover:border-gray-700 hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 rounded-xl p-3 ${tool.iconBg} dark:!bg-gray-800/60 ${tool.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="h-6 w-6" />
                </div>

                <div className="pt-0.5">
                  <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors leading-tight">
                    {tool.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <ArrowRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-red-600 dark:group-hover:text-red-500 group-hover:translate-x-1.5 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}