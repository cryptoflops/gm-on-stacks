import Navbar from "@/components/Navbar";
import SayGmBlock from "@/components/SayGmBlock";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-start pt-32 selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

      <Navbar />

      <div className="relative z-10 w-full">
        <SayGmBlock />
      </div>

      <footer className="mt-auto py-12 text-center opacity-30 hover:opacity-100 transition-opacity">
        <p className="text-[10px] mono uppercase tracking-[0.2em]">
          Powered by Stacks L2 & Reown AppKit
        </p>
      </footer>
    </main>
  );
}
