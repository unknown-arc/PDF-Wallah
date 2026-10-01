import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ToolsGrid from '@/components/ToolsGrid';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <Hero />
        <ToolsGrid />
      </main>
    </div>
  );
}