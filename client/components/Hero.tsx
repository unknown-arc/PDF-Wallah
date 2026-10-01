import { Zap, ShieldCheck, CheckCircle2, Scissors, Image as ImageIcon, Lock, PenTool, RefreshCw, FileText } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-600 tracking-wide">
              Free • Fast • Secure
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[4rem] font-extrabold text-[#0B1221] tracking-tight leading-[1.1]">
              All-in-One <br />
              <span className="text-red-600">PDF Tools</span> for Everyone
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed font-medium">
              Merge, split, convert, edit and manage your PDF files easily — directly in your browser. No installation. No registration.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-red-500">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Fast Processing</h4>
                  <p className="text-xs text-gray-500 font-medium">Works in your browser</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">100% Private</h4>
                  <p className="text-xs text-gray-500 font-medium">Files never leave device</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Completely Free</h4>
                  <p className="text-xs text-gray-500 font-medium">No signup required</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center mt-10 lg:mt-0">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 via-blue-50 to-purple-100 rounded-full blur-3xl -z-10 opacity-70" />

              <div className="relative z-10 w-48 h-64 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] p-6 flex flex-col items-center justify-center text-white transform rotate-6 hover:rotate-0 transition-transform duration-500 ease-out border border-red-400/50">
                <div className="absolute top-12 text-white/90">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 0v16"/>
                    <path d="M15 15c2.2-2.2 2.2-5.8 0-8"/>
                  </svg>
                </div>
                <div className="absolute bottom-6 w-full text-center">
                  <p className="text-4xl font-extrabold tracking-widest drop-shadow-md">PDF</p>
                </div>
              </div>

              <div className="absolute top-4 left-10 p-3.5 bg-white rounded-2xl shadow-xl border border-gray-100 text-blue-500 z-20 animate-[bounce_3s_ease-in-out_infinite]">
                <ImageIcon className="w-6 h-6" />
              </div>

              <div className="absolute top-12 right-12 p-3.5 bg-white rounded-2xl shadow-xl border border-gray-100 text-emerald-500 z-20 animate-[bounce_3.5s_ease-in-out_infinite]">
                <RefreshCw className="w-6 h-6" />
              </div>

              <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 p-3.5 bg-white rounded-2xl shadow-xl border border-gray-100 text-orange-500 z-20 animate-[bounce_4s_ease-in-out_infinite]">
                <Scissors className="w-6 h-6" />
              </div>

              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 p-3.5 bg-white rounded-2xl shadow-xl border border-gray-100 text-pink-500 z-20 animate-[bounce_3.2s_ease-in-out_infinite]">
                <Lock className="w-6 h-6" />
              </div>

              <div className="absolute bottom-16 left-12 p-3.5 bg-white rounded-2xl shadow-xl border border-gray-100 text-purple-600 z-20 animate-[bounce_3.8s_ease-in-out_infinite]">
                <PenTool className="w-6 h-6" />
              </div>

              <div className="absolute bottom-10 right-16 p-3.5 bg-white rounded-2xl shadow-xl border border-gray-100 text-red-500 z-20 animate-[bounce_4.2s_ease-in-out_infinite]">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}