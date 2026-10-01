'use client';

import Link from 'next/link';
import { Search, Moon, FileText, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white shadow-sm">
            <FileText className="w-5 h-5 fill-current" />
          </div>
          <span className="font-bold text-xl text-gray-900">
            PDF <span className="text-red-500">Wallah</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <Link href="/" className="text-red-500 font-semibold">Home</Link>
          <Link href="#tools" className="hover:text-gray-900">PDF Tools</Link>
          <Link href="#how-it-works" className="hover:text-gray-900">How it works</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-48 lg:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input type="text" placeholder="Search tools..." className="pl-9 h-9 rounded-full bg-gray-50 border-gray-200 focus-visible:ring-red-400" />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full text-gray-600">
            <Moon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden rounded-full text-gray-600">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}