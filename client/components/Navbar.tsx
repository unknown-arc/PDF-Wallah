'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Moon, Sun, Monitor, FileText, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

type Theme = 'light' | 'dark' | 'system';

const CYCLE: Theme[] = ['system', 'light', 'dark'];

const ICONS: Record<Theme, React.ElementType> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS: Record<Theme, string> = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'System theme',
};

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextTheme = () => {
    if (!theme) return;
    const idx = CYCLE.indexOf(theme as Theme);
    setTheme(CYCLE[(idx + 1) % CYCLE.length]);
  };

  const Icon = mounted && theme ? ICONS[theme as Theme] || Monitor : Monitor;
  const currentLabel = mounted && theme ? LABELS[theme as Theme] : 'Toggle theme';

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#0B1221] border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm">
            <FileText className="w-5 h-5 fill-current" />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
            PDF <span className="text-red-600">Wallah</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-600 dark:text-gray-300">
          <Link href="/" className="text-red-600">Home</Link>
          <Link href="#tools" className="hover:text-gray-900 dark:hover:text-white transition-colors">PDF Tools</Link>
          <Link href="#how-it-works" className="hover:text-gray-900 dark:hover:text-white transition-colors">How it works</Link>
          <Link href="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block w-48 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search tools..."
              className="pl-9 h-9 rounded-full bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 focus-visible:ring-red-500 transition-colors"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextTheme}
            title={currentLabel}
            aria-label={currentLabel}
            className="rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon className="w-4.5 h-4.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0B1221] px-4 py-5 space-y-5 animate-in slide-in-from-top-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tools..."
              className="w-full pl-9 h-10 rounded-xl bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 focus-visible:ring-red-500"
            />
          </div>

          <nav className="flex flex-col space-y-4 font-medium text-gray-700 dark:text-gray-300">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-red-600 block">Home</Link>
            <Link href="#tools" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-900 dark:hover:text-white block">PDF Tools</Link>
            <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-900 dark:hover:text-white block">How it works</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-900 dark:hover:text-white block">About</Link>
          </nav>
        </div>
      )}
    </header>
  );
}