import Image from 'next/image';
import { Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F6F9] to-white dark:from-[#0B1221] dark:to-[#0B1221] pt-12 pb-16 lg:pt-20 lg:pb-24 transition-colors duration-200">
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full bg-gradient-to-br from-rose-200/50 via-blue-100/50 to-purple-200/50 dark:from-rose-900/20 dark:via-blue-900/10 dark:to-purple-900/20 blur-3xl opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 dark:border-rose-800/50 bg-white dark:bg-rose-900/10 px-4 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 tracking-wide shadow-sm">
              Free • Fast • Secure
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold leading-[1.1] tracking-tight text-gray-900 dark:text-white">
              All-in-One <br className="hidden lg:block" />
              <span className="text-red-600">PDF Tools</span> for Everyone
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
              Merge, split, convert, edit and manage your PDF files easily —
              directly in your browser. No installation. No registration.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
              <div className="flex items-start gap-3 justify-center sm:justify-start">
                <div className="shrink-0 rounded-xl bg-white dark:bg-gray-900/50 p-2.5 text-red-500 shadow-sm border border-gray-100 dark:border-gray-800">
                  <Zap className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Fast Processing</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Works in your browser</p>
                </div>
              </div>

              <div className="flex items-start gap-3 justify-center sm:justify-start">
                <div className="shrink-0 rounded-xl bg-white dark:bg-gray-900/50 p-2.5 text-emerald-500 shadow-sm border border-gray-100 dark:border-gray-800">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">100% Private</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Files never leave device</p>
                </div>
              </div>

              <div className="flex items-start gap-3 justify-center sm:justify-start">
                <div className="shrink-0 rounded-xl bg-white dark:bg-gray-900/50 p-2.5 text-indigo-500 shadow-sm border border-gray-100 dark:border-gray-800">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Completely Free</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">No signup required</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="relative w-full max-w-[380px] sm:max-w-[520px] transform hover:scale-[1.02] transition-transform duration-500 ease-out">
              <div className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20 blur-[60px] rounded-full -z-10" />

              <Image
                src="/hero.png"
                alt="PDF Wallah – All-in-One PDF Tools"
                width={520}
                height={480}
                priority
                className="w-full h-auto object-contain drop-shadow-xl dark:drop-shadow-[0_10px_40px_rgba(220,38,38,0.25)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}