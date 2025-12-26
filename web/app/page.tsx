import { Navbar } from "@/components/Navbar";
import { SayGmBlock } from "@/components/SayGmBlock";

export default function Home() {
  return (
    <main className="min-h-screen bg-dot-pattern relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-12 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-6 mb-12 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            Good Morning <br /> Stacks.
          </h1>
          <p className="text-lg text-gray-400 max-w-lg mx-auto">
            Join the daily ritual. Collect unique GM badges and prove your presence on the blockchain.
          </p>
        </div>

        <SayGmBlock />

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-600">
            Powered by Clarity & Chainhooks
          </p>
        </div>
      </div>
    </main>
  );
}
