import Hero from '@/components/Hero';
import ToolsGrid from '@/components/ToolsGrid';
import TrustBar from '@/components/TrustBar';

export default function Home() {
  return (
    <main className="font-sans w-full">
      <Hero />
      <ToolsGrid />
      <TrustBar />
    </main>
  );
}